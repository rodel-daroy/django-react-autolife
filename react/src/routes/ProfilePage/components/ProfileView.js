import React, { Component } from "react";
import { reduxForm } from "redux-form";
import MySavedCars from "./Section/MySavedCars";
import PersonalInformation from "./Section/PersonalInformation";
import CommunicationPrefernces from "./Section/CommunicationPrefernces";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import AnchorNav from "../../../components/Navigation/AnchorNav";
import Breadcrumbs, {
  RouterBreadcrumbs
} from "../../../components/Navigation/Breadcrumbs";
import PrimaryButton from "../../../components/Forms/PrimaryButton";
import EditChoices from "./Section/EditChoices";
import get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";
import { getProfile } from "../../../redux/actions/userActions";
import CommandBar from "../../../components/common/CommandBar";
import { withRouter } from "react-router-dom";
import ArticleMetaTags from "../../../components/common/ArticleMetaTags";
import "./style.scss";
import sortBy from "lodash/sortBy";
import { showNotification } from "../../../redux/actions/notificationAction";
import {
  getUserInformation,
  updateProfile,
  deleteSavedCar,
  updateBrand,
  updateSubjectInterest
} from "../../../redux/actions/profileActions";

import { setInitialPageLoadedAction } from "../../../redux/actions/layoutActions";

class ProfileView extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { setInitialPageLoaded, getUserInformation } = this.props;

    setInitialPageLoaded();

    getUserInformation(get(this.props, "user.authUser.accessToken"));
  }

  componentWillReceiveProps(nextProps) {
    const { userInfo, dirty, change } = this.props;

    if (nextProps.userInfo && nextProps.userInfo !== userInfo) {
      const { initialize, userInfo, touch } = nextProps;

      let initialValues = cloneDeep(userInfo);
      if (initialValues.personal_information) {
        const password = {
          old_password: "",
          password: "",
          confirm_password: ""
        };

        initialValues.personal_information = Object.assign(
          initialValues.personal_information,
          password
        );
      }

      if (initialValues.saved_cars) {
        for (let car of initialValues.saved_cars) car.remove = false;
      }

      initialize(initialValues);
      touch("personal_information.old_password");
    }

    if (!nextProps.dirty && dirty) {
      this.setState({
        editingBrands: false,
        editingSubjects: false
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.initialized && !prevProps.initialized) {
      const { location } = this.props;

      if (location.hash && location.hash.length > 1) {
        document.querySelector(location.hash).scrollIntoView();
      }
    }
  }

  deleteCars = (values, accessToken) => {
    const { deleteSavedCar } = this.props;

    const removeCars = values.saved_cars.filter(car => car.remove);

    let promises = [];

    for (let car of removeCars) {
      promises.push(deleteSavedCar(car.id, accessToken));
    }

    return Promise.all(promises).then(values => {
      for (let value of values) {
        if (!value.payload) return Promise.reject(new Error());
      }

      return Promise.resolve({ payload: true });
    });
  };

  updateSubjects = (values, accessToken) => {
    const { updateSubjectInterest } = this.props;

    const subjects = values.lifestyle.subjects_that_interests.map(subject => ({
      interest_id: subject.id,
      value: subject.is_checked
    }));

    return updateSubjectInterest({ interests: subjects }, accessToken).then(
      result => {
        if (result.payload) return Promise.resolve(result);
        else return Promise.reject(new Error());
      }
    );
  };

  updateBrands = (values, accessToken) => {
    const { updateBrand } = this.props;

    const brands = values.lifestyle.brands_following.map(brand => ({
      brand_id: brand.id,
      value: brand.is_checked
    }));

    return updateBrand({ brands }, accessToken).then(result => {
      if (result.payload) return Promise.resolve(result);
      else return Promise.reject(new Error());
    });
  };

  update = (values, accessToken) => {
    const { updateProfile, oldPassword } = this.props;

    const profile = {
      ...values.personal_information,
      ...values.communication_preferences,
      contact_num: values.communication_preferences.contact
    };

    return updateProfile(profile, accessToken).then(result => {
      if (!result.payload) return Promise.reject(new Error());
      else return Promise.resolve(result);
    });
  };

  onSubmit = values => {
    const { oldPassword, showNotification } = this.props;
    const accessToken = get(this.props, "user.authUser.accessToken");
    const checkPassword = oldPassword == 200 ? true : false;
    if (values.personal_information.old_password) {
      if (checkPassword) {
        this.updateProfileData(values, accessToken);
      } else {
        showNotification({
          message: "Old Password does not matched",
          type: "ERROR"
        });
      }
    } else {
      this.updateProfileData(values, accessToken);
    }
  };

  updateProfileData = (values, accessToken) => {
    const { getUserInformation, getProfile, showNotification } = this.props;
    return this.update(values, accessToken)
      .then(() => this.deleteCars(values, accessToken))
      .then(() => this.updateSubjects(values, accessToken))
      .then(() => this.updateBrands(values, accessToken))
      .then(() => {
        showNotification({
          message: "Profile updated successfully"
        });

        getUserInformation(accessToken);
        getProfile(accessToken);
      })
      .catch(() => {
        showNotification({
          message: "Profile update failed",
          type: "ERROR"
        });
      });
  };

  handleReset = () => {
    const { reset } = this.props;

    reset();

    this.setState({
      editingBrands: false,
      editingSubjects: false
    });
  };

  render() {
    const {
      user,
      loading,
      updating,
      handleSubmit,
      submitting,
      userInfo,
      initialized,
      dirty
    } = this.props;
    const { editingBrands, editingSubjects } = this.state;

    let brands = [];
    let subjects = [];
    if (userInfo && userInfo.lifestyle) {
      brands = userInfo.lifestyle.brands_following;
      subjects = userInfo.lifestyle.subjects_that_interests;
    }
    return (
      <form
        ref={ref => (this._container = ref)}
        className="home-page page-container content-container offset-header"
        onSubmit={handleSubmit(this.onSubmit)}
      >
        <ArticleMetaTags title="My profile" />

        <article style={{ flexGrow: 1 }} className="text-container">
          <header className="settings-header">
            <RouterBreadcrumbs />

            <h1>My Profile</h1>
            {/*<p>
              Tousled food truck polaroid, salvia bespoke small batch Pinterest
              Marfa.
            </p>*/}
          </header>

          <div className="settings-container">
            <div className="settings-inner">
              <div className="settings-sidebar">
                <AnchorNav>
                  <AnchorNav.Link
                    name="Personal Information"
                    anchor="personal-info"
                  />
                  <AnchorNav.Link
                    name="Communication Preferences"
                    anchor="communication"
                  />
                  <AnchorNav.Link name="My Saved Cars" anchor="saved-cars" />
                  <AnchorNav.Link
                    name="Trends I'm Following"
                    anchor="subjects"
                  />
                  <AnchorNav.Link name="Brands I'm Following" anchor="brands" />
                </AnchorNav>
              </div>
              <div
                className={`settings-content ${!initialized ? "loading" : ""}`}
              >
                <fieldset disabled={submitting || updating}>
                  <div id="personal-info" className="anchor">
                    <PersonalInformation changeField={this.props.change} />
                  </div>
                  <div id="communication" className="anchor">
                    <CommunicationPrefernces />
                  </div>
                  <div id="saved-cars" className="anchor">
                    <MySavedCars />
                  </div>
                  <div id="subjects" className="anchor">
                    <EditChoices
                      title={
                        <div>
                          <h3>Trends I'm Following</h3>
                        </div>
                      }
                      choices={subjects}
                      fieldName="lifestyle.subjects_that_interests"
                      submitting={submitting}
                      editing={editingSubjects}
                      onEdit={() => this.setState({ editingSubjects: true })}
                    />
                  </div>
                  <div id="brands" className="anchor">
                    <EditChoices
                      title={
                        <div>
                          <h3>Brands I'm Following</h3>
                        </div>
                      }
                      alpha
                      choices={brands}
                      fieldName="lifestyle.brands_following"
                      submitting={submitting}
                      editing={editingBrands}
                      onEdit={() => this.setState({ editingBrands: true })}
                    />
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </article>

        <CommandBar active={dirty}>
          <div className="settings-commands">
            <div className="settings-commands-inner">
              <ul className="commands">
                <li>
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={this.handleReset}
                    disabled={submitting || updating}
                  >
                    <span className="icon icon-x" /> Cancel
                  </button>
                </li>
                <li>
                  <PrimaryButton
                    type="submit"
                    onClick={this.handleUpdate}
                    disabled={submitting || updating}
                  >
                    Update
                  </PrimaryButton>
                </li>
              </ul>
            </div>
          </div>
        </CommandBar>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    userInfo: state.profile.userInfo,
    user: state.user,
    loading: state.profile.loading,
    updating: state.profile.updating,
    oldPassword: state.profile.oldPassword,
    initialPageLoaded: state.layout.initialPageLoaded
  };
}
const mapDispatchToProps = {
  getUserInformation,
  updateProfile,
  deleteSavedCar,
  updateBrand,
  updateSubjectInterest,
  setInitialPageLoaded: setInitialPageLoadedAction,
  getProfile,
  showNotification
};

function validate(values) {
  let errors = {
    personal_information: {}
  };

  if (values.personal_information && values.personal_information.password) {
    if (values.personal_information.old_password === "") {
      errors.personal_information.old_password = "Please enter old password";
    }

    if (
      values.personal_information.password !==
      values.personal_information.confirm_password
    ) {
      errors.personal_information.confirm_password =
        "New password and confirm password should be the same";
    }
  }

  return errors;
}

ProfileView = reduxForm({
  form: "ProfileView",
  validate
})(ProfileView);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProfileView)
);
