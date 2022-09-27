import React from 'react';

export default ({ children, title, textContent = 'Lorem...' }) => (
  <section className="page-section marketplace-tool">
    <header className="page-section-header">
      <div className="text-container horizontal-header">
        <h3>{title}</h3>
        <p>{textContent}</p>
      </div>
    </header>
    <div className="page-section-content">
      <div className="content-strip">
        <div className="text-container">
          <div className="text-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  </section>);
