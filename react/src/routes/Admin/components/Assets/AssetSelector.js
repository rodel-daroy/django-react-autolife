import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadAssets } from 'redux/actions/assetActions';
import PagedList from 'components/Layout/PagedList';
import AssetPreview from './AssetPreview';
import TextField from 'components/Forms/TextField';
import debounce from 'lodash/debounce';
import './AssetSelector.scss';

const AssetSelectorAsset = ({ asset, onClick, selected }) => (
	<button 
		className={`asset-selector-asset ${selected ? 'selected' : ''}`} 
		type="button" 
		onClick={onClick}>

		<AssetPreview asset={asset}></AssetPreview>
	</button>
);

AssetSelectorAsset.propTypes = {
	asset: PropTypes.object.isRequired,
	onClick: PropTypes.func,
	selected: PropTypes.bool
};

const AssetSelector = ({ loadAssets, assets: { loading, all }, onChange, selectedId }) => {
	const [pageIndex, setPageIndex] = useState();
	const [searchText, setSearchText] = useState('');
	const [key, setKey] = useState(0);

	const handleRangeChange = ({ startIndex, endIndex }) => {
		loadAssets({
			startIndex,
			count: (endIndex - startIndex) + 1,
			filter: {
				name: searchText
			}
		});
	};

	const updateKey = useCallback(debounce(() => {
		setKey(key => key + 1);
		setPageIndex(0);
	}, 500), []);

	useEffect(() => updateKey, [searchText]);
	useEffect(() => () => updateKey.cancel(), []);

	const renderAssets = useCallback(({ startIndex, endIndex }) => {
		return (
			<div className="asset-selector-assets">
				{(all || []).slice(startIndex, endIndex).filter(asset => !!asset).map(asset => (
					<AssetSelectorAsset 
						key={asset.id} 
						asset={asset} 
						onClick={() => onChange(asset.id, asset)}
						selected={asset.id === selectedId} />
				))}
			</div>
		);
	}, [onChange, all]);

	return (
		<div>
			<TextField 
				prefix={(
					<span className="icon icon-search"></span>
				)}
				placeholder="Search assets" 
				value={searchText} 
				onChange={setSearchText} />

			<PagedList
				key={`list-${key}`}
				className="asset-selector"
				totalCount={all ? all.length : 0}
				loading={loading}
				pageIndex={pageIndex}
				onChange={setPageIndex}
				onRangeChange={handleRangeChange}>
				
				{renderAssets}
			</PagedList>
		</div>
	);
};

AssetSelector.propTypes = {
	selectedId: PropTypes.string,
	onChange: PropTypes.func.isRequired,

	loadAssets: PropTypes.func.isRequired,
	assets: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	assets: state.assets.assets
});
 
export default connect(mapStateToProps, { loadAssets })(AssetSelector);