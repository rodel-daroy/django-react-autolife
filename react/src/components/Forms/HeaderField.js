import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TimelineMax } from 'gsap';
import omit from 'lodash/omit';
import { hasAncestor } from 'utils';

export default class HeaderField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      focused: false
    };
  }

  get isCollapsed() {
    return this.props.collapse && !this.state.expanded;
  }

  componentDidMount() {
    this.updateLayout(true);
  }

  componentWillUnmount() {
    if (this._timeline) this._timeline.kill();
  }

  componentDidUpdate() {
    this.updateLayout();
  }

  hideInput = (immediate) => {
    if (this._timeline) this._timeline.kill();

    const timeline = new TimelineMax();

    timeline.to(this._input, 0.5, {
      maxWidth: 0,
      opacity: 0,
      onComplete: () => {
        if (this._input) this._input.value = '';
      }
    });
    timeline.set(this._input, { display: 'none' });

    if (immediate) timeline.seek('+=0', false);

    this._timeline = timeline;
  }

  showInput = (immediate) =>{
    if (this._timeline) this._timeline.kill();

    const { fullWidth } = this.props;

    const timeline = new TimelineMax();

    timeline.set(this._input, { display: 'block' });
    timeline.to(this._input, 0.75, {
      maxWidth: fullWidth ? 2000 : 200,
      opacity: 1
    });

    if (immediate) timeline.seek('+=0', false);

    this._timeline = timeline;

    // this is somehow preventing the collapsed field from opening at present
    //this._input.focus()
  }

  updateLayout = (immediate) => {
    if (this.isCollapsed) {
      this.hideInput(immediate);
    } else {
      this.showInput(immediate);
    }
  }

  handleButtonClick = (e) => {
    e.preventDefault();
    const { onSubmit } = this.props;

    if (!this.isCollapsed) {
      const value = this._input.value;

      this.setState({
        expanded: false
      });

      onSubmit(value);
    } else {
      this.setState({
        expanded: !this.state.expanded
      });
    }

    e.preventDefault();
  }

  handleFocus = (e) => {
    this.setState({
      focused: true
    });
  }

  handleBlur = (e) => {
    if (e.relatedTarget !== this._button) {
      this.setState({
        focused: false,
        expanded: false
      });
    }
  }

  handleFormFocus = () =>  this.setState({ formFocused: true });

  handleFormBlur = e => {
    const { onChange } = this.props;

    if(!e.relatedTarget || !hasAncestor(this._form, e.relatedTarget)) {
      this._input.value = '';

      if(onChange)
        onChange('');

      this.setState({ formFocused: false });
    }
  }

  render() {
    const {
      iconClassName,
      placeholder,
      caption,
      showCaption,
      black,
      animationRef,
      fullWidth,
      validate,
      onChange,
      onBlur,
      onFocus,
      error
    } = this.props;
    const { focused, formFocused } = this.state;

    const formRef = ref => {
      this._form = ref;
      if(animationRef)
        animationRef(ref);
    };

    return (
      <form
        ref={formRef}
        className={`header-field ${this.isCollapsed ? 'collapsed' : ''} ${black
          ? 'black'
          : ''} ${fullWidth ? 'full-width' : ''}`}
        onSubmit={this.handleButtonClick}
        onFocus={this.handleFormFocus}
        onBlur={this.handleFormBlur}>

        <div className="header-field-inner">
          <input
            ref={ref => (this._input = ref)}
            type="text"
            className="form-control"
            placeholder={!focused && showCaption ? caption : placeholder}
            onFocusCapture={this.handleFocus}
            onBlurCapture={this.handleBlur}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            aria-invalid={!!error}
          />

          {formFocused && error && <div className="header-field-error">{error}</div>}
        </div>
        <button
          ref={ref => (this._button = ref)}
          type="submit"
          className="btn"
          onClick={this.handleButtonClick}
          title={caption}
          aria-label={caption}
        >
          <span className={iconClassName} />
        </button>
      </form>
    );
  }
}

HeaderField.propTypes = {
  iconClassName: PropTypes.string,
  placeholder: PropTypes.string,
  caption: PropTypes.string,
  showCaption: PropTypes.bool,
  collapse: PropTypes.bool,
  onSubmit: PropTypes.func,
  black: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  error: PropTypes.string
};

HeaderField.defaultProps = {
  iconClassName: 'icon icon-search',
  placeholder: 'Enter text',
  onSubmit: () => {}
};

const ReduxHeaderField = props => {
  const { meta, input } = props;

  let error = meta.error || meta.warning;
  if(!meta.touched)
    error = null;

  return (
    <HeaderField {...omit(props, ['meta', 'input'])} {...input} error={error} />
  );
}

export { ReduxHeaderField };
