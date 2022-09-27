import React from "react";
import PropTypes from "prop-types";
import PrimaryButton from "components/Forms/PrimaryButton";
import ObjectFit from "components/common/ObjectFit";

const Tout = ({ heading, children, buttonText, image, link, target }) => (
  <section className="tout">
    <div className="tout-inner">
      {image && (
        <div className="tout-image">
          <ObjectFit fit="contain">
            <img src={image} alt="" />
          </ObjectFit>
        </div>
      )}
      <div className="tout-content">
        <div className="tout-content-inner">
          <h2>{heading}</h2>
          {children}

          <PrimaryButton link={link} target={target} className="first last">
            {buttonText} <span className="icon icon-angle-right" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  </section>
);

Tout.propTypes = {
  heading: PropTypes.node,
  children: PropTypes.node,
  buttonText: PropTypes.string,
  image: PropTypes.string,
  link: PropTypes.any,
  target: PropTypes.string
};

export default Tout;
