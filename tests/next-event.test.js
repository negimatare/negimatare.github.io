import { test } from "node:test";
import assert from "node:assert/strict";
import * as lunar from "../site/js/lunar.js";

// New and full moons from the US Naval Observatory, aa.usno.navy.mil/api/moon/phases.
const USNO = {
  new: [
    "2025-01-29T12:36Z", "2025-02-28T00:45Z", "2025-03-29T10:58Z", "2025-04-27T19:31Z",
    "2025-05-27T03:02Z", "2025-06-25T10:31Z", "2025-07-24T19:11Z", "2025-08-23T06:06Z",
    "2025-09-21T19:54Z", "2025-10-21T12:25Z", "2025-11-20T06:47Z", "2025-12-20T01:43Z",
    "2026-01-18T19:52Z", "2026-02-17T12:01Z", "2026-03-19T01:23Z", "2026-04-17T11:52Z",
    "2026-05-16T20:01Z", "2026-06-15T02:54Z", "2026-07-14T09:43Z", "2026-08-12T17:37Z",
    "2026-09-11T03:27Z", "2026-10-10T15:50Z", "2026-11-09T07:02Z", "2026-12-09T00:52Z",
    "2027-01-07T20:24Z", "2027-02-06T15:56Z", "2027-03-08T09:29Z", "2027-04-06T23:51Z",
    "2027-05-06T10:58Z", "2027-06-04T19:40Z", "2027-07-04T03:02Z", "2027-08-02T10:05Z",
    "2027-08-31T17:41Z", "2027-09-30T02:36Z", "2027-10-29T13:36Z", "2027-11-28T03:24Z",
    "2027-12-27T20:12Z",
  ],
  full: [
    "2025-01-13T22:27Z", "2025-02-12T13:53Z", "2025-03-14T06:55Z", "2025-04-13T00:22Z",
    "2025-05-12T16:56Z", "2025-06-11T07:44Z", "2025-07-10T20:37Z", "2025-08-09T07:55Z",
    "2025-09-07T18:09Z", "2025-10-07T03:47Z", "2025-11-05T13:19Z", "2025-12-04T23:14Z",
    "2026-01-03T10:03Z", "2026-02-01T22:09Z", "2026-03-03T11:38Z", "2026-04-02T02:12Z",
    "2026-05-01T17:23Z", "2026-05-31T08:45Z", "2026-06-29T23:56Z", "2026-07-29T14:36Z",
    "2026-08-28T04:18Z", "2026-09-26T16:49Z", "2026-10-26T04:12Z", "2026-11-24T14:53Z",
    "2026-12-24T01:28Z", "2027-01-22T12:17Z", "2027-02-20T23:23Z", "2027-03-22T10:44Z",
    "2027-04-20T22:27Z", "2027-05-20T10:59Z", "2027-06-19T00:44Z", "2027-07-18T15:45Z",
    "2027-08-17T07:29Z", "2027-09-15T23:03Z", "2027-10-15T13:47Z", "2027-11-14T03:26Z",
    "2027-12-13T16:09Z",
  ],
};

const DAY_MS = 86400000;
const ONE_MINUTE_MS = 60000;
const localDay = (date, timeZone) =>
  new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);

for (const kind of ["new", "full"]) {
  test(`next ${kind} moon is within a minute of USNO, 2025-2027`, () => {
    for (const iso of USNO[kind]) {
      const event = new Date(iso);
      const { instant } = lunar.nextEvent(kind, new Date(event - 3 * DAY_MS), "UTC");
      assert.ok(Math.abs(instant - event) <= ONE_MINUTE_MS, `${iso}: got ${instant.toISOString()}`);
    }
  });

  test(`next ${kind} moon falls on the USNO day in Rome, Tokyo and New York`, () => {
    for (const timeZone of ["Europe/Rome", "Asia/Tokyo", "America/New_York"]) {
      for (const iso of USNO[kind]) {
        const event = new Date(iso);
        const { localDate } = lunar.nextEvent(kind, new Date(event - 3 * DAY_MS), timeZone);
        assert.equal(localDate, localDay(event, timeZone), `${iso} in ${timeZone}`);
      }
    }
  });
}

test("a visitor in Rome on 2026-11-17 sees 24 November and 9 December", () => {
  const now = new Date("2026-11-17T11:00Z");
  assert.equal(lunar.nextEvent("full", now, "Europe/Rome").localDate, "2026-11-24");
  assert.equal(lunar.nextEvent("new", now, "Europe/Rome").localDate, "2026-12-09");
});

test("the full moon of 2026-11-24 14:53 UTC follows the visitor's timezone", () => {
  const now = new Date("2026-11-20T12:00Z");
  assert.equal(lunar.nextEvent("full", now, "Pacific/Honolulu").localDate, "2026-11-24");
  assert.equal(lunar.nextEvent("full", now, "Pacific/Kiritimati").localDate, "2026-11-25");
});

test("the day of the event is today for the whole day, even after the event", () => {
  const evening = lunar.nextEvent("full", new Date("2026-11-24T22:00Z"), "Europe/Rome");
  assert.equal(evening.localDate, "2026-11-24");
  assert.equal(evening.isToday, true);

  const dayBefore = lunar.nextEvent("full", new Date("2026-11-23T22:00Z"), "Europe/Rome");
  assert.equal(dayBefore.localDate, "2026-11-24");
  assert.equal(dayBefore.isToday, false);

  const dayAfter = lunar.nextEvent("full", new Date("2026-11-25T07:00Z"), "Europe/Rome");
  assert.equal(dayAfter.localDate, "2026-12-24");
  assert.equal(dayAfter.isToday, false);
});

test("today is the visitor's day, not the UTC day", () => {
  // 2026-11-24T23:00Z is still the 24th in UTC but already 25 Nov 08:00 in Tokyo.
  const tokyo = lunar.nextEvent("full", new Date("2026-11-24T23:00Z"), "Asia/Tokyo");
  assert.equal(tokyo.localDate, "2026-12-24");
  assert.equal(tokyo.isToday, false);
});
