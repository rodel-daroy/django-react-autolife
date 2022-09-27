import React from 'react';
import ArticleMetaTags from 'components/common/ArticleMetaTags';
import FeatureSpot from 'components/common/FeatureSpot';
import ASpotBody from 'components/common/ASpotBody';
import FeaturedLayout from 'components/content/FeaturedLayout';
import PodcastView from './components/PodcastView';
import PrimaryButton from 'components/Forms/PrimaryButton';
import aSpot from './img/a-spot.jpg';
import avatar from './img/avatar.png';
import './view.scss';

const GregCarrascoView = () => (
  <article className="greg-view">
    <ArticleMetaTags title="The Greg Carrasco Show" />

    <div className="page-width">
      <FeatureSpot images={aSpot} kind="image">
        <ASpotBody heading="The Greg Carrasco Show" synopsis="Are you listening?" />
      </FeatureSpot>
    </div>

    <FeaturedLayout name="The Greg Carrasco Show">
      <FeaturedLayout.Band>
        <div className="text-container">
          <div className="text-width greg-view-container">
            <div className="greg-view-avatar">
              <img src={avatar} alt="Greg Carrasco" />
            </div>

            <div className="greg-view-text article-text">
              <p>
                With over 27 years of experience in the automotive industry and a desire to educate audiences on purchasing awareness, Greg Carrasco has built one of the most well-known influential automotive radio shows &amp; podcast platforms in Canada.
              </p>
              <p>
                Whether you are a car aficionado or buying your first car; looking for the best family car or your dream car, Greg has been providing honest, direct, no-nonsense advice for over 10 years on Global News Radio AM640 (The Greg Carrasco Show) or his podcast (The Greg Carrasco Show on iTunes).
              </p>
            </div>

            <div className="greg-view-site">
              <PrimaryButton link="http://gregcarrasco.com/live/" target="_blank" rel="noopener noreferrer">
                Visit official site
              </PrimaryButton>
            </div>
          </div>
        </div>
      </FeaturedLayout.Band>
      <FeaturedLayout.Band className="greg-view-band">
        <div className="text-container">
          <div className="text-width">
            <h3 className="greg-view-band-title">Latest episodes</h3>

            <PodcastView />
          </div>
        </div>
      </FeaturedLayout.Band>
    </FeaturedLayout>
  </article>
);
 
export default GregCarrascoView;