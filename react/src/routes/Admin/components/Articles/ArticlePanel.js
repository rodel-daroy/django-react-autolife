import React from "react";
import PropTypes from "prop-types";
import Boxout from "components/content/Boxout";
import "./ArticlePanel.scss";

const ArticlePanel = ({ title, children, onEdit, commands, className }) => (
  <Boxout 
    className={`article-panel ${className || ""}`} 
    onClick={onEdit} 

    {...(onEdit && {
      as: "button",
      type: "button"
    })}>

    <header className="article-panel-header">
      <h4>{title}</h4>
    </header>
    <div className="article-panel-body">
      {children}
    </div>
    <footer className="article-panel-footer">
      {commands}

      {onEdit && (
        <div className="btn btn-link primary-link large" type="button">
          Edit...
        </div>
      )}
    </footer>
  </Boxout>
);

ArticlePanel.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node,
  onEdit: PropTypes.func,
  commands: PropTypes.node,
  className: PropTypes.string
};

ArticlePanel.Item = ({ label, children, className }) => (
  <div className={`article-panel-item ${className || ""}`}>
    <h5 className="article-panel-item-label">
      {label}
    </h5>
    <div className="article-panel-item-value">
      {children}
    </div>
  </div>
);

ArticlePanel.Item.propTypes = {
  label: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string
};

ArticlePanel.CheckItem = ({ children, checked }) => (
  <ArticlePanel.Item 
    className="article-panel-check-item"
    label={(
      <>
        <span className={`icon icon-${checked ? "checkmark" : "x"}`}></span>
        {children}
      </>
    )} />
);

ArticlePanel.CheckItem.propTypes = {
  children: PropTypes.node,
  checked: PropTypes.bool
};
 
export default ArticlePanel;