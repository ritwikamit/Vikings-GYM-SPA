// Vercel Serverless Function: Secure server-side AI chat proxy
// Protected against token exploitation, heavy traffic abuse, and runaway generation.

const ipRateMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1-minute window
  const maxReqs = 8; // max 8 requests per minute per IP

  const record = ipRateMap.get(ip);
  if (!record || now - record.startTime > windowMs) {
    ipRateMap.set(ip, { count: 1, startTime: now });
    return false;
  }
  if (record.count >= maxReqs) {
    return true;
  }
  record.count += 1;
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Prune memory if cache grows
  if (ipRateMap.size > 200) {
    const now = Date.now();
    for (const [key, val] of ipRateMap.entries()) {
      if (now - val.startTime > 60000) ipRateMap.delete(key);
    }
  }

  // 1. IP Rate Limiting & Traffic Protection
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || req.socket?.remoteAddress || 'anonymous';
  if (checkRateLimit(ip)) {
    return res.status(429).json({
      error: 'Rate limit reached. Please wait a moment or WhatsApp our reception desk directly.'
    });
  }

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured on server' });
  }

  // 2. Payload Validation & Token Abuse Prevention
  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid messages array' });
  }

  // Guard against giant payloads: keep only last 6 messages
  const sanitizedMessages = messages.slice(-6);
  const lastUserMsg = sanitizedMessages[sanitizedMessages.length - 1];
  if (!lastUserMsg || typeof lastUserMsg.content !== 'string' || !lastUserMsg.content.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  // Reject oversized queries designed to drain token context
  if (lastUserMsg.content.length > 350) {
    return res.status(400).json({ error: 'Query too long. Please keep queries under 350 characters.' });
  }

  const candidateModels = [
    "openrouter/auto",
    "deepseek/deepseek-chat",
    "meta-llama/llama-3.3-70b-instruct",
    "google/gemini-2.0-flash-001"
  ];

  for (const model of candidateModels) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://vikingsgymspa.vercel.app",
          "X-Title": "Vikings Gym & Spa AI Coach"
        },
        body: JSON.stringify({
          model,
          messages: sanitizedMessages,
          temperature: 0.4,
          max_tokens: 220 // Strict token ceiling for fast, concise answers
        })
      });

      if (!response.ok) continue;

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();
      if (reply) {
        return res.status(200).json({ reply });
      }
    } catch {
      continue;
    }
  }

  return res.status(502).json({ error: 'Upstream AI models unavailable' });
}
