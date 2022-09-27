import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import { Portal } from "react-portal";
import RadialButton from "../Forms/RadialButton";
import { mediaQueryString } from "../../utils/style";
import PrimaryButton from "../../components/Forms/PrimaryButton";
import { toggleScrolling } from "../../redux/actions/layoutActions";
import { connect } from "react-redux";
import { getScrollParent } from "../../utils";

Modal.setAppElement("#root");

const getMobileModalContainer = () =>
  document.querySelector("#mobile-modal-container");

class ResponsiveModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobile: null
    };
  }

  componentDidMount() {
    const { fullScreenMobile } = this.props;

    this._mediaQuery = window.matchMedia(mediaQueryString("xs"));
    this._mediaQuery.addListener(this.handleQuery);

    this.handleQuery(this._mediaQuery);

    if (this._mediaQuery.matches && fullScreenMobile) {
      const scrollParent = getScrollParent(getMobileModalContainer());
      scrollParent.scrollTop = scrollParent.scrollLeft = 0;
    }

    setTimeout(() => this.updateScrolling());
  }

  componentWillUnmount() {
    this._mediaQuery.removeListener(this.handleQuery);

    this.updateScrolling(true);

    this.handleQuery({ matches: false });
  }

  handleQuery = e => {
    const { mobile } = this.state;

    if (mobile !== e.matches)
      this.setState({
        mobile: e.matches
      });
  };

  updateScrolling(scrolling = null) {
    if (scrolling == null)
      scrolling = !!this.state.mobile && this.props.fullScreenMobile;

    this.props.toggleScrolling(scrolling);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.mobile !== prevState.mobile) {
      this.updateScrolling();
    }
  }

  renderModalContent = mobile => {
    const {
      children,
      showClose,
      closePosition,
      closeSize,
      fullWidth,
      className,
      closeText
    } = this.props;

    return (
      <div
        className={`responsive-modal-inner ${className || ""} ${
          fullWidth ? "full-width" : ""
        } ${mobile ? "full-screen" : ""}`}
      >
        {showClose && (
          <nav className={`responsive-modal-close ${closePosition}`}>
            {!mobile && (
              <RadialButton
                size={closeSize}
                className="close-button"
                onClick={this.handleClose}
                aria-label="Close"
              >
                <span className="icon icon-x" />
              </RadialButton>
            )}

            {mobile && (
              <PrimaryButton
                className="mobile-back-button"
                size="medium"
                onClick={this.handleClose}
                aria-label={closeText}
              >
                <span className="icon icon-angle-left" /> {closeText}
              </PrimaryButton>
            )}
          </nav>
        )}

        <div className="responsive-modal-content">{children}</div>
      </div>
    );
  };

  handleClose = e => {
    const { onClose } = this.props;

    e.stopPropagation();

    if (onClose) onClose();
  };

  render() {
    const { onClose, fullScreenMobile, overlayClassName } = this.props;
    const { mobile } = this.state;

    if (mobile && fullScreenMobile) {
      const node = getMobileModalContainer();

      return <Portal node={node}>{this.renderModalContent(true)}</Portal>;
    } else {
      return (
        <Modal
          isOpen
          className={{
            base: "responsive-modal",
            afterOpen: "",
            beforeClose: "closing"
          }}
          overlayClassName={{
            base: `modal-overlay ${overlayClassName || ""}`,
            afterOpen: "",
            beforeClose: "closing"
          }}
          onRequestClose={onClose}
          closeTimeoutMS={500}
        >
          {this.renderModalContent(false)}
        </Modal>
      );
    }
  }
}

ResponsiveModal.propTypes = {
  children: PropTypes.node,
  allowClose: PropTypes.bool,
  onClose: PropTypes.func,
  showClose: PropTypes.bool,
  closePosition: PropTypes.oneOf(["top-right", "bottom-right"]),
  closeSize: RadialButton.propTypes.size,
  fullWidth: PropTypes.bool,
  fullScreenMobile: PropTypes.bool,
  className: PropTypes.string,
  overlayClassName: PropTypes.string,
  closeText: PropTypes.string
};

ResponsiveModal.defaultProps = {
  allowClose: true,
  showClose: true,
  closePosition: "top-right",
  closeSize: "large",
  closeText: "Back"
};

ResponsiveModal.Block = props => {
  const { children, className, grey, position } = props;
  const Component =
    props.component || (position === "header" ? "header" : "div");

  return (
    <Component
      className={`responsive-modal-block ${position || ""} ${
        grey ? "grey" : ""
      } ${className || ""}`}
    >
      {children}
    </Component>
  );
};

ResponsiveModal.Block.propTypes = {
  className: PropTypes.string,
  component: PropTypes.any,
  position: PropTypes.oneOf(["left", "top", "right", "bottom", "header"]),
  grey: PropTypes.bool
};

ResponsiveModal.Block.defaultProps = {};

ResponsiveModal.Block.displayName = "ResponsiveModal.Block";

export default connect(
  null,
  { toggleScrolling }
)(ResponsiveModal);
