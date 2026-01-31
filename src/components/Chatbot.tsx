import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Sparkles, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "System Initialized. I am EverBot v2.0. How can I assist you with your hackathon journey today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Use local proxy to bypass CORS
      const response = await fetch("/api/groq/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are EverBot, a futuristic, helpful AI assistant for the EverHack platform. You help users find hackathons, understand rules, and navigate the site. Keep responses concise, helpful, and maintain a subtle cyber-punk persona."
            },
            ...messages,
            userMessage
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API Error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content || "No response received.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Connection interrupted: ${errorMessage}. Neural link unstable. Please try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button - Aesthetic Upgrade */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="absolute inset-0 bg-primary/50 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-background via-card to-background border border-primary/50 flex items-center justify-center shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20" />
          {isOpen ? (
            <X className="w-6 h-6 text-primary relative z-10" />
          ) : (
            <Cpu className="w-8 h-8 text-primary relative z-10" />
          )}
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" }}
            animate={{ opacity: 1, y: 0, scale: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}
            exit={{ opacity: 0, y: 50, scale: 0.9, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-28 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[70vh] glass-card border border-primary/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="relative p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center relative overflow-hidden">
                  <Cpu className="w-6 h-6 text-primary relative z-10" />
                  <div className="absolute inset-0 bg-primary/20 blur-md" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base tracking-wide text-foreground">EverBot <span className="text-primary text-xs">v2.0</span></h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                    <span className="text-xs text-primary/80 font-mono tracking-wider">SYSTEM ONLINE</span>
                  </div>
                </div>
              </div>
              <Sparkles className="text-secondary/50 animate-pulse-glow" size={18} />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((message, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  key={index}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-card border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg backdrop-blur-sm ${message.role === "user"
                      ? "bg-primary/90 text-primary-foreground rounded-br-sm border border-primary/50"
                      : "bg-white/5 text-foreground rounded-bl-sm border border-white/10"
                      }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-lg bg-card border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Cpu className="w-4 h-4 text-primary animate-spin-slow" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-lg">
              <div className="flex gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Input command..."
                  className="flex-1 pl-4 pr-12 py-3 rounded-xl bg-background/50 border border-white/10 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono placeholder:text-muted-foreground/50"
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1 top-1 h-8 w-8 rounded-lg bg-primary/20 hover:bg-primary/40 text-primary border border-primary/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-[10px] text-center mt-2 text-muted-foreground/30 font-mono">
                POWERED BY GROQ_AI // MODEL: LLAMA-3
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
