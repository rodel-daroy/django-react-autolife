import React from "react";
import PropTypes from "prop-types";
import "./FormRow.scss";

const FormRow = ({ children, className }) => (
  <div className={`form-row ${className || ''}`}>
    {children}
  </div>
);

FormRow.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
 
export default FormRow;