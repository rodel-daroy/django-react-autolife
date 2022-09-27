import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, propTypes, registerField, formValueSelector } from 'redux-form';
import { ReduxTextField } from 'components/Forms/TextField';
import { required } from 'utils/validations';
import PrimaryButton from 'components/Forms/PrimaryButton';
import { ReduxRadioButtonGroup } from 'components/Forms/RadioButtonGroup';
import { defaultButtonText } from 'config/constants';
import SelectAssetModal from '../Assets/SelectAssetModal';
import { default as CNJField } from 'components/Forms/Field';
import { connect } from 'react-redux';
import AssetPreview from '../Assets/AssetPreview';
import { ReduxArticleField, getArticleOption } from './ArticleField';
import LoadingOverlay from 'components/common/LoadingOverlay';
import usePrevious from 'hooks/usePrevious';
import { ReduxDropdownField } from 'components/Forms/DropdownField';
import { lookupSponsors } from 'redux/actions/articlesEditActions';
import './TileForm.scss';

const requiredLink = (value, allValues) => {
	if(!value && !allValues.tile_cta_article)
		return 'Please either select an article or enter a link';
};

const TileForm = ({ 
	handleSubmit, 
	loading, 
	onCancel, 
	registerField, 
	form, 
	change, 
	asset,
	article,
	tileCtaLink,
	tileCtaArticle,
	lookupSponsors,
	sponsors
}) => {
	const [selectAssetOpen, setSelectAssetOpen] = useState(false);

	useEffect(() => {
		registerField(form, 'tile_asset', 'Field');
		registerField(form, 'tile_cta_article', 'Field');
	}, [form, registerField]);

	const prevArticle = usePrevious(article);
	useEffect(() => {
		if(article !== prevArticle) {
			if(article)
				change('tile_cta_link', null);

			change('tile_cta_article', article ? article.value : null);
		}
	}, [article, prevArticle, change]);

	useEffect(() => {
			if(tileCtaArticle && typeof tileCtaArticle === 'object') {
				const option = getArticleOption({
					id: tileCtaArticle.article_id,
					heading: tileCtaArticle.article_headline,
					slug: tileCtaArticle.article_slug
				});

				change('article', option);
			}
	}, [tileCtaArticle, change]);

	useEffect(() => {
		if(tileCtaLink)
			change('article', null);
	}, [tileCtaLink, change]);

	const sizes = [1, 2].map(size => ({
		label: size,
		value: size
	}));

	const handleAsset = asset => {
		setSelectAssetOpen(false);
		change('tile_asset', asset);
	};

	const handleAssetClick = () => setSelectAssetOpen(true);

	useEffect(() => {
		lookupSponsors();
	}, [lookupSponsors]);

	const sponsorOptions = useMemo(() => {
		let options = [{
			value: null,
			label: 'No sponsor'
		}];

		if(sponsors) {
			options.push(...sponsors.map(sponsor => ({
				label: <img className="tile-form-sponsor-option" src={sponsor.logo} alt={sponsor.name} />,
				value: sponsor.id
			})));
		}

		return options;
	}, [sponsors]);

	const openLink = tileCtaLink || (article && `/content/${article ? article.slug : ''}`);

	return (
		<form className="tile-form" onSubmit={handleSubmit}>
			<Field
				name="tile_headline"
				label="Heading"
				component={ReduxTextField}
				validate={[required]}
				disabled={loading} />
			<Field
				name="tile_subheadline"
				label="Subheading"
				component={ReduxTextField} 
				disabled={loading} />

			<CNJField
				label="Asset"
				inputComponent={() => (
					<div role="button" onClick={handleAssetClick}>
						{asset && (
							<div className="tile-form-asset-preview">
								<AssetPreview asset={asset} />
							</div>
						)}
						
						<PrimaryButton 
							as="button" 
							type="button" 
							size="small">

							Select asset...
						</PrimaryButton>
					</div>
				)} />

			<Field
				name="sponsor"
				label="Sponsor"
				className="tile-form-sponsor"
				component={ReduxDropdownField}
				options={sponsorOptions}
				searchable={false}
				placeholder="No sponsor"
				parse={value => (value && typeof value === "object") ? value.value : value}
				format={value => (value && typeof value === 'object') ? value.id : value}
				disabled={loading} />

			<Field
				name="tile_cta_text"
				label="CTA"
				component={ReduxTextField}
				placeholder={defaultButtonText}
				disabled={loading} />

			<Field
				name="article"
				label="Link"
				component={ReduxArticleField}
				className="tile-form-article"
				placeholder="Select article"
				disabled={loading}
				last />

			<div className="tile-form-link-or">or</div>

			<Field
				name="tile_cta_link"
				component={ReduxTextField}
				placeholder="enter URL"
				validate={[requiredLink]}
				disabled={loading} />

				<a 
					className="tile-form-link primary-link"
					href={openLink}
					target="_blank"
					rel="noopener noreferrer"
					disabled={!openLink}>
					<span className="icon icon-link"></span>
					&nbsp;Open link in new window
				</a>

			<Field
				name="columns"
				label="Preferred size"
				component={ReduxRadioButtonGroup}
				options={sizes}
				validate={[required]}
				disabled={loading} />

			<div className="tile-form-commands">
				<PrimaryButton type="submit" disabled={loading}>
					Save tile
				</PrimaryButton>

				{onCancel && (
					<button 
						className="btn btn-link primary-link"
						type="button" 
						hasIcon 
						iconClassName="icon icon-cancel" 
						onClick={onCancel}
						disabled={loading}>

						Cancel
					</button>
				)}
			</div>

			{loading && <LoadingOverlay />}

			{selectAssetOpen && (
				<SelectAssetModal 
					onClose={() => setSelectAssetOpen(false)}
					onSubmit={handleAsset} />
			)}
		</form>
	);
};

TileForm.propTypes = {
	...propTypes,
	registerField: PropTypes.func.isRequired,
	asset: PropTypes.object,
	article: PropTypes.any,
	tileCtaLink: PropTypes.string,
	tileCtaArticle: PropTypes.number,
	lookupSponsors: PropTypes.func.isRequired,
	sponsors: PropTypes.array,

	loading: PropTypes.bool,
	onCancel: PropTypes.func
};

const mapStateToProps = (state, { form }) => {
	const formValue = formValueSelector(form);

	return {
		asset: formValue(state, 'tile_asset'),
		article: formValue(state, 'article'),
		tileCtaLink: formValue(state, 'tile_cta_link'),
		tileCtaArticle: formValue(state, 'tile_cta_article'),
		sponsors: state.articlesEdit.sponsors.result
	};
};
 
export default reduxForm({
	form: 'tileForm'
})(connect(mapStateToProps, { registerField, lookupSponsors })(TileForm));