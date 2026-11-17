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

/* ── True new and full moons (Meeus, Astronomical Algorithms, ch. 49) ── */

var MEAN_LUNATION = 29.530588861;
var JDE_NEW_MOON_2000 = 2451550.09766;
var JD_UNIX_EPOCH = 2440587.5;
var RAD = Math.PI / 180;

/* Periodic terms: [coefficient, power of E, multiples of M, M', F, Ω]. */
var NEW_MOON_TERMS = [
  [-0.4072, 0, 0, 1, 0, 0], [0.17241, 1, 1, 0, 0, 0], [0.01608, 0, 0, 2, 0, 0],
  [0.01039, 0, 0, 0, 2, 0], [0.00739, 1, -1, 1, 0, 0], [-0.00514, 1, 1, 1, 0, 0],
  [0.00208, 2, 2, 0, 0, 0], [-0.00111, 0, 0, 1, -2, 0], [-0.00057, 0, 0, 1, 2, 0],
  [0.00056, 1, 1, 2, 0, 0], [-0.00042, 0, 0, 3, 0, 0], [0.00042, 1, 1, 0, 2, 0],
  [0.00038, 1, 1, 0, -2, 0], [-0.00024, 1, -1, 2, 0, 0], [-0.00017, 0, 0, 0, 0, 1],
  [-0.00007, 0, 2, 1, 0, 0], [0.00004, 0, 0, 2, -2, 0], [0.00004, 0, 3, 0, 0, 0],
  [0.00003, 0, 1, 1, -2, 0], [0.00003, 0, 0, 2, 2, 0], [-0.00003, 0, 1, 1, 2, 0],
  [0.00003, 0, -1, 1, 2, 0], [-0.00002, 0, -1, 1, -2, 0], [-0.00002, 0, 1, 3, 0, 0],
  [0.00002, 0, 0, 4, 0, 0],
];
var FULL_MOON_TERMS = [
  [-0.40614, 0, 0, 1, 0, 0], [0.17302, 1, 1, 0, 0, 0], [0.01614, 0, 0, 2, 0, 0],
  [0.01043, 0, 0, 0, 2, 0], [0.00734, 1, -1, 1, 0, 0], [-0.00515, 1, 1, 1, 0, 0],
  [0.00209, 2, 2, 0, 0, 0], [-0.00111, 0, 0, 1, -2, 0], [-0.00057, 0, 0, 1, 2, 0],
  [0.00056, 1, 1, 2, 0, 0], [-0.00042, 0, 0, 3, 0, 0], [0.00042, 1, 1, 0, 2, 0],
  [0.00038, 1, 1, 0, -2, 0], [-0.00024, 1, -1, 2, 0, 0], [-0.00017, 0, 0, 0, 0, 1],
  [-0.00007, 0, 2, 1, 0, 0], [0.00004, 0, 0, 2, -2, 0], [0.00004, 0, 3, 0, 0, 0],
  [0.00003, 0, 1, 1, -2, 0], [0.00003, 0, 0, 2, 2, 0], [-0.00003, 0, 1, 1, 2, 0],
  [0.00003, 0, -1, 1, 2, 0], [-0.00002, 0, -1, 1, -2, 0], [-0.00002, 0, 1, 3, 0, 0],
  [0.00002, 0, 0, 4, 0, 0],
];
/* Planetary arguments: [coefficient, A at k = 0, A per lunation]. */
var PLANETARY_TERMS = [
  [0.000325, 299.77, 0.107408], [0.000165, 251.88, 0.016321], [0.000164, 251.83, 26.651886],
  [0.000126, 349.42, 36.412478], [0.00011, 84.66, 18.206239], [0.000062, 141.74, 53.303771],
  [0.00006, 207.14, 2.453732], [0.000056, 154.84, 7.30686], [0.000047, 34.52, 27.261239],
  [0.000042, 207.19, 0.121824], [0.00004, 291.34, 1.844379], [0.000037, 161.72, 24.198154],
  [0.000035, 239.56, 25.513099], [0.000023, 331.55, 3.592518],
];

/* Instant of lunation k: whole k is a new moon, k + 0.5 a full moon. */
function phaseInstant(k) {
  var T = k / 1236.85;
  var jde = JDE_NEW_MOON_2000 + MEAN_LUNATION * k + 0.00015437 * T * T -
    0.00000015 * T * T * T + 0.00000000073 * T * T * T * T;
  var E = 1 - 0.002516 * T - 0.0000074 * T * T;
  var M = (2.5534 + 29.1053567 * k - 0.0000014 * T * T - 0.00000011 * T * T * T) * RAD;
  var Mp = (201.5643 + 385.81693528 * k + 0.0107582 * T * T + 0.00001238 * T * T * T -
    0.000000058 * T * T * T * T) * RAD;
  var F = (160.7108 + 390.67050284 * k - 0.0016118 * T * T - 0.00000227 * T * T * T +
    0.000000011 * T * T * T * T) * RAD;
  var Om = (124.7746 - 1.56375588 * k + 0.0020672 * T * T + 0.00000215 * T * T * T) * RAD;

  var terms = k % 1 === 0 ? NEW_MOON_TERMS : FULL_MOON_TERMS;
  for (var i = 0; i < terms.length; i++) {
    var t = terms[i];
    jde += t[0] * Math.pow(E, t[1]) * Math.sin(t[2] * M + t[3] * Mp + t[4] * F + t[5] * Om);
  }
  for (var j = 0; j < PLANETARY_TERMS.length; j++) {
    var p = PLANETARY_TERMS[j];
    var a = p[1] + p[2] * k - (j === 0 ? 0.009173 * T * T : 0);
    jde += p[0] * Math.sin(a * RAD);
  }

  /* Terrestrial to universal time: ΔT polynomial for 2005-2050 (Espenak & Meeus). */
  var yearsSince2000 = k / 12.3685;
  var deltaT = 62.92 + 0.32217 * yearsSince2000 + 0.005589 * yearsSince2000 * yearsSince2000;
  return new Date((jde - JD_UNIX_EPOCH) * 86400000 - deltaT * 1000);
}

/* Calendar day of an instant in a timezone, as YYYY-MM-DD. */
function localDay(date, timeZone) {
  var parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  var get = function (type) {
    return parts.find(function (part) { return part.type === type; }).value;
  };
  return get("year") + "-" + get("month") + "-" + get("day");
}

/**
 * The first new or full moon whose calendar day in timeZone is today or
 * later, so the day of the event stays "today" after the event itself.
 */
export function nextEvent(kind, now, timeZone) {
  var today = localDay(now, timeZone);
  var jdNow = now.getTime() / 86400000 + JD_UNIX_EPOCH;
  var k = Math.floor((jdNow - JDE_NEW_MOON_2000) / MEAN_LUNATION) - 1;
  var offset = kind === "full" ? 0.5 : 0;
  for (;; k++) {
    var instant = phaseInstant(k + offset);
    var day = localDay(instant, timeZone);
    if (day >= today) return { instant: instant, localDate: day, isToday: day === today };
  }
}
