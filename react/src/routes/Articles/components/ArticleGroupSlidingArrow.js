import React from 'react';

const ArticleGroupSlidingArrow = (props) => {
  const { onChange, index, slideCount } = props;

  return (
    <ul className="scrollArrowsContainer" role="navigation">
      <li>
        <button className="btn scrollLeftBtn" disabled={index <= 0} onClick={() => onChange(index - 1)} aria-label="Previous page" />
      </li>
      <li><button className="btn scrollRightBtn" disabled={index >= (slideCount - 1)} onClick={() => onChange(index + 1)} aria-label="Next page" /></li>
    </ul>
  );
};
export default ArticleGroupSlidingArrow;
