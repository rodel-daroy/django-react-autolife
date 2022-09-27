import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PrimaryButton from 'components/Forms/PrimaryButton';
import CheckboxField from 'components/Forms/Checkbox';
import ResponsiveModal from 'components/common/ResponsiveModal';
import './RemoveTileModal.scss';

const RemoveTileModal = ({ onRemove, onDelete, onCancel }) => {
	const [deleteTile, setDeleteTile] = useState(false);

	const handleChange = checked => {
		if(checked !== deleteTile)
			setDeleteTile(checked);
	};

	return (
		<ResponsiveModal onClose={onCancel}>
			<ResponsiveModal.Block position="left">
				<div className="remove-tile-modal">
					<p>Are you sure you want to remove this tile?</p>

					<div className="remove-tile-modal-check">
						<CheckboxField
							label="Permanently delete tile"
							value={deleteTile}
							onChange={handleChange} />
					</div>

					<div>
						<PrimaryButton type="button" onClick={deleteTile ? onDelete : onRemove}>
							{deleteTile ? 'Delete' : 'Remove'} tile
						</PrimaryButton>
						<button className="btn btn-link primary-link" type="button" onClick={onCancel}>
							<span className="icon icon-cancel"></span> Cancel
						</button>
					</div>
				</div>
			</ResponsiveModal.Block>
		</ResponsiveModal>
	);
};

RemoveTileModal.propTypes = {
	onRemove: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired
};
 
export default RemoveTileModal;