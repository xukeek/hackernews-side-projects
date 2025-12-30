"use client";

import { useState } from "react";

const YEARS: Record<number, string> = {
  2025: "46307973",
  2024: "42373343",
  2023: "38467691",
  2022: "34190421",
  2021: "29667095",
  2020: "24947167",
  2019: "20899863",
  2018: "17790306",
  2017: "15148804",
};

interface SourceLinksProps {
  years: number[];
}

export function SourceLinks({ years }: SourceLinksProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Sort years descending
  const sortedYears = [...years].sort((a, b) => b - a);

  return (
    <div className="relative inline-block">
      <div 
        className="text-sm text-muted-foreground/60 mt-2 block hover:text-primary dark:hover:text-cyan-400 cursor-pointer transition-colors group"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="border-b border-dashed border-muted-foreground/40 group-hover:border-primary/50 dark:group-hover:border-cyan-400/50">
          SOURCED FROM {years.length} DISCUSSIONS
        </span>
      </div>

      {/* Popover/Tooltip */}
      <div 
        className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 p-2 rounded-md bg-popover/95 backdrop-blur-md border border-border dark:border-cyan-500/30 shadow-xl z-50 transition-all duration-200 origin-top ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-popover/95 border-t border-l border-border dark:border-cyan-500/30 rotate-45" />
        <div className="relative z-10 max-h-[300px] overflow-y-auto sci-fi-scrollbar">
          <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider px-2 py-1 mb-1 border-b border-border/50">
            Select Discussion:
          </p>
          <div className="flex flex-col gap-0.5">
            {sortedYears.map(year => {
              const threadId = YEARS[year];
              if (!threadId) return null;
              
              return (
                <a
                  key={year}
                  href={`https://news.ycombinator.com/item?id=${threadId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1.5 text-xs font-mono text-foreground hover:bg-secondary dark:hover:bg-cyan-900/30 hover:text-primary dark:hover:text-cyan-400 rounded-sm transition-colors flex items-center justify-between group/item"
                >
                  <span>{year} Discussion</span>
                  <svg className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

