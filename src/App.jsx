import { useState, useEffect, useCallback, useMemo } from 'react'
import Slide from './components/Slide.jsx'
import './App.css'

function App() {
  const slides = useMemo(() => [
    { id: 0, title: 'Welcome', content: (<>
      <h1 className="title rainbow">Welcome 🎉</h1>
      <p>Use arrow keys or buttons to move through the slides.</p>
    </>) },
    { id: 1, title: 'About', content: (<>
      <h2 className="title">About</h2>
      <p>This is a simple playful React presentation deck built with Vite.</p>
    </>) },
    { id: 2, title: 'Features', content: (<>
      <h2 className="title">Features</h2>
      <ul className="feature-list">
        <li>Keyboard navigation</li>
        <li>Smooth transitions</li>
        <li>Minimal, fun styling</li>
      </ul>
    </>) },
    { id: 3, title: 'Thanks', content: (<>
      <h2 className="title">Thanks 🙌</h2>
      <p>Wrap up slide. Customize content in <code>src/App.jsx</code>.</p>
    </>) }
  ], [])

  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(0) // retained for title history only
  const [pendingIndex, setPendingIndex] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [typedValue, setTypedValue] = useState(slides[0].title)
  const typingSpeed = 55

  const startTypingFor = useCallback((target) => {
    if (target === current) return;
    setPendingIndex(target);
    setIsTyping(true);
    setTypedValue('');
  }, [current])

  const goTo = useCallback((target) => {
    if (target < 0 || target >= slides.length) return;
    startTypingFor(target);
  }, [slides.length, startTypingFor])

  const next = useCallback(() => goTo(current + 1), [goTo, current])
  const prevFn = useCallback(() => goTo(current - 1), [goTo, current])

  useEffect(() => {
    if (!isTyping || pendingIndex === null) return;
    const full = slides[pendingIndex].title;
    if (typedValue.length < full.length) {
      const t = setTimeout(() => {
        setTypedValue(full.slice(0, typedValue.length + 1));
      }, typingSpeed);
      return () => clearTimeout(t);
    } else {
      setPrev(current);
      setCurrent(pendingIndex);
      setPendingIndex(null);
      setIsTyping(false);
    }
  }, [isTyping, pendingIndex, typedValue, slides, typingSpeed, current])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        next()
      } else if (e.key === 'ArrowLeft') {
        prevFn()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prevFn])

  useEffect(() => {
    document.title = `Presentation – ${slides[current].title || 'Slide'}`;
  }, [current, slides]);

  const inputValue = isTyping ? typedValue : slides[current].title

  return (
    <>
      <div className="deck-input-wrapper">
        <input
          type="text"
          value={inputValue}
          readOnly
          aria-label="Slide heading typing field"
          className={isTyping ? 'typing' : ''}
        />
      </div>
      <div className="deck">
        <div className="slides-wrapper">
          <Slide>{slides[current].content}</Slide>
        </div>
        <div className="dots" role="tablist" aria-label="Slide selection">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              className={"dot" + (idx === current ? ' active' : '')}
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-selected={idx === current}
              role="tab"
              disabled={isTyping && idx !== pendingIndex}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default App
