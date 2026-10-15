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
  // Prepare messages with system prompt injected
  const conversation = [
    { role: "system", content: RITWIK_SYSTEM_PROMPT },
    ...messages.slice(-8), // keep last 8 messages for context efficiency
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
            temperature: 0.6,
            max_tokens: 600,
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

  // Fees & Memberships
  if (q.includes("fee") || q.includes("price") || q.includes("plan") || q.includes("membership") || q.includes("cost") || q.includes("charges") || q.includes("फीस") || q.includes("package")) {
    return `Here are the official membership tiers at Vikings Gym & Spa (MG Road, Aurangabad):\n\n• **1-Month Recruit:** ₹2,000 (Full gym access & Viva Fitness machines)\n• **3-Month Shield-Wall:** ₹4,900 (~₹1,633/mo — Most Popular, Includes Moroccan steam spa)\n• **6-Month Berserker:** ₹9,000 (Includes trainer guidance & customized diet plan)\n• **12-Month Valhalla Annual:** ₹18,000 (VIP full year, all amenities & priority trainer audit, 0% EMI available)\n\nWant to book a free trial pass? Message our reception on WhatsApp at +91 ${GYM_CONFIG.whatsapp}!`;
  }

  // Timings
  if (q.includes("time") || q.includes("timing") || q.includes("hour") || q.includes("open") || q.includes("sunday") || q.includes("समय") || q.includes("close")) {
    return `Vikings Gym & Spa operating hours on MG Road, Aurangabad:\n\n• **Monday to Saturday:** 5:00 AM – 10:00 PM\n  - Morning Batch: 5:00 AM – 10:00 AM\n  - Evening Batch: 4:00 PM – 10:00 PM\n• **Sunday:** 6:00 AM – 12:00 PM (Active recovery session)\n\nWe also have dedicated comfortable batch timings for women supervised by female trainer Neha Singh!`;
  }

  // Location & Contact
  if (q.includes("where") || q.includes("location") || q.includes("address") || q.includes("contact") || q.includes("number") || q.includes("phone") || q.includes("पता") || q.includes("kahan")) {
    return `Vikings Gym & Spa is located at:\n\n📍 **Address:** ${GYM_CONFIG.addressFull} (${GYM_CONFIG.landmark})\n📞 **Phone / WhatsApp:** +91 ${GYM_CONFIG.whatsapp} / ${GYM_CONFIG.phoneDisplay}\n\nDrop by anytime during opening hours for a tour of our Viva Fitness arena and Moroccan steam bath!`;
  }

  // Steam Bath / Spa
  if (q.includes("steam") || q.includes("spa") || q.includes("bath") || q.includes("recovery") || q.includes("स्टीम") || q.includes("sauna")) {
    return `Yes! Vikings Gym & Spa features authentic private **Moroccan Steam Bath suites** right here in Aurangabad, Bihar.\n\n• **Benefits:** Deep muscle relaxation, enhanced blood flow, accelerated lactic acid removal, and skin detoxification after heavy compound lifts.\n• Included with Quarterly, Half-Yearly, and Annual membership plans!`;
  }

  // Coaches & Trainers
  if (q.includes("trainer") || q.includes("coach") || q.includes("amit") || q.includes("neha") || q.includes("bittu") || q.includes("ankit") || q.includes("ali") || q.includes("ट्रेनर")) {
    return `Meet the certified coaching team at Vikings Gym & Spa:\n\n• **Amit Singh:** Founder & Owner Coach (Olympic strength standards & form)\n• **Bittu Verma:** Fitness & Weight Loss Coach\n• **Ankit Kumar:** Strength & Conditioning Coach\n• **Ali:** Personal Training & 1-on-1 Transformation Coach\n• **Neha Singh:** Certified Female Fitness Trainer (Specialized women's strength & toning)\n• **Deepsikha:** Dance & Zumba Coach\n• **Vaishnavi Singh (@chawal.to.choorma):** Official Brand Ambassador`;
  }

  // Workouts, Routines & Splits
  if (q.includes("workout") || q.includes("routine") || q.includes("split") || q.includes("beginner") || q.includes("exercise") || q.includes("start") || q.includes("कसरत")) {
    return `Here is the recommended 4-Day Push/Pull/Legs Split for solid muscle growth:\n\n• **Day 1: Push (Chest, Shoulders, Triceps)** — Flat Dumbbell Press, Incline Barbell Bench, Overhead Dumbbell Press, Cable Lateral Raises, Tricep Rope Pushdowns.\n• **Day 2: Pull (Back & Biceps)** — Lat Pulldowns, Seated Cable Rows, Dumbbell Shrugs, Incline Dumbbell Curls, Hammer Curls.\n• **Day 3: Rest & Steam Spa Recovery**\n• **Day 4: Legs & Core** — Barbell Squats, Romanian Deadlifts, Leg Press, Standing Calf Raises, Hanging Leg Raises.\n• **Day 5: Upper Hypertrophy / Weak Points**\n\nOur certified trainers on the floor will correct your form on every set!`;
  }

  // Chest / Bench Press
  if (q.includes("chest") || q.includes("bench") || q.includes("pec") || q.includes("pushup")) {
    return `**Coach Ritwik's Guide for a Chiseled Chest:**\n\n1. **Incline Over Flat:** Focus on 30° incline dumbbell or barbell press first to target the upper chest shelf.\n2. **Retract Your Scapula:** Pin your shoulder blades back and down into the bench to protect your rotator cuffs and maximize chest tension.\n3. **Full Range of Motion:** Bring the dumbbells down to chest level with a 2-second negative eccentric stretch.\n4. **Finisher:** 3 sets of Cable Flyes or Pec Deck on our Viva Fitness selectorized machines for maximum blood pump!`;
  }

  // Back / Deadlift / Pullups
  if (q.includes("back") || q.includes("deadlift") || q.includes("lat") || q.includes("pullup") || q.includes("row")) {
    return `**Coach Ritwik's Guide for a V-Taper Back:**\n\n1. **Vertical Pull:** Wide-Grip Lat Pulldowns or weighted pullups (3-4 sets of 8-12 reps).\n2. **Horizontal Row:** Chest-supported T-Bar Rows or Seated Cable Rows to build mid-back thickness.\n3. **Deadlifts:** Practice conventional deadlifts on our dedicated Olympic deadlift platform with bumper plates.\n4. **Key Cue:** Pull through your elbows, not your hands, and pause for a 1-second squeeze at peak contraction!`;
  }

  // Arms / Biceps / Triceps
  if (q.includes("bicep") || q.includes("tricep") || q.includes("arm") || q.includes("dole")) {
    return `**Coach Ritwik's Blueprint for Bigger Arms:**\n\n• **Triceps (65% of arm size):** Overhead Cable Extensions (long head) + Weighted Dips + Close-Grip Pushdowns.\n• **Biceps (Peak & Thickness):** Incline Dumbbell Curls (maximum stretch) + Barbell Preacher Curls + Hammer Curls (brachialis & forearms).\n• **Volume:** 10-12 hard sets per week per arm muscle is ideal. Avoid swinging the weights—keep elbows locked at your sides!`;
  }

  // Legs & Squats
  if (q.includes("leg") || q.includes("squat") || q.includes("quad") || q.includes("hamstring") || q.includes("calf")) {
    return `**Coach Ritwik's Leg Day Rules (Never Skip Leg Day!):**\n\n1. **Compound Foundation:** Barbell Back Squats in our heavy-duty squat rack (3-4 sets of 6-8 reps).\n2. **Quad Hypertrophy:** 45° Incline Leg Press followed by Leg Extensions with slow 3-second descents.\n3. **Hamstrings & Glutes:** Romanian Deadlifts (RDLs) with dumbbells + Lying Leg Curls.\n4. **Calves:** Standing Calf Raises with a 2-second pause at the bottom stretch.\n\nFinish with 15 minutes in our Moroccan steam bath to flush lactic acid and eliminate soreness!`;
  }

  // Creatine, Whey & Supplements
  if (q.includes("creatine") || q.includes("whey") || q.includes("supplement") || q.includes("bcaa") || q.includes("preworkout") || q.includes("protein powder")) {
    return `**Coach Ritwik's Evidence-Based Supplement Guide:**\n\n• **Creatine Monohydrate:** Take 3g–5g daily with water. No loading phase needed. Increases ATP energy, muscle fullness, and raw strength. Safe for long-term use (drink 3.5L+ water daily).\n• **Whey Protein:** Excellent convenience tool to hit your daily protein goal (1 scoop = 24g-27g protein). Best post-workout or between meals.\n• **Pre-Workout:** Optional. A black coffee or 150mg-200mg caffeine pill 30 mins before training gives great focus.\n• **Skip:** BCAAs (if you consume enough protein, BCAAs are a waste of money) and fancy fat burners.`;
  }

  // Fat Loss, Belly Fat & Cardio
  if (q.includes("fat loss") || q.includes("weight loss") || q.includes("belly") || q.includes("abs") || q.includes("cardio") || q.includes("pet")) {
    return `**Coach Ritwik's Truth on Fat Loss & Six-Pack Abs:**\n\n1. **Caloric Deficit:** Spot reduction is a myth—you cannot crunch away belly fat! Fat is burned globally when you consume 300-500 kcal less than your maintenance.\n2. **High Protein:** Keeps you full and protects muscle mass so your metabolism stays fiery high.\n3. **Compound Lifting:** Keep lifting heavy weights! It forces your body to burn pure fat instead of sacrificing muscle.\n4. **Daily Steps:** Aim for 8,000–10,000 steps daily using our indoor turf sprint track or treadmills.`;
  }

  // Ladies / Women's Batches
  if (q.includes("female") || q.includes("women") || q.includes("girl") || q.includes("lady") || q.includes("ladies") || q.includes("mahila")) {
    return `**Women's Fitness at Vikings Gym & Spa:**\n\n• **Safe & Respectful Environment:** Certified female trainer **Neha Singh** leads specialized women's strength, conditioning, and posture sculpting sessions.\n• **Dedicated Timings:** Special morning and evening batch timings with full privacy.\n• **Dance & Zumba:** Regular energetic sessions with coach **Deepsikha**.\n• **Brand Ambassador:** Bihar fitness icon **Vaishnavi Singh (@chawal.to.choorma)** trains here and advocates for women lifting heavy weights!\n\nVisit us for a warm, welcoming free tour anytime!`;
  }

  // Diet & Nutrition
  if (q.includes("diet") || q.includes("protein") || q.includes("food") || q.includes("gain") || q.includes("loss") || q.includes("fat") || q.includes("वजन") || q.includes("डाइट") || q.includes("meal")) {
    return `**Coach Ritwik's Indian Fitness Diet Blueprint:**\n\n1. **Daily Protein Target:** 1.6g–2g of protein per kg of body weight.\n   - **Vegetarian Options:** Paneer (100g = 18g protein), Soya Chunks (50g = 26g protein), Low-fat Dahi/Greek Yogurt, Moong dal sprouts, Whey Protein.\n   - **Non-Vegetarian Options:** Eggs (6g per whole egg), Chicken breast (100g = 30g protein), Fish.\n2. **Healthy Carbs:** Oats, Brown/White rice, Roti, Sweet potatoes for workout stamina.\n3. **Good Fats:** Almonds, Walnuts, Peanut butter, and small amounts of pure Desi Ghee.\n4. **Hydration:** 3.5 to 4 liters of clean water daily.\n\nOur coaches customize your complete meal blueprint when you register!`;
  }

  return `Hey warrior! I am **Ritwik**, your AI Fitness Coach & Arena Advisor at Vikings Gym & Spa. How can I help you conquer your goals today?\n\nAsk me about:\n• **Workout Splits & Form** (Chest, Back, Arms, Legs, Squats, Deadlifts)\n• **Supplements** (Creatine, Whey protein, Pre-workout)\n• **Indian Diet Plans** (High protein veg/non-veg, fat loss, lean bulking)\n• **Vikings Gym Facilities** (Membership fees, timings on MG Road, Moroccan steam spa)`;
}

