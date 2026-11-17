import { phaseIndex, nextEvent } from "./lunar.js";

/* ── Phase data ────────────────────────────────────────── */

var PHASES = [
  {
    key: "new_moon",
    italian: "Novilunio",
    latin: "Novilunium \u2014 Luna Nova",
    sentence: "Ex nihilo lux oritur.",
    description:
      "Il Novilunio \u00e8 la fase in cui la Luna \u00e8 tra la Terra e il Sole: il lato illuminato \u00e8 opposto a noi, perci\u00f2 la Luna non \u00e8 visibile ad occhio nudo.",
  },
  {
    key: "waxing_crescent",
    italian: "Falce crescente",
    latin: "Luna Crescens",
    sentence: "Crescit occulta velut arbor aevo.",
    description:
      "La falce crescente appare subito dopo il novilunio: osservare il cielo dopo il tramonto pu\u00f2 rivelarla bassa sull\u2019orizzonte occidentale.",
  },
  {
    key: "first_quarter",
    italian: "Primo quarto",
    latin: "Prima Quadrans",
    sentence: "Dimidium facti, qui coepit, habet.",
    description:
      "Al primo quarto la Luna \u00e8 visibile per buona parte della serata: la \u201cmezza Luna\u201d non rappresenta met\u00e0 superficie illuminata, ma met\u00e0 del disco visibile.",
  },
  {
    key: "waxing_gibbous",
    italian: "Gibbosa crescente",
    latin: "Luna Gibba Crescens",
    sentence: "Paulatim summa petuntur.",
    description:
      "La gibbosa crescente precede il plenilunio: la luce riflessa aumenta rapidamente notte dopo notte.",
  },
  {
    key: "full_moon",
    italian: "Plenilunio",
    latin: "Luna Plena",
    sentence: "Plena refulsit Luna, noctis regina.",
    description:
      "Il Plenilunio \u00e8 quando la Luna \u00e8 opposta al Sole rispetto alla Terra e appare completamente illuminata: la notte pi\u00f9 luminosa del mese.",
  },
  {
    key: "waning_gibbous",
    italian: "Gibbosa calante",
    latin: "Luna Gibba Decrescens",
    sentence: "Post lucem tenebrae, sed lux redit.",
    description:
      "Dopo il plenilunio la Luna inizia a calare, riducendo la porzione illuminata visibile notte dopo notte.",
  },
  {
    key: "last_quarter",
    italian: "Ultimo quarto",
    latin: "Ultima Quadrans",
    sentence: "Nox praeterit, dies autem adpropinquat.",
    description:
      "All\u2019ultimo quarto la Luna mostra di nuovo met\u00e0 faccia illuminata, visibile soprattutto nelle ore del mattino.",
  },
  {
    key: "waning_crescent",
    italian: "Falce calante",
    latin: "Luna Decrescens",
    sentence: "Finis unius principium alterius est.",
    description:
      "La falce calante precede il novilunio: \u00e8 la fase meno luminosa, visibile prima dell\u2019alba nel cielo orientale.",
  },
];

/* ── Date formatting ───────────────────────────────────── */

function toISODate(d) {
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}

var DATE_LONG = { day: "numeric", month: "long", year: "numeric" };
var DATE_FULL = { weekday: "long", day: "numeric", month: "long", year: "numeric" };

function formatDate(d) {
  return d.toLocaleDateString("it-IT", DATE_LONG);
}

function formatDateFull(d) {
  return d.toLocaleDateString("it-IT", DATE_FULL);
}

/* ── Starfield ─────────────────────────────────────────── */

function createStars(container, count) {
  var frag = document.createDocumentFragment();
  for (var i = 0; i < count; i++) {
    var el = document.createElement("div");
    el.className = "star";
    var size = Math.random() * 2 + 0.5;
    var s = el.style;
    s.width = size + "px";
    s.height = size + "px";
    s.left = Math.random() * 100 + "%";
    s.top = Math.random() * 100 + "%";
    s.setProperty("--dur", (3 + Math.random() * 5) + "s");
    s.setProperty("--delay", (Math.random() * 5) + "s");
    frag.appendChild(el);
  }
  container.appendChild(frag);
}

/* ── Cached DOM references ─────────────────────────────── */

var $moonImage, $todayDate, $phaseName, $latinSentence;
var $phaseDescription, $nextNew, $nextFull, $phaseList;
var sidebarItems = [];

function cacheDom() {
  $moonImage = document.getElementById("moon-image");
  $todayDate = document.getElementById("today-date");
  $phaseName = document.getElementById("phase-name");
  $latinSentence = document.getElementById("latin-sentence");
  $phaseDescription = document.getElementById("phase-description");
  $nextNew = document.getElementById("next-new");
  $nextFull = document.getElementById("next-full");
  $phaseList = document.getElementById("phase-list");
}

/* ── Sidebar (built once, toggled via class) ───────────── */

function buildSidebar() {
  var frag = document.createDocumentFragment();
  sidebarItems = [];
  for (var i = 0; i < PHASES.length; i++) {
    var p = PHASES[i];
    var li = document.createElement("li");
    li.className = "phase-item";

    var dot = document.createElement("span");
    dot.className = "phase-dot";

    var label = document.createElement("span");
    label.className = "phase-item-label";

    var main = document.createTextNode(p.italian);
    var sub = document.createElement("span");
    sub.className = "phase-item-sub";
    sub.lang = "la";
    sub.textContent = p.latin;

    label.appendChild(main);
    label.appendChild(sub);
    li.appendChild(dot);
    li.appendChild(label);
    frag.appendChild(li);
    sidebarItems.push(li);
  }
  $phaseList.appendChild(frag);
}

function updateSidebarActive(index) {
  for (var i = 0; i < sidebarItems.length; i++) {
    if (i === index) {
      sidebarItems[i].classList.add("active");
    } else {
      sidebarItems[i].classList.remove("active");
    }
  }
}

/* ── Render ─────────────────────────────────────────────── */

function renderEvent(el, event) {
  if (event.isToday) {
    el.textContent = "Hodie";
    el.lang = "la";
  } else {
    el.textContent = formatDate(event.instant);
    el.removeAttribute("lang");
  }
  el.setAttribute("datetime", event.localDate);
}

function render() {
  var now = new Date();
  var index = phaseIndex(now);
  var phase = PHASES[index];

  $moonImage.src = "assets/moon/" + phase.key + ".webp";
  $moonImage.alt = "La Luna oggi: " + phase.italian;

  $todayDate.textContent = formatDateFull(now);
  $todayDate.setAttribute("datetime", toISODate(now));

  $phaseName.textContent = phase.italian;
  $latinSentence.textContent = phase.sentence;
  $phaseDescription.textContent = phase.description;

  var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  renderEvent($nextNew, nextEvent("new", now, timeZone));
  renderEvent($nextFull, nextEvent("full", now, timeZone));

  updateSidebarActive(index);
}

/* ── Init ───────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", function () {
  cacheDom();
  createStars(document.getElementById("stars"), 120);
  buildSidebar();
  render();
});
