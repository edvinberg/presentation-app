# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Presentation Deck

This project has been adapted into a simple slide deck for presentations.

### Features

- Arrow key / spacebar navigation
- Animated gradient slide background
- Progress indicator and clickable dots
- Responsive layout

### Customize Slides

Edit the `slides` array in `src/App.jsx`:

```js
const slides = [
  { id: 0, content: (<><h1>Title</h1><p>Intro text</p></>) },
  // add more
]
```

Each `content` can contain any React nodes.

### Run

```bash
npm install
npm run dev
```

Open the shown local URL in your browser.

### Build Static Export

```bash
npm run build
npm run preview
```

### Accessibility Notes

- Non-active slides are `aria-hidden="true"`.
- Dot buttons have `aria-label` and `aria-selected` attributes.

Feel free to adjust styling in `src/App.css`.
