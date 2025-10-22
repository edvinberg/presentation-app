import { useState, useEffect, useCallback } from 'react'
import Slide from './components/Slide.jsx'
import './App.css'

function App() {
  const slides = [
    { id: 0, content: (<>
      <h1 className="title rainbow">Welcome 🎉</h1>
      <p>Use arrow keys or buttons to move through the slides.</p>
    </>) },
    { id: 1, content: (<>
      <h2 className="title">About</h2>
      <p>This is a simple playful React presentation deck built with Vite.</p>
    </>) },
    { id: 2, content: (<>
      <h2 className="title">Features</h2>
      <ul className="feature-list">
        <li>Keyboard navigation</li>
        <li>Smooth transitions</li>
        <li>Minimal, fun styling</li>
      </ul>
    </>) },
    { id: 3, content: (<>
      <h2 className="title">Thanks 🙌</h2>
      <p>Wrap up slide. Customize content in <code>src/App.jsx</code>.</p>
    </>) }
  ]

  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent(c => Math.min(c + 1, slides.length - 1)), [slides.length])
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        next()
      } else if (e.key === 'ArrowLeft') {
        prev()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev])

  useEffect(() => {
    const titles = ['Welcome','About','Features','Thanks'];
    document.title = `Presentation – ${titles[current] || 'Slide'}`;
  }, [current]);

  return (
    <div className="deck">
      <div className="slides-wrapper">
        {slides.map((s, idx) => (
          <Slide key={s.id} index={idx} current={current}>
            {s.content}
          </Slide>
        ))}
      </div>
      <div className="controls">
        <button onClick={prev} disabled={current === 0} aria-label="Previous slide">◀</button>
        <span className="progress">Slide {current + 1} / {slides.length}</span>
        <button onClick={next} disabled={current === slides.length - 1} aria-label="Next slide">▶</button>
      </div>
      <div className="dots" role="tablist" aria-label="Slide selection">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            className={"dot" + (idx === current ? ' active' : '')}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            aria-selected={idx === current}
            role="tab"
          />
        ))}
      </div>
    </div>
  )
}

export default App
