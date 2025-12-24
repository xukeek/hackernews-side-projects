import axios from "axios";
import fs from "fs/promises";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const YEARS: Record<number, string> = {
  2025: "46307973",
  2024: "42373343",
  2023: "38467691",
  2022: "34190421",
  2021: "29667095",
  2020: "24947167",
  2019: "20899863",
  2018: "17790306",
  2017: "15148804",
};

const DATA_FILE = path.join(process.cwd(), "data/projects.json");

interface Project {
  name: string;
  url: string;
  description: string;
  revenue: string;
  stack: string[];
  year: number;
}

async function fetchItem(id: number | string) {
  try {
    const { data } = await axios.get(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    return data;
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    return null;
  }
}

async function processYear(year: number, threadId: string): Promise<Project[]> {
  console.log(`Processing Year: ${year} (Thread ${threadId})...`);

  const mainStory = await fetchItem(threadId);
  if (!mainStory) {
    console.error(`Failed to fetch main story for ${year}`);
    return [];
  }

  const kids = mainStory.kids || [];
  console.log(`Found ${kids.length} comments for ${year}.`);

  // Limit for demo/testing - we can increase this later or remove limit
  const kidsToProcess = kids.slice(0, 5); // Process top 5 comments per year for testing

  const projects: Project[] = [];

  for (const kidId of kidsToProcess) {
    try {
      const comment = await fetchItem(kidId);
      if (!comment || !comment.text) continue;

      const text = comment.text;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a data extractor. Extract side project details from the comment. 
                The comment is from a "Show HN" or "revenue" thread.
                Return JSON only: { "name": string, "url": string, "description": "short one-sentence description, translated to Chinese if logical or keep English", "revenue": "revenue string e.g. $500/mo", "stack": ["tech1", "tech2"] }.
                If the comment does not explicitly mention a project with revenue or is just a meta-comment, return { "name": null }.
                `,
          },
          { role: "user", content: text },
        ],
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0].message.content;
      if (content) {
        const result = JSON.parse(content);
        if (result && result.name) {
          const project: Project = { ...result, year };
          projects.push(project);
          console.log(
            `[${year}] Extracted: ${result.name} - ${result.revenue}`
          );
        }
      }
    } catch (e) {
      console.error(`Error processing comment ${kidId}:`, e);
    }
  }
  return projects;
}

async function main() {
  console.log("Starting crawl...");
  let allProjects: Project[] = [];

  // Sort years descending to process newest first
  const sortedYears = Object.keys(YEARS)
    .map(Number)
    .sort((a, b) => b - a);

  for (const year of sortedYears) {
    const threadId = YEARS[year];
    const yearProjects = await processYear(year, threadId);
    allProjects = [...allProjects, ...yearProjects];
  }

  // Ensure data dir
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(allProjects, null, 2));
  console.log(`Saved total ${allProjects.length} projects to ${DATA_FILE}`);
}

main().catch(console.error);
