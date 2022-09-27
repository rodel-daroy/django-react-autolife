import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showInfoModal } from 'redux/actions/infoModalActions';
import Legal from '../components/Legal';
import {
  showHeaderStepperAction,
  changeHeaderStepperAction,
  setInitialPageLoadedAction
} from 'redux/actions/layoutActions';
import { getInsuranceQuote } from 'redux/actions/insuranceActions';
import InsuranceResults from './components/InsuranceResults/';
import FormContainer from './components/FormContainer/';
import SectionIndicator from 'components/Navigation/SectionIndicator';
import HelpBox from '../components/HelpBox/';
import PrimaryButton from 'components/Forms/PrimaryButton';
import {
  driversData,
  vehiclesData,
  claimsData,
  convictionsData,
  incidentsData,
  suspendData,
  getGuid
} from 'utils/format';
import ArticleMetaTags from 'components/common/ArticleMetaTags';
import get from 'lodash/get';
import '../style.scss';
import './style.scss';

const sectionsArray = [
  {
    id: 1,
    sectionName: (
      <span>
        Get
        <br />
        Started
      </span>
    ),
    sectionComplete: false,
    sectionTitle: 'AutoLife Insurance',
    sectionSubTitle: 'Let’s get some basic information first.'
  },
  {
    id: 2,
    sectionName: (
      <span>
        Driver
        <br />
        Information
      </span>
    ),
    sectionComplete: false,
    sectionTitle: 'Driver Information',
    sectionSubTitle:
      'Every quote is unique, just like you. Using real information will allow us to get you our best & most accurate quote.'
  },
  {
    id: 3,
    sectionName: (
      <span>
        Vehicle
        <br />
        Information
      </span>
    ),
    sectionComplete: false,
    sectionTitle: 'Vehicle Information',
    sectionSubTitle:
      'Your quote is customized to your vehicle & how you use it.'
  },
  {
    id: 4,
    sectionName: (
      <span>
        Vehicle
        <br />
        Allocation
      </span>
    ),
    sectionComplete: false,
    sectionTitle: 'Driver Allocation',
    sectionSubTitle: 'Who drives the vehicle?'
  },
  {
    id: 5,
    sectionName: (
      <span>
        Get your
        <br />
        quote
      </span>
    ),
    sectionComplete: false,
    sectionTitle: 'Your quote',
    sectionSubTitle: 'Here is what we came up with.'
  }
];

class View extends Component {
  static propTypes = {
    form0State: PropTypes.object
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      currentSection: 0,
      formComplete: false,
      currentDriver: 0,
      currentVehicle: 0,
      drivers: [],
      vehicles: []
    };
    // change the header
    const { changeHeaderStepper, showHeaderStepper } = this.props;
    this.stepperSettings = { start: 1, end: 4, current: 0, style: 'dark' };
    changeHeaderStepper(this.stepperSettings);
    showHeaderStepper(true);
  }

  // componentDidMount() {
  //   hideLoader();
  // }

  // componentWillUpdate() {
  //   addLoader();
  // }

  // componentDidUpdate() {
  //   hideLoader();
  // }

  componentWillUnmount() {
    this.props.showHeaderStepper(false);
  }
  setCurrentSection = sectionNum => {
    this.setState({ currentSection: sectionNum });
    this.props.changeHeaderStepper({
      ...this.stepperSettings,
      current: sectionNum
    });
  };
  doSubmitForm = () => {
    alert('submitting form');
  };
  cancelClicked = () => {
    alert('cancel clicked');
  };
  clickHelp = () => {
    this.props.showInfoModal('help title', 'help content');
  };

  randomId = number => {
    let x = Math.random() * number;
    return Math.ceil(x);
  };

  goToNextSection = values => {
    const {
      currentSection,
      currentDriver,
      currentVehicle,
      drivers,
      vehicles
    } = this.state;
    const { form0State } = this.props;
    if (currentSection == 0) {
      sectionsArray[currentSection].sectionComplete = true;
      this.setCurrentSection(currentSection + 1);
      this.setState({
        currentDriver: 0,
        currentVehicle: 0,
        drivers: [],
        vehicles: []
      });
    }
    if (currentSection == 1) {
      const {
        birth_day,
        birth_month,
        birth_year,
        license_class,
        license_day,
        license_month,
        license_year,
        tickets,
        claims,
        maritalstatus,
        ...valuesWithoutBirthday
      } = values;
      const updatedBirthday = {
        birth_day: birth_day.value,
        birth_month: birth_month.value,
        birth_year: birth_year.value,
        license_day: license_day.value,
        license_month: license_month.value,
        license_year: license_year.value,
        claims: claims.value,
        tickets: tickets.value,
        maritalstatus: maritalstatus.value
      };
      const newParams = {
        ...valuesWithoutBirthday,
        ...updatedBirthday
      };
      const nextDriver = currentDriver + 1;
      if (drivers.length < form0State.values.driversToInsure) {
        this.setState(
          {
            drivers: [...drivers, { ...newParams }]
          },
          () => this.updateDriverState(this.state.drivers, newParams)
        );
      } else {
        this.updateDriverState(this.state.drivers, newParams);
      }

      if (nextDriver < form0State.values.driversToInsure) {
        this.setState({ currentDriver: nextDriver });
      } else {
        sectionsArray[currentSection].sectionComplete = true;
        this.setCurrentSection(this.state.currentSection + 1);
      }
    }
    if (currentSection == 2) {
      const {
        purchase_day,
        purchase_month,
        purchase_year,
        collision_deductible,
        comprehensive_deductible,
        income_replacement,
        increased_care,
        liability_limit,
        primaryUse,
        vehicle_make,
        vehicle_model,
        vehicle_year,
        ...valuesWithoutpurchase
      } = values;

      const updatedPurchaseDate = {
        purchase_day: purchase_day ? purchase_day.value : '',
        purchase_month: purchase_month ? purchase_month.value : '',
        purchase_year: purchase_year ? purchase_year.value : '',
        collision_deductible: collision_deductible
          ? collision_deductible.value
          : '',
        comprehensive_deductible: comprehensive_deductible
          ? comprehensive_deductible.value
          : '',
        income_replacement: income_replacement ? income_replacement.value : '',
        increased_care: increased_care ? increased_care.value : '',
        liability_limit: liability_limit ? liability_limit.value : '',
        primaryUse: primaryUse ? primaryUse.value : '',
        vehicle_make: vehicle_make ? vehicle_make.value : '',
        vehicle_model: vehicle_model ? vehicle_model.value : '',
        vehicle_year: vehicle_year ? vehicle_year.value : ''
      };

      const updatePurchase = {
        ...valuesWithoutpurchase,
        ...updatedPurchaseDate
      };
      const nextVehicle = currentVehicle + 1;
      if (vehicles.length < form0State.values.vehiclesToInsure) {
        this.setState(
          {
            vehicles: [...vehicles, { ...updatePurchase }]
          },
          () => this.updateVehiclesState(this.state.vehicles, updatePurchase)
        );
      } else {
        this.updateVehiclesState(this.state.vehicles, updatePurchase);
      }
      if (nextVehicle < form0State.values.vehiclesToInsure) {
        this.setState({ currentVehicle: nextVehicle });
      } else {
        sectionsArray[currentSection].sectionComplete = true;
        this.setCurrentSection(currentSection + 1);
      }
    }
    if (currentSection == 3) {
      console.log(values, 'cs-3');
      sectionsArray[currentSection].sectionComplete = true;
      this.setCurrentSection(currentSection + 1);
      this.setState({ formComplete: true });
      this.submitInsuranceForm();
    }
    return false;
  };

  updateDriverState = (drivers, values) => {
    const { form0State } = this.props;
    const { currentSection } = this.state;
    if (
      drivers.length == form0State.values.driversToInsure &&
      currentSection == 1
    ) {
      for (let i = 0; i < drivers.length; i++) {
        if (JSON.stringify(drivers[i]) !== JSON.stringify(values)) {
          const driverIndex = drivers.indexOf(drivers[i]);
          const newArray = drivers.splice(driverIndex, 1);
          newArray.splice(driverIndex, 1, values);
          this.setState({
            drivers: newArray
          });
        } else {
          this.setState({
            drivers
          });
        }
      }
    }
  };

  updateVehiclesState = (vehicles, values) => {
    const { form0State } = this.props;
    const { currentSection } = this.state;
    if (
      vehicles.length == form0State.values.vehiclesToInsure &&
      currentSection == 2
    ) {
      for (let i = 0; i < vehicles.length; i++) {
        if (JSON.stringify(vehicles[i]) !== JSON.stringify(values)) {
          const vehicleIndex = vehicles.indexOf(vehicles[i]);
          const newArray = vehicles.splice(vehicleIndex, 1);
          newArray.splice(vehicleIndex, 1, values);
          this.setState({
            vehicles: newArray
          });
        } else {
          this.setState({
            vehicles
          });
        }
      }
    }
  };

  submitInsuranceForm = () => {
    const {
      form0State,
      form3State,
      getInsuranceQuote,
      accessToken
    } = this.props;
    let { drivers, vehicles } = this.state;
    const driverDetail = [];
    const vehcileDetail = [];
    const convictionDetail = [];
    const claimsDetail = [];
    const incidentDetails = [];
    let driverId = this.randomId(1000000);
    let vehicleId = this.randomId(1000000);
    let claimsId = this.randomId(10);
    let ticketId = this.randomId(10);
    let cancellationId = this.randomId(10);
    let claimDate = [];
    let convictionDate = [];
    let incidentsDate = [];
    let suspendedStartDate = [];
    let suspendedEndDate = [];
    drivers.map((data, i) => {
      driverId += 1;
      claimsId += 1;
      ticketId += 1;
      driverDetail.push(driversData(data, driverId));
      if (data.claims && data.claims > 0) {
        for (var i = 0; i < data.claim_type.length; i++) {
          claimDate.push(
            `${data.claim_year[i]}-${data.claim_month[i]}-${data.claim_day[i]} 00:00:00.000`
          );
          claimsDetail.push(
            claimsData(data, driverId, vehicleId, claimsId, i, claimDate)
          );
        }
      }
      if (data.tickets && data.tickets > 0) {
        for (var i = 0; i < data.conviction_year.length; i++) {
          convictionDate.push(
            `${data.conviction_year[i]}-${data.conviction_month[i]}-${data.conviction_day[i]} 00:00:00.000`
          );
          convictionDetail.push(
            convictionsData(data, driverId, ticketId, i, convictionDate)
          );
        }
      }
      if (
        data.driverListedInsured === 'Y' &&
        data.policesCancel &&
        data.policesCancel.length > 0
      ) {
        for (var i = 0; i < data.policesCancel.length; i++) {
          incidentsDate.push(
            `${data.policy_cancel_year[i]}-${data.policy_cancel_month[i]}-${data.policy_cancel_day[i]} 00:00:00.000`
          );
          incidentDetails.push(
            incidentsData(data, driverId, cancellationId, i, incidentsDate)
          );
        }
      }
      if (
        data.licenseSuspend === 'Y' &&
        data.suspension_reason &&
        data.suspension_reason.length > 0
      ) {
        for (var i = 0; i < data.suspend_start_day.length; i++) {
          suspendedStartDate.push(
            `${data.suspend_start_year[i]}-${data.suspend_start_month[i]}-${data.suspend_start_day[i]} 00:00:00.000`
          );
          suspendedEndDate.push(
            `${data.suspend_end_year[i]}-${data.suspend_end_month[i]}-${data.suspend_end_day[i]} 00:00:00.000`
          );
          incidentDetails.push(
            suspendData(
              data,
              driverId,
              cancellationId,
              i,
              suspendedStartDate,
              suspendedEndDate
            )
          );
        }
      }
    });
    vehicles.map(data => {
      vehicleId += 1;
      vehcileDetail.push(vehiclesData(data, vehicleId, driverId));
    });
    const submitParams = {
      DriverProfile: driverDetail ? driverDetail : null,
      VehicleInfo: vehcileDetail ? vehcileDetail : null,
      Convictions: convictionDetail || [],
      Incidents: incidentDetails || [],
      Claims: claimsDetail || null,
      GUID: getGuid(),
      QuoteID: this.randomId(10),
      ID: 0,
      ProvinceABBR: 'ON',
      City: 'Windsor',
      PostalCode: form0State.values.postal.replace(' ', '')
    };
    getInsuranceQuote(submitParams, accessToken);
  };

  goToPreviousSection = () => {
    const { currentSection, currentDriver, currentVehicle } = this.state;
    const { form0State } = this.props;
    this.setState(
      {
        currentSection: this.state.currentSection - 1
      },
      () => {
        this.updatePreviousStep(currentSection);
      }
    );
  };

  updatePreviousStep = section => {
    const { currentSection, currentDriver, currentVehicle } = this.state;
    const { form0State } = this.props;
    if (section === 1) {
      const prevDriver = currentDriver - 1;
      if (prevDriver >= 0) {
        this.setState({
          currentDriver: prevDriver,
          currentSection: section
        });
      }
    } else if (section === 2) {
      const prevVehicle = currentVehicle - 1;
      if (prevVehicle >= 0) {
        this.setState({
          currentVehicle: prevVehicle,
          currentSection: section
        });
      }
    }
  };

  goToSection = section => {
    const { currentDriver, currentVehicle } = this.state;
    this.setState({ currentSection: section });
    if (section === 1) {
      this.setState({ currentDriver: 0 });
    } else if (section === 2) {
      this.setState({ currentVehicle: 0 });
    }
  };

  render() {
    const { insuranceData, insuranceStatus, loadingInsuranceData } = this.props;
    const { currentSection, drivers, vehicles } = this.state;
    console.log(currentSection, 'section-check');
    return (
      <div className="insurancePage">
        <ArticleMetaTags title="Insurance" />
        <div className="page-width content-container offset-header">
          <div className="text-container">
            <div className="insuranceContent">
              <div className="insuranceContent-body">
                <div className="visible-xs-block">
                  <PrimaryButton
                    size="medium"
                    className="mobile-back-button"
                    onClick={this.goToPreviousSection}
                    disabled={currentSection === 0}
                  >
                    <span className="icon icon-angle-left" /> Back
                  </PrimaryButton>
                  <div className="inline-block insurance-step">
                    Step {currentSection + 1} of 4:{' '}
                    {sectionsArray[currentSection].sectionTitle}
                  </div>
                </div>

                <div className="insurance-title">
                  <h1>{sectionsArray[currentSection].sectionTitle}</h1>
                  <div className="insurance-subTitle">
                    {sectionsArray[currentSection].sectionSubTitle}
                  </div>
                </div>

                <div className="insuranceContent-form">
                  <SectionIndicator
                    className="hidden-xs"
                    sections={sectionsArray}
                    currentSection={currentSection}
                    style={{ minHeight: '500px' }}
                    onClick={this.goToSection}
                  />
                  <div className="insuranceContent-form-body">
                    {this.state.currentSection < 4 && (
                      <FormContainer
                        style={{ minHeight: '500px' }}
                        vehicles={vehicles}
                        drivers={drivers}
                        currentDriver={this.state.currentDriver}
                        currentVehicle={this.state.currentVehicle}
                        currentSection={currentSection}
                        clickCancel={this.cancelClicked}
                        clickPrevious={this.goToPreviousSection}
                        clickNext={this.goToNextSection}
                      />
                    )}
                    {this.state.currentSection === 4 && (
                      <InsuranceResults
                        results={insuranceData}
                        status={insuranceStatus}
                        loadingInsuranceData={loadingInsuranceData}
                      />
                    )}
                  </div>
                </div>

                {/*<div className="visible-xs-block" style={{ textAlign: 'right' }}>
                  <button className="btn btn-clean helpBtn" onKeyPress={this.clickHelp} onClick={this.clickHelp}>
                    <i className="fa fa-question-circle" style={{ fontSize: '40px' }} />
                  </button>
                </div>*/}
              </div>

              {!this.state.formComplete && <HelpBox className="hidden-xs" />}
            </div>
            {/*<div className="row visible-xs-block" style={{ textAlign: 'right' }}>
              <button className="btn btn-clean helpBtn" onKeyPress={this.clickHelp} onClick={this.clickHelp}>
                <i className="fa fa-question-circle" style={{ fontSize: '40px' }} />
              </button>
            </div>*/}
            <div className="row">
              <Legal />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  showHeaderStepper: showHeaderStepperAction,
  changeHeaderStepper: changeHeaderStepperAction,
  setInitialPageLoaded: setInitialPageLoadedAction,
  showInfoModal,
  getInsuranceQuote
};

function mapStateToProps(state) {
  return {
    form0State: state.form.insuranceSection0Form,
    form3State: state.form.insuranceSection3Form,
    insuranceData: state.insurance.insuranceData,
    insuranceStatus: state.insurance.insuranceStatus,
    loadingInsuranceData: state.insurance.loadingInsuranceData,
    accessToken: get(state, 'user.authUser.accessToken')
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
