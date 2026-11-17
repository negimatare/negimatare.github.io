import { test } from "node:test";
import assert from "node:assert/strict";
import { phaseIndex } from "../site/js/lunar.js";

// Phase index for every day of 2026 at 12:00 UTC, captured from the
// original main.js before it was split into modules.
const PHASES_2026 =
  "3444455566667777000111122223333444555566667770000111122233334444555666677" +
  "7700001112222333344455556666777000011112223333444455556667777000011122223" +
  "3334445555666677700001111222333344445555666777700001112222333344455556666" +
  "7770000111122223334444555566677770000111222233334445555666677770001111222" +
  "2333444455556667777000011122223333444455566667777000111122223334444555566";

test("phase index matches the original calculation for every day of 2026", () => {
  for (let day = 0; day < 365; day++) {
    const date = new Date(Date.UTC(2026, 0, 1 + day, 12));
    assert.equal(phaseIndex(date), Number(PHASES_2026[day]), date.toISOString());
  }
});
