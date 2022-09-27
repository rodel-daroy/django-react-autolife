import React from "react";

import PrimaryButton from "../../../../../components/Forms/PrimaryButton";

export default ({
  formState,
  currentSection,
  invalid,
  pristine,
  submitting,
  clickPrevious,
  clickNext,
  clickCancel,
  error
}) => (
  <div>
    <div className="marginTop10">
      <div>
        <PrimaryButton
          disabled={currentSection == 0 ? true : false}
          className="first"
          onClick={clickPrevious}
        >
          <span className="icon icon-angle-left" /> Previous
        </PrimaryButton>
        <PrimaryButton className="first" type="submit" disabled={submitting}>
          Next <span className="icon icon-angle-right" />
        </PrimaryButton>
      </div>
      <button
        type="button"
        className="btn btn-link"
        onClick={clickCancel}
        style={{ marginTop: "20px" }}
      >
        <span className="icon icon-x" /> Cancel
      </button>
      {error && (
        <div
          className="alert alert-danger"
          style={{ marginBottom: "0px", marginTop: "1em" }}
        >
          <small>Error: {error}</small>
        </div>
      )}
    </div>
    {formState && formState.values && (
      <pre>{JSON.stringify(formState.values, null, " ")}</pre>
    )}
  </div>
);
