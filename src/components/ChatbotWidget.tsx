import { useRef, useState } from "react";
import axios from "axios";
import { Bot, SendHorizonal, Sparkles, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

type ChatSender = "user" | "bot";

interface ChatMessage {
  id: number;
  sender: ChatSender;
  text: string;
}

const API_URL = import.meta.env.VITE_CHATBOT_API_URL;

const getResponseText = (payload: unknown): string => {
  if (typeof payload === "string") return payload;

  if (Array.isArray(payload)) {
    const item = payload.find((entry) => typeof entry === "string");
    if (item) return item;
  }

  if (payload && typeof payload === "object") {
    const data = payload as Record<string, unknown>;

    const directKeys = ["message", "reply", "answer", "text", "content", "response", "output"];
    for (const key of directKeys) {
      const value = data[key];
      if (typeof value === "string" && value.trim()) return value;
      if (Array.isArray(value)) {
        const combined = value
          .filter((item): item is string => typeof item === "string")
          .join("\n");
        if (combined.trim()) return combined;
      }
    }

    for (const value of Object.values(data)) {
      if (value && typeof value === "object") {
        const nestedText = getResponseText(value);
        if (nestedText && nestedText !== "") return nestedText;
      }
    }
  }

  return "Sorry, I couldn't generate a response right now.";
};

const formatMessageText = (text: string) =>
  text.split("\n").map((line, index) => (
    <span key={`${line}-${index}`}>
      {index > 0 && <br />}
      {line || " "}
    </span>
  ));

export default function ChatbotWidget() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hi! I can help with your project, services, or general questions. Ask me anything.",
    },
  ]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isDark = theme === "dark";

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        API_URL,
        { prompt: trimmed },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );

      const botReply = getResponseText(response?.data ?? {});

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: botReply,
        },
      ]);
    } catch (error) {
      console.error("Chatbot request failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "bot",
          text: "I’m having trouble reaching the assistant right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div
          className={[
            "w-[360px] overflow-hidden rounded-2xl border shadow-2xl",
            isDark
              ? "border-slate-800 bg-slate-950 text-slate-50 shadow-slate-950/40"
              : "border-slate-200 bg-white text-slate-900 shadow-slate-200/80",
          ].join(" ")}
        >
          <div
            className={[
              "flex items-center justify-between border-b px-4 py-3",
              isDark ? "border-slate-800 bg-slate-900/90" : "border-slate-200 bg-slate-50",
            ].join(" ")}
          >
            <div className="flex items-center gap-2">
              <div
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  isDark ? "bg-blue-600/20 text-blue-400" : "bg-blue-100 text-blue-600",
                ].join(" ")}
              >
                <Bot size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold">Chat Assistant</p>
                <p className={isDark ? "text-xs text-slate-400" : "text-xs text-slate-500"}>Online now</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={[
                "flex h-8 w-8 items-center justify-center rounded-full transition",
                isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-200",
              ].join(" ")}
              aria-label="Close chatbot"
            >
              <X size={18} />
            </button>
          </div>

          <div
            className={[
              "flex max-h-[420px] min-h-[420px] flex-col gap-3 overflow-y-auto px-4 py-4",
              isDark ? "bg-slate-950" : "bg-slate-50",
            ].join(" ")}
          >
            {messages.map((message) => {
              const isUser = message.sender === "user";

              return (
                <div
                  key={message.id}
                  className={[
                    "flex w-full",
                    isUser ? "justify-end" : "justify-start",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm",
                      isUser
                        ? "bg-blue-600 text-white"
                        : isDark
                          ? "bg-slate-900 text-slate-100"
                          : "bg-white text-slate-800",
                    ].join(" ")}
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {formatMessageText(message.text)}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className={[
                    "flex items-center gap-2 rounded-2xl px-3 py-2",
                    isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-800",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className={[
                          "h-2.5 w-2.5 animate-pulse rounded-full",
                          isDark ? "bg-slate-400" : "bg-slate-500",
                        ].join(" ")}
                        style={{ animationDelay: `${dot * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className={[
              "flex items-center gap-2 border-t px-3 py-3",
              isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white",
            ].join(" ")}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className={[
                "flex-1 rounded-full border px-3 py-2 text-sm outline-none transition",
                isDark
                  ? "border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
                  : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-blue-500",
              ].join(" ")}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={[
                "flex h-11 w-11 items-center justify-center rounded-full text-white transition disabled:cursor-not-allowed disabled:opacity-50",
                isDark ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-600 hover:bg-blue-500",
              ].join(" ")}
              aria-label="Send message"
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={[
            "group flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition duration-200 hover:scale-105 hover:shadow-xl",
            isDark ? "bg-blue-600 text-white shadow-blue-900/40" : "bg-blue-600 text-white shadow-blue-500/30",
          ].join(" ")}
          aria-label="Open chatbot"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="absolute -top-1 right-0 h-3.5 w-3.5 text-yellow-300" />
            <Bot size={28} />
          </div>
        </button>
      )}
    </div>
  );
}
