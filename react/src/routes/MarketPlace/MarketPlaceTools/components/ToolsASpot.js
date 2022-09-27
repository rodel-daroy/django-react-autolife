import React from "react";
import PropTypes from "prop-types";
import FeatureSpot from "components/common/FeatureSpot";
import Sponsor from "components/content/Sponsor";
import logo from "styles/img/logos/third-party/cbb.png";
import ASpotBody from "components/common/ASpotBody";

const ToolsASpot = ({ title, image, sponsor }) => (
  <FeatureSpot
    images={image}
    kind="image"
    short
    scrim="gradient"
    frameContent={sponsor}
  >
    <ASpotBody heading={title} />
  </FeatureSpot>
);

ToolsASpot.propTypes = {
  title: PropTypes.node,
  image: PropTypes.string,
  sponsor: PropTypes.node
};

ToolsASpot.defaultProps = {
  sponsor: <Sponsor name="CBB" image={logo} />
};

export default ToolsASpot;
