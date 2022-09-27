import React, { Component } from "react";
import PropTypes from "prop-types";
import omit from "lodash/omit";
import { resizeImageUrl } from "../../utils";
import ObjectFit from "../common/ObjectFit";

let id = 0;

export const toggleButtonProps = {
  caption: PropTypes.string,
  image: PropTypes.string,
  roundImage: PropTypes.bool,
  dark: PropTypes.bool,
  pulse: PropTypes.bool,
  subHeading: PropTypes.string
};

export default class ToggleButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: `toggle-${id++}`
    };
  }

  render() {
    const { caption, image, roundImage, dark, pulse, subHeading } = this.props;
    let id = this.props.id || this.state.id;
    return (
      <div
        className={`toggle-button ${dark ? "dark" : "light"} ${
          pulse ? "pulse" : ""
        }`}
      >
        <input
          id={id}
          type="checkbox"
          {...omit(this.props, Object.keys(toggleButtonProps))}
        />
        <label htmlFor={id}>
          <div className="toggle-button-image">
            <div className="toggle-button-image-inner">
              <ObjectFit fit="contain">
                <img
                  role="presentation"
                  className={roundImage ? "round" : ""}
                  src={resizeImageUrl(image, 50, 50)}
                />
              </ObjectFit>
            </div>
          </div>
          <div className="toggle-button-caption">
            <div>{caption}</div>
            {subHeading && <p>{subHeading}</p>}
          </div>
          <div className="toggle-button-check">
            <span className="icon icon-checkmark" />
            <span className="icon icon-x" />
          </div>
        </label>
      </div>
    );
  }
}

ToggleButton.propTypes = {
  caption: PropTypes.string,
  image: PropTypes.string,
  roundImage: PropTypes.bool,
  dark: PropTypes.bool,
  pulse: PropTypes.bool,
  subHeading: PropTypes.string
};

const makeReduxToggleButton = WrappedComponent => {
  const component = props => {
    const { input, meta } = props;
    const fieldProps = {
      ...input
    };
    const innerProps = omit(props, [
      "meta",
      "input",
      ...Object.keys(fieldProps)
    ]);

    return (
      <WrappedComponent {...innerProps} {...fieldProps} checked={input.value} />
    );
  };

  component.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    ...WrappedComponent.propTypes
  };

  component.defaultProps = {
    ...WrappedComponent.defaultProps
  };

  component.displayName = `Redux${WrappedComponent.name}`;

  return component;
};

const ReduxToggleButton = makeReduxToggleButton(ToggleButton);

export { ReduxToggleButton };
