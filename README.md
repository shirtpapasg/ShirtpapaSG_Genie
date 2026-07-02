# Science Claw — one app, many screens

This folder **is** the app. There is no single "app file" — a working web app is a
**folder of pages that link to each other and share data**. When you upload this
whole folder to GitHub and turn on Pages, `index.html` is the front door and every
screen works together as one product.

---

## 1. What's in the folder

```
science-claw/
├── index.html                 ← FRONT DOOR. The launcher that ties screens together.
├── Shirtpapa Genie.dc.html    ← Screen: the ShirtpapaSG Genie CECL coach (this design)
├── game.html                  ← Screen: the playable 3D Claw Machine (three.js)
│
├── app-state.js               ← THE LINK. Shared credit wallet + question bank.
├── syllabus.js                ← 2024 P3–P6 syllabus + PSLE concept bank (grounds the live AI)
├── question-bank.js           ← 34 worked CECL sample questions (the OFFLINE library)
├── sound.js                   ← Shared arcade sound effects
├── support.js                 ← Runtime the Genie page needs (don't delete)
└── ds/                         ← The Science Claw design system (colors, fonts, parts)
```

> **Heads-up on the design-system folder:** in THIS Claude project it is named `_ds/`,
> but the GitHub-ready export (the `dist/` download) renames it to **`ds/`** (no
> underscore) because GitHub Pages' Jekyll refuses to serve `_`-prefixed folders.
> Always upload the **`dist/` build**, not the raw project.

Anything else in the folder (`uploads/`, `scraps/`, `.thumbnail`) is scratch — safe
to delete before you upload.

> **What works on GitHub Pages (no back-end needed):** the whole **offline core** —
> 📚 Browse the 34 sample questions, the step-by-step CECL teaching tutorial, the twin
> practice, the "I'm not sure — guide me" part-by-part scaffold, the Question Bank,
> Save & Email My Progress, and Teacher Google-Sheet sync. None of these need a server.
>
> **What needs the online Genie:** reading a student's *own* pasted/uploaded question
> with AI (the "Break it down" button + Image/PDF/Doc upload). That AI back-end only
> exists in the hosted Claude environment. On a plain GitHub Pages site there is no AI,
> so the Genie says so and opens the offline sample library instead — it never breaks.
>
> **Grounded in your syllabus:** `syllabus.js` carries the 2024 P3–P6 topics and the
> house-style "acceptable answer" concepts distilled from your PSLE question bank.
> The AI is told to use these, so the **Concept** line matches PSLE marking phrasing
> and the topic is validated. To teach the AI more, edit `syllabus.js` (each topic is
> commented).
>
> **Offline sample library:** `question-bank.js` holds **34 fully-worked CECL questions**
> (P3–P6, every theme), each with an authored **same-topic twin**. On the home screen,
> **📚 Browse 34 sample questions** opens a picker — tap any one and the Genie coaches
> it step by step **with no internet needed**. To add your own, append an entry to
> `question-bank.js` (the schema is commented at the top) — it appears automatically.

---

## 2. The one idea that makes it "one app"

Separate designs become one app through **two simple links** — no framework, no build step:

**A. They link by navigation.** Pages point at each other with ordinary links:

```html
<a href="Shirtpapa%20Genie.dc.html">Open the Genie</a>
<a href="game.html">Play the Claw Machine</a>
```

`index.html` is the hub everything returns to. The Claw Machine has a **← Home**
link back to it, and the Genie's logo returns home too.

### The credit loop (why the two screens need each other)

`game.html` is the real **three.js claw machine** with a 270-question P3–P6 quiz.
It shares the **same credit wallet** as the Genie through `app-state.js`:

- Earn **+10 credits** by getting a Genie **twin** correct (proof you learned it).
- Walk into the Claw Machine and **spend those credits** to drop the claw and grab
  prizes — complete the 5-item Science Collection for a bonus.
- Prizes, stats and credits the game writes flow back to the same wallet, so the
  header on the launcher always shows the true balance.

Because the pages fully reload on navigation, the game always picks up the latest
wallet balance when you open it (including credits you just earned in the Genie).

> **The claw game needs internet** — it loads three.js and pdf.js from a CDN. The
> Genie's offline sample library does not. Both share the wallet either way.

**B. They link by shared state.** Every page loads the same `app-state.js`:

```html
<script src="app-state.js"></script>
```

Because all the pages sit on the **same website (origin)**, they share one browser
storage. So credits the student earns in the Genie are **instantly** spendable in the
Claw Machine, and a question the Genie banks shows up everywhere. That's the whole trick.

```
   index.html  ─┐
   Genie       ─┼──►  app-state.js  ──►  one wallet + one question bank
   Claw game   ─┘        (saved in the browser, shared by every screen)
```

---

## 3. Run it

**On your computer:** open `index.html` in a browser. (The Genie also needs internet
the first time, because it pulls React from a CDN.)

**On GitHub Pages (free hosting):**
1. Upload this whole folder to a repo. **Keep the `.nojekyll` file** (see the note below) — it's what makes the design system load.
2. Repo **Settings → Pages → Build and deployment → Deploy from a branch**, pick your
   branch and `/ (root)`, **Save**.
3. After a minute your app is live at `https://YOURNAME.github.io/REPONAME/`.

> **⚠️ The one gotcha — why the page might look white/unstyled:**
> GitHub Pages runs a tool called Jekyll that **ignores any folder starting with `_`**.
> Your entire design system lives in `_ds/` — so without help, GitHub refuses to serve
> it and the app loads with no colors, no fonts, and default serif text.
> The empty **`.nojekyll`** file in this folder turns Jekyll off and fixes it.
> If your app ever loads plain white: confirm `.nojekyll` is in the repo root, and that
> the `_ds/` folder actually uploaded (some upload tools silently skip dotfiles and
> underscore folders — drag the whole folder in, or use `git add -A`).

---

## 4. The shared-state contract (for any new screen)

`app-state.js` exposes `window.SciClawState`. The useful calls:

```js
SciClawState.getPlayer().credits   // read the wallet (and name, class, collection…)
SciClawState.addCredits(10)         // reward the student
SciClawState.spendCredits(1)        // a claw drop costs a credit
SciClawState.getBank()              // the shared array of questions
SciClawState.addToBank(question)    // add one (the Genie does this with each twin)
```

Reward rules live there too: a Genie twin answered correctly = **+10 credits**
(awarded only when the twin is right — proof the student really learned it).

---

## 5. Add your existing Claw Machine game

1. Copy your `Game3D.html` (and any files it needs) into this folder. Rename it
   `game.html`.
2. In `game.html`, add one line in the `<head>` so it joins the shared economy:
   ```html
   <script src="app-state.js"></script>
   ```
   Then read/spend credits with `SciClawState` instead of the game's own counter,
   and feed questions from `SciClawState.getBank()`.
3. In `index.html`, change the Claw Machine card from a placeholder into a link:
   `<a href="game.html" class="card live …">`
4. In `Shirtpapa Genie.dc.html`, the "Spend them in the Claw Machine" button currently
   goes to `index.html`. Point it straight at the game by changing `index.html` to
   `game.html` inside the `goLauncher` / `playClaw` functions.

---

## 6. Add a brand-new screen later

1. Drop a new `whatever.html` in the folder.
2. Load the shared bits in its `<head>`:
   ```html
   <link rel="stylesheet" href="_ds/science-claw-design-system-0049d466-e787-4a70-b5c8-0dc67671c4bb/styles.css">
   <script src="app-state.js"></script>
   <script src="sound.js"></script>
   ```
3. Link to it from `index.html`. Done — it shares the same wallet and bank.

---

## 7. Keep designing in Claude

Keep editing any screen here in Claude, then re-download and replace that one file in
your repo. The shared `app-state.js` keeps everything connected no matter how many
screens you add.

*Tip: `Shirtpapa Genie.dc.html` has a space in its name (works fine, links use `%20`).
If you prefer a tidy URL, rename it to `genie.html` and update the link in `index.html`.*
