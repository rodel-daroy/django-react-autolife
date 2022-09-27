import React, { Component } from "react";
import PropTypes from "prop-types";
import StepIndicator from "../Navigation/StepIndicator";
import Stepper from "../Navigation/Stepper";
import ResizeSensor from "css-element-queries/src/ResizeSensor";
import debounce from "lodash/debounce";

class RegisterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastActiveStep: 0
    };

    this.dispatchHeight = debounce(this.dispatchHeight.bind(this), 100);
  }

  dispatchHeight() {
    const { onHeightChange } = this.props;

    if (onHeightChange && this._page) {
      const height = this._page.clientHeight;

      if (height !== this._height) {
        onHeightChange(height);
        this._height = height;
      }
    }
  }

  componentDidMount() {
    this._resizeSensor = new ResizeSensor(this._page, this.dispatchHeight);
    this.dispatchHeight();
  }

  componentDidUpdate() {
    this.dispatchHeight();
  }

  componentWillUnmount() {
    this._resizeSensor.detach();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeStep > this.state.lastActiveStep) {
      this.setState({
        lastActiveStep: nextProps.activeStep
      });
    }
  }

  render() {
    const {
      children,
      activeStep,
      stepCount,
      onPrevious,
      onNext,
      changing,
      minHeight
    } = this.props;
    const { lastActiveStep } = this.state;

    return (
      <article
        ref={ref => (this._page = ref)}
        className="register-page page-width"
        style={{ minHeight }}
      >
        <div className="register-page-side-outer">
          <div className="register-page-side">
            <StepIndicator start={1} end={stepCount} current={activeStep + 1} />

            <Stepper
              dark
              first={activeStep === 0}
              last={activeStep === lastActiveStep}
              onPrevious={onPrevious}
              onNext={onNext}
            />
          </div>
        </div>

        <div className="register-page-content">{children}</div>
      </article>
    );
  }
}

RegisterPage.propTypes = {
  activeStep: PropTypes.number,
  stepCount: PropTypes.number,
  children: PropTypes.any,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
  changing: PropTypes.bool,
  minHeight: PropTypes.number,
  onHeightChange: PropTypes.func
};

export default RegisterPage;
