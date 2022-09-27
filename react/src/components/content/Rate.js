import React, { Component } from "react";
import PropTypes from "prop-types";

export const ratePropTypes = {
  currentRating: PropTypes.oneOf([-1, 1]),
  onChange: PropTypes.func,
  noCaption: PropTypes.bool,
  dark: PropTypes.bool
};

const Rate = props => {
  const { currentRating, onChange, noCaption, dark } = props;

  const handleLike = () => (onChange ? onChange(1) : null);
  const handleDislike = () => (onChange ? onChange(-1) : null);

  const thumbs = (
    <ul className={`rate-list ${dark ? "dark" : ""}`}>
      <li>
        <button
          className="btn btn-link"
          onClick={handleLike}
          aria-label="Like"
          aria-pressed={currentRating === 1}
        >
          <span
            className={`icon icon-thumbs-up${
              currentRating === 1 ? "-solid" : ""
            }`}
          />
        </button>
      </li>
      <li>
        <button
          className="btn btn-link"
          onClick={handleDislike}
          aria-label="Dislike"
          aria-pressed={currentRating === -1}
        >
          <span
            className={`icon icon-thumbs-down${
              currentRating === -1 ? "-solid" : ""
            }`}
          />
        </button>
      </li>
    </ul>
  );

  if (noCaption) return thumbs;
  else
    return (
      <div className={`rate ${dark ? "dark" : ""}`}>
        <div className="h6">Rate this story</div>
        {thumbs}
      </div>
    );
};

Rate.propTypes = {
  currentRating: PropTypes.oneOf([-1, 1]),
  onChange: PropTypes.func,
  noCaption: PropTypes.bool,
  dark: PropTypes.bool
};

export default Rate;
