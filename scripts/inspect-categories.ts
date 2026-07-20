import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), ".env"));

async function main() {
  const { getAllCategories } = await import("../src/lib/wordpress");
  const { getCategoryCanonicalSlug, getCategoryPriorityIndex } = await import(
    "../src/lib/category-config"
  );
  const { decodeHtml } = await import("../src/lib/utils");

  const categories = await getAllCategories();
  console.log(`WordPress categories: ${categories.length}\n`);
  console.log(
    ["priority", "id", "count", "slug", "canonical", "name", "parent", "description"].join(
      "\t",
    ),
  );

  for (const category of categories) {
    const name = decodeHtml(category.name);
    console.log(
      [
        getCategoryPriorityIndex(category),
        category.id,
        category.count,
        category.slug,
        getCategoryCanonicalSlug(category),
        name,
        category.parent,
        category.description?.trim() ? "yes" : "no",
      ].join("\t"),
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
