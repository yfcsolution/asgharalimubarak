import { probeWordPressApi } from "../src/lib/wordpress-api";

async function main() {
  const health = await probeWordPressApi();

  console.log(JSON.stringify(health, null, 2));

  if (!health.ok) {
    console.error("WordPress health check failed.");
    process.exit(1);
  }

  console.log("WordPress health check passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
