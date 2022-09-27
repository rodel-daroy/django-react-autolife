import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import EmptyState from 'components/Layout/EmptyState';
import { PageStepperSmall } from 'components/Navigation/PageStepper';
import range from 'lodash/range';
import DropdownField from 'components/Forms/DropdownField';
import './PagedList.scss';

class PagedList extends Component {
	constructor(props) {
		super(props);

		const { onRangeChange, pageIndex } = props;

		onRangeChange(this.getRange(pageIndex));
	}

	state = {}

	getRange(pageIndex = this.props.pageIndex) {
		const { pageSize } = this.props;

		const startIndex = pageSize * pageIndex;
		const endIndex = startIndex + pageSize - 1;

		return {
			startIndex,
			endIndex
		};
	}

	handlePageChange = pageIndex => {
		const { onChange, pageIndex: previousPageIndex } = this.props;

		this.setState({
			previousPageIndex 
		});

		onChange(pageIndex);
	}

	componentDidUpdate(prevProps) {
		const { pageIndex, onRangeChange } = this.props;

		if(pageIndex !== prevProps.pageIndex)
			onRangeChange(this.getRange(pageIndex));
	}

	renderPaginator(className) {
		const { totalCount, pageSize, pageIndex, jumpList } = this.props;

		const startIndex = pageSize * pageIndex;
		const endIndex = Math.min(startIndex + pageSize - 1, totalCount - 1);

		return (
			<div className={`paged-list-2-paginator ${className || ''}`}>
				{totalCount > 0 && (
					<span className="paged-list-2-page-count">
						{`${startIndex + 1} – ${endIndex + 1} of ${totalCount} result(s)`}
					</span>
				)}

				{pageSize < totalCount && (
					<div className="paged-list-2-page-selector">
						<PageStepperSmall
							className="paged-list-2-paginator-inner"
							onChange={this.handlePageChange}
							count={Math.ceil(totalCount / pageSize)}
							index={pageIndex}
							size="large"
							wrapAround={false} />

						{jumpList && (
							<DropdownField
								placeholder="Jump to"
								options={range(0, totalCount / pageSize).map(i => ({
									label: i + 1,
									value: i
								}))}
								size="small"
								noBorder
								searchable={false}
								onChange={({ value }) => this.handlePageChange(value)} />
						)}
					</div>
				)}
			</div>
		);
	}

	renderInner() {
		const { loading, children } = this.props;
		let { pageIndex } = this.props;
		const { previousPageIndex } = this.state;

		if(loading && typeof previousPageIndex === 'number')
			pageIndex = previousPageIndex;

		const items = children(this.getRange(pageIndex));
		if(items)
			return (
				<React.Fragment>
					{this.renderPaginator('top')}

					<div className="paged-list-2-results">
						{items}
					</div>

					{this.renderPaginator('bottom')}
				</React.Fragment>
			);
		else
			return null;
	}

	render() { 
		const { loading, className } = this.props;

		return (
			<div className={`paged-list-2 ${loading ? 'loading' : ''} ${className || ''}`}>
				{this.renderInner()}

				{loading && <EmptyState.Loading />}
			</div>
		);
	}
}

PagedList.propTypes = {
	className: PropTypes.string,
	totalCount: integer().isRequired,
	pageSize: integer(),
	pageIndex: integer(),
	children: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onRangeChange: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	jumpList: PropTypes.bool
};

PagedList.defaultProps = {
	pageSize: 20,
	pageIndex: 0
};
 
export default PagedList;