import React from 'react';
import ArticleMetaTags from 'components/common/ArticleMetaTags';
import ASpotBody from 'components/common/ASpotBody';
import FeatureSpot from 'components/common/FeatureSpot';
import PrimaryButton from 'components/Forms/PrimaryButton';
import CircleIcons from './components/CircleIcons';
import CircleIcon from './components/CircleIcon';
import SiriusVINBox from './components/SiriusVINBox';
import image from './img/siriusxm.jpg';
import logo from './img/siriusxm-logo.svg';
import image1 from './img/01.svg';
import car from './img/car.svg';
import home from './img/home.svg';
import cfree from './img/cfree.svg';
import music from './img/music.svg';
import sports from './img/sports.svg';
import stationsTop from './img/stations-1.jpg';
import stationsBottom from './img/stations-2.jpg';
import FeaturedLayout from 'components/content/FeaturedLayout';
import Boxout from 'components/content/Boxout';
import { makeTileContainer } from 'components/containers/TileContainer';
import './style.scss';

const SiriusXMTileContainer = makeTileContainer('SiriusXM');

const View = () => (
  <article className="sirius-xm">
    <ArticleMetaTags title="SiriusXM" />

    <div className="page-width">
      <FeatureSpot images={image} kind="image">
        <div className="sirius-xm-logo-outer">
          <img className="sirius-xm-logo" src={logo} alt="SiriusXM" />
        </div>
        <ASpotBody heading="Discover What&rsquo;s on SiriusXM" synopsis="Hop in, Turn on &amp; Enjoy!" />
      </FeatureSpot>

      <FeaturedLayout name="SiriusXM">
        <div className="content-container">
          <div className="text-container">
            <div className="text-width">
              <div className="article-text sirius-xm-image-1-content">
                <h2>SiriusXM offers subscribers access to endless audio entertainment. Customize over 140+ channels to your liking and access exclusive programming available whenever and wherever you like!</h2>

                <h2 className="sirius-xm-title">Welcome to a whole new world of radio!</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="content-container sirius-xm-shade-1">
          <div className="text-container">
            <div className="text-width sirius-xm-container">
              <img className="sirius-xm-image-1" src={image1} alt="" />

              <div className="article-text sirius-xm-image-1-content">
                <p>Whether you are going on the ultimate road trip, travelling around the corner or relaxing in the comfort of your home, you&rsquo;ll have access to commercial-free music, artist-dedicated channels, entertainment &amp; comedy programming, the best in talk as well as the most comprehensive sports coverage available.</p>
              </div>

              <CircleIcons>
                <CircleIcon caption="On the road" image={car} />
                <CircleIcon caption="At Home" image={home} />
                <CircleIcon caption="Commercial Free" image={cfree} />
                <CircleIcon caption="Music, Talk, Comedy &amp; Entertainment" image={music} />
                <CircleIcon caption="Comprehensive Sports" image={sports} />
              </CircleIcons>
            </div>
          </div>
        </div>
        <div className="sirius-xm-image-strip">
        </div>
        <div className="content-container sirius-xm-shade-2">
          <div className="text-container">
            <div className="text-width">
              <div className="article-text dark">
                <h3>Listen Everywhere</h3>
                <p>Imagine channels and channels of anything you want to listen to — 140+ of them (and 200+ with XM All Access), to be precise. Commercial-free music? Check. All your favorite sports? Yup. Exclusive talk and entertainment? Of course. Not to mention comedy, news, traffic, weather and more. There&rsquo;s no downloading, no managing playlists, nothing. Just a ton of great stuff right at your fingertips. There&rsquo;s even a full range of additional services for your car, like infotainment and traffic.</p>
                <p>What’s more, you can stream SiriusXM on tons of devices all over your house — from smart TVs and wireless speakers to media players and more — and it’s included with your SiriusXM trial, along with Select+ and All Access subscriptions.</p>
              </div>
            </div>
          </div>

          <img className="sirius-xm-stations" src={stationsTop} alt="" />
        </div>
        <div className="content-container">
          <img className="sirius-xm-stations" src={stationsBottom} alt="" />

          <div className="text-container">
            <div className="text-width">
              <SiriusVINBox />

              <div className="article-text centered sirius-xm-steps">
                <h2 className="sirius-xm-title">Test Drive the 30-day trial for Free!</h2>

                <p>Why not try the 30-day trial. It takes 3 easy steps to subscribe:</p>

                <Boxout>
                  <ol>
                    <li>Sign-up</li>
                    <li>Turn on your radio</li>
                    <li>Start listening</li>
                  </ol>
                </Boxout>

                <div className="sirius-xm-not-sure">Not sure if your car is compatible? You can either browse by vehicles or use the <a href="https://www.siriusxm.ca/what-is-siriusxm/in-your-vehicle/vin-lookup/" target="_blank">VIN look-up tool</a> to see.</div>

                <PrimaryButton link="http://siriusxm.ca/findyoursound" target="_blank">
                  Subscribe now <span className="icon icon-angle-right"></span>
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </FeaturedLayout>

      <SiriusXMTileContainer />
    </div>
  </article>
);

export default View;
