import React from "react";
import { Link, withRouter } from "react-router-dom";
import RadialButton from "../../../../components/Forms/RadialButton";

const StartOverButton = ({ location }) => (
  <Link
    className="btn btn-link"
    to={`${location.pathname}?reset`}
    style={{ marginTop: "20px" }}
  >
    <RadialButton component="div" size="tiny">
      <span className="icon icon-angle-left" />
    </RadialButton>{" "}
    Start over
  </Link>
);

export default withRouter(StartOverButton);
