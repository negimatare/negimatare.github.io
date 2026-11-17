<div align="center">

<img src="docs/readme/banner.png" alt="Lunarium, Horologium Lunae: a pixel-art full moon beside the eight lunar phases over a moonlit horizon" width="100%">

# Lunarium

**Horologium Lunae, a moon clock for your browser.**<br>
Today's phase, the next new and full moon, and a Latin motto for every night.

![HTML](https://img.shields.io/badge/HTML-static-e8ecff?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-no%20dependencies-fea082?style=flat-square)
![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-6b7194?style=flat-square)
![CSP](https://img.shields.io/badge/CSP-self%20only-c8cce0?style=flat-square)

</div>

<br>

Open the page and the moon is already there: **today's phase**, drawn from NASA imagery,
with its Italian name, a Latin motto and a short note on what you'll see in the sky.
Two cards count down to the **next new moon** (*Novilunium proximum*) and the **next full
moon** (*Plenilunium proximum*). On the day itself they simply say ***Hodie***, today.

The site speaks Italian, with Latin wherever the old astronomers would have used it.

---

## The eight phases

<table>
<tr><td align="center"><img src="site/assets/moon/new_moon.webp" width="64"></td><td><b>Novilunio</b></td><td>Novilunium, Luna Nova</td><td><i>Ex nihilo lux oritur.</i></td></tr>
<tr><td align="center"><img src="site/assets/moon/waxing_crescent.webp" width="64"></td><td><b>Falce crescente</b></td><td>Luna Crescens</td><td><i>Crescit occulta velut arbor aevo.</i></td></tr>
<tr><td align="center"><img src="site/assets/moon/first_quarter.webp" width="64"></td><td><b>Primo quarto</b></td><td>Prima Quadrans</td><td><i>Dimidium facti, qui coepit, habet.</i></td></tr>
<tr><td align="center"><img src="site/assets/moon/waxing_gibbous.webp" width="64"></td><td><b>Gibbosa crescente</b></td><td>Luna Gibba Crescens</td><td><i>Paulatim summa petuntur.</i></td></tr>
<tr><td align="center"><img src="site/assets/moon/full_moon.webp" width="64"></td><td><b>Plenilunio</b></td><td>Luna Plena</td><td><i>Plena refulsit Luna, noctis regina.</i></td></tr>
<tr><td align="center"><img src="site/assets/moon/waning_gibbous.webp" width="64"></td><td><b>Gibbosa calante</b></td><td>Luna Gibba Decrescens</td><td><i>Post lucem tenebrae, sed lux redit.</i></td></tr>
<tr><td align="center"><img src="site/assets/moon/last_quarter.webp" width="64"></td><td><b>Ultimo quarto</b></td><td>Ultima Quadrans</td><td><i>Nox praeterit, dies autem adpropinquat.</i></td></tr>
<tr><td align="center"><img src="site/assets/moon/waning_crescent.webp" width="64"></td><td><b>Falce calante</b></td><td>Luna Decrescens</td><td><i>Finis unius principium alterius est.</i></td></tr>
</table>

---

## How it keeps time

<table>
<tr><td><b>Next new and full moon</b></td><td>Computed from the true lunar phases (Meeus, <i>Astronomical Algorithms</i>, ch. 49), not an average month. Tested against the US Naval Observatory's 74 new and full moons of 2025–2027: the worst miss is under a minute.</td></tr>
<tr><td><b>Your calendar, your day</b></td><td>Dates follow your own timezone. The full moon of 24 November 2026, 14:53 UTC, is the 24th in Rome and Honolulu and already the 25th in Kiribati.</td></tr>
<tr><td><b><i>Hodie</i></b></td><td>Shown for the whole day of the event, the evening after it included.</td></tr>
<tr><td><b>Today's phase</b></td><td>One of eight phases from the moon's age, each 3.7 days wide.</td></tr>
<tr><td><b>Privacy</b></td><td>No cookies, no analytics, no third-party requests. Fonts are served by the site, and a strict Content Security Policy allows nothing else.</td></tr>
</table>

---

## Under the hood

<details>
<summary><b>Structure</b></summary>

```
site/              everything GitHub Pages publishes
  index.html       Italian metadata, CSP, link preview
  css/             main.css, noscript.css
  js/main.js       the page: sidebar, today's phase, the two event cards
  js/lunar.js      the astronomy: phase index, true new and full moons
  assets/          moon/ (NASA frames), fonts/ (Inter, Cinzel), icons/, social/
tests/             node:test: phase pinning, USNO dates in several timezones
docs/readme/       images for this README
.github/workflows/ pages.yml (test, then deploy site/), codeql.yml
```

</details>

<details>
<summary><b>Development</b></summary>

```sh
npm test                                        # node:test, no dependencies
python3 -m http.server 8000 --directory site    # then open http://localhost:8000
```

Serve the folder over HTTP: the page loads ES modules, which browsers refuse from `file://`.

A pull request runs the tests and CodeQL. A merge to `main` runs them again and deploys `site/`
to GitHub Pages.

</details>

<details>
<summary><b>The moon images</b></summary>

Each phase comes from NASA's *Moon Phase and Libration, 2026* (3840×2160 frames), taken from
one lunation, 9 November to 9 December 2026, at the USNO phase times and halfway between them.
The disc is cut out along the frame's transparency, so every phase is the same size and
centred, then scaled to 1000×1000 WebP.

</details>

---

## Credits

- **Moon imagery**: NASA's Scientific Visualization Studio,
  [Moon Phase and Libration, 2026](https://svs.gsfc.nasa.gov/5587).
- **Phase times** for the tests: [US Naval Observatory](https://aa.usno.navy.mil/data/MoonPhases).
- **Fonts**: [Inter](https://github.com/rsms/inter) and [Cinzel](https://github.com/NDISCOVER/Cinzel),
  SIL Open Font License 1.1, in `site/assets/fonts/`.
- **Icons**: [Moon icons created by Freepik - Flaticon](https://www.flaticon.com/free-icons/moon).

Made by [negimatare](https://github.com/negimatare).
