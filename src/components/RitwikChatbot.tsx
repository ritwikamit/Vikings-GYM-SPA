import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  X, 
  Send, 
  RotateCcw, 
  User, 
  CheckCheck,
  Dumbbell,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { sendRitwikMessage, ChatMessage } from "../services/aiChatService";
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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: "Namaste! I am **Ritwik**, your AI Fitness Coach & Arena Advisor at **Vikings Gym & Spa**, Aurangabad.\n\nAsk me anything about **gym workouts, strength training, Indian diets, or our membership plans and steam spa**! How can I help you crush your fitness goals today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

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
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMsg]);
      if (!isOpen) setHasUnread(true);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: "I am having trouble connecting to the network right now. Please call or WhatsApp our reception desk directly at **+91 8809544449** for instant assistance!",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: "Chat cleared! I am **Ritwik**. Ask me any question on **workouts, gym equipment, nutrition, or Vikings Gym memberships**.",
        timestamp: new Date()
      }
    ]);
  };

  // Helper to format bot responses with markdown-like bolding and bullet points
  const formatBotContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Bold text processing
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-bold text-red-500 font-sans">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-inherit my-0.5 leading-relaxed">
            {renderedParts}
          </li>
        );
      }
      if (line.trim().match(/^\d+\.\s/)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-inherit my-0.5 leading-relaxed">
            {renderedParts}
          </li>
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="my-1 leading-relaxed">
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Button: exact same size and right-alignment as ScrollToTopButton */}
      <div className="fixed bottom-20 right-4 sm:right-6 lg:bottom-6 z-50 flex items-center">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="mr-2.5 hidden sm:flex items-center bg-neutral-950/90 text-neutral-200 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-neutral-800 hover:border-red-500/50 shadow-xl backdrop-blur-md cursor-pointer transition-all select-none group"
            >
              <span>Ask Coach <strong className="text-red-500 font-bold group-hover:text-red-400 transition-colors">Ritwik</strong></span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close Ritwik Chatbot" : "Open Ritwik Chatbot"}
          className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center p-0 cursor-pointer shadow-2xl transition-all duration-200 ${
            isOpen 
              ? "bg-neutral-900 border-2 border-red-500 text-white shadow-black/80" 
              : "bg-neutral-950 border-2 border-red-600 hover:border-red-500 hover:bg-neutral-900 text-white shadow-black/80"
          }`}
        >
          {/* Online green indicator: appears on the chatbot icon only */}
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-neutral-950 shadow-[0_0_8px_rgba(16,185,129,0.8)] pointer-events-none" />

          {isOpen ? (
            <X className="w-5 h-5 text-red-400 transition-transform" />
          ) : (
            <MessageSquare className="w-5 h-5 text-white transition-colors" />
          )}
        </motion.button>
      </div>

      {/* Main Chat Modal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-24 sm:bottom-24 lg:bottom-22 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[410px] md:w-[430px] max-h-[82vh] sm:max-h-[640px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-950 text-white font-sans backdrop-blur-xl"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px -5px rgba(220, 38, 38, 0.2)"
            }}
          >
            {/* Header */}
            <div className="relative px-4 py-3.5 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-red-500/50 shadow-md bg-neutral-900 ring-1 ring-red-500/20">
                    <img
                      src={chatbotProfilePhoto}
                      alt="Coach Ritwik"
                      className="w-full h-full object-cover object-[center_20%]"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-neutral-900 shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm tracking-wide text-white">Ritwik</span>
                    <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                      Fitness Coach
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Vikings Gym &amp; Spa Expert
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Clear conversation"
                  aria-label="Clear chat"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  aria-label="Close chat"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Guardrail Disclaimer Banner */}
            <div className="px-3.5 py-1.5 bg-red-950/40 border-b border-red-900/30 text-[10.5px] text-neutral-300 flex items-center justify-between">
              <span className="truncate">
                ⚡ Strictly answers <strong>Gym Workouts, Diets &amp; Vikings Facilities</strong>.
              </span>
              <a
                href={`https://wa.me/${GYM_CONFIG.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-0.5 shrink-0 ml-2"
              >
                WhatsApp Desk <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 text-xs sm:text-[13px] scrollbar-thin scrollbar-thumb-neutral-800">
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
                          : "border-red-500/40 bg-neutral-900"
                      }`}
                    >
                      {isUser ? (
                        <User className="w-3.5 h-3.5" />
                      ) : (
                        <img
                          src={chatbotProfilePhoto}
                          alt="Ritwik"
                          className="w-full h-full object-cover object-[center_20%]"
                        />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                        isUser
                          ? "bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-tr-none font-medium"
                          : "bg-neutral-900 border border-neutral-800 text-gray-200 rounded-tl-none font-normal"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="space-y-1">{formatBotContent(msg.content)}</div>
                      )}
                      <div
                        className={`text-[9.5px] mt-1 flex items-center gap-1 ${
                          isUser ? "text-red-100 justify-end" : "text-gray-500 justify-start"
                        }`}
                      >
                        <span>
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {isUser && <CheckCheck className="w-3 h-3 text-red-200" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full border border-red-500/40 shrink-0 overflow-hidden bg-neutral-900">
                    <img
                      src={chatbotProfilePhoto}
                      alt="Ritwik"
                      className="w-full h-full object-cover object-[center_20%] opacity-85"
                    />
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 text-gray-400 rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" />
                    <span className="text-[11px] text-gray-400 ml-1.5 font-mono">Ritwik is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-2 bg-neutral-900/60 border-t border-neutral-850 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={loading}
                  onClick={() => handleSend(prompt)}
                  className="shrink-0 text-[10.5px] font-semibold bg-neutral-800 hover:bg-neutral-750 text-gray-300 hover:text-white px-2.5 py-1 rounded-full border border-neutral-700 hover:border-red-500/40 transition-colors cursor-pointer select-none disabled:opacity-50"
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
              className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Ritwik about gym workouts or diets..."
                disabled={loading}
                className="flex-1 bg-neutral-900 text-white placeholder-gray-500 text-xs sm:text-[13px] px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-red-500 transition-colors disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-neutral-850 disabled:text-gray-600 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RitwikChatbot;
