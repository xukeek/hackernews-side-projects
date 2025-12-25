import React from "react";

export interface Project {
  name: string;
  url: string;
  description: string;
  revenue: string;
  stack: string[];
  year: number;
}

export const ProjectCard = ({ project }: { project: Project }) => {
  const revenue = project.revenue || "";
  const stack = project.stack || [];
  const displayRevenue = revenue.length > 15 ? revenue.substring(0, 15) + "..." : revenue;

  return (
    <div className="glass relative rounded-sm p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-cyan-950/20 group flex flex-col h-full min-h-[280px] overflow-hidden border-t-2 border-t-transparent hover:border-t-cyan-500/50">
      {/* Decorative corner accents */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan-500/30 rounded-tr-sm" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyan-500/30 rounded-bl-sm" />
      
      {/* Scanline effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 pointer-events-none" />

      <div className="flex justify-between items-start mb-4 gap-2 z-10">
        <h3 className="text-xl font-bold text-cyan-50 group-hover:text-cyan-400 transition-colors line-clamp-2 flex-grow font-sans tracking-tight">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline decoration-cyan-500/50 underline-offset-4"
          >
            {project.name}
          </a>
        </h3>
        {revenue && (
          <span 
            className="bg-cyan-950/50 text-cyan-300 px-3 py-1 rounded-sm text-xs font-mono border border-cyan-500/30 whitespace-nowrap flex-shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
            title={revenue}
          >
            {displayRevenue}
          </span>
        )}
      </div>
      <p className="text-slate-400 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow font-sans">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-cyan-500/10 z-10">
        {stack.slice(0, 5).map((tech) => (
          <span
            key={tech}
            className="text-[10px] uppercase tracking-wider text-cyan-200/70 bg-cyan-900/20 px-2 py-1 rounded-sm border border-cyan-500/20 font-mono"
          >
            {tech}
          </span>
        ))}
        {stack.length > 5 && (
          <span className="text-[10px] text-cyan-500/70 px-1 py-1 font-mono">
            +{stack.length - 5}
          </span>
        )}
      </div>
    </div>
  );
};
