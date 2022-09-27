import React from 'react';

export default class RatingsAndShare extends React.Component {

  constructor (props) {
    super(props);
  }

  render() {
    return (
      <div className="col-right_side">
        <div className="rate-sec">
          <ul>
            <li><span>Rate</span></li>
            <li><a href="#"><img src={require("../../../styles/img/cb-like.png")} /></a></li>
            <li><a href="#"><img src={require("../../../styles/img/cb-dislike.png")} /></a></li>
          </ul>
          <ul className="share_right">
            <li><span>Share</span></li>
            <li><a href="#"><img src={require("../../../styles/img/share.png")} /></a></li>
          </ul>
        </div>
      </div>
    );
  }
}
