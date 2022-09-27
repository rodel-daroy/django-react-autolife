import React from "react";
import StepIndicator from "../StepIndicator";
import Stepper from "../Stepper";
import ResizeSensor from "css-element-queries/src/ResizeSensor";
import debounce from "lodash/debounce";
import "./style.scss";

class TradeInPriceSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastActiveStep: 0
    };
    this.dispatchHeight = debounce(this.dispatchHeight.bind(this), 100);
  }

  componentDidMount() {
    this._resizeSensor = new ResizeSensor(this._page, this.dispatchHeight);
    this.dispatchHeight();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeStep > this.state.lastActiveStep) {
      this.setState({ lastActiveStep: nextProps.activeStep });
    }
  }

  componentDidUpdate() {
    this.dispatchHeight();
  }

  componentWillUnmount() {
    this._resizeSensor.detach();
  }

  dispatchHeight() {
    const { onHeightChange } = this.props;

    if (onHeightChange) {
      const height = this._page.clientHeight;

      if (height !== this._height) {
        onHeightChange(height);
        this._height = height;
      }
    }
  }

  render() {
    const { activeStep, stepCount, minHeight, onPrevious, onNext } = this.props;
    const { lastActiveStep } = this.state;
    return (
      <div className="step-slider">
        <article
          ref={ref => (this._page = ref)}
          className="slider_wrapper"
          style={{ minHeight }}
        >
          <div className="slider-bar">
            <StepIndicator
              stepBarFill="step_fill_bg_clr"
              stepBarEmpty="step_empty_bg_clr"
              stepStart="step_start_clr"
              stepIndicator="step_width"
              start={1}
              end={stepCount}
              current={activeStep}
            />
            <Stepper
              first={activeStep === 0}
              last={activeStep === lastActiveStep}
              onPrevious={onPrevious}
              onNext={onNext}
            />
          </div>
        </article>
      </div>
    );
  }
}

export default TradeInPriceSlider;
