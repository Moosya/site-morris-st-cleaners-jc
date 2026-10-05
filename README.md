# Demo site template (Daily 10)

Canonical copy of the Friday 2026-09-25 demo template, fixed 2026-09-26:

- `<title>` is baked from `public/config.json` `shopName` at build time (`vite.config.js`), never "Local shop".
- Hero photo is self-hosted: `public/hero.jpg` + `"photoUrl": "/hero.jpg"`. A dead third-party URL can't break it.
  `src/main.js` also falls back to `/hero.jpg`, then hides the image, if `photoUrl` fails to load.
- No generic "shop"/"storefront" in customer-facing copy ("Neighborhood business", "for your business").
- Team CTAs unchanged: Call us / Text us / Email us -> ownerPhone (908) 286-8650 / troupe.javelin-7w@icloud.com.

Build a new demo with `python3 /workspace/daily-owner-dials/build_demo_site.py ...` (copies this folder, writes
config, picks the hero photo by category). Then run `check_demo_assets.py <live url>` before dialing.
