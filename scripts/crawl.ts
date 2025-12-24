import axios from "axios";
import fs from "fs/promises";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const HN_ITEM_ID = "46307973";
const DATA_FILE = path.join(process.cwd(), "data/projects.json");

interface Project {
  name: string;
  url: string;
  description: string;
  revenue: string;
  stack: string[];
}

async function fetchItem(id: number | string) {
  const { data } = await axios.get(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  );
  return data;
}

async function main() {
  console.log("Starting crawl...");

  const mainStory = await fetchItem(HN_ITEM_ID);
  const kids = mainStory.kids || [];
  console.log(`Found ${kids.length} comments.`);

  // Limit for demo/testing - we can increase this later
  const kidsToProcess = kids.slice(0, 10);

  const projects: Project[] = [];

  for (const kidId of kidsToProcess) {
    try {
      const comment = await fetchItem(kidId);
      if (!comment.text) continue;

      // Simple HTML entity decode could be added here if needed, but LLMs handle it well
      const text = comment.text;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a data extractor. Extract side project details from the comment. 
                The comment is from a "Show HN" or "revenue" thread.
                Return JSON only: { "name": string, "url": string, "description": "short one-sentence description", "revenue": "revenue string e.g. $500/mo", "stack": ["tech1", "tech2"] }.
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
          projects.push(result);
          console.log(`Extracted: ${result.name} - ${result.revenue}`);
        }
      }
    } catch (e) {
      console.error(`Error processing ${kidId}:`, e);
    }
  }

  // Ensure data dir
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
  console.log(`Saved ${projects.length} projects to ${DATA_FILE}`);
}

main().catch(console.error);
