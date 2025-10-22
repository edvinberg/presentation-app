# AB Presentation App (React + Vite)

A minimal React + Vite project adapted into a lightweight presentation slide deck.

## Features

- Keyboard navigation (Arrow Left/Right, Space for next)
- Animated gradient slide background
- Progress indicator with clickable circular dots
- Responsive, centered layout
- Accessible: inactive slides are `aria-hidden`, dots have labels & selection state

## Quick Start

```bash
npm install
npm run dev
```
Visit the printed local URL.

## Customize Slides

Edit the `slides` array in `src/App.jsx`:

```jsx
const slides = [
  { id: 0, content: (<><h1 className="title">Welcome</h1><p>Intro text</p></>) },
  // Add more slides here
];
```
Each `content` value can be any React nodes.

## Build & Preview

```bash
npm run build
npm run preview
```

## Styling

Main styles live in `src/App.css`. Adjust `.slide-inner` for sizing and layout.

## Accessibility Notes

- Only the active slide is interactive; others have `aria-hidden="true"`.
- Navigation dots are buttons with `aria-label` and `aria-selected`.

## Project Structure

```
.
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── README.md
├── src
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── components
│       └── Slide.jsx
├── public
│   └── vite.svg
└── node_modules/ (installed dependencies)
```

---
Generated with Vite + React and then adapted for presentations. Enjoy!
