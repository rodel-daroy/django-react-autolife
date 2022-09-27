import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ResponsiveModal from 'components/common/ResponsiveModal';
import AssetSelector from './AssetSelector';
import TabSet from 'components/Navigation/TabSet';
import AssetForm from './AssetForm';
import { connect } from 'react-redux';
import { createAsset } from 'redux/actions/assetActions';
import { showInfoModal } from 'redux/actions/infoModalActions';
import Spinner from 'components/common/Spinner';
import get from 'lodash/get';
import './SelectAssetModal.scss';

const getErrorMessage = error => get(error, 'data.Message', 'Bad request');

const SelectAssetModal = ({
	onClose, 
	onSubmit, 
	selectedId, 
	createAsset, 
	asset: { loading, result },
	showInfoModal
}) => {
	useEffect(() => {
		if(result)
			onSubmit(result);
	}, [result]);
	
	const handleAssetSelect = (id, asset) => {
		onSubmit(asset);
	};

	const handleAssetCreate = async asset => {
		try {
			const result = await createAsset(asset);
			onSubmit(result);
		}
		catch(error) {
			showInfoModal('Error', getErrorMessage(error));
		}
	};

	return (
		<ResponsiveModal className="select-asset-modal" onClose={onClose}>
			<ResponsiveModal.Block position="left">
				<h2>Select asset</h2>
				<div className="select-asset-modal-inner">
					<TabSet 
						name="selectAssetTabs" 
						className="select-asset-modal-tabs"
						tabs={[{
							caption: 'Use existing asset',
							content: () => (
								<AssetSelector selectedId={selectedId} onChange={handleAssetSelect} />
							)
						},
						{
							caption: 'Upload asset',
							content: () => (
								<AssetForm onSubmit={handleAssetCreate} />
							)
						}]} />

					{loading && (
						<Spinner />
					)}
				</div>
			</ResponsiveModal.Block>
		</ResponsiveModal>
	);
};

SelectAssetModal.propTypes = {
	selectedId: PropTypes.string,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,

	createAsset: PropTypes.func.isRequired,
	asset: PropTypes.object.isRequired,
	showInfoModal: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	asset: state.assets.createAsset
});
 
export default connect(mapStateToProps, { createAsset, showInfoModal })(SelectAssetModal);