import React from "react";
import PrimaryButton from "../../../../components/Forms/PrimaryButton";
import StartOverButton from "./StartOverButton";

const FormFooter = ({ formState, invalid, pristine, submitting, error }) => (
  <div className="form-group">
    <PrimaryButton
      type="submit"
      disabled={(pristine && invalid) || invalid || submitting}
    >
      Continue <span className="icon icon-angle-right" />
    </PrimaryButton>
    <br />
    <StartOverButton />
    {error && (
      <div
        className="alert alert-danger"
        style={{ marginBottom: "0px", marginTop: "1em" }}
      >
        <small>Error: {error} </small>
      </div>
    )}
    {/*formState &&
      formState.values &&
      <pre>
        {<div>{JSON.stringify(formState, null, ' ')}</div>}
    </pre>*/}
  </div>
);

export default FormFooter;
