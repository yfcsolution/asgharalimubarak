#!/usr/bin/env npx tsx

import { readSnapshot } from "../src/lib/content-repository";

async function main() {
  const snapshot = await readSnapshot("site");
  if (!snapshot) {
    console.error("No snapshot found.");
    process.exit(1);
  }

  if (!Array.isArray(snapshot.posts) || snapshot.posts.length === 0) {
    console.error("Snapshot is empty or invalid.");
    process.exit(1);
  }

  console.log(
    `Snapshot OK — ${snapshot.posts.length} posts saved at ${snapshot.savedAt}`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
