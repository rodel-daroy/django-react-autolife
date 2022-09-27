import React, { Component } from "react";
import FeatureSpot from "../../components/common/FeatureSpot";
import Breadcrumbs from "../../components/Navigation/Breadcrumbs";
import Videos from "./components/Videos";
import ArticleMetaTags from "../../components/common/ArticleMetaTags";
import ASpotBody from "../../components/common/ASpotBody";
import "./style.scss";
import aSpot from "./img/a-spot.jpg";

class View extends Component {
  render() {
    return (
      <article className="video-wall">
        <ArticleMetaTags title="AutoLife Stories" />

        <div className="page-width">
          <FeatureSpot short kind="image" images={aSpot}>
            <ASpotBody
              heading="AutoLife Stories"
              synopsis="It's all about what moves you"
            />
          </FeatureSpot>

          <div className="content-container">
            <div className="text-container">
              <Breadcrumbs>
                <Breadcrumbs.Crumb name="AutoLife Stories" />
              </Breadcrumbs>
            </div>

            <section className="page-section video-section last">
              <header className="page-section-header">
                <div className="text-container">
                  <h3>Featured Videos</h3>
                </div>
              </header>

              <div className="page-section-content">
                <Videos />
              </div>
            </section>
          </div>
        </div>
      </article>
    );
  }
}

export default View;
