"use client";

import { useState, useMemo } from "react";
import { Project, ProjectCard } from "./ProjectCard";
import { StatisticsPanel } from "./StatisticsPanel";
import { parseRevenue } from "@/lib/utils";

interface ProjectBoardProps {
  projects: Project[];
}

type SortOption = "revenue-high" | "revenue-low" | "year-new" | "year-old" | "name-az" | "name-za";

export function ProjectBoard({ projects }: ProjectBoardProps) {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYears, setSelectedYears] = useState<number[]>([2025]);
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [techSearchQuery, setTechSearchQuery] = useState("");
  const [revenueRange, setRevenueRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("year-new");
  const [showInsights, setShowInsights] = useState(false);

  // Extract unique years and sort descending
  const years = useMemo(() => {
    if (!projects) return [];
    const uniqueYears = Array.from(new Set(projects.map((p) => p.year)));
    return uniqueYears.sort((a, b) => b - a);
  }, [projects]);

  // Extract unique tech stacks
  const allTechStacks = useMemo(() => {
    if (!projects) return [];
    const techCount: Record<string, number> = {};
    projects.forEach((p) => {
      if (p.stack && Array.isArray(p.stack)) {
        p.stack.forEach((tech) => {
          techCount[tech] = (techCount[tech] || 0) + 1;
        });
      }
    });
    return Object.entries(techCount)
      .sort((a, b) => b[1] - a[1]) // Sort by frequency
      .map(([name]) => name);
  }, [projects]);

  // Filter tech stacks based on search
  const filteredTechStacks = useMemo(() => {
    if (!techSearchQuery.trim()) return allTechStacks.slice(0, 15);
    const query = techSearchQuery.toLowerCase();
    return allTechStacks.filter(tech => tech.toLowerCase().includes(query)).slice(0, 30);
  }, [allTechStacks, techSearchQuery]);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects || [];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => {
        return (
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.stack || []).some((tech) => tech.toLowerCase().includes(query))
        );
      });
    }

    // Year filter
    if (selectedYears.length > 0) {
      filtered = filtered.filter((p) => selectedYears.includes(p.year));
    }

    // Tech stack filter
    if (selectedTechStack.length > 0) {
      filtered = filtered.filter((p) =>
        selectedTechStack.every((tech) => (p.stack || []).includes(tech)) // Using every for AND logic
      );
    }

    // Revenue range filter
    if (revenueRange !== "all") {
      filtered = filtered.filter((p) => {
        const rev = parseRevenue(p.revenue);
        switch (revenueRange) {
          case "0-500":
            return rev > 0 && rev <= 500;
          case "500-1k":
            return rev > 500 && rev <= 1000;
          case "1k-5k":
            return rev > 1000 && rev <= 5000;
          case "5k-10k":
            return rev > 5000 && rev <= 10000;
          case "10k+":
            return rev > 10000;
          default:
            return true;
        }
      });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "revenue-high":
          return parseRevenue(b.revenue) - parseRevenue(a.revenue);
        case "revenue-low":
          return parseRevenue(a.revenue) - parseRevenue(b.revenue);
        case "year-new":
          return b.year - a.year;
        case "year-old":
          return a.year - b.year;
        case "name-az":
          return a.name.localeCompare(b.name);
        case "name-za":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [projects, searchQuery, selectedYears, selectedTechStack, revenueRange, sortBy]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedYears([2025]);
    setSelectedTechStack([]);
    setTechSearchQuery("");
    setRevenueRange("all");
    setSortBy("year-new");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    (selectedYears.length === 1 && selectedYears[0] === 2025 ? false : true) || // Active if not just 2025
    selectedTechStack.length > 0 ||
    revenueRange !== "all" ||
    sortBy !== "year-new";

  return (
    <div className="space-y-8">
      {/* Search Bar - Moved to top and made more prominent */}
      <div className="relative max-w-2xl mx-auto group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <svg className="h-6 w-6 text-muted-foreground dark:text-cyan-400 group-focus-within:text-primary dark:group-focus-within:text-cyan-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-primary/5 dark:bg-cyan-500/5 blur-xl rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="SEARCH DATABASE_..."
          className="relative w-full pl-12 pr-12 py-5 bg-background/80 dark:bg-gray-950/80 backdrop-blur-md border border-border dark:border-cyan-900/50 rounded-sm text-foreground dark:text-cyan-50 text-lg placeholder-muted-foreground dark:placeholder-cyan-900/70 focus:outline-none focus:border-primary dark:focus:border-cyan-500/50 focus:ring-1 focus:ring-primary/50 dark:focus:ring-cyan-500/50 shadow-lg dark:shadow-2xl transition-all font-mono tracking-wide"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground dark:text-cyan-700 hover:text-primary dark:hover:text-cyan-400 transition-colors z-10"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Insights Toggle Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowInsights(!showInsights)}
          className="px-6 py-2 bg-secondary/50 dark:bg-cyan-950/30 border border-border dark:border-cyan-800/50 rounded-sm text-xs text-secondary-foreground dark:text-cyan-400 hover:text-primary dark:hover:text-cyan-200 hover:bg-secondary/80 dark:hover:bg-cyan-900/50 hover:border-primary/50 dark:hover:border-cyan-500/50 transition-all duration-200 flex items-center gap-2 uppercase tracking-widest font-mono"
        >
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${showInsights ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          [{showInsights ? "HIDE" : "SHOW"}_DATA_INSIGHTS]
        </button>
      </div>

      {/* Collapsible Insights Panel */}
      {showInsights && (
        <div className="animate-in fade-in zoom-in duration-300">
          <StatisticsPanel projects={projects} filteredProjects={filteredAndSortedProjects} />
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white/80 dark:bg-gray-950/60 backdrop-blur-md p-6 rounded-sm border border-border dark:border-cyan-900/30 space-y-6 shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden transition-colors duration-300">
        {/* Decorative corner lines for filter panel - hidden in light mode */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50 opacity-0 dark:opacity-100" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/50 opacity-0 dark:opacity-100" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/50 opacity-0 dark:opacity-100" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50 opacity-0 dark:opacity-100" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Year Filter */}
          <div>
            <label className="block text-xs font-mono text-muted-foreground dark:text-cyan-600 mb-2 uppercase tracking-wider">// Year_</label>
            <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-1 sci-fi-scrollbar">
              <button
                onClick={() => setSelectedYears([])}
                className={`px-3 py-1.5 rounded-sm text-xs font-mono border transition-all ${
                  selectedYears.length === 0
                    ? "bg-primary text-primary-foreground dark:bg-cyan-900/40 dark:text-cyan-300 border-primary dark:border-cyan-500/50 shadow-sm dark:shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                    : "bg-secondary text-secondary-foreground dark:bg-gray-900/40 dark:text-cyan-700/70 hover:bg-secondary/80 dark:hover:bg-cyan-950/60 dark:hover:text-cyan-400 dark:hover:border-cyan-500/30 border-transparent"
                }`}
              >
                ALL_YEARS
              </button>
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYears((prev) =>
                      prev.includes(year)
                        ? prev.filter((y) => y !== year)
                        : [...prev, year]
                    );
                  }}
                  className={`px-3 py-1.5 rounded-sm text-xs font-mono border transition-all ${
                    selectedYears.includes(year)
                      ? "bg-primary text-primary-foreground dark:bg-cyan-900/40 dark:text-cyan-300 border-primary dark:border-cyan-500/50 shadow-sm dark:shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                      : "bg-secondary text-secondary-foreground dark:bg-gray-900/40 dark:text-cyan-700/70 hover:bg-secondary/80 dark:hover:bg-cyan-950/60 dark:hover:text-cyan-400 dark:hover:border-cyan-500/30 border-transparent"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Revenue Range Filter */}
          <div>
            <label className="block text-xs font-mono text-muted-foreground dark:text-cyan-600 mb-2 uppercase tracking-wider">// Revenue_Range_</label>
            <select
              value={revenueRange}
              onChange={(e) => setRevenueRange(e.target.value)}
              className="w-full px-4 py-2 bg-background dark:bg-gray-900/80 border border-border dark:border-cyan-900/50 rounded-sm text-foreground dark:text-cyan-100 focus:outline-none focus:border-primary dark:focus:border-cyan-500/50 focus:ring-1 focus:ring-primary/20 dark:focus:ring-cyan-500/20 transition-all font-mono text-sm appearance-none cursor-pointer hover:bg-secondary/20 dark:hover:bg-gray-900"
            >
              <option value="all">ALL REVENUE</option>
              <option value="0-500">$0 - $500/mo</option>
              <option value="500-1k">$500 - $1k/mo</option>
              <option value="1k-5k">$1k - $5k/mo</option>
              <option value="5k-10k">$5k - $10k/mo</option>
              <option value="10k+">$10k+/mo</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-mono text-muted-foreground dark:text-cyan-600 mb-2 uppercase tracking-wider">// Sort_By_</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-4 py-2 bg-background dark:bg-gray-900/80 border border-border dark:border-cyan-900/50 rounded-sm text-foreground dark:text-cyan-100 focus:outline-none focus:border-primary dark:focus:border-cyan-500/50 focus:ring-1 focus:ring-primary/20 dark:focus:ring-cyan-500/20 transition-all font-mono text-sm appearance-none cursor-pointer hover:bg-secondary/20 dark:hover:bg-gray-900"
            >
              <option value="year-new">YEAR (NEWEST)</option>
              <option value="year-old">YEAR (OLDEST)</option>
              <option value="revenue-high">REVENUE (DESC)</option>
              <option value="revenue-low">REVENUE (ASC)</option>
              <option value="name-az">NAME (A-Z)</option>
              <option value="name-za">NAME (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Tech Stack Filter with Search */}
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <label className="text-xs font-mono text-muted-foreground dark:text-cyan-600 uppercase tracking-wider">// Filter_by_Tech_Stack_</label>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={techSearchQuery}
                onChange={(e) => setTechSearchQuery(e.target.value)}
                placeholder="SEARCH STACK..."
                className="w-full pl-9 pr-4 py-2 bg-background dark:bg-gray-900/80 border border-border dark:border-cyan-900/50 rounded-sm text-sm text-foreground dark:text-cyan-100 placeholder-muted-foreground dark:placeholder-cyan-800/70 focus:outline-none focus:border-primary dark:focus:border-cyan-500/50 focus:ring-1 focus:ring-primary/20 dark:focus:ring-cyan-500/20 transition-all font-mono"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-cyan-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Selected Stacks First */}
            {selectedTechStack.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTechStack(prev => prev.filter(t => t !== tech))}
                className="px-3 py-1.5 rounded-sm text-xs font-mono bg-primary text-primary-foreground dark:bg-cyan-900/40 dark:text-cyan-300 border border-primary dark:border-cyan-500/50 shadow-sm dark:shadow-[0_0_10px_rgba(6,182,212,0.1)] flex items-center gap-1.5 hover:bg-primary/90 dark:hover:bg-cyan-900/60 transition-all group"
              >
                {tech}
                <svg className="h-3 w-3 text-primary-foreground dark:text-cyan-500 group-hover:text-primary-foreground dark:group-hover:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ))}
            
            {/* Filtered Stacks */}
            {filteredTechStacks
              .filter(tech => !selectedTechStack.includes(tech))
              .map((tech) => (
                <button
                  key={tech}
                  onClick={() => setSelectedTechStack(prev => [...prev, tech])}
                  className="px-3 py-1.5 rounded-sm text-xs font-mono bg-secondary text-secondary-foreground dark:bg-gray-900/40 dark:text-cyan-700/70 hover:bg-secondary/80 dark:hover:bg-cyan-950/60 dark:hover:text-cyan-400 dark:hover:border-cyan-500/30 border border-transparent transition-all"
                >
                  {tech}
                </button>
              ))}
            
            {filteredTechStacks.length === 0 && (
              <p className="text-xs font-mono text-muted-foreground dark:text-cyan-900 py-2">[NO_MATCHES_FOUND]</p>
            )}
          </div>
        </div>
      </div>

      {/* Results Summary & Clear Filters */}
      <div className="flex items-center justify-between py-4 border-t border-border dark:border-gray-700/30">
        <div className="text-muted-foreground dark:text-gray-400">
          <span className="text-foreground dark:text-white font-semibold text-lg">{filteredAndSortedProjects.length}</span>{" "}
          {filteredAndSortedProjects.length === 1 ? "project" : "projects"} found
          {hasActiveFilters && (
            <span className="ml-2 text-sm">
              (filtered from {(projects || []).length} total)
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-destructive/10 dark:bg-red-500/10 text-destructive dark:text-red-400 rounded-lg hover:bg-destructive/20 dark:hover:bg-red-500/20 transition-all duration-200 border border-destructive/20 dark:border-red-500/20 text-sm font-medium"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {filteredAndSortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProjects.map((project, i) => (
            <ProjectCard key={`${project.name}-${i}`} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-600 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round" strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg font-medium">No projects found</p>
          <p className="text-sm mt-2">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
}
