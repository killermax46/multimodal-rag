"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ChatBox from "./components/ChatBox";
import FileUploader from "./components/FileUploader";

const API = process.env.NEXT_PUBLIC_API_URL!;

type DocMeta = {
  id: string;
  name: string;
};

export default function Home() {
  const [docId, setDocId] = useState<string | null>(null);
  const [docName, setDocName] = useState<string | null>(null);
  const [docs, setDocs] = useState<DocMeta[]>([]);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const filteredDocs = docs.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDocumentChange = (id: string, name: string) => {
    setDocId(id);
    setDocName(name);
    setDocs((prev) => {
      if (prev.some((d) => d.id === id)) return prev;
      return [...prev, { id, name }];
    });
  };

  const handleDeleteDocument = async (id: string) => {
    const target = docs.find((d) => d.id === id);
    if (!target) return;

    const ok = confirm(`Delete "${target.name}"?`);
    if (!ok) return;

    try {
      await axios.post(`${API}/delete_document`, { doc_id: id });
    } catch {}

    setDocs((prev) => prev.filter((d) => d.id !== id));
    if (docId === id) {
      setDocId(null);
      setDocName(null);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const initial =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="workspace">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>📚 Vault</h2>
          <button
            className="theme-btn"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        <FileUploader
          onUploaded={handleDocumentChange}
          existingNames={docs.map((d) => d.name)}
          activeDocName={docName}
        />

        <input
          className="search"
          placeholder="Search docs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="doc-list">
          {filteredDocs.map((d) => (
            <div
              key={d.id}
              className={`doc-item ${docId === d.id ? "active" : ""}`}
            >
              <button
                onClick={() => {
                  setDocId(d.id);
                  setDocName(d.name);
                }}
              >
                📄 {d.name}
              </button>

              <button onClick={() => handleDeleteDocument(d.id)}>🗑</button>
            </div>
          ))}
        </div>
      </aside>

      {/* CENTER CHAT */}
      <main className="chat-area">
        <div className="chat-header">
          <h1>AI Assistant</h1>
          <p>{docName ? `Talking about: ${docName}` : "No document selected"}</p>
        </div>

        <ChatBox
          docId={docId}
          docName={docName}
          onDocumentChange={handleDocumentChange}
          existingNames={docs.map((d) => d.name)}
        />
      </main>

      {/* RIGHT PANEL */}
      <aside className="info-panel">
        <h3>📌 Context</h3>

        {docName ? (
          <div className="info-card">
            <p><b>Active Document:</b></p>
            <p>{docName}</p>
            <p>Status: Ready for Q&A</p>
          </div>
        ) : (
          <div className="info-card muted">
            Select a document to start chatting
          </div>
        )}
      </aside>
    </div>
  );
}