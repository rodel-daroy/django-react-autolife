import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { showInfoModal } from 'store/actions/infoModal'
import { combineFuncs } from "../../utils";

const WithPhoneLink = WrappedComponent => {
  const WrapperComponent = ({
    title,
    phone,
    phoneWords,
    preamble,
    onClick,
    showInfoModal,
    ...otherProps
  }) => {
    const handleClick = () => {
      const modalContent = (
        <div className="phone-link-modal">
          {preamble && <p>{preamble}</p>}

          <h2>
            <span className="icon icon-phone" />
            {!phoneWords && phone}
            {phoneWords && (
              <div>
                <div>{phoneWords}</div>
                <div className="phone-link-subscript">({phone})</div>
              </div>
            )}
          </h2>
        </div>
      );

      // showInfoModal(title, modalContent)
    };

    return (
      <WrappedComponent
        {...otherProps}
        href={`tel:${phone}`}
        onClick={combineFuncs(onClick, handleClick)}
      />
    );
  };

  WrapperComponent.propTypes = {
    title: PropTypes.string,
    phone: PropTypes.string,
    phoneWords: PropTypes.string,
    preamble: PropTypes.string
  };

  WrapperComponent.defaultProps = {
    title: "Call now"
  };

  WrapperComponent.displayName = `WithPhoneLink(${WrappedComponent.displayName ||
    WrappedComponent.name})`;

  return connect(null /*{ showInfoModal }*/)(WrapperComponent);
};

export default WithPhoneLink;

export const PhoneLink = WithPhoneLink("a");
