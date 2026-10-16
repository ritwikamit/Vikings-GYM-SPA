import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  X, 
  Send, 
  RotateCcw, 
  User, 
  CheckCheck,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { sendRitwikMessage, refineBotResponse, ChatMessage } from "../services/aiChatService";
import { GYM_CONFIG } from "../config/gym";
import chatbotProfilePhoto from "../../assets/ChatbotImage.webp";

const QUICK_PROMPTS = [
  "💰 Membership Plans & Fees",
  "⏰ Gym Timings & Batches",
  "🧖 Moroccan Steam Spa Details",
  "🥗 High Protein Indian Diet Plan",
  "🏋️ Beginner Workout Routine",
  "👩 Ladies Batches & Privacy"
];

export const RitwikChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLight, setIsLight] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      document.documentElement.classList.contains("theme-light") ||
      document.body?.classList.contains("theme-light") ||
      localStorage.getItem("vikings_theme") === "light"
    );
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Namaste! I am Ritwik, your AI Fitness Coach & Arena Advisor at Vikings Gym & Spa, Aurangabad.\n\nAsk me anything about:\n1. Gym workouts, exercise form & strength training\n2. High-protein Indian diets & daily nutrition\n3. Vikings Gym membership plans & Moroccan steam spa\n\nHow can I help you crush your fitness goals today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTypingId, setActiveTypingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Synchronize with site theme toggle (light / dark)
  useEffect(() => {
    const checkTheme = () => {
      const active =
        document.documentElement.classList.contains("theme-light") ||
        document.body?.classList.contains("theme-light") ||
        localStorage.getItem("vikings_theme") === "light";
      setIsLight(active);
    };
    checkTheme();

    const handleThemeChange = (e: any) => {
      setIsLight(e?.detail?.theme === "light");
    };

    window.addEventListener("vikings_theme_change", handleThemeChange);
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("vikings_theme_change", handleThemeChange);
      observer.disconnect();
    };
  }, []);

  // Cleanup typewriter on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages, isTyping]);

  // Simulates manual keystroke typing cadence with progressive reveal
  const typeMessageOut = (text: string, msgId: string) => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    setIsTyping(true);
    setActiveTypingId(msgId);
    let index = 0;

    const tick = () => {
      // Chunk 3-5 chars per tick for smooth, realistic typing speed
      const chunkSize = Math.floor(Math.random() * 3) + 3;
      index = Math.min(index + chunkSize, text.length);
      const partial = text.slice(0, index);

      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, content: partial } : m))
      );
      scrollToBottom();

      if (index < text.length) {
        typingTimerRef.current = setTimeout(tick, 20);
      } else {
        setIsTyping(false);
        setActiveTypingId(null);
      }
    };

    tick();
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendRitwikMessage(query, messages);
      const refined = refineBotResponse(response);
      const botMsgId = `bot-${Date.now()}`;
      const botMsg: ChatMessage = {
        id: botMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
      typeMessageOut(refined, botMsgId);
    } catch {
      const fallbackText = refineBotResponse(
        "I am having trouble connecting to the network right now. Please call or WhatsApp our reception desk directly at +91 8809544449 for instant assistance!"
      );
      const botMsgId = `bot-${Date.now()}`;
      const botMsg: ChatMessage = {
        id: botMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
      typeMessageOut(fallbackText, botMsgId);
    }
  };

  const handleResetChat = () => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    setIsTyping(false);
    setActiveTypingId(null);
    setLoading(false);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content:
          "Chat cleared! I am Ritwik. Ask me any question on workouts, gym equipment, nutrition, or Vikings Gym memberships.",
        timestamp: new Date()
      }
    ]);
  };

  const formatBotContent = (content: string, isBeingTyped: boolean) => {
    const lines = content.split("\n");
    return (
      <div className="space-y-1">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          // Check if numbered line like "1. text" or "1) text"
          const numMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)$/);
          if (numMatch) {
            const num = numMatch[1];
            const itemText = numMatch[2];
            return (
              <div key={idx} className="flex items-start gap-2 my-1 leading-relaxed">
                <span
                  className={`shrink-0 flex items-center justify-center w-4.5 h-4.5 rounded-full text-[10.5px] font-bold font-mono mt-0.5 ${
                    isLight
                      ? "bg-red-100 text-red-600"
                      : "bg-red-950/90 text-red-400 border border-red-800/50"
                  }`}
                >
                  {num}
                </span>
                <span className="flex-1">{itemText}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="my-1 leading-relaxed">
              {trimmed}
            </p>
          );
        })}
        {isBeingTyped && (
          <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-red-500 rounded-xs animate-pulse align-middle" />
        )}
      </div>
    );
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-20 right-4 sm:right-6 lg:bottom-6 z-50 flex items-center">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className={`mr-2.5 hidden sm:flex items-center text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-xl backdrop-blur-md cursor-pointer transition-all select-none group border ${
                isLight
                  ? "bg-white/95 text-slate-800 border-slate-200 hover:border-red-500/50"
                  : "bg-neutral-950/90 text-neutral-200 border-neutral-800 hover:border-red-500/50"
              }`}
            >
              <span>
                Ask Coach{" "}
                <strong className="text-red-500 font-bold group-hover:text-red-600 transition-colors">
                  Ritwik
                </strong>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close Ritwik Chatbot" : "Open Ritwik Chatbot"}
          className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center p-0 cursor-pointer shadow-2xl transition-all duration-200 border-2 ${
            isOpen
              ? isLight
                ? "bg-slate-100 border-red-500 text-red-500"
                : "bg-neutral-900 border-red-500 text-red-400"
              : isLight
                ? "bg-white border-red-600 hover:bg-slate-50 text-red-600"
                : "bg-neutral-950 border-red-600 hover:border-red-500 hover:bg-neutral-900 text-white"
          }`}
        >
          {/* Online green indicator: appears on the chatbot icon perimeter */}
          <span
            className={`absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 shadow-[0_0_8px_rgba(16,185,129,0.8)] pointer-events-none ${
              isLight ? "border-white" : "border-neutral-950"
            }`}
          />

          {isOpen ? (
            <X className="w-5 h-5 text-red-500 transition-transform" />
          ) : (
            <MessageSquare
              className={`w-5 h-5 transition-colors ${isLight ? "text-red-600" : "text-white"}`}
            />
          )}
        </motion.button>
      </div>

      {/* Main Chat Modal Window: Smartphone-optimized & Light/Dark Theme Adaptive */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`fixed z-50 inset-x-2.5 top-16 bottom-3 sm:inset-x-auto sm:top-auto sm:bottom-22 sm:right-6 sm:w-[410px] sm:h-[580px] sm:max-h-[calc(100dvh-7rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl font-sans backdrop-blur-xl transition-colors duration-200 ${
              isLight
                ? "bg-white border border-slate-200/90 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
                : "bg-neutral-950 border border-neutral-800 text-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_35px_-5px_rgba(220,38,38,0.2)]"
            }`}
          >
            {/* Header: Gradient Red with pure white text & icons in both themes */}
            <div className="ritwik-gradient-header relative px-4 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 border-b border-red-700/60 shadow-md flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/80 shadow-md bg-neutral-900 ring-2 ring-white/20">
                    <img
                      src={chatbotProfilePhoto}
                      alt="Coach Ritwik"
                      width="40"
                      height="40"
                      decoding="async"
                      className="w-full h-full object-cover object-[center_20%]"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-red-700 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-extrabold text-base tracking-wide text-white drop-shadow-xs">
                      Ritwik
                    </span>
                  </div>
                  <p className="text-[11px] flex items-center gap-1 font-medium text-red-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    <span>Vikings Gym &amp; Spa Expert</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Clear conversation"
                  aria-label="Clear chat"
                  className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-white" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  aria-label="Close chat"
                  className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>


            {/* Guardrail Disclaimer Banner */}
            <div
              className={`px-3.5 py-1.5 border-b text-[10.5px] flex items-center justify-between shrink-0 transition-colors ${
                isLight
                  ? "bg-red-50/90 border-red-100 text-red-950 font-medium"
                  : "bg-red-950/40 border-red-900/30 text-neutral-300"
              }`}
            >
              <span className="truncate">
                ⚡ Answers <strong>Gym Workouts, Diets &amp; Vikings Facilities</strong>.
              </span>
              <a
                href={`https://wa.me/${GYM_CONFIG.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className={`font-semibold flex items-center gap-0.5 shrink-0 ml-2 transition-colors ${
                  isLight ? "text-red-600 hover:text-red-700" : "text-red-400 hover:text-red-300"
                }`}
              >
                WhatsApp Desk <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            {/* Messages Scroll Area */}
            <div
              className={`flex-1 overflow-y-auto px-4 py-3 space-y-3.5 text-xs sm:text-[13px] scrollbar-thin transition-colors ${
                isLight
                  ? "bg-slate-100/70 scrollbar-thumb-slate-300"
                  : "bg-neutral-950 scrollbar-thumb-neutral-800"
              }`}
            >
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border overflow-hidden ${
                        isUser
                          ? "bg-red-600 text-white border-red-500"
                          : isLight
                            ? "border-red-400/50 bg-white"
                            : "border-red-500/40 bg-neutral-900"
                      }`}
                    >
                      {isUser ? (
                        <User className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <img
                          src={chatbotProfilePhoto}
                          alt="Ritwik"
                          width="28"
                          height="28"
                          decoding="async"
                          className="w-full h-full object-cover object-[center_20%]"
                        />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                        isUser
                          ? "bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-tr-none font-medium ritwik-user-bubble shadow-sm"
                          : isLight
                            ? "bg-white border border-slate-200/90 text-slate-800 rounded-tl-none font-normal shadow-xs"
                            : "bg-neutral-900 border border-neutral-800 text-gray-200 rounded-tl-none font-normal shadow-xs"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap !text-white text-white">{msg.content}</p>
                      ) : (
                        <div>{formatBotContent(msg.content, isTyping && msg.id === activeTypingId)}</div>
                      )}
                      <div
                        className={`text-[9.5px] mt-1 flex items-center gap-1 ${
                          isUser
                            ? "text-red-100 justify-end"
                            : isLight
                              ? "text-slate-400 justify-start"
                              : "text-gray-500 justify-start"
                        }`}
                      >
                        <span>
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {isUser && <CheckCheck className="w-3 h-3 text-red-100" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-full border shrink-0 overflow-hidden ${
                      isLight ? "border-red-400/50 bg-white" : "border-red-500/40 bg-neutral-900"
                    }`}
                  >
                    <img
                      src={chatbotProfilePhoto}
                      alt="Ritwik"
                      width="28"
                      height="28"
                      decoding="async"
                      className="w-full h-full object-cover object-[center_20%] opacity-85"
                    />
                  </div>
                  <div
                    className={`rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-1.5 border shadow-xs ${
                      isLight
                        ? "bg-white border-slate-200 text-slate-500"
                        : "bg-neutral-900 border-neutral-800 text-gray-400"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" />
                    <span
                      className={`text-[11px] ml-1.5 font-mono ${
                        isLight ? "text-slate-500" : "text-gray-400"
                      }`}
                    >
                      Ritwik is thinking...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div
              className={`px-3 py-2 border-t flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 transition-colors ${
                isLight
                  ? "bg-slate-100/90 border-slate-200"
                  : "bg-neutral-900/60 border-neutral-850"
              }`}
            >
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={loading || isTyping}
                  onClick={() => handleSend(prompt)}
                  className={`shrink-0 text-[10.5px] font-semibold px-2.5 py-1 rounded-full border transition-colors cursor-pointer select-none disabled:opacity-50 ${
                    isLight
                      ? "bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-300 hover:border-red-400 shadow-2xs"
                      : "bg-neutral-800 hover:bg-neutral-750 text-gray-300 hover:text-white border-neutral-700 hover:border-red-500/40"
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className={`p-3 border-t flex items-center gap-2 shrink-0 transition-colors ${
                isLight
                  ? "bg-white border-slate-200"
                  : "bg-neutral-950 border-neutral-800"
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Ritwik about gym workouts or diets..."
                disabled={loading || isTyping}
                className={`flex-1 text-xs sm:text-[13px] px-3.5 py-2.5 rounded-xl border focus:outline-none focus:border-red-500 transition-colors disabled:opacity-60 ${
                  isLight
                    ? "bg-slate-50 text-slate-900 placeholder-slate-400 border-slate-300 focus:bg-white"
                    : "bg-neutral-900 text-white placeholder-gray-500 border-neutral-800"
                }`}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading || isTyping}
                aria-label="Send message"
                className="ritwik-send-btn w-10 h-10 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed shadow-md"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RitwikChatbot;
