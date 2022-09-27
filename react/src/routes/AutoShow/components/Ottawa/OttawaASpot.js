import React from 'react';
import ASpotBody from 'components/common/ASpotBody';
import logo from './img/logo.png';
import PrimaryButton from 'components/Forms/PrimaryButton';
import './OttawaASpot.scss';

const OttawaASpot = () => (
  <div className="ottawa-a-spot">
    <ASpotBody
      heading={(
        <span><em>2019 Ottawa Gatineau</em><br />International Auto Show</span>
      )}
      synopsis={(
        <div className="ottawa-a-spot-synopsis">
          <p>At the Shaw Centre<br />March 21-24, 2019</p>

          <div>
            <PrimaryButton dark link="https://www.autoshowottawa.com/tickets-and-hours-auto-show" target="_blank">
              Buy tickets now &gt;
            </PrimaryButton>
          </div>

          <div className="ottawa-a-spot-logos">
            <img src={logo} alt="2019 Ottawa Gatineau International Auto Show" />
          </div>
        </div>
      )} />
  </div>
);
 
export default OttawaASpot;