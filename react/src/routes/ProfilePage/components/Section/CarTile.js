import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { TimelineMax } from "gsap";
import ObjectFit from "components/common/ObjectFit";
import SafeImage from "components/common/SafeImage";
import { bodyStyle, defaultSedanImg, defaultCarImg } from "config/constants";

class CarTile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false
    };
  }

  componentWillAppear(cb) {
    const timeline = new TimelineMax();

    timeline.set(this._outer, { opacity: 0, maxHeight: 0, minHeight: 0 });
    timeline.to(this._outer, 0.25, {
      maxHeight: 500,
      clearProps: "maxHeight,minHeight"
    });
    timeline.to(this._outer, 0.25, { opacity: 1, clearProps: "opacity" });
    timeline.eventCallback("onComplete", cb);

    //timeline.timeScale(.1)

    this._timeline = timeline;
  }

  componentWillLeave(cb) {
    if (this._timeline) this._timeline.kill();

    cb();
  }

  handleError = () => {
    this.setState({
      error: true
    });
  };

  render() {
    const {
      name,
      image,
      sold,
      category,
      saved,
      onSave,
      onUnsave,
      bodyStyleId,
      vehicleId,
      make,
      model,
      bodyStyleName,
      source_id
    } = this.props;
    const { error } = this.state;
    let { style } = this.props;
    let imageUrl = defaultSedanImg;
    const defaultBodyStyleImage = bodyStyle[bodyStyleName];
    if (defaultBodyStyleImage) {
      imageUrl = defaultBodyStyleImage;
    }
    if (error || !image)
      style = Object.assign({}, style, { backgroundImage: `url(${imageUrl})` });

    const onClick = saved ? onUnsave : onSave;
    const link =
      sold || category != null
        ? `/market-place/browse-detail/${source_id}/${make}/${model}`
        : `/shopping/vehicle-details/${vehicleId}/${bodyStyleId}`;

    return (
      <div
        ref={ref => (this._outer = ref)}
        className={`car-tile ${sold ? "sold" : ""}`}
      >
        <div className="car-tile-image" style={style}>
          {!sold && image && (
            <ObjectFit fit="contain" tag="img">
              <SafeImage src={image} alt={name} onError={this.handleError} />
            </ObjectFit>
          )}
          <div className="car-tile-image-content">
            {sold && (
              <span className="tag">
                <span className="tag-hole" /> Sold
              </span>
            )}

            <div className="car-tile-image-text">
              <button
                type="button"
                className={`btn btn-link save-button ${saved ? "saved" : ""}`}
                onClick={onClick}
              >
                <span className="save-unsave-text">
                  {saved ? "Unsave?" : "Save?"}
                </span>
                <span className="icon icon-heart" />
                <span className="icon icon-heart-empty" />
              </button>

              {sold && <span className="car-tile-text">{name}</span>}
            </div>
          </div>
        </div>
        <div className="car-tile-caption">
          <Link className="btn btn-link" to={link}>
            <span className="car-tile-text">
              {!sold ? name : "Find similar vehicles"}
            </span>
            <span className="pull-right icon icon-arrow-right" />
          </Link>
        </div>
      </div>
    );
  }
}

CarTile.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  sold: PropTypes.bool,
  saved: PropTypes.bool,
  onSave: PropTypes.func,
  onUnsave: PropTypes.func,
  bodyStyleId: PropTypes.string.isRequired,
  vehicleId: PropTypes.string.isRequired
};

CarTile.defaultProps = {
  saved: true
};

const ReduxCarTile = props => {
  const {
    input: { onChange, value }
  } = props;

  const handleSave = () => onChange(false);
  const handleUnsave = () => onChange(true);
  const imageUrl = props.car.image_url
    ? props.car.image_url
    : defaultCarImg;
  return (
    <CarTile
      name={props.car.name}
      image={imageUrl}
      vehicleId={props.car.vehicle_id}
      bodyStyleId={props.car.body_style_id}
      bodyStyleName={props.car.body_style}
      saved={!value}
      onSave={handleSave}
      category={props.car.category}
      make={props.car.make}
      model={props.car.model}
      source_id={props.car.id}
      onUnsave={handleUnsave}
    />
  );
};

export default CarTile;
export { ReduxCarTile };
