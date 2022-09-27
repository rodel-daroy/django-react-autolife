import React from "react";
import PropTypes from "prop-types";
import { PhoneLink } from "components/Decorators/WithPhoneLink";
import { INSURANCE_PHONE, INSURANCE_PHONE_TEXT } from "config/constants";
import "./InsurancePhone.scss";

const InsurancePhone = ({ dark }) => (
  <div className={`insurance-phone ${dark ? "dark" : ""}`}>
    <PhoneLink phone={INSURANCE_PHONE} phoneWords={INSURANCE_PHONE_TEXT}>
      {INSURANCE_PHONE_TEXT}
      <span>({INSURANCE_PHONE})</span>
    </PhoneLink>
  </div>
);

InsurancePhone.propTypes = {
	dark: PropTypes.bool
};

export default InsurancePhone;