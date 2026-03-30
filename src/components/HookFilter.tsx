"use client";

import { Search, X } from "lucide-react";

export type Category =
  | "all"
  | "pre-execution"
  | "post-execution"
  | "pre-commit"
  | "session"
  | "notification";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pre-execution", label: "Pre-Execution" },
  { value: "post-execution", label: "Post-Execution" },
  { value: "pre-commit", label: "Pre-Commit" },
  { value: "session", label: "Session" },
  { value: "notification", label: "Notification" },
];

interface HookFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  totalCount: number;
  filteredCount: number;
}

export default function HookFilter({
  search,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  totalCount,
  filteredCount,
}: HookFilterProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Search input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search hooks by name, event, or tag…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl shadow-sm placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onCategoryChange(value)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              activeCategory === value
                ? "bg-brand-500 text-white border-brand-500 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-brand-500/50 hover:text-brand-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-600">{filteredCount}</span> of{" "}
        <span className="font-semibold text-gray-600">{totalCount}</span> hooks
      </p>
    </div>
  );
}
