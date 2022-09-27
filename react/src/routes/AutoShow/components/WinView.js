import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FeatureSpot from 'components/common/FeatureSpot';
import aSpot from '../img/a-spot.jpg';
import FeaturedLayout from 'components/content/FeaturedLayout';
import TabSet from 'components/Navigation/TabSet';
import ArticleMetaTags from 'components/common/ArticleMetaTags';
import AutoShowASpot from './AutoShowASpot';
import { withRouter } from 'react-router';
import { getScrollContainer } from 'utils/style';
import './WinView.scss';

const TABS = [
  {
    hash: '#daily-prize',
    caption: 'Win $10K in instant prizes',
    content: () => (
      <iframe 
        title="promo"
        src="https://pr.easypromosapp.com/p/835777?micro=1&utm_source=widget&utm_medium=embed"
        width="100%" 
        height="850" 
        frameBorder="0" 
        webkitallowfullscreen="true" 
        mozallowfullscreen="true" 
        allowFullScreen />
    )
  },
  {
    hash: '#grand-prize',
    caption: 'Win your AutoLife adventure',
    content: () => (
      <iframe 
        title="promo"
        src="https://a.cstmapp.com/p/29798?micro=1&utm_source=widget&utm_medium=embed"
        width="100%" 
        height="850" 
        frameBorder="0" 
        webkitallowfullscreen="true" 
        mozallowfullscreen="true" 
        allowFullScreen />
    )
  },
  {
    hash: '#mr-bentley',
    caption: 'Win my Bentley',
    content: () => (
      <iframe 
        title="promo"
        src="https://a.cstmapp.com/p/30119?micro=1&utm_source=widget&utm_medium=embed"
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
        <ArticleMetaTags title="Win with AutoLife!" />

        <div className="page-width">
          <FeatureSpot images={aSpot} kind="image">
            <AutoShowASpot />
          </FeatureSpot>
        </div>

        <div ref={ref => this._container = ref}>
          <FeaturedLayout name="autolife.win" share={false}>
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

            <FeaturedLayout.Band>
              <div className="text-container">
                <div className="legal-area">
                  <section className="auto-show-win-rules">
                    <h4>
                      Instant Win Contest
                    </h4>
                    <strong>No purchase necessary.</strong>
                    <h5>Contest period</h5>
                    <p>February 15th 2019 to February 24th 2019 4pm.</p>
                    <h5>Eligibility</h5>
                    <ol>
                      <li>There will be a daily draw of at least 10 draws per day. The maximum daily value of all the draws will be $1,000.00 in giveaways.</li>
                      <li>To enter this contest, you must provide a valid email address.</li>
                      <li>The Contest is open to Ontario residents only.</li>
                      <li>The Contestants must be 18 years of age or older.</li>
                      <li>There are unlimited entries allowed, per day.</li>
                      <li>Only 1 winner per household per day will be selected.</li>
                      <li>The Winners will be notified by email and will be given the instructions on how to redeem the prize.</li>
                      <li>If you have questions about the collection of personal information by the TADA as referenced above, please contact the Trillium Automobile Dealers Association, 50 Leek Cres., 2B; Richmond Hill ON L4B 4J3 at (905) 940-6232 or by email at <a href="mailto:info@tada.ca">info@tada.ca</a>.</li>
                    </ol>
                    <p>
                      Entrants and winner(s) cannot be an employee of, or living with an employee of The Canadian International AutoShow, the Trillium Automobile Dealers Association (aka. TADA) or AutoLife, and their subsidiaries, affiliates, agents or representatives or a member of an employee&rsquo;s immediate family. Members of the immediate family of an employee not eligible to receive a prize include the employee&rsquo;s parents, children and siblings.
                    </p>
                    <p>
                      By entering this Contest, entrants agree to accept and abide by the Contest Rules. All decisions of AutoLife with respect to any aspect of this Contest, including without limitation the eligibility of entries, are final and binding for all entrants in all matters as they relate to this Contest.
                    </p>
                  </section>

                  <section className="auto-show-win-rules">
                    <h4>Your AutoLife Adventure</h4>
                    <strong>No purchase necessary.</strong>
                    <h5>Contest period</h5>
                    <p>February 4th 2019 - March 1st 2019</p>
                    <p>
                      The Contest will occur on the Autolife (&ldquo;Sponsor&rdquo;) website at Autolife.win. 
                      Autolife is owned and operated by the Trillium Automotive Dealer Association (TADA). 
                      Entries for the Your Autolife Adventure contest (the &ldquo;Contest&rdquo;) will be accepted on the Autolife website.
                    </p>
                    <h5>Eligibility</h5>
                    <ol>
                      <li>There will be two random drawings, on or about March 2nd 2019, by Autolife &amp; the Trillium Automotive Dealer Association (TADA).</li>
                      <li>Entries that are incomplete, illegible, or corrupted are void and will not be accepted.</li>
                      <li>To enter the contest, you must complete the form on the Autolife.win website.</li>
                      <li>The Contest is open to Ontario residents only.</li>
                      <li>The Contestant must be 18 years of age or older.</li>
                      <li>Only one entry, per person, per day is allowed.</li>
                      <li>The two winners can&rsquo;t be from the same household.</li>
                      <li>The two winners will be notified by email and will be given the instructions on how to redeem his/her prize.</li>
                      <li>If you have questions about the collection of personal information by the TADA, as referenced above, please contact the Trillium Automobile Leaders Association, 50 Leek Cres., 2 B; Richmond Hill  ON  L4B 4J3  at (905) 940-6232 or by email at <a href="mailto:info@tada.ca">info@tada.ca</a>.</li>
                    </ol>
                    <h5>The Grand Prize</h5>
                    <ul>
                      <li>Is a trip worth $5,000.00 Canadian towards an experience of your choice. If the trip value exceeds the grand prize amount of $5,000.00, the winner must pay the difference.</li>
                      <li>Must be booked through Away by TTI Travel.</li>
                      <li>Can&rsquo;t be sold to other(s).</li>
                      <li>Can&rsquo;t be exchanged for cash.</li>
                      <li>Can&rsquo;t be transferred to others.</li>
                      <li>Must be redeemed, for travel, by February 29th, 2020.</li>
                    </ul>
                    <p>All expenses not specified herein are the winners&rsquo; responsibility.<br />Odds of winning are determined by the total number of entries received.</p>
                    <p>
                      Entrants and winner(s) cannot be an employee of, or living with an employee of The Canadian International AutoShow, the Trillium Automobile Dealers Association (aka. TADA) or AutoLife, and their subsidiaries, affiliates, agents or representatives or a member of an employee&rsquo;s immediate family. Members of the immediate family of an employee not eligible to receive a prize include the employee&rsquo;s parents, children and siblings. 
                    </p>
                    <p>
                      By entering this Contest, entrants agree to accept and abide by the Contest Rules. All decisions of AutoLife with respect to any aspect of this Contest, including without limitation the eligibility of entries, are final and binding for all entrants in all matters as they relate to this Contest.
                    </p>
                    <h5>Disclaimer</h5>
                    <p>
                      The Sponsor reserves the right to terminate the Entry Period prior to its scheduled termination and to choose among entries received prior to the date of such early termination. 
                      The Sponsor reserves the right to review all entries on a rolling basis as they come in. 
                      In the event that entry processing challenges or technical malfunctions occur, the Sponsor reserves the right to change or discontinue the entry submission procedures.
                    </p>
                    <p>
                      Entrants agree to be bound by these rules. 
                      Failure to comply with these rules may result in disqualification from this Contest. 
                      The Sponsor reserves the right to permanently disqualify any person it believes has intentionally violated these rules.
                    </p>
                    <p>
                      By providing your email address and selecting &ldquo;Submit&rdquo;, you agree to our Privacy Notice (<a href="https://www.autolife.ca/content/privacy-policy">https://www.autolife.ca/content/privacy-policy</a>) and to receive e-mails from Autolife. 
                      You may withdraw your consent to receiving emails from Autolife at any time by clicking the unsubscribe link in the email or contacting us at:<br />
                      50 Leek Cres., 2B, Richmond Hill, ON L4B 4J3 at (905) 940-6232 or by email at <a href="mailto:info@tada.ca">info@tada.ca</a>.
                    </p>
                  </section>

                  <section className="auto-show-win-rules">
                    <h4>&ldquo;You could win my Bentley&rdquo; Contest</h4>
                    <strong>No purchase necessary.</strong>
                    <p>
                      The Contest will occur on the Autolife (&ldquo;Sponsor&rdquo;) website at Autolife.win. 
                      Autolife is owned and operated by the Trillium Automotive Dealer Association (TADA). 
                      Entries for the Your Autolife Adventure contest (the &ldquo;Contest&rdquo;) will be accepted on the Autolife website.
                    </p>
                    <h5>Eligibility</h5>
                    <ol>
                      <li>There will be ONE random drawing, on or about February 26, 2019, by Autolife &amp; the Trillium Automotive Dealer Association (TADA).</li>
                      <li>Entries that are incomplete, illegible, or corrupted are void and will not be accepted.</li>
                      <li>To enter the contest, you must complete the form on the Autolife.win website.</li>
                      <li>The Contest is open to Ontario residents only.</li>
                      <li>The Contestant must be 18 years of age or older.</li>
                      <li>Only one entry, per person, per day is allowed.</li>
                      <li>The two winners can&rsquo;t be from the same household.</li>
                      <li>The two winners will be notified by email and will be given the instructions on how to redeem his/her prize.</li>
                      <li>If you have questions about the collection of personal information by the TADA, as referenced above, please contact the Trillium Automobile Leaders Association, 50 Leek Cres., 2 B; Richmond Hill  ON  L4B 4J3  at (905) 940-6232 or by email at <a href="mailto:info@tada.ca">info@tada.ca</a>.</li>
                    </ol>
                    <h5>&ldquo;You could win my Bentley&rdquo; Prizing details</h5>
                    <ul>
                      <li>The prize is a Bentley EXP 12V kids electric ride-on car with R/C Parental remote (any imagery shown on promotional advertising and/or literature may differ from the actual prize)</li>
                      <li>The generally accepted retail value of the prize is $700 CDN</li>
                      <li>The prize must be claimed by the winner identified on the ballot and the winning ballot cannot be sold to other(s)</li>
                      <li>The winner must show government issued photo identification in order to claim the prize.</li>
                      <li>The winner will be notified by email using the email address on the completed ballot.</li>
                      <li>The winner must collect the prize &ldquo;as is&rdquo; and there is no cash equivalent in exchange for declining to collect the prize.</li>
                      <li>The winning ballot cannot be transferred to another party</li>
                      <li>Contest period: Monday, Friday February 18, 2019 at 10:30am EST to February 24, 2019 at 5:59 PM EST</li>
                      <li>Draw will take place on or about February 26, 2019 and the winner&rsquo;s name shall be made public.</li>
                      <li>All expenses not specified herein are the winners&rsquo; responsibility.</li>
                      <li>Odds of winning are determined by the total number of entries received.</li>
                    </ul>
                    <p>
                      Entrants and winner(s) cannot be an employee of, or living with an employee of The Canadian International AutoShow, the Trillium Automobile Dealers Association (aka. TADA) or AutoLife, and their subsidiaries, affiliates, agents or representatives or a member of an employee&rsquo;s immediate family. Members of the immediate family of an employee not eligible to receive a prize include the employee&rsquo;s parents, children and siblings. 
                    </p>
                    <p>
                      By entering this Contest, entrants agree to accept and abide by the Contest Rules. All decisions of AutoLife with respect to any aspect of this Contest, including without limitation the eligibility of entries, are final and binding for all entrants in all matters as they relate to this Contest.
                    </p>
                    <h5>Disclaimer</h5>
                    <p>
                      The Sponsor reserves the right to terminate the Entry Period prior to its scheduled termination and to choose among entries received prior to the date of such early termination. 
                      The Sponsor reserves the right to review all entries on a rolling basis as they come in. 
                      In the event that entry processing challenges or technical malfunctions occur, the Sponsor reserves the right to change or discontinue the entry submission procedures.
                    </p>
                    <p>
                      Entrants agree to be bound by these rules. 
                      Failure to comply with these rules may result in disqualification from this Contest. 
                      The Sponsor reserves the right to permanently disqualify any person it believes has intentionally violated these rules.
                    </p>
                    <p>
                      By providing your email address and selecting &ldquo;Submit&rdquo;, you agree to our Privacy Notice (<a href="https://www.autolife.ca/content/privacy-policy">https://www.autolife.ca/content/privacy-policy</a>) and to receive e-mails from Autolife. 
                      You may withdraw your consent to receiving emails from Autolife at any time by clicking the unsubscribe link in the email or contacting us at:<br />
                      50 Leek Cres., 2B, Richmond Hill, ON L4B 4J3 at (905) 940-6232 or by email at <a href="mailto:info@tada.ca">info@tada.ca</a>.
                    </p>
                  </section>
                </div>
              </div>
            </FeaturedLayout.Band>
          </FeaturedLayout>
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