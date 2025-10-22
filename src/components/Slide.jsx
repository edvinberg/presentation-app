import React from 'react';

function Slide({ children, index, current }) {
  return (
    <section
      className={"slide" + (index === current ? " active" : "")}
      aria-hidden={index !== current}
    >
      <div className="slide-inner">
        {children}
      </div>
    </section>
  );
}

export default Slide;

