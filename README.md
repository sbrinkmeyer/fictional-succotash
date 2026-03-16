# Shop Calculator

A simple web app built for the workbench. Pull it up in a browser or install it on your phone like an app — no app store required.

## What it does

Use the menu (☰) in the top-right corner to switch between the two screens.

**Converter** — Type in a decimal inch (like `6.425`) or a millimeter value and get:

- The equivalent in the other unit
- The nearest fractional inch rounded _up_ (cut long) and rounded _down_ (stop short), using tape-measure-friendly fractions: 1/2, 1/4, 1/8, 1/16, 1/32

You can also go the other direction — type a fraction like `9/32` and it fills in the decimal for you.

**Board Feet & List** — Enter the thickness, width, and length of a board to get its board footage. Add a quantity and a price per board foot to see cost. Hit _Add to Cut List_ to keep a running tally of everything you're buying or cutting. The list shows individual pieces and a grand total — board feet and dollars.

## Using it on your phone

1. Open the app URL in Safari on your iPhone
2. Tap the Share button (the box with the arrow)
3. Tap _Add to Home Screen_
4. Done — it opens full-screen like a regular app and works offline

## Changing things

The whole app is three files: `index.html` (the layout), `app.js` (the math), and `sw.js` (the offline magic). If you want to tweak a label, change a placeholder, or swap a color, open `index.html` and look for what you want to change — it's pretty readable even if you're not a coder.

If you do make changes and push them to GitHub Pages, bump the version number in `sw.js` (e.g. `v5` → `v6`) so phones pick up the new version automatically.

## Hosted on GitHub Pages

The app lives at: `https://[your-github-username].github.io/fictional-succotash/`
