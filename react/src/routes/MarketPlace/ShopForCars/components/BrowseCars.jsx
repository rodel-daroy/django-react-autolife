import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import CategoryTile from "components/common/CategoryTile";
import PrimaryButton from "components/Forms/PrimaryButton";
import {
  browseCarData,
  getAllVehicleData,
  getBrowseCategoryData
} from "redux/actions/marketPlaceActions";

class BrowseCars extends Component {
  componentDidMount() {
    this.props.browseCarData();
  }

  render() {
    const { browseData } = this.props;

    const categories = (browseData && browseData.data) || [];
    const categoryLink = ({ slug } = {}) => `/market-place/browse-cars/${slug}`;

    return (
      <section className="page-section browse-cars">
        <header className="page-section-header">
          <div className="text-container horizontal-header">
            <h3>Browse</h3>
            <p>
              Still thinking about your next car? We’ve curated the best of the
              best for <u>2019</u>. Check out some of our favourite models.
            </p>
          </div>
        </header>

        <div className="page-section-content">
          <div className="content-strip">
            <nav className="text-container">
              <ul className="categories-container">
                {categories.map((data, i) => (
                  <li className="category-cell" key={i}>
                    <CategoryTile
                      name={data.name}
                      image={data.image_url}
                      as={Link}
                      to={categoryLink(data)}
                    />
                  </li>
                ))}
                <li className="category-cell">
                  <div className="browse-cars-see-all">
                    <PrimaryButton link={categoryLink(categories[0])}>
                      See all vehicles
                    </PrimaryButton>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  browseData: state.MarketPlace.browseData,
  user: state.user
});

const mapDispatchToProps = {
  browseCarData,
  getBrowseCategoryData,
  getAllVehicleData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowseCars);
