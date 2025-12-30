import { Project } from "@/components/ProjectCard";
import { ProjectBoard } from "@/components/ProjectBoard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SourceLinks } from "@/components/SourceLinks";
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
  const uniqueYears = Array.from(new Set(projects.map(p => p.year)));
  
  // Get the latest crawl time
  const latestCrawlTime = projects
    .map(p => p.crawled_at ? new Date(p.crawled_at).getTime() : 0)
    .reduce((max, time) => Math.max(max, time), 0);
  
  const lastUpdated = latestCrawlTime > 0 
    ? new Date(latestCrawlTime).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "HN Side Fund",
    "description": "Discover profitable side projects shared on Hacker News making $500+/mo",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "dateModified": latestCrawlTime > 0 ? new Date(latestCrawlTime).toISOString() : undefined,
    "inLanguage": "en",
    "about": {
      "@type": "Thing",
      "name": "Side Projects",
      "description": "Profitable side projects and indie hacker ventures"
    },
    "keywords": "side projects, hacker news, profitable projects, startup ideas, indie hacker",
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto relative overflow-hidden transition-colors duration-300">
      {/* Theme Toggle - Absolute Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Last Update Indicator - Top Left */}
      {lastUpdated && (
        <div className="absolute top-6 left-6 z-50">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background/50 dark:bg-gray-900/50 backdrop-blur-md border border-border dark:border-cyan-500/30 rounded-sm shadow-sm">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
            </div>
            <span className="text-xs font-mono text-muted-foreground dark:text-cyan-400">
              UPDATED: {lastUpdated}
            </span>
          </div>
        </div>
      )}

      {/* Sci-fi background elements - reduced intensity in light mode */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none opacity-50 dark:opacity-100" />
      
      <header className="mb-16 text-center space-y-6 relative z-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-2 font-mono">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 animate-pulse dark:from-cyan-400 dark:via-blue-500 dark:to-purple-600">
            HN_SIDE_FUND
          </span>
          <span className="text-cyan-500 animate-pulse">_</span>
        </h1>
        <div className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-mono">
          [DISCOVER_PROFITABLE_SIDE_PROJECTS]
          <br/>
          <span className="text-cyan-600 dark:text-cyan-400 font-semibold">$500+/MO</span> FROM HACKER_NEWS
          <br/>
          <SourceLinks years={uniqueYears} />
        </div>
      </header>

      <div className="relative z-10">
        <ProjectBoard projects={projects} />
      </div>

      {/* SEO-friendly content section */}
      <footer className="mt-24 pt-12 border-t border-border dark:border-cyan-900/30 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-foreground dark:text-cyan-50 font-mono mb-4">
              About HN Side Fund
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              HN Side Fund is a curated directory of profitable side projects shared on <strong>Hacker News</strong>. 
              We aggregate and showcase side projects that are generating <strong>$500+ per month in revenue</strong>, 
              sourced directly from the popular &ldquo;Who wants to be hired?&rdquo; and &ldquo;Ask HN: Share your side project revenue&rdquo; threads on Hacker News.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Whether you&apos;re an <strong>indie hacker</strong>, entrepreneur, or developer looking for inspiration, 
              our platform helps you discover real-world examples of successful side hustles, passive income projects, 
              and bootstrapped businesses. Filter by technology stack (React, Python, Node.js, etc.), revenue range, 
              or launch year to find projects that match your interests.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Data is automatically updated daily from Hacker News discussions spanning multiple years, 
              giving you access to hundreds of validated side project ideas and their revenue metrics. 
              Each project includes links to the original HN discussion, tech stack details, and creator information.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary dark:text-cyan-400 font-mono">
                {projects.length}+
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Side Projects
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary dark:text-cyan-400 font-mono">
                {uniqueYears.length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Years Covered
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary dark:text-cyan-400 font-mono">
                $500+
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Min Revenue/mo
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary dark:text-cyan-400 font-mono">
                Daily
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Data Updates
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground pt-8">
            <p>
              Data sourced from Hacker News &ldquo;Show HN&rdquo; and revenue discussion threads. 
              All projects and revenue figures are self-reported by their creators.
            </p>
          </div>
        </div>
      </footer>
    </main>
    </>
  );
}
