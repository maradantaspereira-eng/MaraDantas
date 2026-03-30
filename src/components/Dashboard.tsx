"use client";

import { useState, useMemo } from "react";
import { Webhook } from "lucide-react";
import HookCard, { Hook } from "./HookCard";
import HookFilter, { Category } from "./HookFilter";

interface DashboardProps {
  hooks: Hook[];
}

export default function Dashboard({ hooks }: DashboardProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return hooks.filter((hook) => {
      const matchesCategory =
        activeCategory === "all" || hook.category === activeCategory;
      const matchesSearch =
        !q ||
        hook.name.toLowerCase().includes(q) ||
        hook.event.toLowerCase().includes(q) ||
        hook.description.toLowerCase().includes(q) ||
        hook.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [hooks, search, activeCategory]);

  const activeCount = hooks.filter((h) => h.status === "active").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-500 text-white shadow-sm">
              <Webhook size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                HookHub
              </h1>
              <p className="text-xs text-gray-400">
                Claude Code Event Hook Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="hidden sm:flex items-center gap-2 text-gray-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                <strong className="text-gray-800">{activeCount}</strong> active
              </span>
            </div>
            <a
              href="https://github.com/maradantaspereira-eng/maradantas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors"
            >
              GitHub →
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Filters */}
        <section aria-label="Filter hooks">
          <HookFilter
            search={search}
            onSearchChange={setSearch}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            totalCount={hooks.length}
            filteredCount={filtered.length}
          />
        </section>

        {/* Grid */}
        <section aria-label="Hook cards">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((hook) => (
                <HookCard key={hook.id} hook={hook} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
              <Webhook size={40} className="text-gray-200" />
              <p className="text-gray-400 text-sm">
                No hooks match your current filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
                className="text-xs text-brand-500 hover:underline"
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
    </div>
  );
}
