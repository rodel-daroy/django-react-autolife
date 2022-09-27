import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CBBTOOLS } from '../../../../config/constants';
import Breadcrumbs from '../../../../components/Navigation/Breadcrumbs';
import StepSlider from '../../../../components/Navigation/StepSlider';
// import PropDump from 'components/Debugging/PropDump';
//import AdBanner from 'components/advertising/AdBanner';
import { postTradeInValueStepTwo } from '../../../../redux/actions/carWorthAction';
import { getScrollParent } from '../../../../utils';
import Terms from './../components/Terms';
import OtherTools from './../components/OtherTools';
import StepOne from './../components/StepOne';
import StepTwo from './../components/StepTwo';
import ToolsASpot from './../components/ToolsASpot';
import StepThree from './components/StepThree';
import StepFour from './components/StepFour';
import Results from './components/Results';
import headerImage from './img/header.png';
import get from 'lodash/get';
import ArticleMetaTags from '../../../../components/common/ArticleMetaTags';
import './../style.scss';

class MarketPlaceTradeInView extends Component {
  constructor(props) {
    super(props);
    let currentStep = 0;
    this.STEP_COUNT = 2; // NOTE currently we are using only step 2. Step 3 and 4 are not being used, but could be used later //4
    this.currentTool = CBBTOOLS.TRADEIN;
    const {
      match: {
        params: {
          year,
          make,
          model,
          trim,
          bodystyle,
          postalcode,
          current_kilometers
        }
      }
    } = props; // eslint-disable-line
    if (
      year &&
      make &&
      model &&
      trim &&
      bodystyle &&
      postalcode &&
      current_kilometers
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
      current_kilometers // eslint-disable-line
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
    this.setState({ ...values, activeStep: nextStep });
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
        current_kilometers
      } = values; // eslint-disable-line
      const { accessToken } = this.props;
      this.props.postTradeInValueStepTwo(
        {
          year,
          make,
          model,
          option,
          trim: trim.value,
          body_style: body_style.value,
          postal_code,
          current_kilometers
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

  selectCar = ({ year, make, model }) => {
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
      option,
      addOns,
      deducts
    } = this.state; // eslint-disable-line
    return (
      <div className="toolsPage">
        <ArticleMetaTags title="Trade-in Value" />

        <div
          className={`page-width content-container ${
            activeStep > 0 ? 'offset-header' : ''
          }`}
        >
          {activeStep === 0 && (
            <ToolsASpot image={headerImage} title="Trade-in Value" />
          )}
          <div ref={ref => (this.contentContainer = ref)}>
            <div className="text-container">
              <Breadcrumbs>
                <Breadcrumbs.Crumb link="/market-place" name="Marketplace" />
                <Breadcrumbs.Crumb name="Trade-in Value" />
              </Breadcrumbs>
            </div>
            {activeStep === 0 && (
              <StepOne
                currentTool={this.currentTool}
                selectCar={this.selectCar}
                className="animated fadeIn"
              />
            )}
            {activeStep > 0 && (
              <div className="text-container">
                <h1>
                  Canadian black book Trade-In value for a {year} {make} {model}
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
                          showPostal={false}
                          showMileage
                          showEstimatedMileage={false}
                          showDeducts
                        />
                      )}
                      {activeStep === 2 && (
                        <StepThree
                          onContinueNextStep={this.onContinueNextStep}
                          year={year}
                          make={make}
                          model={model}
                          option={option}
                        />
                      )}
                      {activeStep === 3 && (
                        <StepFour
                          onContinueNextStep={this.onContinueNextStep}
                          year={year}
                          make={make}
                          model={model}
                          option={option}
                        />
                      )}
                    </div>
                    {/*<div className="adAreaColumn">
                    <AdBanner width="300px" height="300px" style={{ margin: '0' }} />
                  </div>*/}
                  </div>
                )}
                {activeStep === this.STEP_COUNT && (
                  <div className="resultsContainer">
                    <div className="resultsContainer-item">
                      <Results
                        resultsData={{
                          year,
                          make,
                          model,
                          trim,
                          bodystyle,
                          postalcode,
                          current_kilometers,
                          addOns,
                          deducts
                        }}
                        handleStartOver={this.handleStartOver}
                      />
                    </div>
                  </div>
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
  postAvgPriceData: state.carWorth.postAvgPriceData,
  accessToken: get(state, 'user.authUser.accessToken')
});
const mapDispatchToProps = {
  postTradeInValueStepTwo
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketPlaceTradeInView);
