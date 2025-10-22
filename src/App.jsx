import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Slide from './components/Slide.jsx'
import './App.css'
import slidesDefault from './data/slides.json';
import slidesFun from './data/slides_fun.json';
import slidesMinimal from './data/slides_minimal.json';
import slidesAb from './data/ab.json';

function App() {
  // deck selection state
  const [selectedDeck, setSelectedDeck] = useState('default');
  const [deckOpen, setDeckOpen] = useState(false);
  const deckSources = { default: slidesDefault, fun: slidesFun, minimal: slidesMinimal, ab: slidesAb };
  const rawDeck = deckSources[selectedDeck];
  const slides = useMemo(() => {
    const renderContent = (entry) => entry.content.map((block, i) => {
      if (block.type === 'p') return <p key={i}>{block.text}</p>;
      if (block.type === 'list') return (
        <ul key={i} className="feature-list">
          {block.items.map((it, j) => <li key={j}>{it}</li>)}
        </ul>
      );
      return null;
    });
    return rawDeck.map(raw => ({
      id: raw.id,
      title: raw.title,
      content: (
        <>
          {/* Title removed from slide; shown only in the typing input */}
          {renderContent(raw)}
        </>
      )
    }));
  }, [rawDeck])

  const [current, setCurrent] = useState(0)
  const [pendingIndex, setPendingIndex] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [typedValue, setTypedValue] = useState(slides[0].title)
  const typingSpeed = 25; // typing interval in ms
  // Removed animateBg; using variant + animDirection instead
  const prevIndexRef = useRef(null);
  const [animDirection, setAnimDirection] = useState(null);

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
      setCurrent(pendingIndex);
      setPendingIndex(null);
      setIsTyping(false);
    }
  }, [isTyping, pendingIndex, typedValue, slides, typingSpeed, current])

  // Determine animation direction based on parity change (only half traverse)
  useEffect(() => {
    if (prevIndexRef.current === null) { prevIndexRef.current = current; return; }
    const prev = prevIndexRef.current;
    if ((prev % 2) !== (current % 2)) {
      setAnimDirection(prev % 2 === 0 ? 'right' : 'left');
      prevIndexRef.current = current; // ensure ref updates even when animating
      const t = setTimeout(() => setAnimDirection(null), 500); // was 800ms, now 500ms to match faster animation
      return () => clearTimeout(t);
    } else {
      setAnimDirection(null); // same parity, no animation
      prevIndexRef.current = current;
    }
  }, [current]);

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

  const selectorRef = useRef(null);
  const firstItemRef = useRef(null);

  const toggleDeckMenu = () => setDeckOpen(o => !o);
  const selectDeck = (key) => {
    setSelectedDeck(key);
    setDeckOpen(false);
  };
  // keyboard navigation for menu
  const onMenuKeyDown = (e) => {
    if (!deckOpen) return;
    const items = selectorRef.current?.querySelectorAll('.deck-dropdown button');
    if (!items || !items.length) return;
    const arr = Array.from(items);
    const currentIndex = arr.indexOf(document.activeElement);
    if (e.key === 'Escape') {
      setDeckOpen(false);
      selectorRef.current.querySelector('.deck-selector-button')?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = arr[(currentIndex + 1 + arr.length) % arr.length];
      next.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = arr[(currentIndex - 1 + arr.length) % arr.length];
      prev.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      arr[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      arr[arr.length - 1].focus();
    }
  };
  // outside click / escape close
  useEffect(() => {
    if (!deckOpen) return;
    const handleClick = (e) => {
      if (!selectorRef.current?.contains(e.target)) setDeckOpen(false);
    };
    const handleKey = (e) => { if (e.key === 'Escape') setDeckOpen(false); };
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, [deckOpen]);
  // focus first item when opening
  useEffect(() => {
    if (deckOpen) {
      const active = selectorRef.current?.querySelector('.deck-dropdown .active') || firstItemRef.current;
      active?.focus();
    }
  }, [deckOpen]);

  // reset when deck changes
  useEffect(() => {
    setCurrent(0);
    setPendingIndex(null);
    setIsTyping(false);
    setTypedValue(slides[0].title);
    prevIndexRef.current = 0; // reset parity tracking on deck change
  }, [selectedDeck, slides]);

  return (
    <>
      <div className="deck-selector" ref={selectorRef} onKeyDown={onMenuKeyDown}>
          <h2 onClick={toggleDeckMenu} className="title dice-emoji">🎲</h2>
        {deckOpen && (
          <ul className="deck-dropdown" role="menu" aria-label="Select deck">
            <li role="none">
              <button ref={firstItemRef} role="menuitem" onClick={() => selectDeck('default')} className={selectedDeck==='default'?'active':''}>Default</button>
            </li>
            <li role="none">
              <button role="menuitem" onClick={() => selectDeck('fun')} className={selectedDeck==='fun'?'active':''}>Fun Pack</button>
            </li>
            <li role="none">
              <button role="menuitem" onClick={() => selectDeck('minimal')} className={selectedDeck==='minimal'?'active':''}>Minimal</button>
            </li>
              <li role="none">
              <button role="menuitem" onClick={() => selectDeck('ab')} className={selectedDeck==='ab'?'active':''}>ab</button>
            </li>
          </ul>
        )}
      </div>
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
          <Slide variant={current % 2 === 0 ? 'even' : 'odd'} animDirection={animDirection}>{slides[current].content}</Slide>
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
