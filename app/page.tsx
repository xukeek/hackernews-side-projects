import { ProjectCard, Project } from "@/components/ProjectCard";

const MOCK_PROJECTS: Project[] = [
  {
    name: "Example Project",
    url: "https://example.com",
    revenue: "$500/mo",
    description:
      "A placeholder project to demonstrate the UI layout. This project makes consistent revenue and uses a modern tech stack.",
    stack: ["Next.js", "Tailwind", "OpenAI"],
  },
];

export default function Home() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROJECTS.map((project, i) => (
          <ProjectCard key={i} project={project} />
        ))}
      </div>
    </main>
  );
}
