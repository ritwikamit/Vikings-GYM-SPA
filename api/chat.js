// Vercel Serverless Function: Secure server-side AI chat proxy
// Keeps OPENROUTER_API_KEY completely secret without exposing it to the client.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured on server' });
  }

  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages array' });
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
          messages,
          temperature: 0.6,
          max_tokens: 600
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
