import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "My therapist says I have a fear of commitment, but that's just what my last three therapists said.";

const OUT = process.env.OUTPUT_DIR ?? "/output";

function main(): void {
  // Sealed gate: /output/entry.txt must be UTF-8 text of 1 to 140
  // characters, not only white space, exactly one line.
  const entry = LINE.trim();
  if (entry.length < 1 || entry.length > 140) {
    throw new Error(`entry length ${entry.length} is outside 1-140`);
  }
  if (entry.includes("\n") || entry.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (entry.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  // Brief-aligned guards: the joke must keep its setup ("therapist")
  // and land its punch on the final words ("therapists said.").
  if (!entry.toLowerCase().includes("therapist")) {
    throw new Error("entry lost its setup: no therapist");
  }
  if (!entry.endsWith("therapists said.")) {
    throw new Error("entry lost its punchline ending");
  }
  // The sealed gate counts characters; keep the byte size in the same
  // range too so the entry stays tight on the leaderboard tie-break.
  if (Buffer.byteLength(entry, "utf8") > 140) {
    throw new Error("entry exceeds 140 UTF-8 bytes");
  }
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, "entry.txt"), entry, "utf8");
  console.log(`entry ok: ${entry.length} chars, 1 line`);
}

main();
