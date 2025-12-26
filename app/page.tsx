import { Project } from "@/components/ProjectCard";
import { ProjectBoard } from "@/components/ProjectBoard";
import { ThemeToggle } from "@/components/ThemeToggle";
import fs from "fs/promises";
import path from "path";

async function getProjects(): Promise<Project[]> {
  const dataDir = path.join(process.cwd(), "data");
  try {
    const entries = await fs.readdir(dataDir, { withFileTypes: true });
    const files = entries
      .filter(
        (file) => file.isFile() && /^projects-\d{4}\.json$/.test(file.name)
      )
      .map((file) => file.name);

    if (files.length === 0) {
      // Fallback to legacy projects.json
      const dataFile = path.join(dataDir, "projects.json");
      try {
        const content = await fs.readFile(dataFile, "utf-8");
        return JSON.parse(content);
      } catch {
        return [];
      }
    }

    const projectsPromises = files.map(async (file) => {
      const content = await fs.readFile(path.join(dataDir, file), "utf-8");
      return JSON.parse(content) as Project[];
    });

    const projectsArrays = await Promise.all(projectsPromises);
    return projectsArrays.flat();
  } catch (e) {
    console.warn("Failed to load projects data:", e);
    return [];
  }
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto relative overflow-hidden transition-colors duration-300">
      {/* Theme Toggle - Absolute Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Sci-fi background elements - reduced intensity in light mode */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none opacity-50 dark:opacity-100" />
      
      <header className="mb-16 text-center space-y-6 relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-2 font-mono">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse dark:from-cyan-400 dark:via-blue-500 dark:to-purple-600 from-blue-600 via-purple-600 to-pink-600">
            SIDE_FUND
          </span>
          <span className="text-cyan-500 animate-pulse">_</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-mono">
          [DISCOVER_PROFITABLE_SIDE_PROJECTS]
          <br/>
          <span className="text-cyan-600 dark:text-cyan-400 font-semibold">$500+/MO</span> FROM HACKER_NEWS
        </p>
      </header>

      <div className="relative z-10">
        <ProjectBoard projects={projects} />
      </div>
    </main>
  );
}
