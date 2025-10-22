import React from 'react';

function Slide({ children, variant, animDirection }) {
  const variantClass = variant === 'odd' ? ' odd' : ' even';
  const animClass = animDirection ? (animDirection === 'right' ? ' animate-gradient-right' : ' animate-gradient-left') : '';
  return (
    <section className="slide" aria-hidden={false}>
      <div className={"slide-inner" + variantClass + animClass}>
        {children}
      </div>
    </section>
  );
}

export default Slide;
