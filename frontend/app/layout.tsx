import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {
 title: "Study Assistant",
  description: "AI-powered study assistant for students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: inter.style.fontFamily,
          background: "#0b1220",
          color: "#e5e7eb",
        }}
      >
        {/* Background */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "radial-gradient(circle at top, #1f2a44, transparent 60%), radial-gradient(circle at bottom, #111827, #0b1220)",
            zIndex: -1,
          }}
        />

        {/* App Container */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "24px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1400px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* Top Bar */}
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "18px" }}>
                AI Assistant
              </div>
              <div style={{ fontSize: "12px", opacity: 0.7 }}>
                AI-powered document assistant
              </div>
            </div>

            {/* Main App */}
            <div
              style={{
                flex: 1,
                borderRadius: "16px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(14px)",
                overflow: "hidden",
                minHeight: "80vh",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}