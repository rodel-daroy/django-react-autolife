import React from 'react';
import FeatureSpot from 'components/common/FeatureSpot';
import Breadcrumbs from 'components/Navigation/Breadcrumbs';
import PrimaryButton from 'components/Forms/PrimaryButton';
import Sponsor from 'components/content/Sponsor';
import ArticleMetaTags from 'components/common/ArticleMetaTags';
import ASpotBody from 'components/common/ASpotBody';

import image from './img/a-spot.jpg';
import logo from './img/logo_carsandjobs.png';

import './style.scss';

const View = props => (
	<article className="cars-and-jobs">
		<ArticleMetaTags title="Find a Job" />

		<div className="page-width">
			<FeatureSpot short images={image} kind="image" frameContent={<Sponsor name="Cars &amp; Jobs" image={logo} />}>
				<ASpotBody heading="Find a job" synopsis="A career in the Ontarian automotive industry is closer than you think!" />
			</FeatureSpot>
		</div>

		<div className="content-container">
			<div className="text-container">
				<Breadcrumbs>
					<Breadcrumbs.Crumb name="Find a Job" />
				</Breadcrumbs>

				<div className="cars-and-jobs-content">
					<div className="text-width">
						<div className="article-text centered">
							<p>With our frequently updated and comprehensive listing of available car industry jobs in Ontario, you can filter job postings by both city and department - to quickly find the car industry career listings that are relevant to you.</p>
							<h3>Which industry sectors are you interested in exploring?</h3>
							<ul className="industry-sectors">
								<li>
									<PrimaryButton link="https://www.carsandjobs.com/jobs/browse?category=sales&detail=1" target="_blank" rel="noopener noreferrer">
										Sales
									</PrimaryButton>
								</li>
								<li>
									<PrimaryButton link="https://www.carsandjobs.com/jobs/browse?category=office&detail=1" target="_blank" rel="noopener noreferrer">
										Office
									</PrimaryButton>
								</li>
								<li>
									<PrimaryButton link="https://www.carsandjobs.com/jobs/browse?category=service&detail=1" target="_blank" rel="noopener noreferrer">
										Service
									</PrimaryButton>
								</li>
								<li>
									<PrimaryButton link="https://www.carsandjobs.com/jobs/browse?category=parts&detail=1" target="_blank" rel="noopener noreferrer">
										Parts
									</PrimaryButton>
								</li>
							</ul>
							<p>New postings appear on a daily basis, so check back often to find new and exciting opportunities!</p>
							{/* <p>For answers to your most pressing automotive career questions, visit our <a href="https://www.carsandjobs.com/faqs" target="_blank" rel="noopener noreferrer">FAQ</a> page.</p> */}
							<p>Visit TADA’s full website to <a href="https://www.carsandjobs.com/students" target="_blank" rel="noopener noreferrer">learn more about our Education Committee</a>, which has partnered with Ontario educational institutions to create programs that prepare candidates for successful automotive careers.</p>
							{/* <p>You can also access our convenient <a href="https://www.carsandjobs.com/find-a-dealer" target="_blank" rel="noopener noreferrer">dealer locator</a> tool to find dealerships in your specific area.</p> */}

							<ul className="commands">
								<li>
									<PrimaryButton link="https://www.carsandjobs.com/jobs/browse" target="_blank" rel="noopener noreferrer">
										See all Current Jobs
									</PrimaryButton>
								</li>
								<li>
									<PrimaryButton link="https://www.carsandjobs.com/register" target="_blank" rel="noopener noreferrer">
										Create your Job Seeker Account
									</PrimaryButton>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</article>
);

export default View;