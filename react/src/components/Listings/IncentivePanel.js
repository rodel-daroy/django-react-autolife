import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import PrimaryButton from "../Forms/PrimaryButton";
import sortBy from "lodash/sortBy";
import minBy from "lodash/minBy";
import remove from "lodash/remove";
import { formatCurrency } from "../../utils/format";

const DEFAULT_TERMS_LINES = 4;

const transformTerms = terms => {
  terms = terms || [];

  terms = sortBy(terms, ["term"]);

  const minRate = minBy(terms, t => t.rate);
  if (minRate) {
    let bestRates = remove(
      terms,
      t => t.rate.toFixed(2) === minRate.rate.toFixed(2)
    );

    if (terms.length > 0) {
      bestRates = bestRates.map(t => ({
        ...t,
        bestRate: true
      }));
    }

    terms.splice(0, 0, ...bestRates);
  }

  return terms;
};

class IncentivePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAll: false,
      terms: transformTerms(props.terms)
    };
  }

  componentWillReceiveProps(nextProps) {
    const { terms } = this.props;

    if (terms !== nextProps.terms) {
      this.setState({
        terms: transformTerms(nextProps.terms)
      });
    }
  }

  showAll = () => {
    this.setState({
      showAll: true
    });
  };

  renderTerms() {
    const { terms, showAll } = this.state;
    let displayTerms;
    if (showAll) displayTerms = terms;
    else
      displayTerms = terms.slice(
        0,
        Math.min(terms.length, DEFAULT_TERMS_LINES)
      );

    if (terms.length > 0) {
      return (
        <div className="incentive-panel-terms">
          <ol>
            {displayTerms.map((term, i) => (
              <li key={i} className={term.bestRate ? "best" : ""}>
                <span>{term.term} months</span>
                <span>{term.rate.toFixed(2)}%</span>
              </li>
            ))}
          </ol>

          {displayTerms.length < terms.length && (
            <PrimaryButton size="small" onClick={this.showAll}>
              + See all
            </PrimaryButton>
          )}
        </div>
      );
    } else return null;
  }

  render() {
    const { terms, rebate, throughDate, title, icon } = this.props;
    const { showAll } = this.state;

    let formattedDate = null;
    if (throughDate) formattedDate = moment(throughDate).format("MMMM D, YYYY");

    return (
      <div className="incentive-panel-outer">
        <div className="incentive-panel">
          <header className="incentive-panel-header">
            <h2>
              {title} <img src={icon} />
            </h2>
          </header>

          <div className="incentive-panel-inner">
            {!!rebate && (
              <div className="incentive-panel-rebate">
                ${formatCurrency(rebate, false)} Rebate
              </div>
            )}

            {this.renderTerms()}

            {formattedDate && (
              <div className="incentive-panel-available">
                Available now through <br />
                <b>{formattedDate}.</b>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

IncentivePanel.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  rebate: PropTypes.number,
  terms: PropTypes.arrayOf(
    PropTypes.shape({
      term: PropTypes.number,
      rate: PropTypes.number
    })
  ),
  throughDate: PropTypes.any
};

export default IncentivePanel;
