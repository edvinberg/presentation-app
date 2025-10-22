import React from 'react';

function Slide({ children }) {
  return (
    <section className="slide" aria-hidden={false}>
      <div className="slide-inner">
        {children}
      </div>
    </section>
  );
}

export default Slide;
