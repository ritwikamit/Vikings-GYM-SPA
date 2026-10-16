import { GYM_CONFIG } from "../config/gym";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// OpenRouter model list with automatic fallbacks for maximum resilience
const CANDIDATE_MODELS = [
  "openrouter/auto",
  "deepseek/deepseek-chat",
  "meta-llama/llama-3.3-70b-instruct",
  "google/gemini-2.0-flash-001",
];

const RITWIK_SYSTEM_PROMPT = `You are Ritwik, the expert Fitness Coach & Arena Advisor at Vikings Gym & Spa in Aurangabad, Bihar.

CORE INSTRUCTIONS (STRICT):
1. SHORT & CONCISE (SAVE TOKENS): Keep answers brief and direct (2 to 4 sentences or 2 to 3 bullet dots). Do NOT write long essays or rambling explanations.
2. NATURAL HUMAN LANGUAGE: Speak in friendly, approachable, motivating conversational tone in English or natural Hinglish.
3. USE BULLET DOTS (•) ONLY: If listing points or items, ALWAYS use bullet dots (•). NEVER use numbers (do NOT use 1, 2, 3), and NEVER use asterisks (* or **).
4. NO REPEATED INTRODUCTIONS: The user already greeted you. Never start your answer with "I am Ritwik...", "Coach Ritwik here...", or greetings. Directly answer the question.
5. STRICT RELEVANCE: Only answer questions on gym workouts, exercise form, healthy Indian nutrition/diet, and Vikings Gym & Spa facilities. Decline off-topic queries in one short sentence.

OFFICIAL VIKINGS GYM & SPA VERIFIED KNOWLEDGE BASE:
- Location: ${GYM_CONFIG.addressFull} (${GYM_CONFIG.landmark}).
- Phone & WhatsApp: ${GYM_CONFIG.phoneDisplay} / +91 ${GYM_CONFIG.whatsapp}.
- Operating Hours:
  - Monday to Saturday: 5:00 AM – 10:00 PM (Morning: 5:00 AM – 10:00 AM, Evening: 4:00 PM – 10:00 PM).
  - Sunday: 6:00 AM – 12:00 PM (Active morning recovery session).
- Membership Tiers:
  - 1-Month Recruit: ₹2,000 (Full gym access & Viva Fitness machines).
  - 3-Month Shield-Wall: ₹4,900 (~₹1,633/month, includes Moroccan steam spa).
  - 6-Month Berserker: ₹9,000 (Includes trainer guidance & diet plan).
  - 12-Month Valhalla Annual: ₹18,000 (VIP full year, all amenities & steam spa, 0% EMI available).
- Facilities: 7,500+ sq.ft AC luxury arena, imported Viva Fitness biomechanical machines, Olympic deadlift platforms, 60kg dumbbells, Moroccan steam bath, indoor turf track.
- Coaches: Amit Singh (Founder/Head Coach), Bittu Verma, Ankit Kumar, Ali, Neha Singh (Women's Coach), Deepsikha (Zumba), Vaishnavi Singh (Brand Ambassador).
- WhatsApp: https://wa.me/${GYM_CONFIG.whatsapp}`;

/**
 * Refines the chatbot response:
 * 1. Ensures the bot does not introduce itself multiple times.
 * 2. Uses clean bullet dots (•) for point sentences, never numbers.
 * 3. Removes markdown asterisks (* and **) cleanly.
 */
export function refineBotResponse(text: string): string {
  if (!text) return "";

  let cleaned = text.trim();

  // Strip redundant opening self-introductions if not asked
  cleaned = cleaned.replace(/^(namaste!?|hello!?|hey(?: there)?!?|hi!?)[,\s]+(?:i am|i'm|this is|coach)\s+ritwik[^\n.!?]*[.!?]\s*/i, "");
  cleaned = cleaned.replace(/^(?:i am|i'm|this is)\s+ritwik[^\n.!?]*[.!?]\s*/i, "");
  cleaned = cleaned.replace(/^as coach ritwik[^\n.!?]*[.!?]\s*/i, "");
  cleaned = cleaned.replace(/^coach ritwik's\s*/i, "");

  // Convert numbers (1., 2.) and bullets (*, -) into uniform bullet dots (•)
  const lines = cleaned.split("\n");
  const refinedLines = lines.map((line) => {
    const trimmed = line.trim();
    // Match numbered lines like "1. text", "1) text" or bullet marks "* text", "- text"
    const listMatch = trimmed.match(/^(?:\d+[\.\)]|[*•\-])\s+(.*)$/);
    if (listMatch) {
      return `• ${listMatch[1]}`;
    }
    return line;
  });

  cleaned = refinedLines.join("\n");

  // Remove all asterisks (* and **) used for bold or italics, leaving clean text
  cleaned = cleaned.replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1");
  cleaned = cleaned.replace(/\*/g, "");

  // Normalize excessive blank lines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n").trim();

  return cleaned;
}

/**
 * Sends conversation messages to OpenRouter with automatic model fallback
 * and offline/rate-limit recovery.
 */
export async function sendRitwikMessage(
  userQuery: string,
  history: ChatMessage[] = []
): Promise<string> {
  const formattedHistory = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  formattedHistory.push({ role: "user", content: userQuery });
  return sendChatMessage(formattedHistory);
}

export async function sendChatMessage(messages: { role: "user" | "assistant" | "system"; content: string }[]): Promise<string> {
  // Prepare messages with system prompt injected (keep last 6 for token economy)
  const conversation = [
    { role: "system", content: RITWIK_SYSTEM_PROMPT },
    ...messages.slice(-6),
  ];

  // 1. Primary path: Secure serverless proxy (/api/chat) where OPENROUTER_API_KEY stays private
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversation }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.reply) {
        return data.reply;
      }
    }
  } catch {
    // Continue to client direct call or offline fallback
  }

  // 2. Secondary path: Client-side direct call if key is provided in client environment
  const clientKey =
    (import.meta.env.VITE_OPENROUTER_API_KEY as string) ||
    (import.meta.env.OPENROUTER_API_KEY as string) ||
    "";

  if (clientKey) {
    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await fetch(OPENROUTER_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${clientKey}`,
            "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "https://vikingsgymspa.vercel.app",
            "X-Title": "Vikings Gym & Spa AI Coach",
          },
          body: JSON.stringify({
            model,
            messages: conversation,
            temperature: 0.4,
            max_tokens: 220,
          }),
        });

        if (!response.ok) continue;

        const data = await response.json();
        const reply = data?.choices?.[0]?.message?.content?.trim();
        if (reply) {
          return reply;
        }
      } catch {
        continue;
      }
    }
  }

  // 3. Fallback: Instant verified offline knowledge engine
  return generateLocalFallbackResponse(messages[messages.length - 1]?.content || "");
}

/**
 * Instant local knowledge engine: provides verified, concise answers for common queries
 * using clean bullet dots (•) and natural human language.
 */
function generateLocalFallbackResponse(userPrompt: string): string {
  const q = userPrompt.toLowerCase().trim();

  // Strict guardrail check for non-gym / non-diet queries
  const nonGymKeywords = [
    "code", "coding", "python", "javascript", "react", "math", "equation", "exam", "president",
    "politics", "movie", "song", "actor", "game", "cricket score", "weather", "crypto", "bitcoin",
    "history of", "who wrote", "solve", "homework", "translate"
  ];
  if (nonGymKeywords.some((k) => q.includes(k)) && !q.includes("gym") && !q.includes("diet") && !q.includes("protein")) {
    return "I strictly focus on gym workouts, exercise technique, healthy diets, and Vikings Gym facilities. Let us redirect that energy into hitting your fitness goals!";
  }

  // Fees & Memberships
  if (q.includes("fee") || q.includes("price") || q.includes("plan") || q.includes("membership") || q.includes("cost") || q.includes("charges") || q.includes("फीस") || q.includes("package")) {
    return `Here are the membership plans at Vikings Gym & Spa (MG Road, Aurangabad):

• 1-Month Recruit: ₹2,000 (Full gym access & Viva Fitness equipment)
• 3-Month Shield-Wall: ₹4,900 (~₹1,633/month, includes Moroccan steam spa)
• 6-Month Berserker: ₹9,000 (Includes trainer guidance & customized diet plan)
• 12-Month Valhalla Annual: ₹18,000 (VIP full year, all amenities & priority audit, 0% EMI available)

WhatsApp our reception at +91 ${GYM_CONFIG.whatsapp} to book a trial pass!`;
  }

  // Timings
  if (q.includes("time") || q.includes("timing") || q.includes("hour") || q.includes("open") || q.includes("sunday") || q.includes("समय") || q.includes("close")) {
    return `Vikings Gym & Spa operating hours on MG Road, Aurangabad:

• Monday to Saturday: 5:00 AM – 10:00 PM (Morning: 5:00 AM – 10:00 AM, Evening: 4:00 PM – 10:00 PM)
• Sunday: 6:00 AM – 12:00 PM (Active recovery session)
• Special women batches with female trainer Neha Singh are available daily.`;
  }

  // Location & Contact
  if (q.includes("where") || q.includes("location") || q.includes("address") || q.includes("contact") || q.includes("number") || q.includes("phone") || q.includes("पता") || q.includes("kahan")) {
    return `Vikings Gym & Spa is located at:

• Address: ${GYM_CONFIG.addressFull} (${GYM_CONFIG.landmark})
• Phone / WhatsApp: +91 ${GYM_CONFIG.whatsapp} / ${GYM_CONFIG.phoneDisplay}

Feel free to drop by anytime during opening hours for a tour!`;
  }

  // Steam Bath / Spa
  if (q.includes("steam") || q.includes("spa") || q.includes("bath") || q.includes("recovery") || q.includes("स्टीम") || q.includes("sauna")) {
    return `Yes, we have authentic private Moroccan Steam Bath suites right here in Aurangabad!

• Relaxes tight muscles and flushes lactic acid after heavy compound lifts
• Improves blood circulation and detoxifies skin
• Included with 3-Month, 6-Month, and Annual memberships`;
  }

  // Coaches & Trainers
  if (q.includes("trainer") || q.includes("coach") || q.includes("amit") || q.includes("neha") || q.includes("bittu") || q.includes("ankit") || q.includes("ali") || q.includes("ट्रेनर")) {
    return `Our certified coaches at Vikings Gym & Spa:

• Amit Singh: Founder & Head Coach (Olympic strength & biomechanics)
• Bittu Verma: Fitness & Weight Loss Coach
• Ankit Kumar: Strength & Conditioning Coach
• Ali: 1-on-1 Transformation Coach
• Neha Singh: Certified Female Fitness Trainer
• Deepsikha: Dance & Zumba Coach
• Vaishnavi Singh (@chawal.to.choorma): Official Brand Ambassador`;
  }

  // Workouts, Routines & Splits
  if (q.includes("workout") || q.includes("routine") || q.includes("split") || q.includes("beginner") || q.includes("exercise") || q.includes("start") || q.includes("कसरत")) {
    return `Recommended 4-Day Push/Pull/Legs Split:

• Push (Chest, Shoulders, Triceps): Incline Dumbbell Press, Barbell Bench, Lateral Raises, Tricep Pushdowns
• Pull (Back & Biceps): Lat Pulldowns, Seated Cable Rows, Dumbbell Shrugs, Bicep Curls
• Legs & Core: Barbell Squats, Romanian Deadlifts, Leg Press, Hanging Leg Raises
• Rest & Recovery: 15 minutes Moroccan steam bath to eliminate soreness`;
  }

  // Chest / Bench Press
  if (q.includes("chest") || q.includes("bench") || q.includes("pec") || q.includes("pushup")) {
    return `Key chest training tips:

• Start with 30° incline dumbbell press to target the upper chest
• Retract your shoulder blades back and down into the bench for safety
• Lower weights with a controlled 2-second negative stretch
• Finish with cable flyes on our Viva Fitness machines for a full pump`;
  }

  // Back / Deadlift / Pullups
  if (q.includes("back") || q.includes("deadlift") || q.includes("lat") || q.includes("pullup") || q.includes("row")) {
    return `Key back training tips:

• Wide-Grip Lat Pulldowns for back width (3-4 sets of 8-12 reps)
• Chest-supported rows for mid-back thickness
• Practice deadlifts on our Olympic platform with bumper plates
• Always pull through your elbows and pause for 1 second at contraction`;
  }

  // Arms / Biceps / Triceps
  if (q.includes("bicep") || q.includes("tricep") || q.includes("arm") || q.includes("dole")) {
    return `Key arm training tips:

• Triceps (65% of arm size): Overhead cable extensions and close-grip pushdowns
• Biceps: Incline dumbbell curls for stretch, plus hammer curls for thickness
• Keep elbows pinned to your sides and avoid swinging the weight`;
  }

  // Legs & Squats
  if (q.includes("leg") || q.includes("squat") || q.includes("quad") || q.includes("hamstring") || q.includes("calf")) {
    return `Key leg day routine:

• Barbell Back Squats in our squat cages (3-4 sets of 6-8 reps)
• 45° Incline Leg Press and slow Leg Extensions
• Romanian Deadlifts (RDLs) for hamstrings and glutes
• Finish with a steam bath to flush lactic acid and avoid severe soreness`;
  }

  // Creatine, Whey & Supplements
  if (q.includes("creatine") || q.includes("whey") || q.includes("supplement") || q.includes("bcaa") || q.includes("preworkout") || q.includes("protein powder")) {
    return `Simple evidence-based supplement advice:

• Creatine Monohydrate: 3g–5g daily with water. Boosts raw strength and muscle fullness. No loading phase needed.
• Whey Protein: Easy way to hit protein goals (1 scoop = ~25g protein) post-workout or between meals.
• Pre-Workout: A cup of black coffee 30 mins before training gives great focus.
• Drink at least 3.5 liters of water every day.`;
  }

  // Fat Loss, Belly Fat & Cardio
  if (q.includes("fat loss") || q.includes("weight loss") || q.includes("belly") || q.includes("abs") || q.includes("cardio") || q.includes("pet")) {
    return `Practical fat loss truth:

• Spot reduction is a myth; fat is burned across the entire body in a 300-500 kcal deficit
• Keep protein high to protect muscle and keep metabolism running fast
• Lift heavy compound weights so you lose pure fat, not muscle
• Aim for 8,000–10,000 daily steps on our turf track or treadmills`;
  }

  // Ladies / Women's Batches
  if (q.includes("female") || q.includes("women") || q.includes("girl") || q.includes("lady") || q.includes("ladies") || q.includes("mahila")) {
    return `Women fitness at Vikings Gym & Spa:

• Safe, private, and respectful environment
• Certified female trainer Neha Singh guides strength and posture sessions
• Energetic Zumba and dance cardio sessions with coach Deepsikha
• Brand ambassador Vaishnavi Singh (@chawal.to.choorma) trains here!`;
  }

  // Diet & Nutrition
  if (q.includes("diet") || q.includes("protein") || q.includes("food") || q.includes("gain") || q.includes("loss") || q.includes("fat") || q.includes("वजन") || q.includes("डाइट") || q.includes("meal")) {
    return `Simple Indian fitness diet blueprint:

• Aim for 1.6g–2g protein per kg of body weight
• Veg sources: Paneer, Soya chunks, Greek yogurt/Dahi, Moong dal sprouts, Whey
• Non-veg sources: Whole eggs, Chicken breast, Fish
• Carbs & Fats: Oats, Rice, Roti, Sweet potatoes, Almonds, and 3.5L+ water daily`;
  }

  return `How can I help your fitness journey today?

• Workout splits & exercise form (Chest, Back, Arms, Legs)
• Indian diet plans (High protein veg/non-veg, fat loss)
• Vikings Gym membership fees & steam bath on MG Road`;
}

