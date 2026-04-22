import { useState } from "react";

type DocumentInspectorProps = {
  file: File;
  previewUrl: string;
};

export default function DocumentInspector({
  file,
  previewUrl,
}: DocumentInspectorProps) {
  const [tab, setTab] = useState<
    "preview" | "text" | "images" | "pages"
  >("preview");

  const [zoom, setZoom] = useState(false);
  const [focus, setFocus] = useState(false);

  const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
  const isPdf = file.type === "application/pdf";
  const isImage = file.type.startsWith("image/");

  const toggleZoom = () => setZoom((z) => !z);
  const openFocus = () => setFocus(true);
  const closeFocus = () => setFocus(false);

  const download = () => {
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = file.name;
    a.click();
  };

  const askAI = () => {
    alert("Ask in chat: 'Explain this document'");
  };

  return (
    <>
      <div className="doc-inspector">

        {/* ================= HEADER CARD ================= */}
        <div className="inspector-card">

          {/* FILE HEADER */}
          <div className="inspector-header">
            <div className="inspector-header-main">
              <div className="inspector-file-icon">📄</div>

              <div className="inspector-file-meta">
                <div className="inspector-file-name">
                  {file.name}
                </div>

                <div className="inspector-file-sub">
                  {isPdf
                    ? "PDF Document"
                    : isImage
                    ? "Image File"
                    : "File"}{" "}
                  • {sizeMb} MB
                </div>
              </div>
            </div>

            <div className="inspector-badge-current">
              Active
            </div>
          </div>

          {/* ================= TABS ================= */}
          <div className="inspector-tabs">
            {["preview", "text", "images", "pages"].map((t) => (
              <button
                key={t}
                className={
                  "inspector-tab" +
                  (tab === t ? " inspector-tab-active" : "")
                }
                onClick={() => setTab(t as any)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* ================= AI STATUS ================= */}
          <div className="inspector-ai-context">
            <span className="inspector-ai-dot" />
            <span className="inspector-ai-text">
              AI is using this document
            </span>
          </div>

          {/* ================= PREVIEW ================= */}
          {tab === "preview" && (
            <div className="inspector-preview-shell">

              <div className="inspector-preview-frame">

                <div
                  className={
                    "inspector-preview-inner" +
                    (zoom
                      ? " inspector-preview-inner-zoomed"
                      : "")
                  }
                >
                  {isImage && (
                    <img
                      src={previewUrl}
                      className="inspector-preview-media"
                      alt={file.name}
                    />
                  )}

                  {isPdf && (
                    <iframe
                      src={previewUrl}
                      className="inspector-preview-media"
                      title={file.name}
                    />
                  )}
                </div>

                {/* ================= ACTIONS ================= */}
                <div className="inspector-actions">
                  <button
                    className="inspector-action-btn"
                    onClick={toggleZoom}
                  >
                    {zoom ? "Reset" : "Zoom"}
                  </button>

                  <button
                    className="inspector-action-btn"
                    onClick={download}
                  >
                    Download
                  </button>

                  <button
                    className="inspector-action-btn"
                    onClick={openFocus}
                  >
                    Fullscreen
                  </button>

                  <button
                    className="inspector-action-btn"
                    onClick={askAI}
                  >
                    Ask AI
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= OTHER TABS ================= */}
          {tab !== "preview" && (
            <div className="inspector-tab-placeholder">
              {tab === "text" && "Text extraction coming soon..."}
              {tab === "images" && "Image extraction coming soon..."}
              {tab === "pages" && "Page breakdown coming soon..."}
            </div>
          )}
        </div>
      </div>

      {/* ================= FOCUS MODAL ================= */}
      {focus && (
        <div
          className="inspector-modal-backdrop"
          onClick={closeFocus}
        >
          <div
            className="inspector-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inspector-modal-header">
              <span className="inspector-modal-title">
                {file.name}
              </span>

              <button
                className="inspector-modal-close"
                onClick={closeFocus}
              >
                ✕
              </button>
            </div>

            <div className="inspector-modal-body">
              {isImage && (
                <img
                  src={previewUrl}
                  className="inspector-modal-media"
                  alt={file.name}
                />
              )}

              {isPdf && (
                <iframe
                  src={previewUrl}
                  className="inspector-modal-media"
                  title={file.name}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}