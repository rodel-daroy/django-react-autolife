import React from 'react';
import ArticleMetaTags from 'components/common/ArticleMetaTags';
import FeatureSpot from 'components/common/FeatureSpot';
import ASpotBody from 'components/common/ASpotBody';
import FeaturedLayout from 'components/content/FeaturedLayout';
import Card from 'components/content/Card';
import PrimaryButton from 'components/Forms/PrimaryButton';
import aSpotImage from './img/image002.jpg';
import cardImage from './img/Lobby.jpg';
import './style.scss';

const SpringGetawayView = () => (
  <article className="spring-getaway">
    <ArticleMetaTags title="Spring Getaway" />

    <div className="page-width">
      <FeatureSpot images={aSpotImage} kind="image">
        <ASpotBody 
          heading={<span>Spring is Here!<br/>Time to get out there and explore</span>}
          synopsis="Enter our Spring Getaway Contest today" />
      </FeatureSpot>
    </div>

    <FeaturedLayout name="Spring Getaway">
      <FeaturedLayout.Band>
        <div className="text-container">
          <div className="text-width article-text spring-getaway-text">
            <p>
              Okay so you&rsquo;ve been hiding like a bear all winter and now that spring has finally arrived, it&rsquo;s about time we got you out there exploring.
              The great news is that there are lots of places that are just a short drive from the GTA.
              Hidden gems, right here in our backyard.
            </p>
            <p>
              Because we know how long you&rsquo;ve been waiting to get out there - we&rsquo;ve made it real easy to enter our Spring Getaway Contest.
              Simply register to AutoLife.ca (it&rsquo;s free) between April 22nd, 2019 and April 30th 2019 and you are automatically entered.
              Potential winners will be chosen from all registrants and must be 18 yrs of age.
              In order to claim their prize you must meet all contest requirements and answer a skill testing question to be declared&nbsp;a&nbsp;winner.  
            </p>
          </div>

          <div className="spring-getaway-signup text-center">
            <PrimaryButton link="?register">
              Sign up
            </PrimaryButton>
          </div>
        
          <div className="text-width">
            <Card image={cardImage}>
              <h4>Win 1 of 2, $225 Gift Cards for Hockley&nbsp;Valley&nbsp;Resort!</h4>
              <p>
                Nestled in the headwaters region of Southern Ontario, Hockley Valley Resort is located just 60 mins from Toronto.
              </p>
              <p>
                Once you arrive you&rsquo;ll easily forget that you&rsquo;re just a short drive from the city.
              </p>
              <p>
                Your gift certificate can be used at the spa, restaurants, for a round of golf or towards your accommodations. 
              </p>
            </Card>
          </div>
        
          <div className="legal-area">
            <h4>EXPLORE YOUR AUTOLIFE (HOCKLEY VALLEY)<br />CONTEST RULES AND REGULATIONS</h4>

            <p><strong>No purchase necessary.</strong></p>

            <p><strong>Contest period:</strong> Begins April 22nd 2019 at 9:00 AM EST and ends on April 29th, 2019 at 12:00 AM EST.</p>

            <p>The Contest will occur on the Autolife (&ldquo;Sponsor&rdquo;) website at Autolife.ca. autolife.ca is owned and operated by the Trillium Automotive Dealer Association (aka. TADA). Entries for the &ldquo;Explore your AutoLife&rdquo; contest (the &ldquo;Contest&rdquo;) will be accepted on the Autolife website.</p>

            <p>
              <strong>Eligibility:</strong>
              <ol>
                <li>There will be two random drawings, on or about April 30th 2019, by Autolife and the Trillium Automotive Dealer Association (TADA).</li>
                <li>Entries that are incomplete, illegible, or corrupted are void and will not be accepted.</li>
                <li>To enter the contest, you must complete registration on the Autolife.ca website within the Contest Period. Following registration, you will be entered to win 1 of 2 Hockley Valley Resort Gift cards: <a href="http://www.hockley.com/">http://www.hockley.com/</a></li>
                <li>The Contest is open to Ontario residents only.</li>
                <li>The Contestant must be 18 years of age or older.</li>
                <li>Only one entry, per person, is allowed.</li>
                <li>A skill testing question must be successfully answered before a contestant may be declared a winner.</li>
                <li>The two winners cannot be from the same household.</li>
                <li>The two winners will be notified by email and will be given the instructions on how to redeem his/her prize.</li>
                <li>If you have questions about the collection of personal information by the TADA, as referenced above, please contact the Trillium Automobile Leaders Association, 50 Leek Cres., 2 B; Richmond Hill ON L4B 4J3 at (905) 940-6232 or by email at <a href="mailto:info@tada.ca">info@tada.ca</a>.</li>
              </ol>
            </p>

            <p>
              <strong>Prizing:</strong>
              <ul>
                <li>The prize is 1 of 2 gift cards valued at $225.00 Canadian each towards an experience of your choice at the Hockley Valley Resort. The choices are: Dinner at the resort, the spa, a round of golf or towards accommodations. The winners decide. If the experience value exceeds the prize amount of $225.00, the winner must pay the difference.</li>
                <li>Must be redeemed at the Hockley Valley Resort.</li>
                <li>Can&rsquo;t be sold to other(s).</li>
                <li>Can&rsquo;t be exchanged for cash.</li>
                <li>Can&rsquo;t be transferred to others.</li>
              </ul>
              All expenses not specified herein are the winners&rsquo; responsibility.<br />
              Odds of winning are determined by the total number of entries received.
            </p>

            <p>
              Entrants and winner(s) cannot be an employee of, or living with an employer of the Trillium Automobile Dealers Association (aka. TADA) or AutoLife, and their subsidiaries, affiliates, agents or representatives or a member of an employee&rsquo;s immediate family. Members of the immediate family of an employee not eligible to receive a prize include the employee&rsquo;s parents, children and siblings.
            </p>
            <p>
              By entering this Contest, entrants agree to accept and abide by the Contest Rules. All decisions of AutoLife with respect to any aspect of this Contest, including without limitation the eligibility of entries, are final and binding for all entrants in all matters as they relate to this Contest.
            </p>
            <p>
              <strong>Disclaimer:</strong><br />
              The Sponsor reserves the right to terminate the Entry Period prior to its scheduled termination and to choose among entries received prior to the date of such early termination. The Sponsor reserves the right to review all entries on a rolling basis as they come in. In the event that entry processing challenges or technical malfunctions occur, the Sponsor reserves the right to change or discontinue the entry submission procedures.
            </p>
            <p>
              Entrants agree to be bound by these rules. Failure to comply with these rules may result in disqualification from this Contest. The Sponsor reserves the right to permanently disqualify any person it believes has intentionally violated these rules.
              By providing your email address and selecting &ldquo;Submit&rdquo;, you agree to our Privacy Notice (<a href="https://www.autolife.ca/content/privacy-policy">https://www.autolife.ca/content/privacy-policy</a>) and to receive e-mails from Autolife. You may withdraw your consent to receiving emails from Autolife at any time by clicking the unsubscribe link in the email or contacting us at: 50 Leek Cres., 2B, Richmond Hill, ON L4B 4J3 at (905) 940-6232 or by email at <a href="mailto:info@tada.ca">info@tada.ca</a>.
            </p>
          </div>
        </div>
      </FeaturedLayout.Band>
    </FeaturedLayout>
  </article>
);
 
export default SpringGetawayView;