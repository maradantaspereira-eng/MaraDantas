"use client";

import {
  ExternalLink,
  Zap,
  Terminal,
  Bell,
  Play,
  StopCircle,
  CircleDot,
} from "lucide-react";

export type HookStatus = "active" | "inactive";
export type HookLanguage = "python" | "bash" | "typescript";

export interface Hook {
  id: string;
  name: string;
  event: string;
  category: string;
  description: string;
  author: string;
  status: HookStatus;
  language: HookLanguage;
  githubUrl: string;
  tags: string[];
}

const EVENT_ICONS: Record<string, React.ReactNode> = {
  PreToolUse: <Zap size={14} />,
  PostToolUse: <CircleDot size={14} />,
  SessionStart: <Play size={14} />,
  Stop: <StopCircle size={14} />,
  Notification: <Bell size={14} />,
};

const LANGUAGE_COLORS: Record<HookLanguage, string> = {
  python: "bg-blue-100 text-blue-700",
  bash: "bg-amber-100 text-amber-700",
  typescript: "bg-violet-100 text-violet-700",
};

const CATEGORY_BADGE: Record<string, string> = {
  "pre-execution": "bg-orange-50 text-orange-600 border-orange-200",
  "post-execution": "bg-teal-50 text-teal-600 border-teal-200",
  "pre-commit": "bg-red-50 text-red-600 border-red-200",
  session: "bg-indigo-50 text-indigo-600 border-indigo-200",
  notification: "bg-purple-50 text-purple-600 border-purple-200",
};

interface HookCardProps {
  hook: Hook;
}

export default function HookCard({ hook }: HookCardProps) {
  const statusActive = hook.status === "active";

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-500/30 transition-all duration-200 overflow-hidden">
      {/* Top accent bar */}
      <div
        className={`h-1 w-full ${statusActive ? "bg-gradient-to-r from-brand-500 to-indigo-400" : "bg-gray-200"}`}
      />

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1 min-w-0">
            <h2 className="text-base font-semibold text-gray-900 truncate">
              {hook.name}
            </h2>
            <span
              className={`inline-flex items-center gap-1 self-start text-xs font-medium px-2 py-0.5 rounded-full border ${CATEGORY_BADGE[hook.category] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}
            >
              {EVENT_ICONS[hook.event] ?? <Terminal size={12} />}
              {hook.event}
            </span>
          </div>

          {/* Status pill */}
          <span
            className={`flex items-center gap-1.5 shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
              statusActive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${statusActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}
            />
            {statusActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
          {hook.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {hook.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-50">
          <span
            className={`text-xs font-mono font-medium px-2 py-0.5 rounded-md ${LANGUAGE_COLORS[hook.language] ?? "bg-gray-100 text-gray-600"}`}
          >
            {hook.language}
          </span>

          <a
            href={hook.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors"
            aria-label={`View ${hook.name} source on GitHub`}
          >
            View source
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </article>
  );
}
