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
  "google/gemma-4-26b-a4b-it:free",
  "liquid/lfm-2.5-2.6b:free",
  "nvidia/nemotron-3.5-lightning:free",
];

const RITWIK_SYSTEM_PROMPT = `You are Ritwik, the expert Head Fitness Coach & AI Arena Advisor at Vikings Gym & Spa in Aurangabad, Bihar.

PERSONALITY & BRAND VOICE:
- You are energetic, disciplined, motivating, respectful, and authoritative on fitness and nutrition.
- Your name is RITWIK. Always introduce or identify yourself as Ritwik if asked.
- You speak clearly in English or natural conversational Hindi/Hinglish depending on what language the user speaks.
- Keep answers concise, actionable, and encouraging (2 to 4 short paragraphs or bullet points).

CRITICAL GUARDRAIL & STRICT SCOPE:
- You ONLY entertain and answer queries strictly related to:
  1. Fitness, gym training, weightlifting, bodybuilding, powerlifting, cardio, calisthenics, functional training, Zumba, yoga.
  2. Diet, nutrition, macros, calories, protein intake, muscle building, fat loss, weight gain, healthy Indian vegetarian and non-vegetarian food, hydration, gym supplements (whey, creatine, multivitamin, BCAAs).
  3. Vikings Gym & Spa details: memberships, fees, timings, address, equipment, steam bath, coaches, facilities, and contact.
- ABSOLUTE REFUSAL FOR OFF-TOPIC QUESTIONS:
  If the user asks about ANYTHING outside fitness, diet, or Vikings Gym (for example: coding, politics, exams, general knowledge, movies, history, dating, math, or news), you MUST POLITELY AND FIRMLY DECLINE.
  Pivot with athletic energy back to fitness. Example:
  "I am Ritwik, your fitness & nutrition coach at Vikings Gym & Spa! I only train your body and answer queries on workouts, gym training, Indian diets, and Vikings Gym facilities. Let's redirect that energy into hitting your fitness goals—ask me about workout routines, gym plans, or healthy meal prep!"

OFFICIAL VIKINGS GYM & SPA VERIFIED KNOWLEDGE BASE:
- Location: ${GYM_CONFIG.addressFull} (${GYM_CONFIG.landmark}).
- Phone & WhatsApp: ${GYM_CONFIG.phoneDisplay} / +91 ${GYM_CONFIG.whatsapp}.
- Operating Hours:
  - Monday to Saturday: 5:00 AM – 10:00 PM (Morning Batch: 5:00 AM – 10:00 AM, Evening Batch: 4:00 PM – 10:00 PM).
  - Sunday: 6:00 AM – 12:00 PM (Special active morning recovery session).
- Membership Tiers & Transparent Pricing:
  - 1-Month Recruit: ₹2,000 (Full gym access, Viva Fitness machines, locker, biometric entry).
  - 3-Month Shield-Wall: ₹4,900 (~₹1,633/month — Most Popular, includes Moroccan steam spa access).
  - 6-Month Half-Year Berserker: ₹9,000 (Best value, includes certified trainer guidance + customized diet plan).
  - 12-Month Valhalla Annual: ₹18,000 (VIP full year, all amenities, steam bath, priority trainer audit, 0% EMI option).
- Facilities & Infrastructure:
  - 7,500+ sq.ft air-conditioned luxury arena on MG Road.
  - Imported Viva Fitness biomechanical plate-loaded machines and selectorized pin stacks.
  - Dedicated Olympic Powerlifting Platform with calibrated bumper plates & safety squat cages.
  - Heavy-duty polyurethane dumbbells ranging from 2.5 kg up to 60 kg pairs.
  - Authentic Moroccan Steam Bath / Steam Spa private recovery suites for muscle relaxation & detox.
  - Indoor high-density turf sprint track, boxing heavy bags, air rowers, and spin bikes.
- Certified Coaches & Staff:
  - Amit Singh: Founder & Owner Coach (Olympic strength standards, biomechanics & form).
  - Bittu Verma: Fitness & Weight Loss Coach.
  - Ankit Kumar: Strength & Conditioning Coach.
  - Ali: Personal Training & 1-on-1 Transformation Specialist.
  - Neha Singh: Certified Female Fitness Trainer (Specialized women's strength, conditioning, and safe environment).
  - Deepsikha: Dance & Aerobics Coach (Zumba, rhythmic cardio).
- Official Brand Ambassador: Vaishnavi Singh (@chawal.to.choorma) — inspiring youth & women across Bihar for athletic strength & balanced Indian diets.
- Direct Front Desk WhatsApp: https://wa.me/${GYM_CONFIG.whatsapp}`;

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
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";

  // Prepare messages with system prompt injected
  const conversation = [
    { role: "system", content: RITWIK_SYSTEM_PROMPT },
    ...messages.slice(-8), // keep last 8 messages for context efficiency
  ];

  if (!apiKey) {
    return generateLocalFallbackResponse(messages[messages.length - 1]?.content || "");
  }

  // Attempt candidate models sequentially
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "https://www.vikingsgym.in",
          "X-Title": "Vikings Gym & Spa AI Coach",
        },
        body: JSON.stringify({
          model,
          messages: conversation,
          temperature: 0.6,
          max_tokens: 600,
        }),
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();
      if (reply) {
        return reply;
      }
    } catch {
      // Continue to next candidate model
    }
  }

  // If external API is unavailable or rate-limited, provide verified instant answer
  return generateLocalFallbackResponse(messages[messages.length - 1]?.content || "");
}

/**
 * Instant local knowledge engine: provides verified answers for common gym & diet queries
 * even if the network is constrained or the API hits rate limits.
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
    return "Hey! I am Ritwik, your fitness & nutrition coach at Vikings Gym & Spa. I strictly focus on workouts, exercise biomechanics, healthy diets, and our gym facilities. Let's redirect that energy into hitting your fitness goals—ask me about workout routines, membership plans, or nutrition!";
  }

  if (q.includes("fee") || q.includes("price") || q.includes("plan") || q.includes("membership") || q.includes("cost") || q.includes("charges") || q.includes("फीस")) {
    return `Here are the official membership tiers at Vikings Gym & Spa (MG Road, Aurangabad):\n\n• **1-Month Recruit:** ₹2,000 (Full gym access & Viva Fitness machines)\n• **3-Month Shield-Wall:** ₹4,900 (~₹1,633/mo — Most Popular, Includes Moroccan steam spa)\n• **6-Month Berserker:** ₹9,000 (Includes trainer guidance & customized diet plan)\n• **12-Month Valhalla Annual:** ₹18,000 (VIP full year, all amenities & priority trainer audit, 0% EMI available)\n\nWant to book a free trial pass? You can message our reception directly on WhatsApp at +91 ${GYM_CONFIG.whatsapp}!`;
  }

  if (q.includes("time") || q.includes("timing") || q.includes("hour") || q.includes("open") || q.includes("sunday") || q.includes("समय")) {
    return `Vikings Gym & Spa operating hours on MG Road, Aurangabad:\n\n• **Monday to Saturday:** 5:00 AM – 10:00 PM\n  - Morning Batch: 5:00 AM – 10:00 AM\n  - Evening Batch: 4:00 PM – 10:00 PM\n• **Sunday:** 6:00 AM – 12:00 PM (Active recovery session)\n\nWe also have dedicated comfortable batch timings for women with female trainer Neha Singh!`;
  }

  if (q.includes("where") || q.includes("location") || q.includes("address") || q.includes("contact") || q.includes("number") || q.includes("phone") || q.includes("पता")) {
    return `Vikings Gym & Spa is located at:\n\n📍 **Address:** ${GYM_CONFIG.addressFull} (${GYM_CONFIG.landmark})\n📞 **Phone / WhatsApp:** +91 ${GYM_CONFIG.whatsapp} / ${GYM_CONFIG.phoneDisplay}\n\nFeel free to drop by for a tour of our Viva Fitness arena and Moroccan steam bath!`;
  }

  if (q.includes("steam") || q.includes("spa") || q.includes("bath") || q.includes("recovery") || q.includes("स्टीम")) {
    return `Yes! Vikings Gym & Spa features authentic private **Moroccan Steam Bath suites** right here in Aurangabad, Bihar.\n\n• **Benefits:** Deep muscle relaxation, enhanced blood flow, accelerated lactic acid removal, and skin detoxification after heavy compound lifts.\n• Included with Quarterly, Half-Yearly, and Annual membership plans!`;
  }

  if (q.includes("trainer") || q.includes("coach") || q.includes("trainer") || q.includes("amit") || q.includes("neha") || q.includes("bittu") || q.includes("ट्रेनर")) {
    return `Meet the certified coaching team at Vikings Gym & Spa:\n\n• **Amit Singh:** Founder & Owner Coach (Olympic strength standards & form)\n• **Bittu Verma:** Fitness & Weight Loss Coach\n• **Ankit Kumar:** Strength & Conditioning Coach\n• **Ali:** Personal Training & 1-on-1 Transformation Coach\n• **Neha Singh:** Certified Female Fitness Trainer (Specialized women's strength & toning)\n• **Deepsikha:** Dance & Zumba Coach\n• **Vaishnavi Singh (@chawal.to.choorma):** Official Brand Ambassador`;
  }

  if (q.includes("diet") || q.includes("protein") || q.includes("food") || q.includes("gain") || q.includes("loss") || q.includes("fat") || q.includes("वजन") || q.includes("डाइट")) {
    return `Here is core nutrition advice from Ritwik:\n\n1. **For Muscle Gain:** Target 1.6g–2g of protein per kg of body weight. Great Indian sources: Paneer, Soya chunks, Eggs, Chicken breast, Moong dal sprouts, Greek yogurt, and Whey protein.\n2. **For Fat Loss:** Maintain a moderate 300–400 kcal caloric deficit. Keep protein high to prevent muscle loss, drink 3–4 liters of water, and log daily 8,000–10,000 steps.\n3. **Consistency:** Avoid crash starvation. Pair balanced Indian meals with heavy compound lifts 4–5 days a week.\n\nOur trainers can customize your exact meal plan when you join!`;
  }

  return `Hey warrior! I'm Ritwik, your fitness coach at Vikings Gym & Spa. How can I help you today? You can ask me about our gym membership plans, timings on MG Road, Viva Fitness equipment, Moroccan steam spa, or personalized workout & diet tips!`;
}
