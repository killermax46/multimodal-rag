import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL!;

type ChatMessage = {
  role: "user" | "bot";
  content: string;
};

type ChatBoxProps = {
  docId?: string | null;
  docName?: string | null;
  onDocumentChange?: (docId: string, fileName: string) => void;
  existingNames?: string[];
};

const urlRegex = /(https?:\/\/[^\s]+)/g;

function renderMessageContent(text: string) {
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.startsWith("http")) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noreferrer"
          style={{
            color: "#4f46e5",
            textDecoration: "underline",
            wordBreak: "break-all",
          }}
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function ChatBox({
  docId,
  docName,
  onDocumentChange,
  existingNames,
}: ChatBoxProps) {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<
    "rag" | "web_search" | "ui_generator" | "youtube"
  >("rag");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const send = async () => {
    if (!msg.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: msg,
    };

    setChat((prev) => [...prev, userMessage]);
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/chat`, {
        message: msg,
        doc_id: docId,
        mode,
      });

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          content: res.data.response ?? "No response.",
        },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          content: "⚠️ Server error. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: "18px",
        overflow: "hidden",
        background: "linear-gradient(180deg,#f8fafc,#eef2ff)",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "14px",
          borderBottom: "1px solid #e5e7eb",
          background: "white",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "16px" }}>
          💬 Study Assistant AI
        </div>
        <div style={{ fontSize: "12px", opacity: 0.6 }}>
          {docName ? `Using: ${docName}` : "No document selected"}
        </div>
      </div>

      {/* MODE SELECTOR */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "10px",
          background: "#f9fafb",
          borderBottom: "1px solid #e5e7eb",
          flexWrap: "wrap",
        }}
      >
        {["rag", "web_search", "ui_generator", "youtube"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as any)}
            style={{
              padding: "6px 10px",
              borderRadius: "999px",
              fontSize: "12px",
              border:
                mode === m ? "1px solid #4f46e5" : "1px solid #e5e7eb",
              background: mode === m ? "#4f46e5" : "white",
              color: mode === m ? "white" : "#111827",
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* CHAT AREA */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {chat.length === 0 && (
          <div style={{ opacity: 0.5, fontSize: "14px" }}>
            Start asking something...
          </div>
        )}

        {chat.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "10px 14px",
                borderRadius: "14px",
                fontSize: "14px",
                background:
                  m.role === "user"
                    ? "linear-gradient(135deg,#4f46e5,#6366f1)"
                    : "white",
                color: m.role === "user" ? "white" : "#111827",
                border: m.role === "bot" ? "1px solid #e5e7eb" : "none",
                boxShadow:
                  m.role === "bot"
                    ? "0 2px 10px rgba(0,0,0,0.04)"
                    : "none",
              }}
            >
              {renderMessageContent(m.content)}
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "12px",
          borderTop: "1px solid #e5e7eb",
          background: "white",
        }}
      >
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Ask something..."
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: "999px",
            border: "1px solid #e5e7eb",
            outline: "none",
            fontSize: "14px",
          }}
        />

        <button
          onClick={send}
          disabled={loading}
          style={{
            padding: "10px 16px",
            borderRadius: "999px",
            border: "none",
            background: "#4f46e5",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}