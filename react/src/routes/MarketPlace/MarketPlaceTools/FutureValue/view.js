import React, { Component } from 'react';
import { connect } from 'react-redux';
import Breadcrumbs from '../../../../components/Navigation/Breadcrumbs';
import StepSlider from '../../../../components/Navigation/StepSlider';
// import PropDump from 'components/Debugging/PropDump';
import { postFutureValueResults } from '../../../../redux/actions/carWorthAction';
import { CBBTOOLS } from '../../../../config/constants';
import { getScrollParent } from '../../../../utils';
import Terms from './../components/Terms';
import OtherTools from './../components/OtherTools';
import ToolsASpot from './../components/ToolsASpot';
import StepOne from './../components/StepOne';
import StepTwo from './../components/StepTwo';
import Results from './components/Results';
import get from 'lodash/get';
import headerImage from './img/header.png';
import ArticleMetaTags from '../../../../components/common/ArticleMetaTags';
import './../style.scss';

class MarketPlaceFutureValueView extends Component {
  constructor(props) {
    super(props);
    let currentStep = 0;
    this.STEP_COUNT = 2;
    this.currentTool = CBBTOOLS.FUTUREVALUE;

    const {
      match: {
        params: {
          year,
          make,
          model,
          trim,
          bodystyle,
          postalcode,
          current_kilometers,
          annual_kilometers
        }
      }
    } = props;
    // eslint-disable-line

    if (
      year &&
      make &&
      model &&
      trim &&
      bodystyle &&
      postalcode &&
      current_kilometers &&
      annual_kilometers
    ) {
      // eslint-disable-line
      // go to final page if they have all the query strings in the url
      currentStep = this.STEP_COUNT;
    }
    this.state = {
      activeStep: currentStep,
      year,
      make,
      model,
      trim,
      bodystyle,
      postalcode,
      current_kilometers,
      annual_kilometers
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.location !== this.props.location &&
      nextProps.location.search === '?reset'
    ) {
      this.setState({ activeStep: 0 });
      getScrollParent(this.contentContainer).scrollTop = 0;
    }
  }

  onContinueNextStep = values => {
    const nextStep = this.state.activeStep + 1;
    this.setState({
      bodystyle: values.bodystyle.value,
      ...values,
      activeStep: nextStep
    });
    const contentContainer = getScrollParent(this.contentContainer);
    if (contentContainer) {
      contentContainer.scrollTop = 0;
    }
    if (nextStep === this.STEP_COUNT) {
      const { year, make, model } = this.state;
      const {
        option,
        trim,
        bodystyle: body_style,
        postalcode: postal_code,
        current_kilometers,
        annual_kilometers
      } = values; // eslint-disable-line
      // const body_style1 = body_style.value;
      const { accessToken } = this.props;
      this.props.postFutureValueResults(
        {
          year,
          make,
          model,
          option,
          trim: trim.value,
          body_style: body_style.value,
          postal_code,
          current_kilometers,
          annual_kilometers
        },
        accessToken
      );
    }
  };

  handlePrevious = () => {
    this.setState({ activeStep: this.state.activeStep - 1 });
  };

  handleNext = () => {
    this.setState({ activeStep: this.state.activeStep + 1 });
  };

  handleStartOver = () => {
    this.setState({ activeStep: 0 });
  };

  handleHeightChange = pageHeight => {
    this.setState({ pageHeight });
  };

  selectCar = ({ year, model, make }) => {
    getScrollParent(this.contentContainer).scrollTop = 0;
    this.setState({ year, make, model, activeStep: this.state.activeStep + 1 });
  };

  render() {
    const {
      activeStep,
      pageHeight,
      year,
      make,
      model,
      trim,
      bodystyle,
      postalcode,
      current_kilometers,
      annual_kilometers,
      addOns,
      deducts
    } = this.state;

    console.log(this.state, 'props');
    return (
      <div className="toolsPage">
        <ArticleMetaTags title="Future Value" />

        <div
          className={`page-width content-container ${
            activeStep > 0 ? 'offset-header' : ''
          }`}
        >
          {activeStep === 0 && (
            <ToolsASpot image={headerImage} title="Future Value" />
          )}
          <div ref={ref => (this.contentContainer = ref)}>
            <div className="text-container">
              <Breadcrumbs>
                <Breadcrumbs.Crumb link="/market-place" name="Marketplace" />
                <Breadcrumbs.Crumb name="Future Value" />
              </Breadcrumbs>
            </div>
            {activeStep === 0 && (
              <StepOne
                currentTool="future-value"
                selectCar={this.selectCar}
                className="animated fadeIn"
              />
            )}
            {activeStep > 0 && (
              <div className="text-container">
                <h1>
                  Canadian black book Future Value value for a {year} {make}{' '}
                  {model}
                </h1>
                {activeStep < this.STEP_COUNT && (
                  <div className="formContainer">
                    <div className="stepperArea hidden-xs hidden-sm">
                      <StepSlider
                        onHeightChange={this.handleHeightChange}
                        minHeight={pageHeight}
                        stepCount={this.STEP_COUNT + 1}
                        activeStep={activeStep + 1}
                        onPrevious={this.handlePrevious}
                        onNext={this.handleNext}
                      />
                    </div>
                    <div className="formArea">
                      <h2 className="stepTitle">Step {activeStep + 1}</h2>
                      {activeStep === 1 && (
                        <StepTwo
                          onContinueNextStep={this.onContinueNextStep}
                          year={year}
                          make={make}
                          model={model}
                          showMileage
                          showEstimatedMileage
                          showDeducts
                        />
                      )}
                    </div>
                    {/*<div className="adAreaColumn">
                    Ad Column
                  </div>*/}
                  </div>
                )}
                {activeStep === this.STEP_COUNT && (
                  <Results
                    resultsData={{
                      year,
                      make,
                      model,
                      trim,
                      bodystyle,
                      postalcode,
                      current_kilometers,
                      annual_kilometers,
                      addOns,
                      deducts
                    }}
                    handleStartOver={this.handleStartOver}
                  />
                )}
              </div>
            )}

            <div className="text-container" style={{ marginBottom: '50px' }}>
              {(activeStep === 0 || activeStep === this.STEP_COUNT) && (
                <OtherTools currentTool={this.currentTool} />
              )}
              <Terms />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  accessToken: get(state, 'user.authUser.accessToken')
});
const mapDispatchToProps = {
  postFutureValueResults
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketPlaceFutureValueView);
