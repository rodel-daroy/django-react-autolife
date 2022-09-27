import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FeatureSpot from 'components/common/FeatureSpot';
import aSpot from './img/a-spot.jpg';
import FeaturedLayout from 'components/content/FeaturedLayout';
import TabSet from 'components/Navigation/TabSet';
import ArticleMetaTags from 'components/common/ArticleMetaTags';
import { withRouter } from 'react-router';
import { getScrollContainer } from 'utils/style';
import OttawaASpot from './OttawaASpot';
import Tout from 'components/common/Tout';
import carsAndJobsLogo from "./img/carsandjobs-logo-en.svg";
import '../WinView.scss';
import './index.scss';

const TABS = [
  {
    hash: '#daily-prize',
    caption: 'Win instant prizes',
    content: () => (
      <iframe 
        title="promo"
        src="https://a.cstmapp.com/p/30573?micro=1&utm_source=widget&utm_medium=embed"
        width="100%" 
        height="850" 
        frameBorder="0" 
        webkitallowfullscreen="true" 
        mozallowfullscreen="true" 
        allowFullScreen />
    )
  }
];

class WinView extends Component {
  componentDidMount() {
    if(typeof this.selectedTab === 'number') {
      const scrollContainer = getScrollContainer();
      scrollContainer.scrollTop = this._container.offsetTop - 200;
    }
  }

  get selectedTab() {
    const { location: { hash } } = this.props;

    if (hash) {
      const index = TABS.findIndex(tab => tab.hash === hash);
      if (index > -1)
        return index;
    }

    return undefined;
  }

  handleTabChange = tabIndex => {
    this.props.history.replace({ ...this.props.location,
      hash: TABS[tabIndex].hash,
      state: {
        suppressScroll: true
      }
    });
  }

  render() {
    return (
      <article className="auto-show-win">
        <ArticleMetaTags title="Ottawa Gatineau International Auto Show" />

        <div className="page-width">
          <FeatureSpot images={aSpot} kind="image">
            <OttawaASpot />
          </FeatureSpot>
        </div>

        <div ref={ref => this._container = ref}>
          <FeaturedLayout name="Ottawa Gatineau International Auto Show" share={false}>
            <FeaturedLayout.Band>
              <div className="text-container auto-show-win-tabs">
                <TabSet selected={this.selectedTab} onChange={this.handleTabChange} name="autolifeWin" tabs={TABS.map(tab => ({
                  caption: tab.caption,
                  content: () => null
                }))} />
              </div>
            </FeaturedLayout.Band>
            <FeaturedLayout.Band className="auto-show-win-iframe-band">
              <div className="text-container">
                {TABS[this.selectedTab || 0].content()}
              </div>
            </FeaturedLayout.Band>
          </FeaturedLayout>
        </div>

        <div className="content-container">
          <div className="ottawa-carsandjobs">
            <Tout
              heading={<span>Join us for our Educational&nbsp;Series:<br />Careers in the Automotive&nbsp;Industry</span>}
              image={carsAndJobsLogo}
              buttonText="Visit website"
              link="https://carsandjobs.com"
              target="_blank">

              <p>
                Thursday, March 21<sup>st</sup> &amp; Friday, March 22<sup>nd</sup> 2019
              </p>
            </Tout>
          </div>
        </div>
      </article>
    );
  }

}

WinView.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
 
export default withRouter(WinView);