import React from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import Logo from "components/common/Logo";
import ResponsiveModal from "components/common/ResponsiveModal";
import { closeModal } from "redux/actions/userContainerActions";

class VerifyEmailModal extends React.Component {
  handleClose = () => {
    const { location, history, closeModal } = this.props;

    if(location.pathname === "/softregistration")
      history.push("/");
    else
      closeModal();
  }

  render() {
    return (
      <ResponsiveModal
        className="forgot-password-modal"
        onClose={this.handleClose}
        fullScreenMobile
      >
        <ResponsiveModal.Block>
          <div className="forgot-password">
            <div className="forgot-password-inner">
              <Logo kind="Symbol-Colour" noLink />
              <h2>Confirmation email sent</h2>
              <h2 style={{ fontSize: "20px" }}>
                Please check your email and confirm your email address
              </h2>
            </div>
          </div>
        </ResponsiveModal.Block>
      </ResponsiveModal>
    );
  }
}

const mapDispatchToProps = {
  closeModal
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(VerifyEmailModal)
);
