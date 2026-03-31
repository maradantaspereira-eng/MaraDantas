import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "HookHub — Claude Code Event Hook Dashboard",
  description:
    "Visualize and manage Claude Code event hooks with clarity. Filter by category, explore source code, and monitor hook status.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
