/**
 * Build script — runs on Netlify before deploy.
 * Reads all markdown files from _posts/ and generates posts.json
 * that the blog pages use to render posts without a backend.
 */

const fs = require("fs");
const path = require("path");

const postsDir = path.join(__dirname, "_posts");
const outFile = path.join(__dirname, "posts.json");

function parseFrontMatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };
  const metaLines = match[1].split("\n");
  const meta = {};
  metaLines.forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    meta[key] = val;
  });
  return { meta, content: match[2].trim() };
}

function slugify(filename) {
  return filename.replace(/\.md$/, "");
}

const posts = [];

if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

const files = fs
  .readdirSync(postsDir)
  .filter((f) => f.endsWith(".md"))
  .sort()
  .reverse();

files.forEach((file) => {
  const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
  const { meta, content } = parseFrontMatter(raw);
  const slug = slugify(file);
  const excerpt =
    meta.excerpt ||
    content
      .replace(/[#*`_>\[\]]/g, "")
      .replace(/\n+/g, " ")
      .slice(0, 200) + "...";

  posts.push({
    slug,
    title: meta.title || "Untitled",
    date: meta.date || "",
    category: meta.category || "General",
    excerpt: excerpt.trim(),
    readTime: meta.readTime || "5 min read",
    coverImage: meta.coverImage || "",
    content,
  });
});

fs.writeFileSync(outFile, JSON.stringify(posts, null, 2));
console.log(`✅ Generated posts.json with ${posts.length} post(s)`);
