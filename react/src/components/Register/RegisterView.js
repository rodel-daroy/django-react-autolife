import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PrimaryButton from "components/Forms/PrimaryButton";
import ImageRadioButton from "components/Forms/ImageRadioButton";
import Animate from "components/Animation/Animate";
import AnimationContainer from "components/Animation/AnimationContainer";
import { AnimationOptions } from "components/Animation";
import RegisterPage from "./RegisterPage";
import RegisterSection from "./RegisterSection";
import omit from "lodash/omit";
import range from "lodash/range";
import sortBy from "lodash/sortBy";
import get from "lodash/get";
import RegisterSliderPanel from "./RegisterSliderPanel";
import { ReduxTextField } from "components/Forms/TextField";
import RegisterChoicesPanel from "./RegisterChoicesPanel";
import RegisterRadioGroup from "./RegisterRadioGroup";
import step1 from "styles/img/step1.jpg";
import step2 from "styles/img/timer-bg.jpg";
import step3 from "styles/img/black-bg.jpg";
import step4 from "styles/img/banner-image.jpg";
import brand from "styles/img/register/panels/brand_img.jpg";
import lifeStyle from "styles/img/register/panels/lifestyle_img.jpg";
import offers from "styles/img/register/panels/offers_img.jpg";
import { ReduxPasswordField } from "components/Forms/PasswordField";
import Loader from "components/common/Loader";
import { connect } from "react-redux";
import Google from "components/Social/Google";
import { Field, reduxForm } from "redux-form";
import { required, isNumber, email, alphabets } from "utils/validations";
import {
  changeHeaderLayoutAction,
  changeFooterLayoutAction,
  showHeaderStepperAction,
  changeHeaderStepperAction,
  setInitialPageLoadedAction,
  setParallax
} from "redux/actions/layoutActions";
import { modalVerifyPassword } from "redux/actions/userContainerActions";
import {
  HEADER_LAYOUT_TYPES,
  FOOTER_LAYOUT_TYPES
} from "config/constants";
import { getScrollParent } from "utils";
import {
  getQuestions,
  getBrands,
  getOffers,
  getLifeStyle
} from "redux/actions/RegistrationAction";
// import SignInModal from "components/User/SignInModal";
import ArticleMetaTags from "components/common/ArticleMetaTags";
import {
  socialLogin,
  registerUser
  // resetErrorMessage
} from "redux/actions/userActions";
import Facebook from "components/Social/Facebook";
const STEP_COUNT = 8;

const passwordsMatch = (value, values) => {
  if (values.password === values.c_password) {
    return undefined;
  }

  return "Please enter same password";
};

const FacebookButton = props => (
  <PrimaryButton
    dark
    className={`facebook social-button ${props.className || ""}`}
    {...omit(props, ["className"])}
  >
    <PrimaryButton.Icon className="icon-facebook social-icon" />
    Facebook
  </PrimaryButton>
);

const GoogleButton = props => (
  <PrimaryButton
    dark
    className={`social-button ${props.className || ""}`}
    {...omit(props, ["className"])}
  >
    <PrimaryButton.Icon className="icon-google social-icon" />
    Google
  </PrimaryButton>
);

class RegisterView extends Component {
  constructor(props) {
    super(props);
    // change the header
    const {
      changeHeaderLayout,
      changeFooterLayout,
      changeHeaderStepper,
      showHeaderStepper
    } = this.props;
    this.stepperSettings = { start: 1, end: 6, current: 0 };
    changeHeaderLayout(HEADER_LAYOUT_TYPES.SOFTREGISTRATION);
    changeFooterLayout(FOOTER_LAYOUT_TYPES.SOFTREGISTRATION);
    changeHeaderStepper(this.stepperSettings);
    showHeaderStepper(true);
    //
    this.selectOption = false;
    this.firstQuestion = true;
    this.loadSuccess = true;

    this.state = {
      activeStep: 0,
      enteredStep: 0,
      previousStep: 0,

      activePage: 0,

      activeParallax: 0,

      brandChoices: [],
      offerChoices: [],
      lifestyleChoices: [],
      brands: [],
      offers: [],
      lifestyle: [],
      isSelected: true,
      showHeader: false
    };

    this.updateParallax();
  }

  componentDidMount() {
    const {
      getQuestions,
      getBrands,
      getLifeStyle,
      getOffers,
      setInitialPageLoaded
    } = this.props;

    setInitialPageLoaded();

    getQuestions({});
    getBrands(get(this.props, "user.authUser.accessToken"));
    getLifeStyle(get(this.props, "user.authUser.accessToken"));
    getOffers(get(this.props, "user.authUser.accessToken"));
  }

  updateDOM = () => {
    if (
      this.loadSuccess &&
      this.props.brands &&
      this.props.lifestyle &&
      this.props.offers
    ) {
      const { brands, lifestyle, offers } = this.props;
      console.log(brands, "brands");
      const brandChoices = brands
        ? brands.data.map(brand => ({
            name: brand.name,
            image: brand.logo,
            id: brand.id
          }))
        : [];
      const lifestyleChoices = lifestyle
        ? lifestyle.data.map(lifestyle => ({
            name: lifestyle.name,
            image: lifestyle.image,
            id: lifestyle.id,
            subHeading: lifestyle.tag_line
          }))
        : [];
      const offerChoices = offers
        ? offers.data.map(offer => ({
            name: offer.name,
            image: offer.image_url,
            id: offer.id
          }))
        : [];
      this.setState({
        brandChoices: brandChoices,
        lifestyleChoices: lifestyleChoices,
        offerChoices: offerChoices
      });
      this.loadSuccess = false;
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { changeHeaderLayout, changeFooterLayout, setParallax } = this.props;

    this.updateDOM();

    if (
      this.state.activeStep == 8 &&
      prevState.activeStep !== this.state.activeStep
    ) {
      changeHeaderLayout(HEADER_LAYOUT_TYPES.DEFAULT);
      changeFooterLayout(FOOTER_LAYOUT_TYPES.DEFAULT);
    }

    if (this.state.activeParallax !== prevState.activeParallax) {
      this.updateParallax();
    }
  }

  componentWillUnmount() {
    this.props.changeHeaderLayout(HEADER_LAYOUT_TYPES.DEFAULT);
    this.props.changeFooterLayout(FOOTER_LAYOUT_TYPES.DEFAULT);
    this.props.showHeaderStepper(false);
    this.props.setParallax(null);
  }

  handleSliderChange = stop => {
    this.setState({ slider: stop, isSelected: true });
  };

  handleNext = () => {
    const { activeStep, enteredStep } = this.state;
    if (activeStep === enteredStep) {
      this.setState({
        activeStep: this.state.activeStep + 1,
        previousStep: this.state.activeStep,
        isSelected: false
      });
      this.stepperSettings.current = this.state.activeStep + 1; // We shouldn't use local state - RichT
      this.props.changeHeaderStepper(this.stepperSettings);
    }
  };

  nextShow = () => {
    this.firstQuestion = false;
    this.selectOption = false;
  };

  handlePrevious = () => {
    const { activeStep, enteredStep } = this.state;

    if (activeStep === enteredStep) {
      this.setState({
        activeStep: this.state.activeStep - 1,
        previousStep: this.state.activeStep,
        isSelected: true
      });
      this.stepperSettings.current = this.state.activeStep + 1; // We shouldn't use local state - RichT
      this.props.changeHeaderStepper(this.stepperSettings);
    }
  };

  updateParallax = () => {
    const { setParallax } = this.props;
    const { activeParallax } = this.state;

    const images = [step1, step2, step3, step4];

    setParallax({
      images,
      activeStep: activeParallax
    });
  };

  handlePageLeft = step => {
    const { activeStep, previousStep } = this.state;

    setTimeout(() => {
      let direction = activeStep - previousStep;
      if (direction === 0) direction = 1;

      this.setState({
        enteredStep: step + direction
      });
    }, 250);

    this.setState({
      activeParallax: activeStep,
      pageHeight: null
    });

    getScrollParent(this._container).scrollTop = 0;
  };

  handleOfferChange = choice => {
    let offersArray = this.getArrayOfIdsCheckboxes(this.state.offers, choice);
    this.setState({
      offers: offersArray,
      isSelected: true
    });
    this.forceUpdate();
  };

  handleLifestyleChange = choice => {
    const lifeStyleArray = this.getArrayOfIdsCheckboxes(
      this.state.lifestyle,
      choice
    );
    this.setState({
      lifestyle: lifeStyleArray,
      isSelected: true
    });
    this.forceUpdate();
  };

  handleBrandChange = choice => {
    const brandsArray = this.getArrayOfIdsCheckboxes(this.state.brands, choice);
    this.setState({
      brands: brandsArray,
      isSelected: true
    });
    this.forceUpdate();
  };

  getArrayOfIdsCheckboxes(arrayOfIds, choice) {
    const newArrayOfIds = arrayOfIds;
    let index;
    choice.checked = !choice.checked;
    if (choice.checked) {
      // add the numerical value of the checkbox to array
      newArrayOfIds.push(+choice.id);
    } else {
      // or remove the value from the unchecked checkbox from the array
      index = newArrayOfIds.indexOf(+choice.id);
      newArrayOfIds.splice(index, 1);
    }
    return newArrayOfIds;
  }

  socialLoginPost = async postData => {
    const { socialLogin } = this.props;
    const { brands, lifestyle, offers } = this.state;

    const response = await socialLogin({
      ...postData,

      brands: brands || [],
      lifestyle: lifestyle || [],
      offers: offers || []
    });

    this.successLoad(response);
  };

  successLoad = resp => {
    if (resp.status == 200)
      this.props.history.push("/");
  };

  submitUserRegister = values => {
    const { registerUser } = this.props;
    values.brands = this.state.brands;
    values.offers = this.state.offers;
    console.log(this.props, "submit-register");
    values.lifestyle = this.state.lifestyle;
    registerUser(values).then(data => {
      if (data.status == 200) {
        console.log(data, "register-data");
        this.setState({
          formData: values
        });
        this.handleNext();
      }
    });
  };

  handleRegistrationFinished = () => {
    // const {
    //   location: { pathname },
    //   history
    // } = this.props;
    // history.push(`${pathname}?verify`);
    this.props.modalVerifyPassword();
  };

  renderSection = step => {
    const animationOptions = new AnimationOptions();

    const { questionObject, user } = this.props;
    console.log(questionObject, "question");
    const { activeStep, enteredStep, openPanel, slider, formData } = this.state;
    const isActive = activeStep === step && enteredStep === step;

    let content, title, footerContent;
    let canSkip = true;
    let showFooter = step < STEP_COUNT - 1;
    let canContinue = false;
    let showContinue = true;

    switch (step) {
      case 0: {
        canContinue = true;
        canSkip = false;
        title = "Sign up for AutoLife";
        content = (
          <div>
            <Animate active={isActive}>
              <div>
                <h2>
                  Autolife is about people and the emotional connection they
                  have with cars.
                </h2>
                <h2>
                  Whether you&rsquo;re a first-time buyer, enthusiast or are
                  fascinated about the future of automobiles in just a few
                  simple steps you can personalize your experience and connect
                  to valuable information and tools that will inspire you.
                </h2>
              </div>
            </Animate>
          </div>
        );

        break;
      }

      case 1: {
        canContinue = typeof slider === "number" && slider >= 0;
        title = questionObject.question
          ? questionObject.question.data.text
          : "";
        const stops = questionObject.question
          ? questionObject.question.data.options
          : [];
        content = (
          <div>
            <Animate active={isActive}>
              <RegisterSliderPanel
                value={slider}
                stops={stops}
                onChange={this.handleSliderChange}
              />
            </Animate>
          </div>
        );

        break;
      }

      case 2: {
        canContinue = !!this.state.option_id2;
        showContinue = false;
        title = questionObject.question
          ? questionObject.question.data.next_question.text
          : "";
        content = (
          <RegisterRadioGroup active={isActive}>
            {questionObject.question
              ? questionObject.question.data.next_question.options.map(
                  (data, i) => {
                    return (
                      <ImageRadioButton
                        key={i}
                        caption={data.text}
                        name={data.text}
                        image={data.image}
                        value={data.text}
                        checked={this.state.option_id2 === data.option_id}
                        onChange={e => {
                          this.setState({
                            option_id2: data.option_id,
                            isSelected: true
                          });

                          this.handleNext();
                        }}
                      />
                    );
                  }
                )
              : ""}
          </RegisterRadioGroup>
        );

        break;
      }

      case 3: {
        canContinue = !!this.state.option_id3;
        showContinue = false;
        title = questionObject.question
          ? questionObject.question.data.next_question.next_question.text
          : "";
        content = (
          <RegisterRadioGroup active={isActive}>
            {questionObject.question
              ? questionObject.question.data.next_question.next_question.options.map(
                  (data, i) => {
                    return (
                      <ImageRadioButton
                        key={i}
                        name={data.text}
                        image={data.image}
                        value={data.text}
                        checked={this.state.option_id3 === data.option_id}
                        onChange={e => {
                          this.setState({
                            option_id3: data.option_id,
                            isSelected: true
                          });

                          this.handleNext();
                        }}
                      />
                    );
                  }
                )
              : ""}
          </RegisterRadioGroup>
        );

        break;
      }

      case 4: {
        const { brands, lifestyle } = this.props;
        title = "Tell us what you're interested in";
        footerContent = (
          <p>
            You can always change these settings in My Profile if you change
            your mind.
          </p>
        );
        canSkip = false;

        canContinue = true;
        content = (
          <div>
            <Animate active={isActive}>
              <RegisterChoicesPanel
                title="Lifestyle"
                subtitle="Select as many trends as you like. We’ll customize the stories that appear on your AutoLife."
                image={lifeStyle}
                choices={sortBy(this.state.lifestyleChoices, "name")}
                onChange={this.handleLifestyleChange}
                large
              />
            </Animate>

            <Animate active={isActive}>
              <RegisterChoicesPanel
                title="Brands"
                subtitle="Select the brands you like. You can change these preferences later if you change your mind."
                image={brand}
                choices={this.state.brandChoices}
                alpha
                onChange={this.handleBrandChange}
              />
            </Animate>
            <Animate active={isActive}>
              <RegisterChoicesPanel
                title="Communications"
                subtitle="Select the types of communications you would like to receive. You can unsubscribe at any time."
                image={offers}
                choices={this.state.offerChoices}
                onChange={this.handleOfferChange}
                last
              />
            </Animate>
          </div>
        );

        break;
      }

      case 5: {
        title = (
          <div>
            <h1>Sign up for Autolife</h1>
            <h2>
              You are 2 clicks away from joining millions of Canadian drivers
              like you.
            </h2>
          </div>
        );
        showFooter = false;

        content = (
          <div className="vertical-form">
            <Animate active={isActive}>
              <Facebook 
                component={FacebookButton}
                onSuccess={this.socialLoginPost} />
            </Animate>
            <Animate active={isActive}>
              <Google
                component={GoogleButton}
                onSuccess={this.socialLoginPost} />
            </Animate>
            <Animate active={isActive} last>
              <PrimaryButton
                dark
                type="button"
                className="social-button"
                onClick={this.handleNext}
              >
                <PrimaryButton.Icon className="icon icon-mail" />
                Email
              </PrimaryButton>
            </Animate>
          </div>
        );

        break;
      }

      case 6: {
        title = (
          <div>
            <h1>Sign up for Autolife</h1>
            <h2>
              You are 2 clicks away from joining millions of Canadian drivers
              like you.
            </h2>
          </div>
        );
        showFooter = false;
        const { registerError, registerMessage } = user;
        const { handleSubmit, submitting } = this.props;
        content = (
          <div className="vertical-form">
            <form onSubmit={handleSubmit(this.submitUserRegister)}>
              <Animate active={isActive}>
                <Field
                  label="First name"
                  component={ReduxTextField}
                  name="first_name"
                  dark
                  validate={[required, alphabets]}
                />
              </Animate>
              <Animate active={isActive}>
                <Field
                  label="Last name"
                  name="last_name"
                  component={ReduxTextField}
                  dark
                  validate={[required, alphabets]}
                />
              </Animate>
              <Animate active={isActive}>
                <Field
                  label="Email"
                  name="email"
                  component={ReduxTextField}
                  type="email"
                  dark
                  validate={[required, email]}
                />
              </Animate>
              <Animate active={isActive}>
                <Field
                  name="password"
                  label="Password"
                  component={ReduxPasswordField}
                  dark
                  validate={[required]}
                  autoComplete="new-password"
                />
              </Animate>
              <Animate active={isActive}>
                <Field
                  name="c_password"
                  label="Confirm password"
                  component={ReduxPasswordField}
                  dark
                  validate={[required, passwordsMatch]}
                  hideMeter
                  autoComplete="new-password"
                />
              </Animate>
              <Animate active={isActive}>
                <Field
                  label="Mobile (optional)"
                  name="tel"
                  component={ReduxTextField}
                  type="phone"
                  dark
                  validate={[isNumber]}
                />
              </Animate>
              {registerError ? (
                <div className="error_message signup_error">
                  {registerMessage}
                </div>
              ) : (
                ""
              )}
              <div className="button-group">
                <Animate active={isActive} last>
                  <PrimaryButton type="submit" dark>
                    Continue <span className="fa fa-angle-right" />
                  </PrimaryButton>
                </Animate>
              </div>
            </form>
          </div>
        );

        break;
      }

      default: {
        title = "We're building your Autolife";
        content = (
          <Animate active={isActive} last>
            <Loader dark play onFinished={this.handleRegistrationFinished} />
          </Animate>
        );

        break;
      }
    }

    return (
      <AnimationContainer
        key={`step-${step}`}
        options={animationOptions}
        onLeft={() => this.handlePageLeft(step)}
      >
        <RegisterSection active={isActive} ref={ref => (this._section = ref)}>
          <RegisterSection.Header active={isActive}>
            {title}
          </RegisterSection.Header>

          {content}

          {showFooter && (
            <RegisterSection.Footer
              isSelected={this.state.isSelected}
              active={isActive}
              onContinue={this.handleNext}
              canSkip={canSkip}
              onSkip={this.handleNext}
              canContinue={canContinue}
              showContinue={showContinue}
            >
              {footerContent}
            </RegisterSection.Footer>
          )}
        </RegisterSection>
      </AnimationContainer>
    );
  };

  handleHeightChange = pageHeight => {
    this.setState({
      pageHeight
    });
  };

  render() {
    const { activeStep, enteredStep, previousStep, pageHeight } = this.state;
    const { brands } = this.props;

    return (
      <div ref={ref => (this._container = ref)} className="page-container">
        <ArticleMetaTags title="Registration" />

        <div className="offset-header">
          <RegisterPage
            onHeightChange={this.handleHeightChange}
            minHeight={pageHeight}
            stepCount={STEP_COUNT}
            activeStep={activeStep}
            changing={activeStep !== enteredStep}
            onPrevious={this.handlePrevious}
            onNext={this.handleNext}
          >
            {range(0, STEP_COUNT).map(i => this.renderSection(i))}
          </RegisterPage>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    questionObject: state.question,
    brands: state.question.brands,
    lifestyle: state.question.lifestyle,
    offers: state.question.offers,
    user: state.user,
    initialPageLoaded: state.layout.initialPageLoaded
  };
}
const mapDispatchToProps = {
  getQuestions,
  getBrands,
  getLifeStyle,
  getOffers,
  socialLogin,
  registerUser,
  modalVerifyPassword,
  // resetErrorMessage,
  changeHeaderLayout: changeHeaderLayoutAction,
  changeFooterLayout: changeFooterLayoutAction,
  showHeaderStepper: showHeaderStepperAction,
  changeHeaderStepper: changeHeaderStepperAction,
  setInitialPageLoaded: setInitialPageLoadedAction,
  setParallax
};

RegisterView = reduxForm({
  form: "RegisterView"
})(RegisterView);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RegisterView)
);

RegisterView.propTypes = {};
