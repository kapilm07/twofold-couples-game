# Twofold — A daily connection game

A small, responsive, browser-based product demo built with vanilla HTML, CSS, and JavaScript. It is designed as a portfolio project to demonstrate front-end fundamentals, interaction design, accessibility basics, local persistence, and thoughtful UI states.

## Features

- Daily question rotation based on the local calendar date
- Three answer moods: Sweet, Playful, and Deep
- Optional private note field with a 240-character limit and live counter
- Reveal state with context-specific encouragement
- Save/remove questions in a collection using `localStorage`
- Completion state for the day
- Confirmation before clearing saved questions
- Toast feedback, keyboard focus styles, responsive layout, and reduced-motion support
- No backend, account, analytics, or external API required

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser.

For a local server, run one of these commands from the project directory:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy with GitHub Pages

1. Create a public GitHub repository, for example `twofold-couples-game`.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md` to the repository root.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then save.
6. Wait for the Pages deployment to finish. GitHub will show the live URL in the Pages section, usually `https://YOUR-USERNAME.github.io/twofold-couples-game/`.

No build step or secrets are required.

## Project decisions and limitations

- The app stores saved questions and completion dates only in the current browser. They do not sync between partners or devices.
- The question rotation is deterministic by local date, so everyone opening the app on the same date sees the same first prompt.
- Sound is optional and off by default.
- Google Fonts is an optional external font request; system fallbacks keep the page usable if it cannot load.

## Before using this as a job application sample

Make sure you personally run it, test the flows, and can explain the code. Improve it with at least one change of your own before sharing it as work you personally built. In particular, be ready to explain:
- How `localStorage` is wrapped to handle unavailable storage
- How the app handles empty, result, saved, and confirmation states
- Why user-entered text is rendered with `textContent` rather than injected as HTML
- What you would change to sync answers between two people (a backend, authentication, and privacy model)
- How you would test question rotation, saving/removing, and storage failures

This is an independent portfolio demo and is not affiliated with Kulfi.
