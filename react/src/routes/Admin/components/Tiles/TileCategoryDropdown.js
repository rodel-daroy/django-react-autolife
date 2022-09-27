import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadCategories } from 'redux/actions/tileActions';
import DropdownField from 'components/Forms/DropdownField';
import orderBy from 'lodash/orderBy';
import usePrevious from 'hooks/usePrevious';
import './TileCategoryDropdown.scss';

const TileCategoryDropdown = ({ 
	loadCategories, 
	categories: { result: categories }, 
	value, 
	onChange
}) => {
	useEffect(() => {
		loadCategories();
	}, [loadCategories]);

	const sortedCategories = useMemo(() => {
		if(categories)
			return orderBy(categories, ['categoryName']);

		return null;
	}, [categories]);

	const categoryOptions = useMemo(() => {
		return (sortedCategories || []).map(cat => ({
			value: cat.id,
			label: cat.name
		}));
	}, [sortedCategories]);

	const prevSortedCategories = usePrevious(sortedCategories);
	useEffect(() => {
		if(sortedCategories && sortedCategories !== prevSortedCategories) {
			if(sortedCategories.length > 0 && !value)
				onChange(sortedCategories[0].id);
			else {
				// eslint-disable-next-line eqeqeq
				if(value && !sortedCategories.find(cat => cat.id == value))
					onChange(null);
			}
		}
	}, [sortedCategories, prevSortedCategories, onChange, value]);

	const handleChange = category => {
		if(category && typeof category === 'object')
			onChange(category.value);
		else
			onChange(category);
	};
	
	return (
		<div className="tile-category-dropdown">
			<DropdownField
				label="Category"
				options={categoryOptions}
				value={value}
				searchable={false}
				onChange={handleChange} />
		</div>
	);
};

TileCategoryDropdown.propTypes = {
	value: PropTypes.any,
	onChange: PropTypes.func.isRequired,

	loadCategories: PropTypes.func.isRequired,
	categories: PropTypes.any
};

const mapStateToProps = state => ({
	categories: state.tiles.categories
});
 
export default connect(mapStateToProps, { loadCategories })(TileCategoryDropdown);