import React, { Component } from 'react';
import { childrenOfType } from 'airbnb-prop-types';
import CarListingTile from './CarListingTile';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { TimelineMax } from 'gsap';

class CarListingCell extends Component {
  reveal(cb) {
    const { index } = this.props;

    if (this._timeline) this._timeline.kill();

    const timeline = (this._timeline = new TimelineMax());

    timeline.set(this._cell, { opacity: 0, scale: 0.75 });
    timeline.to(
      this._cell,
      0.2,
      {
        opacity: 1,
        scale: 1,
        clearProps: 'opacity,transform'
      },
      index * 0.1 + 0.5
    );

    timeline.eventCallback('onComplete', cb);
  }

  componentWillAppear(cb) {
    this.reveal(cb);
  }

  componentWillEnter(cb) {
    this.reveal(cb);
  }

  componentWillUnmount() {
    if (this._timeline) this._timeline.kill();
  }

  render() {
    const { children } = this.props;
    console.log(children, 'childrennn');
    return (
      <div ref={ref => (this._cell = ref)} className="car-listing-cell">
        {React.Children.only(children)}
      </div>
    );
  }
}

const CarListings = ({ children, ...otherProps }) => {
  children = React.Children.toArray(children);

  return (
    <div className="car-listings">
      <TransitionGroup className="car-listings-inner" component="div">
        {children.map((child, i) => (
          <CarListingCell key={child.key} index={i}>
            {child}
          </CarListingCell>
        ))}
      </TransitionGroup>
    </div>
  );
};

CarListings.propTypes = {
  children: childrenOfType(CarListingTile)
};

export default CarListings;
