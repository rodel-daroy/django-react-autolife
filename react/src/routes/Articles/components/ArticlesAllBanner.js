import React from "react";
import PropTypes from 'prop-types';
import FeatureSpot from "components/common/FeatureSpot";
import { Link } from "react-router-dom";
import ASpotBody from "components/common/ASpotBody";
import Spinner from "components/common/Spinner";
import image from "./img/news_all_header.jpg";
import "./ArticlesAllBanner.scss";

const ArticlesAllBanner = ({ title, previousLink, nextLink, loading }) => (
  <FeatureSpot images={image} scrim="gradient" short kind="image">
    {!loading && (
      <ASpotBody
        heading={
          <div className="news_all_banner_title">
            <Link
              className="btn btn-link dark previous-button"
              to={previousLink}
              aria-label="Previous page"
            >
              <span className="icon icon-arrow-thick-left" />
            </Link>

            {title}

            <Link
              className="btn btn-link dark next-button"
              to={nextLink}
              aria-label="Next page"
            >
              <span className="icon icon-arrow-thick-right" />
            </Link>
          </div>
        }
      />
    )}

    {loading && (
      <div style={{ position: "relative", height: "20vh" }}>
        <Spinner pulse color="white" scale={0.5} />
      </div>
    )}
  </FeatureSpot>
);

ArticlesAllBanner.propTypes = {
  title: PropTypes.string, 
  previousLink: PropTypes.any, 
  nextLink: PropTypes.any, 
  loading: PropTypes.bool
};

ArticlesAllBanner.defaultProps = { 
  title: "Title"
};

export default ArticlesAllBanner;
