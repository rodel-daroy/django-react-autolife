import React from "react";
import { roundNumbers } from "../../../../../utils/format";
import PrimaryButton from "../../../../../components/Forms/PrimaryButton";
import WithPhoneLink from "../../../../../components/Decorators/WithPhoneLink";
import {
  INSURANCE_PHONE,
  INSURANCE_PHONE_TEXT,
  INSURANCE_EMAIL
} from "../../../../../config/constants";
import "./style.scss";

const PhoneButton = WithPhoneLink(props => (
  <PrimaryButton {...props} component="a" />
));

const InsuranceResult = props => {
  const {
    imageAlt,
    image,
    perYear,
    perMonth,
    textContent,
    offerContent,
    clickBrokerLink,
    clickOrderLink,
    first,
    last
  } = props;

  return (
    <div
      className={`insurance-result ${first ? "first" : ""} ${
        last ? "last" : ""
      }`}
    >
      <div className="insurance-result-logo">
        <div>
          <img alt={imageAlt} src={image} />
        </div>
      </div>
      <div className="insurance-result-body">
        <h3 className="insurance-result-per-month">
          ${roundNumbers(perMonth, 0)} / mo
        </h3>
        <h4 className="insurance-result-per-year">${perYear} / yr</h4>
        <p className="insurance-result-text">{textContent}</p>
        {offerContent && (
          <p className="insurance-result-offer">{offerContent}</p>
        )}
      </div>
      <div className="insurance-result-buttons">
        <div className="insurance-result-buttons-inner">
          <PhoneButton
            phone={INSURANCE_PHONE}
            phoneWords={INSURANCE_PHONE_TEXT}
            onClick={clickOrderLink}
          >
            Call <span className="icon icon-angle-right" />
          </PhoneButton>
          <a
            className="btn btn-link primary-link"
            href={`mailto:${INSURANCE_EMAIL}`}
            onClick={clickBrokerLink}
          >
            Email a Broker >
          </a>
        </div>
      </div>
    </div>
  );
};

export default InsuranceResult;
