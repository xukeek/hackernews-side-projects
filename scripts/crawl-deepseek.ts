import axios from "axios";
import fs from "fs/promises";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Configure DeepSeek API using OpenAI SDK
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
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

const DATA_DIR = path.join(process.cwd(), "data");

interface Project {
  name: string;
  url: string;
  description: string;
  revenue: string;
  stack: string[];
  year: number;
  author: string;
  hn_discussion_url?: string;
  comment_count?: number;
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

  // Process ALL comments (removed the limit)
  const kidsToProcess = kids;

  const projects: Project[] = [];
  let processedCount = 0;
  let extractedCount = 0;

  for (const kidId of kidsToProcess) {
    try {
      const comment = await fetchItem(kidId);
      if (!comment || !comment.text) continue;

      processedCount++;
      const text = comment.text;

      // Use DeepSeek API
      const completion = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are a data extractor. Extract side project details from the comment. 
                The comment is from a "Show HN" or "revenue" thread.
                Return JSON only: { "name": string, "url": string, "description": "short one-sentence description in English", "revenue": "revenue string e.g. $500/mo", "stack": ["tech1", "tech2"] }.
                If the comment does not explicitly mention a project with revenue or is just a meta-comment, return { "name": null }.
                IMPORTANT: All returned data must be in English.
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
          const project: Project = {
            ...result,
            year,
            author: comment.by,
            hn_discussion_url: `https://news.ycombinator.com/item?id=${kidId}`,
            comment_count: comment.kids?.length || 0,
          };
          projects.push(project);
          extractedCount++;
          console.log(
            `[${year}] Extracted (${extractedCount}/${processedCount}): ${result.name} - ${result.revenue}`
          );
        }
      }

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (e) {
      console.error(`Error processing comment ${kidId}:`, e);
      // Continue processing even if one comment fails
    }
  }

  console.log(
    `[${year}] Completed: Extracted ${extractedCount} projects from ${processedCount} comments`
  );
  return projects;
}

async function main() {
  console.log("Starting crawl with DeepSeek AI...");
  console.log("This will process comments and save each year to a separate file.");

  const updateYear = process.env.UPDATE_YEAR
    ? parseInt(process.env.UPDATE_YEAR)
    : null;

  // Sort years descending to process newest first
  let sortedYears = Object.keys(YEARS)
    .map(Number)
    .sort((a, b) => b - a);

  if (updateYear) {
    if (!YEARS[updateYear]) {
      console.error(`Year ${updateYear} is not defined in YEARS configuration.`);
      process.exit(1);
    }
    sortedYears = [updateYear];
    console.log(`Updating year ${updateYear} only.`);
  }

  for (const year of sortedYears) {
    const threadId = YEARS[year];
    const yearProjects = await processYear(year, threadId);
    
    // Save year data specifically
    const yearFile = path.join(DATA_DIR, `projects-${year}.json`);
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(yearFile, JSON.stringify(yearProjects, null, 2));
    
    console.log(
      `Saved results for ${year}: ${yearProjects.length} projects to ${yearFile}\n`
    );
  }

  console.log(`\n✅ Crawl completed!`);
}

main().catch(console.error);
