# Shop Calculator

PWA I run on my iPhone for shop math. No install, just add to home screen from Safari.

## What it does

Burger menu top-right switches between the two screens.

**Converter** — type a decimal inch or mm, get the other unit plus the nearest fraction rounded up and down (cut long / stop short). Fractions are tape-measure denominators: 1/2 down to 1/32. You can also type a fraction like 9/32 and it works backwards into decimal.

**Board Feet & List** — thickness, width, length, qty, price per bf. Shows board footage and cost. Hit Add to Cut List to build a running total for a project. Clears when you close the app.

## On the phone

Safari → Share → Add to Home Screen. Opens full screen, works offline.

## Tweaking it

Three files: `index.html` is the layout and styles, `app.js` is the math, `sw.js` is what makes it work offline. If you change something and push it, bump the version number in `sw.js` so the phone picks it up.

Lives at: `https://[your-github-username].github.io/fictional-succotash/`
