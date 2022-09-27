import React from "react";
import { connect } from "react-redux";
import PrimaryButton from "../../../components/Forms/PrimaryButton";
import { reduxForm, Field } from "redux-form";
import { required, email, phoneNumber } from "../../../utils/validations";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";
import { ReduxTextField } from "../../../components/Forms/TextField";
import { ReduxTextAreaField } from "../../../components/Forms/TextAreaField";
import { postContactFormData } from "../../../redux/actions/contactActions";
import ArticleMetaTags from "../../../components/common/ArticleMetaTags";
import { showNotification } from "../../../redux/actions/notificationAction";
import Breadcrumbs from "../../../components/Navigation/Breadcrumbs";
import "./style.scss";

class ContactUsView extends React.Component {
  updateContactForm = values => {
    const { postContactFormData, history, showNotification } = this.props;
    postContactFormData(values).then(data => {
      showNotification({
        message: "Thank you, Your message has been sent"
      });
      history.push("/");
    });
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="content-container offset-header">
        <ArticleMetaTags title="Contact us" />

        <div className="text-container">
          <Breadcrumbs>
            <Breadcrumbs.Crumb name="Contact us" />
          </Breadcrumbs>

          <div className="contact-us">
            <h1>Contact us</h1>
            <h2>
              Fill out the form below and we'll get back to you as soon as
              possible.
            </h2>
            <form
              className="contact-us-form"
              onSubmit={handleSubmit(this.updateContactForm)}
            >
              <Field
                component={ReduxTextField}
                name="first_name"
                label="First Name"
                type="text"
                placeholder="First Name"
                validate={[required]}
              />
              <Field
                component={ReduxTextField}
                name="last_name"
                label="Last Name"
                type="text"
                placeholder="Last Name"
                validate={[required]}
              />
              <Field
                component={ReduxTextField}
                name="email"
                label="Email"
                type="text"
                placeholder="Email"
                validate={[required, email]}
              />
              <Field
                component={ReduxTextField}
                name="mobile"
                label="Mobile (optional)"
                type="text"
                placeholder="Mobile Number"
                validate={[phoneNumber]}
              />
              <Field
                component={ReduxTextAreaField}
                name="text"
                label="How can we help you?"
                rows="3"
                validate={[required]}
              />

              <div className="contact-us-address">
                <p>
                  <strong>AUTOLIFE INC.</strong>
                </p>
                <p>50 Leek Crescent, Suite 2B</p>
                <p>Richmond Hill, Ontario, L4B 4J3</p>
              </div>

              <PrimaryButton size="large" type="submit">
                Submit
              </PrimaryButton>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
const mapDispatchToProps = {
  postContactFormData,
  showNotification
};

ContactUsView = reduxForm({
  form: "ContactUsView"
})(ContactUsView);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ContactUsView)
);
