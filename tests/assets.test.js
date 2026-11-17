import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

// main.js reads the DOM when it loads, so the phase keys are read from its source.
const MAIN_JS = new URL("../site/js/main.js", import.meta.url);
const keys = [...readFileSync(MAIN_JS, "utf8").matchAll(/^\s+key: "([a-z_]+)",$/gm)].map((m) => m[1]);

test("every phase has its moon image", () => {
  assert.equal(keys.length, 8, `expected 8 phase keys, found ${keys.length}`);
  for (const key of keys) {
    const image = new URL(`../site/assets/moon/${key}.webp`, import.meta.url);
    assert.ok(existsSync(image), `missing site/assets/moon/${key}.webp`);
  }
});
