import { Project } from "@/components/ProjectCard";
import { ProjectBoard } from "@/components/ProjectBoard";
import fs from "fs/promises";
import path from "path";

async function getProjects(): Promise<Project[]> {
  const dataFile = path.join(process.cwd(), "data/projects.json");
  try {
    const content = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(content);
  } catch (e) {
    console.warn("Failed to load projects data:", e);
    return [];
  }
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto relative overflow-hidden">
      {/* Sci-fi background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <header className="mb-16 text-center space-y-6 relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-2 font-mono">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse">
            SIDE_FUND
          </span>
          <span className="text-cyan-500 animate-pulse">_</span>
        </h1>
        <p className="text-xl text-cyan-200/60 max-w-2xl mx-auto leading-relaxed font-mono">
          [DISCOVER_PROFITABLE_SIDE_PROJECTS]
          <br/>
          <span className="text-cyan-400 font-semibold">$500+/MO</span> FROM HACKER_NEWS
        </p>
      </header>

      <div className="relative z-10">
        <ProjectBoard projects={projects} />
      </div>
    </main>
  );
}
