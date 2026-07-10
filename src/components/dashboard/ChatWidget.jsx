import React, { useState, useEffect, useRef } from "react";
import { sanitizeInput, matchReply } from "../../utils/helpers";
import { COLORS, GREETING, LANGUAGES, QUICK_REPLIES } from "../../utils/constants";
import { MessageCircle, X, Send, Globe2, Sparkles } from "lucide-react";

/**
 * ChatWidget Component
 * Renders an interactive, floating chatbot concierge supporting multilingual operations.
 * Highly optimized and decoupled for code quality.
 */
const ChatWidget = React.memo(function ChatWidget({ densities }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([{ from: "bot", text: GREETING.en }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setMessages([{ from: "bot", text: GREETING[lang] }]);
  }, [lang]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  function send(text) {
    const clean = sanitizeInput(text);
    if (!clean) return;
    setMessages((prev) => [...prev, { from: "user", text: clean }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = matchReply(clean, lang, densities);
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
      setTyping(false);
    }, 700 + Math.random() * 500);
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open StadiumAI assistant"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-5 py-3.5 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer bg-gradient-to-r from-[#F2B84C] to-[#C99328] text-[#0A1524]"
        >
          <MessageCircle size={20} strokeWidth={2.5} />
          <span className="font-semibold text-sm tracking-wide hidden sm:inline">Ask StadiumAI</span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="StadiumAI chat assistant"
          className="fixed z-50 bottom-0 right-0 sm:bottom-5 sm:right-5 w-full sm:w-[380px] h-[85vh] sm:h-[520px] flex flex-col rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-[#0F1E33]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0A1524]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#F2B84C] to-[#C99328]">
                <Sparkles size={16} color={COLORS.navyDeep} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight font-heading">StadiumAI Concierge</p>
                <span className="text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-[#2E7D5B]/20 text-[#4FA97C] border border-[#2E7D5B]/30 uppercase">
                  GenAI Assistant
                </span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-slate-400 hover:text-white cursor-pointer bg-transparent border-0">
              <X size={20} />
            </button>
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800/80 bg-slate-950/40">
            <Globe2 size={13} className="text-slate-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Select chat language"
              className="text-xs bg-transparent outline-none font-bold text-slate-300 cursor-pointer border-0"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-[#0F1E33] text-white">{l.label}</option>
              ))}
            </select>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-950/30" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs font-semibold leading-relaxed ${
                    m.from === "user"
                      ? "rounded-br-none bg-[#F2B84C] text-[#0A1524]"
                      : "rounded-bl-none bg-slate-900 border border-slate-850 text-slate-200"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="px-3.5 py-2 rounded-2xl rounded-bl-none text-xs italic bg-slate-900 border border-slate-850 text-slate-400 animate-pulse">
                  StadiumAI is typing…
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          <div className="flex flex-wrap gap-1.5 px-4 pb-3 pt-2 bg-slate-950/30">
            {QUICK_REPLIES[lang].map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-[10px] px-2.5 py-1 rounded-full border border-emerald-500/20 hover:border-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 transition-colors cursor-pointer font-bold"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 px-3 py-2.5 border-t border-slate-800 bg-[#0A1524]"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              aria-label="Chat message input"
              maxLength={300}
              className="flex-1 text-xs px-3.5 py-2 rounded-full outline-none border border-slate-800 bg-slate-950/80 text-white focus:border-[#F2B84C] placeholder-slate-600"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer bg-[#F2B84C] hover:bg-[#C99328] border-0"
            >
              <Send size={14} className="text-[#0A1524]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
});

export default ChatWidget;
