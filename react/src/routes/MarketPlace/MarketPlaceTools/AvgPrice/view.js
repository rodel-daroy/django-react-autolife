import React, { Component } from 'react';
import { connect } from 'react-redux';

import Breadcrumbs from '../../../../components/Navigation/Breadcrumbs';
import StepSlider from '../../../../components/Navigation/StepSlider';
// import PropDump from 'components/Debugging/PropDump';
//import AdBanner from 'components/advertising/AdBanner';
import { postAvgPriceResult } from '../../../../redux/actions/carWorthAction';
import { CBBTOOLS } from '../../../../config/constants';
import { getScrollParent } from '../../../../utils';
import Terms from './../components/Terms';
import OtherTools from './../components/OtherTools';
import StepTwo from './../components/StepTwo';
import ToolsASpot from './../components/ToolsASpot';
import StepOne from './../components/StepOne';
import Results from './components/Results';
import get from 'lodash/get';
import headerImage from './img/header.png';
import { withRouter } from 'react-router-dom';
import ArticleMetaTags from '../../../../components/common/ArticleMetaTags';

import './../style.scss';

class MarketPlaceAvrgPriceView extends Component {
  constructor(props) {
    super(props);
    let currentStep = 0;
    this.STEP_COUNT = 2;
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
    this.currentTool = CBBTOOLS.AVERAGEPRICE;
    this.state = {
      activeStep: currentStep,
      year,
      make,
      model,
      trim,
      bodystyle,
      postalcode,
      addOn: null, // eslint-disable-line
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
    const { accessToken } = this.props;
    if (nextStep === this.STEP_COUNT) {
      const { year, make, model } = this.state;
      const {
        option,
        trim,
        bodystyle: body_style,
        postalcode: postal_code,
        current_kilometers
      } = values; // eslint-disable-line
      this.props.postAvgPriceResult(
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
      addOns,
      deducts
    } = this.state;
    return (
      <div className="toolsPage">
        <ArticleMetaTags title="Average Asking Price" />

        <div
          className={`page-width content-container ${
            activeStep > 0 ? 'offset-header' : ''
          }`}
        >
          {activeStep === 0 && (
            <ToolsASpot image={headerImage} title="Average Asking Price" />
          )}
          <div ref={ref => (this.contentContainer = ref)}>
            <div className="text-container">
              <Breadcrumbs>
                <Breadcrumbs.Crumb link="/market-place" name="Marketplace" />
                <Breadcrumbs.Crumb name="Average Asking Price" />
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
                  Canadian Black Book Average Asking Price for a {year} {make}{' '}
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
                          showMileage={false}
                          showDeducts={false}
                        />
                      )}
                    </div>
                    {/*<div className="adAreaColumn">
                    <AdBanner width="300px" height="300px" style={{ margin: '0' }} />
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
  postAvgPriceData: state.carWorth.postAvgPriceData,
  accessToken: get(state, 'user.authUser.accessToken')
});
const mapDispatchToProps = {
  postAvgPriceResult
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketPlaceAvrgPriceView)
);
