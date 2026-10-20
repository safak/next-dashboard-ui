"use client";

import { useState, useRef, useEffect } from "react";

type FlowStep = "idle" | "name" | "phone" | "class" | "done";

type Message = {
  role: "user" | "assistant";
  text: string;
  options?: string[];
};

export default function ChatWidget({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [flowStep, setFlowStep] = useState<FlowStep>("idle");

  const [leadData, setLeadData] = useState({
    name: "",
    phone: "",
    classInterested: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔹 Validation helpers
  const isValidPhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    // 🔥 TRIGGER FLOW
    if (flowStep === "idle" && userText.toLowerCase().includes("admission")) {
      setFlowStep("name");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Great! May I know your name?" },
      ]);
      return;
    }

    // 🔹 NAME
    if (flowStep === "name") {
      if (userText.length < 2) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Please enter a valid name." },
        ]);
        return;
      }

      setLeadData((prev) => ({ ...prev, name: userText }));
      setFlowStep("phone");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Please share your phone number." },
      ]);
      return;
    }

    // 🔹 PHONE
    if (flowStep === "phone") {
      if (!isValidPhone(userText)) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Please enter a valid 10-digit phone number.",
          },
        ]);
        return;
      }

      setLeadData((prev) => ({ ...prev, phone: userText }));
      setFlowStep("class");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Which class are you interested in?",
          options: ["PlayGroup", "Nursery", "JuniorKG", "SeniorKG", "Grade1", "Grade2", "Grade3"], 
        },
      ]);
      return;
    }

    // 🔹 CLASS STEP (FINAL CORRECT)
    if (flowStep === "class") {
      // Save selected class (typed OR fallback)
      const finalData = {
        ...leadData,
        classInterested: userText,
      };

      setFlowStep("done");
      setIsTyping(true);

      try {
        await fetch("/api/agent/lead", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        });

        setIsTyping(false);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "✅ Thank you! Our team will contact you shortly.",
          },
        ]);
      } catch {
        setIsTyping(false);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "⚠️ Failed to save details. Please try again.",
          },
        ]);
      }

      return;
    }

    // 🔥 NORMAL AI CHAT
    setIsTyping(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      setIsTyping(false);

      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch {
      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Something went wrong." },
      ]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!open) return null;

  const handleOptionClick = async (option: string) => {
    setMessages((prev) => [...prev, { role: "user", text: option }]);

    const finalData = {
      ...leadData,
      classInterested: option,
    };

    setFlowStep("done");
    setIsTyping(true);

    try {
      await fetch("/api/agent/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "✅ Thank you! Our team will contact you shortly.",
        },
      ]);
    } catch {
      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ Failed to save details. Please try again.",
        },
      ]);
    }
  };

  return (
    <div
      className="
    fixed z-[9999]

    /* 📱 MOBILE FULL SCREEN */
    inset-0 w-full h-full rounded-none

    /* 💻 DESKTOP FLOATING */
    sm:inset-auto
    sm:right-5 sm:bottom-32
    sm:w-[380px] sm:h-[420px]
    sm:rounded-2xl

    bg-white/80 backdrop-blur-xl
    border border-white/40
    shadow-2xl
    flex flex-col overflow-hidden
    animate-[fadeInUp_0.3s_ease-out]
  "
    >
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white flex justify-between">
        <div>
          <h3 className="text-sm font-semibold">Admissions Assistant</h3>
          <p className="text-xs opacity-80">TrueSunshine Preschool</p>
        </div>
        <button onClick={onClose}>✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-xs text-gray-500 text-center mt-10">
            👋 Ask about admissions or type &quot;admission&quot; to get started.
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : ""}`}
          >
            <div className="flex flex-col gap-2 max-w-[75%]">
              {/* Message bubble */}
              <div
                className={`px-3 py-2 text-sm rounded-2xl shadow ${
                  m.role === "user"
                    ? "bg-purple-600 text-white self-end"
                    : "bg-white border text-gray-800"
                }`}
              >
                {m.text}
              </div>

              {/* OPTIONS BUTTONS */}
              {m.options && (
                <div className="flex flex-wrap gap-2">
                  {m.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionClick(opt)}
                      className="
                px-3 py-1 text-xs rounded-full
                border border-purple-500 text-purple-600
                hover:bg-purple-600 hover:text-white
                transition
              "
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing */}
        {isTyping && (
          <div className="flex">
            <div className="px-3 py-2 bg-white border rounded-2xl flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-full border"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-4 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}
