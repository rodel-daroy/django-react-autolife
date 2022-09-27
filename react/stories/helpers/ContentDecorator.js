import React from 'react';

const ContentDecorator = story => (
  <div className="content-container">
    {story()}
  </div>
);

export default ContentDecorator;