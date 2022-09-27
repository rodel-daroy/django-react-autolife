import React, { Component } from "react";
import PropTypes from "prop-types";
import { TimelineMax } from "gsap";
import PrimaryButton from 'components/Forms/PrimaryButton'
import RadialButton from 'components/Forms/RadialButton'
import Media from "react-media";
import { mediaQuery } from "utils/style";
import take from "lodash/take";
import takeRight from "lodash/takeRight";

function fixWidowsOrphans(text) {
  let words = (text || "").split(" ");

  if (words.length > 3) {
    const firstWords = take(words, 1);
    const lastWords = takeRight(words, 1);
    words.splice(0, 1);
    words.splice(-1, 1);

    const formattedText = [
      firstWords[0],
      <span key="whitespace-1">&nbsp;</span>,

      words.join(" "),

      <span key="whitespace-2">&nbsp;</span>,
      lastWords[0]
    ];

    return formattedText;
  } else return [text];
}

class TileBody extends Component {
  show = cb => {
    if (this._timeline) this._timeline.kill();

    const timeline = new TimelineMax();

    timeline.set([this._body, this._a], { opacity: 0 });
    timeline.set(this._body, { maxHeight: 0 });

    timeline.to(this._body, 1, { maxHeight: 350 });
    timeline.to(this._body, 0.5, { opacity: 1 }, 0.5);

    if (this._a) {
      timeline.fromTo(
        this._a,
        0.5,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1 },
        0.5
      );
    }

    timeline.timeScale(2);

    timeline.eventCallback("onComplete", cb);

    this._timeline = timeline;
  };

  hide = cb => {
    if (this._timeline) this._timeline.kill();

    const timeline = new TimelineMax();

    timeline.to(this._body, 0.5, { maxHeight: 0, opacity: 0 });

    timeline.eventCallback("onComplete", cb);

    this._timeline = timeline;
  };

  updateLayout = () => {
    const { hover } = this.props;

    if (hover) this.show();
    else this.hide();
  };

  componentDidMount() {
    this.updateLayout();
  }

  componentWillUnmount() {
    if (this._timeline) this._timeline.kill();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hover !== this.props.hover) {
      this.updateLayout();
    }
  }

  renderButton = () => {
    const { buttonText } = this.props;

    const render = large => {
      if(large)
      	return (
      		<PrimaryButton dark component="div" tabIndex={-1}>
      			{buttonText} <span className="icon icon-angle-right"></span>
      		</PrimaryButton>
      	)
      else
      	return (
      		<RadialButton dark size="large" component="div">
      			<span className="icon icon-angle-right"></span>
      		</RadialButton>
      	)
    };

    return (
      <div ref={ref => (this._a = ref)} className="tile-button">
        <Media query={mediaQuery("sm md lg")}>
          {matches => (matches ? render(true) : render(false))}
        </Media>
      </div>
    );
  };

  render() {
    const { text } = this.props;

    const formattedText = fixWidowsOrphans(text);

    return (
      <div
        ref={ref => (this._body = ref)}
        className={`tile-body ${text ? "" : "no-text"}`}
      >
        {text && <p className="tile-body-text">{formattedText}</p>}

        {this.renderButton()}
      </div>
    );
  }
}

const TileContent = props => {
  const { hover, kind, title, logo } = props;

  const className = `tile-content kind-${kind} ${
    hover ? "hover" : ""
  }`;

  const logoTag = logo ? <img className="tile-logo" src={logo} /> : null;

  const header = (
    <div className="tile-header">
      <h2>
        {logoTag}
        {fixWidowsOrphans(title)}
        <span className="tile-header-button">
          &nbsp;
          <RadialButton dark component="div" size="tiny">
						<span className="icon icon-angle-right"></span>
					</RadialButton>
        </span>
      </h2>
    </div>
  );

  return (
    <div className={className}>
      {header}

      <Media query={mediaQuery("sm md lg")}>
        {matches => <TileBody {...props} hover={!matches || hover} />}
      </Media>
    </div>
  );
};

TileContent.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  buttonText: PropTypes.string,
  hover: PropTypes.bool,
  kind: PropTypes.oneOf([1, 2]).isRequired,
  logo: PropTypes.string
};

TileContent.defaultProps = {
  title: "Why sign up for Autolife?",
  text:
    "Get Great advice and information you can actually use. No sales the it",
  buttonText: "Read more",
  kind: "A"
};

export default TileContent;
