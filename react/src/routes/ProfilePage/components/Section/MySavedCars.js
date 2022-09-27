import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Field } from "redux-form";
import { ReduxCarTile } from "./CarTile";
import PrimaryButton from "../../../../components/Forms/PrimaryButton";
import TransitionGroup from "react-transition-group/TransitionGroup";

const PAGE_SIZE = 10;

class MySavedCars extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      pagesLoaded: 1
    };
  }

  loadMore = () => {
    this.setState({
      pagesLoaded: this.state.pagesLoaded + 1
    });
  };

  render() {
    const { userInfo } = this.props;
    const { pagesLoaded } = this.state;

    let savedCars = [];
    if (userInfo) savedCars = userInfo.saved_cars || [];

    let displayCars = savedCars.slice(
      0,
      Math.min(savedCars.length, pagesLoaded * PAGE_SIZE)
    );

    return (
      <section className="page-section">
        <header className="page-section-header">
          <h3>My Saved Cars</h3>
        </header>
        <div className="page-section-content">
          <div className="interest-container">
            <div className="interest-container-inner">
              {displayCars.map((car, i) => (
                <TransitionGroup key={i} component="div" className="interest">
                  <Field
                    component={ReduxCarTile}
                    name={`saved_cars[${i}].remove`}
                    car={car}
                  />
                </TransitionGroup>
              ))}
            </div>

            {displayCars.length === 0 && (
              <div className="text-center">
                <p>You don't have any vehicles saved</p>

                <div>
                  <PrimaryButton link="/shopping">
                    Search for vehicles{" "}
                    <span className="icon icon-angle-right" />
                  </PrimaryButton>
                </div>
              </div>
            )}

            {displayCars.length < savedCars.length && (
              <div className="text-center load-more">
                <PrimaryButton type="button" onClick={this.loadMore}>
                  + Load more
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    userInfo: state.profile.userInfo
  };
}
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MySavedCars);
