import React, { Component } from 'react';
//import SiriusVINForm from './SiriusVINForm';
import PrimaryButton from 'components/Forms/PrimaryButton';
import Card from 'components/content/Card';
import image from '../img/vin.jpg';
import './SiriusVINBox.scss';

class SiriusVINBox extends Component {
  handleSubmit = values => console.log('vin submit:', values);

  render() {
    return (
      <Card image={image}>
        <h2 className="sirius-vin-box-title">See if your car is compatible</h2>
        {/* <p className="sirius-vin-box-not-sure">Not sure what service your vehicle is equipped with? Enter your VIN (Vehicle Identification Number) below to find out.</p>
        <SiriusVINForm onSubmit={this.handleSubmit} /> */}

        <p className="sirius-vin-box-not-sure">
          Not sure what service your vehicle is equipped with?
        </p>

        <PrimaryButton link="https://www.siriusxm.ca/what-is-siriusxm/in-your-vehicle/vin-lookup/" target="_blank">
          Look-up your VIN
        </PrimaryButton>
      </Card>
    );
  }
}

export default SiriusVINBox;

