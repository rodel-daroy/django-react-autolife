import React from "react";
import { connect } from "react-redux";
import ResponsiveModal from "components/common/ResponsiveModal";
import PrimaryButton from "components/Forms/PrimaryButton";
import get from "lodash/get";
import Logo from "components/common/Logo";
import Media from "react-media";
import { mediaQuery } from "utils/style";

const ConfirmMessageModal = props => {
  const { modalIsOpen, closeModal, accessToken } = props;

  console.log(modalIsOpen, "mdo");

  if (modalIsOpen) {
    return (
      <ResponsiveModal onClose={closeModal} fullScreenMobile>
        <Media query={mediaQuery("xs sm md")}>
          {matches => (
            <div className="confirm-dealer-modal">
              <ResponsiveModal.Block position={matches ? "header" : "left"}>
                <div className="responsive-modal-title">
                  <h1>
                    <span className="icon icon-email-tick" /> Thank you!
                  </h1>
                  <h2>A dealer representative will be in touch shortly</h2>
                </div>
              </ResponsiveModal.Block>

              <ResponsiveModal.Block
                position={matches ? "bottom" : "right"}
                grey
              >
                <div>
                  <Logo kind="Stacked-Colour" noLink />
                  {!accessToken && (
                    <PrimaryButton
                      link="?register"
                      className="btn btn-link"
                    >
                      Sign Up For AutoLife{" "}
                      <span className="icon icon-angle-right" />
                    </PrimaryButton>
                  )}
                </div>
              </ResponsiveModal.Block>
            </div>
          )}
        </Media>
      </ResponsiveModal>
    );
  } else return null;
};

function mapStateToProps(state) {
  const accessToken = get(state, "user.authUser.accessToken");

  return {
    accessToken
  };
}

export default connect(
  mapStateToProps,
  null
)(ConfirmMessageModal);
