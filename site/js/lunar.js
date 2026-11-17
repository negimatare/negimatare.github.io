/* ── Moon phase calculation ────────────────────────────── */

var SYNODIC_MONTH = 29.53058770576;
var REF_MS = Date.UTC(2000, 0, 6, 18, 14, 0);

/**
 * Returns the moon age in days (0 = new moon, ~14.76 = full moon).
 * Uses a known new-moon reference: 2000-01-06 18:14 UTC (astronomical).
 */
function moonAge(date) {
  var diff = (date.getTime() - REF_MS) / 86400000;
  return ((diff % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
}

/**
 * Returns the phase index (0-7) for a given date.
 */
export function phaseIndex(date) {
  var age = moonAge(date);
  return Math.floor((age / SYNODIC_MONTH) * 8 + 0.5) % 8;
}

/* ── Find the next occurrence of a specific phase ──────── */

export function findNextPhase(targetIndex, fromDate) {
  var d = new Date(fromDate);
  for (var i = 1; i <= 45; i++) {
    d.setDate(d.getDate() + 1);
    if (phaseIndex(d) === targetIndex) return new Date(d);
  }
  return null;
}
