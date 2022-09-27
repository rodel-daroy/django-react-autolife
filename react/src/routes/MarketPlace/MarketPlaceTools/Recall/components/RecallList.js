import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { connect } from "react-redux";
import { postSearch, getBrands } from "redux/actions/marketPlaceActions";
import get from "lodash/get";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
import SafeImage from "components/common/SafeImage";
import ObjectFit from "components/common/ObjectFit";
import Spinner from "components/common/Spinner";
import defaultImage from "styles/img/listings/DefaultCarIcon-NoLabel.svg";
import "./RecallList.scss";

const getURL = recallNo =>
  `http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/detail.aspx?lang=eng&rn=${recallNo}`;

const recallDate = date => moment(date, "M/D/YYYY hh:mm:ss A");
const formatRecallDate = date => recallDate(date).format("LL");

const formatSummary = summary => {
  return (summary || "")
    .replace(/(\r\n|\n|\r)/gm, "<br>")
    .replace(
      /((Issue|Safety Risk|Corrective Action|Note|Correction):)/gm,
      "<strong>$1</strong>"
    );
};

const RecallListItemText = ({ car }) => {
  const renderStat = (label, value) => (
    <li className="recall-list-item-stat">
      {label && <div className="recall-list-item-stat-label">{label}</div>}
      <div className="recall-list-item-stat-value">{value}</div>
    </li>
  );

  return (
    <div className="recall-list-item-text">
      <ul className="recall-list-item-stats">
        {renderStat("Recalled", formatRecallDate(car.recall_date))}
        {renderStat(
          "Recall no.",
          <a
            className="primary-link"
            href={getURL(car.recallNo)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {car.recallNo}
          </a>
        )}
      </ul>

      <div className="article-text recall-list-item-summary">
        <p dangerouslySetInnerHTML={{ __html: formatSummary(car.summary) }} />
      </div>
    </div>
  );
};

const RecallListItem = ({ car, image, background, items }) => (
  <section className="page-section listing-section recall-list-item">
    <header className="page-section-header">
      <h2>
        {car.year} {car.make} {car.model}
      </h2>
    </header>

    <div className="page-section-body recall-list-item-body">
      <div className="recall-list-item-text-outer">
        {items.map((car, i) => (
          <RecallListItemText key={i} car={car} />
        ))}
      </div>

      <div className="recall-list-item-image">
        <div className="recall-list-item-image-inner" style={background}>
          {image && (
            <ObjectFit fit="contain" tag="img">
              <SafeImage src={image} alt="" />
            </ObjectFit>
          )}
        </div>
      </div>
    </div>
  </section>
);

class RecallList extends Component {
  state = {};

  static getDerivedStateFromProps(props, state) {
    const { list, year, make, model } = props;

    if (
      list !== state.list ||
      year !== state.year ||
      make !== state.make ||
      model !== state.model
    ) {
      let allCars = (list || []).reduce((acc, cur) => {
        const recallNo = cur["recall-number"];
        const cars = cur.summary
          // only this year, make, model
          .filter(
            car =>
              car.year == year &&
              car.make.toLowerCase() === make.toLowerCase() &&
              car.model.toLowerCase() === model.toLowerCase()
          )
          // combine with recallNo
          .map(car => ({
            ...car,
            recallNo
          }));

        return [...acc, ...cars];
      }, []);

      // remove duplicates
      allCars = uniqBy(allCars, ({ recall_date, recallNo, summary }) =>
        JSON.stringify({
          recall_date,
          recallNo,
          summary
        })
      );
      // sort by date
      allCars = sortBy(allCars, car => -recallDate(car.recall_date).valueOf());

      // load image for year, make, model
      props.postSearch({ year, make, model });

      return {
        list,
        year,
        make,
        model,
        allCars
      };
    }

    return null;
  }

  componentDidMount() {
    this.props.getBrands();
  }

  findImage() {
    const { searchResults } = this.props;

    for (const result of searchResults) {
      for (const { image_url, izmo } of result.vehicles) {
        if (izmo || image_url) return izmo || image_url;
      }
    }

    return null;
  }

  findBackground() {
    const { brands, make } = this.props;

    const brand = brands.find(
      ({ name }) => name.toLowerCase() === make.toLowerCase()
    );
    if (brand)
      return {
        backgroundSize: "60%",
        backgroundImage: `url('${brand.logo}')`,
        backgroundPosition: "center 16px"
      };

    return {
      backgroundImage: `url('${defaultImage}')`
    };
  }

  render() {
    const { loading } = this.props;
    const { allCars = [] } = this.state;

    return (
      <section className="recall-list">
        {loading && <Spinner scale={0.5} color="lightgrey" />}

        {!loading && allCars.length === 0 && (
          <div className="text-container">
            <h4 className="text-center max-text-width center">
              No recalls found
            </h4>
          </div>
        )}

        {allCars.length > 0 && (
          <RecallListItem
            car={allCars[0]}
            image={this.findImage()}
            background={this.findBackground()}
            items={allCars}
          />
        )}
      </section>
    );
  }
}

RecallList.propTypes = {
  list: PropTypes.array.isRequired,
  year: PropTypes.any.isRequired,
  make: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  loading: PropTypes.bool,

  postSearch: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  getBrands: PropTypes.func.isRequired,
  brands: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  searchResults: get(state, "MarketPlace.searchData.data.results", []),
  brands: get(state, "MarketPlace.brands.data", [])
});

export default connect(
  mapStateToProps,
  { postSearch, getBrands }
)(RecallList);
