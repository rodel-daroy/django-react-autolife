import React from 'react';
import PropTypes from 'prop-types';
import { resizeImageUrl } from 'utils';
import ObjectFit from 'components/common/ObjectFit';
import './AssetPreview.scss';

const AssetPreview = ({ asset }) => {
	if(Array.isArray(asset))
		asset = asset[0];

	const { name, asset_type, asset_content } = asset;

	let imageUrl = asset.asset_url;
	if(asset_type === 'image' && asset_content && asset_content.length > 0)
		imageUrl = asset_content[0].url;
		
	return (
		<div className="asset-preview">
			{imageUrl && (
				<div className="asset-preview-image">
					<ObjectFit fit="contain">
						<img src={resizeImageUrl(imageUrl, 200)} alt="" />
					</ObjectFit>
				</div>
			)}

			<div className="asset-preview-name">{name}</div>
		</div>
	);
};

AssetPreview.propTypes = {
	asset: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired
};

export default AssetPreview;