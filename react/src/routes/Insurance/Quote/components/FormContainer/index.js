import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import Section0 from "./../Forms/Form0";
import Section1 from "./../Forms/Form1";
import Section2 from "./../Forms/Form2";
import Section3 from "./../Forms/Form3";
import get from "lodash/get";
import { getScrollParent, scrollToTop } from "../../../../../utils";

class InsuranceFormContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    const { currentSection } = this.props;

    if (currentSection != prevProps.currentSection) {
      getScrollParent(this._container).scrollTop = 0;
    }
  }

  handleSubmitFail = () => {
    scrollToTop(this._container);
    setTimeout(() => {
      ReactDOM.findDOMNode(this._errorSummary) &&
        ReactDOM.findDOMNode(this._errorSummary).focus({ preventScroll: true });
    });
  };

  handleErrorSummaryRef = ref => (this._errorSummary = ref);

  render() {
    const {
      insuranceSection0Form,
      currentSection,
      currentDriver,
      currentVehicle,
      vehicles,
      drivers,
      clickPrevious,
      clickCancel,
      clickNext
    } = this.props;

    const driversToInsure = get(
      this.props,
      "insuranceSection0Form.values.driversToInsure",
      0
    );
    const vehiclesToInsure = get(
      this.props,
      "insuranceSection0Form.values.vehiclesToInsure",
      0
    );

    return (
      <div ref={ref => (this._container = ref)}>
        {currentSection == 0 && (
          <div>
            <Section0
              clickCancel={clickCancel}
              currentSection={currentSection}
              clickPrevious={clickPrevious}
              clickNext={clickNext}
              onSubmitFail={this.handleSubmitFail}
              errorSummaryRef={this.handleErrorSummaryRef}
            />
          </div>
        )}
        {currentSection == 1 && (
          <div>
            {[
              ...Array(Number(insuranceSection0Form.values.driversToInsure))
            ].map((e, i) => (
              <div key={i}>
                <Section1
                  clickCancel={clickCancel}
                  currentSection={currentSection}
                  clickPrevious={clickPrevious}
                  clickNext={clickNext}
                  currentDriver={currentDriver}
                  driverIndex={i}
                  onSubmitFail={this.handleSubmitFail}
                  errorSummaryRef={this.handleErrorSummaryRef}
                />
              </div>
            ))}
          </div>
        )}
        {currentSection == 2 && (
          <div>
            {[...Array(Number(vehiclesToInsure))].map((e, i) => (
              <div key={i}>
                <Section2
                  clickCancel={clickCancel}
                  currentSection={currentSection}
                  clickPrevious={clickPrevious}
                  clickNext={clickNext}
                  currentVehicle={currentVehicle}
                  vehicleIndex={i}
                  onSubmitFail={this.handleSubmitFail}
                  errorSummaryRef={this.handleErrorSummaryRef}
                />
              </div>
            ))}
          </div>
        )}
        {currentSection == 3 && (
          <div>
            <Section3
              clickCancel={clickCancel}
              vehicles={vehicles}
              drivers={drivers}
              currentSection={currentSection}
              clickPrevious={clickPrevious}
              clickNext={clickNext}
              onSubmitFail={this.handleSubmitFail}
              errorSummaryRef={this.handleErrorSummaryRef}
            />
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    insuranceSection0Form: state.form.insuranceSection0Form
  }),
  dispatch => ({
    // onSubmit: data => dispatch(myActionToDoStuff(data))
  })
)(InsuranceFormContainer);
