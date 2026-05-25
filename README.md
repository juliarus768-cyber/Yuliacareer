# Summer Math Battle Tutor (V1)

Tablet-friendly React + Vite app to support Alex (Grade 7) and Katya (Grade 4) with summer math missions, battle mode, money lab, rewards, and parent reporting.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Open the local URL shown by Vite (typically `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## What to test first

1. Home Dashboard cards for Alex and Katya update when `+ Complete Mission` is clicked.
2. Switch `Mode: Weekday/Weekend` and verify mission duration and daily goals change.
3. Reward Store requests appear in Parent Dashboard and remain after refresh (localStorage).
4. Math Facts Trainer mastery dots render from 1–12 for both children.
5. Battle Mode text confirms balanced scoring and Alex’s “Check Before Submit” bonus.
