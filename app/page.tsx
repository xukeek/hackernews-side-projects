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
    <main className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto">
      <header className="mb-16 text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-2">
          <span className="text-gradient">Side Fund</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Discover profitable side projects making{" "}
          <span className="text-green-400 font-semibold">$500+/mo</span> from
          Hacker News.
        </p>
      </header>

      <ProjectBoard projects={projects} />
    </main>
  );
}
