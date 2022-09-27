import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TreeNav from "components/Navigation/TreeNav";
import get from "lodash/get";
import {
  getCategoriesDetail,
  getBrowseCategoryData
} from "redux/actions/marketPlaceActions";
import sortBy from "lodash/sortBy";

class CategoryFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedCategoryId: null,
      activeCategoryId: null,
      activeSubCategoryId: null
    };

    if (!props.categoriesDetail) {
      const accessToken = get(props, "user.authUser.accessToken");

      props.getCategoriesDetail(null, accessToken);
    }
  }

  componentDidMount() {
    this.updateLayout();
  }

  updateLayout = (
    params = this.props.match.params,
    categoriesDetail = this.props.categoriesDetail,
    categorySlug = this.props.categorySlug,
    make = this.props.make,
    location = this.props.location
  ) => {
    if (categoriesDetail) {
      let subCategoryId = null;

      if(location.state && location.state.categorySlug && location.state.subCategoryId) {
        categorySlug = location.state.categorySlug;
        subCategoryId = location.state.subCategoryId;
      }

      if (!categorySlug) categorySlug = params.id;

      const category = categoriesDetail.data.find(c => c.slug === categorySlug);
      let expandedCategoryId =
        this.state.expandedCategoryId ||
        (category ? category.category_id : null);

      if (!make) {
        subCategoryId = params.subcategory_id;
      } else {
        if (category) {
          subCategoryId = (
            category.sub_categories.find(
              subCategory => subCategory.name === make
            ) || {}
          ).sub_category_id;
          expandedCategoryId = category.category_id;
        }
      }

      this.setState({
        activeCategoryId: category ? category.category_id : null,
        activeSubCategoryId: subCategoryId,
        expandedCategoryId
      });
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { match: { params }, categoriesDetail, categorySlug, make } = this.props;

    if (
      params !== nextProps.match.params ||
      categoriesDetail !== nextProps.categoriesDetail ||
      categorySlug !== nextProps.categorySlug ||
      make !== nextProps.make
    ) {
      this.updateLayout(
        nextProps.match.params,
        nextProps.categoriesDetail,
        nextProps.categorySlug,
        nextProps.make,
        nextProps.location
      );
    }
  }

  handleExpandCategory = category => {
    this.setState({
      expandedCategoryId: category ? category.id : null
    });
  };

  getFilterTreeCategories() {
    const { categoriesDetail } = this.props;

    let categories = [];
    if (categoriesDetail) {
      categories = categoriesDetail.data.map(category => {
        let subCategories = [];

        const baseRoute = `/market-place/browse-cars/${category.slug}`;

        if (category.sub_categories) {
          subCategories = category.sub_categories.map(subCategory => ({
            id: subCategory.sub_category_id,
            name: subCategory.name,
            slug: category.slug,
            link: {
              pathname: `${baseRoute}/${subCategory.sub_category_id}`,
              state: {
                suppressScroll: true
              }
            }
          }));

          subCategories = sortBy(subCategories, ["name"]);
        }

        return {
          id: category.category_id,
          name: category.name,
          slug: category.slug,
          link: {
            pathname: baseRoute,
            state: {
              suppressScroll: true
            }
          },

          subCategories
        };
      });
    }

    return categories;
  }

  render() {
    const {
      expandedCategoryId,
      activeCategoryId,
      activeSubCategoryId
    } = this.state;
    const { onChange, dark } = this.props;

    const categories = this.getFilterTreeCategories();

    return (
      <TreeNav
        title="Categories"
        categories={categories}
        expandedCategoryId={expandedCategoryId}
        activeCategoryId={activeCategoryId}
        activeSubCategoryId={activeSubCategoryId}
        onExpandCategory={this.handleExpandCategory}
        onChange={onChange}
        dark={dark}
      />
    );
  }
}

CategoryFilters.propTypes = {
  onChange: PropTypes.func,
  categorySlug: PropTypes.string,
  make: PropTypes.string,
  dark: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    categoriesDetail: state.MarketPlace.categoriesDetail,
    user: state.user
  };
}

const mapDispatchToProps = {
  getCategoriesDetail,
  getBrowseCategoryData
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryFilters));
