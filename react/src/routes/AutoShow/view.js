import React from 'react';
import ArticleMetaTags from 'components/common/ArticleMetaTags';
import FeatureSpot from 'components/common/FeatureSpot';
import FeaturedLayout from 'components/content/FeaturedLayout';
import { makeTileContainer } from 'components/containers/TileContainer';
import IconHeading from './components/IconHeading';
import AutoShowASpot from './components/AutoShowASpot';
import aSpot from './img/a-spot.jpg';
import ticket from './img/ticket.svg';
import PrimaryButton from 'components/Forms/PrimaryButton';
import './style.scss';

const AutoShowTileContainer = makeTileContainer('autoshow');

const View = () => (
  <article className="auto-show">
    <ArticleMetaTags title="AutoShow" />

    <div className="page-width">
      <FeatureSpot images={aSpot} kind="image">
        <AutoShowASpot />
      </FeatureSpot>
    </div>

    <FeaturedLayout name="AutoShow">
      <div className="content-container">
        <div className="text-container">
          <div className="text-width">
            <IconHeading icon={ticket}>
              2020 AutoShow Tickets Available Now
            </IconHeading>
          </div>

          <div className="auto-show-buy">
            <PrimaryButton link="https://www.autoshow.ca/tickets/" target="_blank">
              Buy tickets
            </PrimaryButton>
          </div>
        </div>
      </div>
    </FeaturedLayout>

    <div className="page-width">
      <div className="content-container">
        <hr />
   
        <div className="text-container">
          <div className="text-width">
            <IconHeading>
              2019 AutoShow Highlights
            </IconHeading>
          </div>
        </div>
      </div>

      <AutoShowTileContainer />
    </div>
  </article>
);

export default View;
