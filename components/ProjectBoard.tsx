"use client";

import { useState, useMemo } from "react";
import { Project, ProjectCard } from "./ProjectCard";

interface ProjectBoardProps {
  projects: Project[];
}

export function ProjectBoard({ projects }: ProjectBoardProps) {
  // Extract unique years and sort descending
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(projects.map((p) => p.year)));
    return uniqueYears.sort((a, b) => b - a);
  }, [projects]);

  // Default to the newest year, or 2025 if available, otherwise just newest
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    if (years.includes(2025)) return 2025;
    return years[0] || 2025;
  });

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => p.year === selectedYear);
  }, [projects, selectedYear]);

  return (
    <div className="space-y-8">
      {/* Year Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedYear === year
                ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-700/50"
            }`}
          >
            {year}
          </button>
        ))}
        {years.length === 0 && (
          <span className="text-gray-500 text-sm">No data available</span>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, i) => (
            <ProjectCard key={`${project.name}-${i}`} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p>No projects found for {selectedYear}.</p>
          <p className="text-sm mt-2">Try running the crawler to fetch data.</p>
        </div>
      )}
    </div>
  );
}
