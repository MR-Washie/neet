import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Assuming content folder is at the root. 
// If it's inside src, change this to path.join(process.cwd(), "src/content")
const POSTS_DIR = path.join(process.cwd(), "src/content");

export function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  
  return files.map((filename) => {
    const slug = filename.replace(".mdx", "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
    const { data } = matter(raw);
    return { slug, frontmatter: data };
  });
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) return null;
  
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data, content };
}