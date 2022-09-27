import React, { Component } from "react";
import PrimaryButton from "components/Forms/PrimaryButton";
import HelpBox from "../components/HelpBox";
import Legal from "../components/Legal";
import ArticleMetaTags from "components/common/ArticleMetaTags";
import "../style.scss";
import "./style.scss";

class QuoteIntroView extends Component {
  render() {
    return (
      <article className="insurance-intro-page">
        <ArticleMetaTags title="Insurance" />

        <div className="content-container offset-header">
          <div className="text-container">
            <div className="insurance-content">
              <div className="text-center text-width">
                <div className="insurance-title">
                  <h1>5 mins = up to 8 offers</h1>
                  <div className="insurance-subTitle">
                    Complete a quote and we’ll provide you with rates from
                    Canada’s most well known insurance brands. It only takes a
                    few minutes and if you like the price, we will connect you
                    to an Insurance Advisor. It’s that simple!
                  </div>
                </div>

                <div className="article-text centered what-you-need">
                  <h3>What you need</h3>
                  <ol>
                    <li>
                      <div>
                        <span className="what-number" />
                        Your driving information
                      </div>
                      <ul>
                        <li>When you got your license</li>
                        <li>When/if you became a primary driver</li>
                        <li>Length of time insured</li>
                        <li>Number of tickets and driving suspensions</li>
                      </ul>
                    </li>
                    <li>
                      <div>
                        <span className="what-number" />
                        Your car
                      </div>
                      <ul>
                        <li>Make, model and year of vehicle</li>
                        <li>New or used</li>
                        <li>Purchased or leased</li>
                      </ul>
                    </li>
                    <li>
                      <div>
                        <span className="what-number" />
                        Your coverage
                      </div>
                      <ul>
                        <li>
                          Previous insurance docs – this will help select the
                          right coverage and compare once your premium is
                          calculated
                        </li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <div className="insurance-business-use article-text centered">
                  <p>
                    Use your car for Business or Commercial use?
                    <br />
                    Please call to speak with one of our Insurance Advisors.
                  </p>
                </div>

                <div className="article-text centered">
                  <PrimaryButton
                    className="quote-button"
                    link="/insurance/quote/form"
                  >
                    Get started <span className="icon icon-angle-right" />
                  </PrimaryButton>
                </div>
              </div>

              <div>
                <HelpBox title="Rather speak to an&nbsp;Insurance&nbsp;Advisor?" />
              </div>
            </div>

            <Legal />
          </div>
        </div>
      </article>
    );
  }
}

export default QuoteIntroView;
