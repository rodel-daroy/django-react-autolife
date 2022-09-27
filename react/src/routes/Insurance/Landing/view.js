import React, { Component } from 'react';
import { connect } from 'react-redux';
import FeatureSpot from 'components/common/FeatureSpot';
import PrimaryButton from 'components/Forms/PrimaryButton';
import image from './img/insurance-landing.jpg';
import Breadcrumbs from 'components/Navigation/Breadcrumbs';
import HelpBox from '../components/HelpBox';
import Legal from '../components/Legal';
import InsuranceLogos from '../components/InsuranceLogos';
import ArticleMetaTags from 'components/common/ArticleMetaTags';
import ASpotBody from 'components/common/ASpotBody';
import get from 'lodash/get';
import { makeRelatedArticlesContainer } from 'components/containers/RelatedArticlesContainer';
import InsurancePhone from '../components/HelpBox/InsurancePhone';
import '../style.scss';

const InsuranceRelatedArticles = makeRelatedArticlesContainer('insurance');

class InsuranceView extends Component {
  state = {
    tile: []
  };
  componentWillReceiveProps(nextProps) {
    this.setState({
      tile: nextProps.controller
    });
  }

  render() {
    const { tile } = this.state;
    return (
      <article className="insurance-page page-width">
        <ArticleMetaTags title="Insurance" />

        <div>
          <FeatureSpot short kind="image" images={image}>
            <ASpotBody
              heading="AutoLife Insurance Solutions"
              synopsis="It's about what protects you"
            />

            <div className="insurance-page-a-spot">
              <div className="insurance-page-a-spot-button">
                <PrimaryButton
                  className="quote-button"
                  link="/insurance/quote"
                  dark
                >
                  Get a free quote <span className="icon icon-angle-right" />
                </PrimaryButton>
              </div>

              <div className="insurance-page-a-spot-phone">
                <p>or speak to an insurance advisor</p>

                <InsurancePhone dark />
              </div>
            </div>
          </FeatureSpot>
        </div>
        <div className="content-container">
          <div className="text-container">
            <Breadcrumbs>
              <Breadcrumbs.Crumb name="Insurance" />
            </Breadcrumbs>

            <div className="insurance-content">
              <div className="text-width">
                <div className="article-text centered">
                  <p>
                    Protecting your family matters most to us. AutoLife
                    Insurance Solutions is powered by Hub Insurance, one of
                    Canada’s leading insurance providers in Canada.
                  </p>
                  <p>
                    We know insurance can be complicated, that’s why we make it
                    easier for you to get the right coverage to protect you and
                    what matters most.
                  </p>
                  <p>
                    Our multi-carrier quote makes shopping easier. Answer a few
                    questions and choose from a list of the top Insurance
                    Carriers in Canada.
                  </p>

                  <h3>Our Insurance Partners</h3>
                  <p>
                    We represent and compare coverage from more than 7 insurance
                    carriers including:
                  </p>
                </div>
              </div>
              <InsuranceLogos />
              <div className="text-width">
                <div className="article-text centered">
                  <h3>Shopping for new Insurance?</h3>
                  <p>
                    Why not take our quoter for a spin? In just a few minutes
                    you can get your premium, find a broker or if you’re ready
                    buy online.
                  </p>
                </div>

                <div className="article-text centered">
                  <PrimaryButton
                    className="quote-button"
                    link="/insurance/quote"
                  >
                    Get a free quote <span className="icon icon-angle-right" />
                  </PrimaryButton>
                </div>
              </div>
              <div>
                <HelpBox title="Rather speak to an Insurance&nbsp;Advisor?" />
              </div>

              <section className="page-section last">
                {tile.length > 0 && (
                  <header className="page-section-header">
                    <h3>Other articles you may like</h3>
                  </header>
                )}
                <div className="page-section-content">
                  <InsuranceRelatedArticles orientation="horizontal" />
                </div>
              </section>
            </div>

            <Legal />
          </div>
        </div>
      </article>
    );
  }
}
const mapStateToProps = state => ({
  controller: get(state, `uiController.controllers[insurance]`)
});
export default connect(mapStateToProps)(InsuranceView);
