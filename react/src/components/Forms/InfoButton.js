import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { showInfoModal } from "../../redux/actions/infoModalActions";

const InfoButton = ({
  title,
  content,
  showInfoModal,
  className,
  ...otherProps
}) => {
  const handleClick = e => {
    showInfoModal(title, content);

    e.preventDefault();
    return false;
  };

  return (
    <button
      {...otherProps}
      type="button"
      className={`btn btn-link info-button ${className || ""}`}
      onClick={handleClick}
      aria-label="More info"
    >
      <span className="icon icon-info" />
    </button>
  );
};

InfoButton.propTypes = {
  title: PropTypes.string,
  content: PropTypes.node
};

export default connect(
  null,
  { showInfoModal }
)(InfoButton);
