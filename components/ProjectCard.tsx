import React from "react";

export interface Project {
  name: string;
  url: string;
  description: string;
  revenue: string;
  stack: string[];
}

export const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="glass rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {project.name}
          </a>
        </h3>
        <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/20 whitespace-nowrap ml-2">
          {project.revenue}
        </span>
      </div>
      <p className="text-gray-400 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="text-xs text-blue-200/60 bg-blue-500/5 px-2.5 py-1 rounded-md border border-blue-500/10"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};
