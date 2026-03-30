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
      {/* Search — explicit <label> satisfies WCAG 1.3.1 / 4.1.2 */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="hook-search"
          className="text-xs font-medium text-gray-500"
        >
          Search hooks
        </label>
        <div className="relative">
          <Search
            size={16}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            id="hook-search"
            type="search"
            placeholder="Name, event, or tag…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl shadow-sm placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 rounded"
              aria-label="Clear search"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Category filters — role="group" groups related controls (WCAG 1.3.1) */}
      <div
        role="group"
        aria-label="Filter by category"
        className="flex flex-wrap gap-2"
      >
        {CATEGORIES.map(({ value, label }) => {
          const isActive = activeCategory === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onCategoryChange(value)}
              aria-pressed={isActive}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 ${
                isActive
                  ? "bg-brand-500 text-white border-brand-500 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand-500/50 hover:text-brand-500"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/*
        aria-live="polite" + aria-atomic="true": screen readers announce the
        updated count after filter changes without interrupting ongoing speech.
      */}
      <p
        aria-live="polite"
        aria-atomic="true"
        className="text-xs text-gray-400"
      >
        Showing{" "}
        <span className="font-semibold text-gray-600">{filteredCount}</span> of{" "}
        <span className="font-semibold text-gray-600">{totalCount}</span> hooks
      </p>
    </div>
  );
}
