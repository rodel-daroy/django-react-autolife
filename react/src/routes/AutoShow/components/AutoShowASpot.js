import React from 'react';
import ASpotBody from 'components/common/ASpotBody';
import logos from './img/logos.png';
import './AutoShowASpot.scss';

const AutoShowASpot = () => (
  <div className="auto-show-a-spot">
    <ASpotBody
      heading="Thank you for joining us!"
      synopsis={(
        <div className="auto-show-a-spot-synopsis">
          <p>We hope to see you next year at the AutoShow,<br />February 14-23, 2020</p>

          <div className="auto-show-a-spot-logos">
            <img src={logos} alt="AutoShow presented by Toronto Star, wheels.ca" />
          </div>
        </div>
      )} />
  </div>
);
 
export default AutoShowASpot;