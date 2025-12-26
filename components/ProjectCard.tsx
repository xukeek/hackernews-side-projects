import React from "react";

export interface Project {
  name: string;
  url: string;
  description: string;
  revenue: string;
  stack: string[];
  year: number;
  author?: string;
  hn_discussion_url?: string;
  comment_count?: number;
}

export const ProjectCard = ({ project }: { project: Project }) => {
  const revenue = project.revenue || "";
  const stack = project.stack || [];
  const displayRevenue = revenue.length > 15 ? revenue.substring(0, 15) + "..." : revenue;

  return (
    <div className="glass relative rounded-sm p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-cyan-950/20 dark:hover:bg-cyan-950/20 group flex flex-col h-full min-h-[280px] overflow-hidden border-t-2 border-t-transparent hover:border-t-cyan-500/50">
      {/* Decorative corner accents - hidden in light mode unless hovered, visible in dark mode */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan-500/30 rounded-tr-sm opacity-0 group-hover:opacity-100 dark:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyan-500/30 rounded-bl-sm opacity-0 group-hover:opacity-100 dark:opacity-100 transition-opacity" />
      
      {/* Scanline effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 pointer-events-none" />

      <div className="flex justify-between items-start mb-4 gap-2 z-10">
        <h3 className="text-xl font-bold text-foreground dark:text-cyan-50 group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors line-clamp-2 flex-grow font-sans tracking-tight">
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
            className="bg-secondary/50 dark:bg-cyan-950/50 text-secondary-foreground dark:text-cyan-300 px-3 py-1 rounded-sm text-xs font-mono border border-border dark:border-cyan-500/30 whitespace-nowrap flex-shrink-0 shadow-sm dark:shadow-[0_0_10px_rgba(6,182,212,0.1)]"
            title={revenue}
          >
            {displayRevenue}
          </span>
        )}
      </div>
      <p className="text-muted-foreground dark:text-slate-400 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow font-sans">
        {project.description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {stack.slice(0, 5).map((tech) => (
          <span
            key={tech}
            className="text-[10px] uppercase tracking-wider text-muted-foreground dark:text-cyan-200/70 bg-secondary/50 dark:bg-cyan-900/20 px-2 py-1 rounded-sm border border-border dark:border-cyan-500/20 font-mono"
          >
            {tech}
          </span>
        ))}
        {stack.length > 5 && (
          <span className="text-[10px] text-muted-foreground dark:text-cyan-500/70 px-1 py-1 font-mono">
            +{stack.length - 5}
          </span>
        )}
      </div>

      <div className="pt-4 border-t border-border dark:border-cyan-900/30 mt-auto flex justify-between items-center text-xs font-mono text-muted-foreground dark:text-cyan-700/80">
        {project.author && (
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>@{project.author}</span>
          </div>
        )}
        
        {project.hn_discussion_url && (
          <a 
            href={project.hn_discussion_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary dark:hover:text-cyan-400 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{project.comment_count || 0} comments</span>
          </a>
        )}
      </div>
    </div>
  );
};
