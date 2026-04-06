"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Webhook } from "lucide-react";
import HookCard, { Hook } from "./HookCard";
import HookFilter, { Category } from "./HookFilter";
import OllamaChat from "./OllamaChat";

interface DashboardProps {
  hooks: Hook[];
}

/**
 * Debounce: delays applying the search term until the user pauses typing.
 * Avoids running the filter on every keystroke for potentially large lists.
 */
function useDebounce(value: string, delayMs: number): string {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}

export default function Dashboard({ hooks }: DashboardProps) {
  const [searchInput, setSearchInput] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  // Debounced value used for filtering — 200 ms is imperceptible to users
  // but eliminates redundant filter passes on fast typists.
  const debouncedSearch = useDebounce(searchInput, 200);

  // Memoized filter: only re-runs when the debounced query or category changes.
  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    return hooks.filter((hook) => {
      const matchesCategory =
        activeCategory === "all" || hook.category === activeCategory;

      // Short-circuit: skip string checks when query is empty.
      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        hook.name.toLowerCase().includes(q) ||
        hook.event.toLowerCase().includes(q) ||
        hook.description.toLowerCase().includes(q) ||
        hook.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [hooks, debouncedSearch, activeCategory]);

  // Memoized separately — does not depend on search/category state.
  const activeCount = useMemo(
    () => hooks.filter((h) => h.status === "active").length,
    [hooks]
  );

  const handleClearFilters = useCallback(() => {
    setSearchInput("");
    setActiveCategory("all");
  }, []);

  // Ref for "skip to content" target — improves keyboard navigation.
  const mainRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip-to-content link: first focusable element on the page (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-500 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-500 text-white shadow-sm"
            >
              <Webhook size={18} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 leading-tight">
                HookHub
              </p>
              <p className="text-xs text-gray-400">
                Claude Code Event Hook Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            {/* Decorative dot is aria-hidden; text content carries the meaning */}
            <div
              aria-label={`${activeCount} active hooks`}
              className="hidden sm:flex items-center gap-2 text-gray-500"
            >
              <span aria-hidden="true" className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span aria-hidden="true">
                <strong className="text-gray-800">{activeCount}</strong> active
              </span>
            </div>

            <a
              href="https://github.com/maradantaspereira-eng/maradantas"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View project source on GitHub (opens in new tab)"
              className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 rounded"
            >
              GitHub →
            </a>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8 focus:outline-none"
      >
        {/* Filters */}
        <section aria-label="Search and filter hooks">
          <HookFilter
            search={searchInput}
            onSearchChange={setSearchInput}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            totalCount={hooks.length}
            filteredCount={filtered.length}
          />
        </section>

        {/* Hook grid */}
        <section aria-label="Hook list">
          {filtered.length > 0 ? (
            <ul
              role="list"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0"
            >
              {filtered.map((hook) => (
                <li key={hook.id}>
                  <HookCard hook={hook} />
                </li>
              ))}
            </ul>
          ) : (
            <div
              role="status"
              className="flex flex-col items-center justify-center py-24 text-center gap-3"
            >
              <Webhook size={40} aria-hidden="true" className="text-gray-200" />
              <p className="text-gray-400 text-sm">
                No hooks match your current filters.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                aria-label="Clear all filters and show all hooks"
                className="text-xs text-brand-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 rounded"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        HookHub &mdash; Built with Next.js + Tailwind CSS
      </footer>

      {/* Ollama gemma4 AI assistant — floats in the bottom-right corner */}
      <OllamaChat />
    </div>
  );
}
