"use client";

import axios from "axios";
import { useState, useRef, useEffect } from "react";
import DocumentInspector from "./DocumentInspector";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* =========================
   TYPES
========================= */

type FileUploaderProps = {
  onUploaded?: (docId: string, fileName: string) => void;
  existingNames?: string[];
  activeDocName?: string | null;
};

type LocalDoc = {
  name: string;
  file: File;
  url: string;
};

/* =========================
   COMPONENT
========================= */

export default function FileUploader({
  onUploaded,
  existingNames,
  activeDocName,
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localDocs, setLocalDocs] = useState<LocalDoc[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  /* =========================
     SYNC ACTIVE DOC
  ========================= */
  useEffect(() => {
    if (!activeDocName) return;

    const match = localDocs.find((d) => d.name === activeDocName);

    if (!match) return;

    setFile(match.file);
    setPreviewUrl(match.url);
  }, [activeDocName, localDocs]);

  /* =========================
     FILE UPLOAD
  ========================= */
  const uploadFile = async (selected?: File) => {
    const f = selected || file;
    if (!f) return;

    if (existingNames?.includes(f.name)) {
      return;
    }

    const form = new FormData();
    form.append("file", f);

    setUploading(true);

    try {
      const res = await axios.post(`${API}/upload`, form);

      const data = res.data;

      if (data?.doc_id && onUploaded) {
        onUploaded(data.doc_id, data.file_name || f.name);
      }

      const url = URL.createObjectURL(f);

      setLocalDocs((prev) => [
        ...prev,
        { name: f.name, file: f, url },
      ]);

      setFile(f);
      setPreviewUrl(url);
      setShowPreview(false);
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* =========================
     FILE PICK
  ========================= */
  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    uploadFile(selected);
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  /* =========================
     DRAG & DROP
  ========================= */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) uploadFile(dropped);
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="uploader">

      {/* DROP ZONE */}
      <div
        className="uploader-dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={openPicker}
      >
        <div className="uploader-drop-inner">
          <div className="uploader-icon">📄</div>

          <div>
            <p className="uploader-title">
              Drop file or click to upload
            </p>
            <p className="uploader-help">
              PDF, images, docs supported
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          onChange={handlePick}
          className="uploader-input"
        />
      </div>

      {/* ACTION BAR */}
      {file && (
        <div className="uploader-actions">
          <div className="uploader-file-card">
            <span>📎 {file.name}</span>
            {uploading && <span>Uploading...</span>}
          </div>

          <div className="uploader-buttons">
            <button
              type="button"
              className="uploader-btn"
              onClick={openPicker}
            >
              Replace
            </button>

            <button
              type="button"
              className="uploader-btn primary"
              onClick={() => setShowPreview((p) => !p)}
            >
              {showPreview ? "Hide" : "Preview"}
            </button>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      {file && showPreview && previewUrl && (
        <div className="uploader-preview">
          <DocumentInspector
            file={file}
            previewUrl={previewUrl}
          />
        </div>
      )}
    </div>
  );
}