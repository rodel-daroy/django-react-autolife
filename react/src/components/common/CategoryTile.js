import React from "react"
import PropTypes from "prop-types"
import ObjectFit from "components/common/ObjectFit"

const CategoryTile = ({ image, name, as: Component, ...otherProps }) => (
	<Component {...otherProps} className="btn category-tile" aria-label={name}>
		<div className="category-tile-inner">
			<div className="category-tile-image">
				<ObjectFit>
					<img src={image} alt={name} />
				</ObjectFit>
			</div>

			<div className="category-tile-caption">
				<span className="category-tile-text">{name}</span>
				<span className="pull-right icon icon-arrow-right"></span>
			</div>
		</div>
	</Component>
);

CategoryTile.propTypes = {
	image: PropTypes.string,
	name: PropTypes.string,
	as: PropTypes.any
};

CategoryTile.defaultProps = {
	as: "button"
};

export default CategoryTile