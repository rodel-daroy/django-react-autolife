import React, { Component } from "react";
import InsuranceResult from "./InsuranceResult";
import PropTypes from "prop-types";
import FormSection from "../../../../../components/Forms/FormSection";
import ProgressLoader from "../../../../../components/common/ProgressLoader";
import { getScrollParent } from "../../../../../utils";
import get from "lodash/get";
import { INSURANCE_LOGOS } from "../../../components/InsuranceLogos";
import HelpBox from "../../../components/HelpBox";
import "./style.scss";

export default class InsuranceResults extends Component {
  constructor(props) {
    super(props);

    this.clickBrokerLink = this.clickBrokerLink.bind(this);
    this.clickOrderLink = this.clickOrderLink.bind(this);

    this.state = {
      loadingInsuranceData: props.loadingInsuranceData,
      loadedInsuranceData: false
    };
  }

  componentDidMount() {
    getScrollParent(this._container).scrollTop = 0;
  }

  componentWillReceiveProps(nextProps) {
    if (
      !nextProps.loadingInsuranceData &&
      nextProps.loadingInsuranceData !== this.props.loadingInsuranceData
    ) {
      this.setState({
        loadedInsuranceData: true
      });
    }
  }

  clickBrokerLink() {
    // alert('clicked broker link')
  }

  clickOrderLink() {
    // alert('clicked order link')
  }

  insuranceContent(result) {
    const textContent = `${
      result.DownPayment == 0
        ? "No down payment"
        : `$ ${Math.ceil(result.DownPayment)}`
    }:
     1 payment of $${Math.ceil(result.MonthlyPayment)} and ${
      result.NumberOfMonths
    } monthly payments`;

    return {
      textContent,
      offerContent: /*'Save $850 / yr when you bundle with your home*'*/ null
    };
  }

  renderResults() {
    const { results, textContent, status } = this.props;
    const { loadedInsuranceData } = this.state;

    if (status != 200)
      return (
        <HelpBox
          className="insurance-error"
          title={
            <div>
              <p>
                Sorry, we are having an issue finding quotes and are unable to
                continue.
              </p>
              <p>To continue your quote, please call:</p>
            </div>
          }
        />
      );

    let prices = get(results, "price.Prices", []);
    prices = prices.filter(
      price =>
        price.InsuranceCompany !== "" &&
        Object.keys(INSURANCE_LOGOS).includes(price.InsuranceCompany)
    );

    return (
      <FormSection first title={<h3>Here is what we came up with:</h3>}>
        {results &&
          prices.map((insuranceResult, index) => {
            let image =
              INSURANCE_LOGOS[insuranceResult.InsuranceCompany] ||
              INSURANCE_LOGOS[""];

            return (
              <InsuranceResult
                key={`insuranceResult-${index}`}
                first={index == 0}
                last={index == results.price.Prices.length - 1}
                image={image.props.image}
                imageAlt={image.props.alt}
                perYear={insuranceResult.Annual}
                perMonth={insuranceResult.MonthlyPayment}
                {...this.insuranceContent(insuranceResult)}
                clickBrokerLink={this.clickBrokerLink}
                clickOrderLink={this.clickOrderLink}
              />
            );
          })}
        {(!results || prices.length == 0) && (
          <div className="no-quotes">No Quotes Available</div>
        )}
      </FormSection>
    );
  }

  render() {
    const { loadingInsuranceData, loadedInsuranceData } = this.state;
    console.log(loadingInsuranceData, "loadingInsuranceData");
    console.log(loadedInsuranceData, "loadedInsuranceData ");
    return (
      <div ref={ref => (this._container = ref)}>
        {loadingInsuranceData && (
          <FormSection
            first
            title={
              <h3 className="text-center">Finding insurance options...</h3>
            }
          >
            <ProgressLoader
              averageDuration={10}
              finished={loadedInsuranceData}
              onFinished={() => this.setState({ loadingInsuranceData: false })}
            />
          </FormSection>
        )}

        {!loadingInsuranceData && this.renderResults()}
      </div>
    );
  }
}
