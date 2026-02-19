# Language Soup Website 🍜

This folder contains the **public marketing + signup website** for Language Soup.

## What lives here

- `index.html`: main landing page explaining what Language Soup is and how it works.
  - Includes a demo video and examples of daily challenges.
  - Contains a signup form that posts directly to **Supabase** into the `signups` table.
  - On success:
    - iOS users are sent to a **TestFlight** link.
    - Android users trigger a notification via **ntfy.sh** so they can be added to a closed beta.
- Static assets:
  - `images/` for marketing graphics and icons.
  - **Founder avatar:** **`images/noah.png`** is used by default. You can replace it or set **`window.NOAH_AVATAR_URL`** to another image URL. If the image fails to load, the site shows an "N" placeholder.
  - `videos/` for demo videos (optional; current design is hero-first without video).
  - `privacy.html` for the privacy policy.

## Live souper count

The site shows a live count of app users (soupers) by calling the Supabase Edge Function `count-soupers`. Deploy it once so the number updates in real time (and refreshes every 60 seconds on the page):

```bash
cd code/dashboard && npx supabase functions deploy count-soupers
```

The website fetches `https://<your-project>.supabase.co/functions/v1/count-soupers` on load and every 60s. If the function isn't deployed, the fallback static number (150) stays.

## Hosting & edge logic

- Deployed as a static site (e.g. on **Netlify** or similar) using:
  - `_redirects` and `netlify.toml` for routing and config.
  - `netlify/edge-functions/challenge-og.js` for dynamic Open Graph images.

## Relationship to the app

- This site is often the **first touchpoint**, capturing interested learners via the signup form.
- The app itself lives in `code/dashboard` (Expo app), and internal admin tools live in `code/app-dashboard`.

