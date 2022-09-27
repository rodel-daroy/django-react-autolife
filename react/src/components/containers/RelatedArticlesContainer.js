import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUiController } from '../../redux/actions/uiController';
import get from 'lodash/get';
import RelatedArticles from '../../components/content/RelatedArticles';

const RelatedArticlesContainer = ({ data, ...otherProps }) => {
  const getArticle = ({
    key,
    tile_headline,
    tile_subheading,
    tile_cta_link,
    tile_cta_article,
    tile_asset,
    linked_outside
  }) => {
    let image = '';
    console.log(tile_asset);
    if (tile_asset) {
      for (let asset of tile_asset) {
        console.log(asset.asset_type, 'asset');
        switch (asset.asset_type) {
          case 'carousel':
          case 'image':
            image = asset.asset_url;
          case 'video':
            image = asset.thumbnail;
            break;
        }
      }
    }

    let link = {};

    if (linked_outside) link.target = '_blank';

    if (tile_cta_link) {
      if (linked_outside) link.href = tile_cta_link;
      else link.link = tile_cta_link;
    } else link.link = `/content/${tile_cta_article}`;
    return (
      <RelatedArticles.Article
        key={key}
        title={tile_headline}
        content={tile_subheading}
        image={{ url: image }}
        slug={tile_cta_article || tile_cta_link}
        {...link}
      />
    );
  };
  return (
    <RelatedArticles {...otherProps}>
      {data &&
        data.slice(0, 4).map((tile, i) => getArticle({ ...tile, key: i }))}
    </RelatedArticles>
  );
};

RelatedArticlesContainer.propTypes = {
  data: PropTypes.array
};

export default RelatedArticlesContainer;

export const makeRelatedArticlesContainer = name => {
  const NamedRelatedArticlesContainer = class extends Component {
    constructor(props) {
      super(props);

      props.getUiController(props.accessToken, name);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.accessToken !== this.props.accessToken)
        nextProps.getUiController(nextProps.accessToken, name);
    }

    render() {
      const { controller, ...otherProps } = this.props;
      if (controller && controller.loading == undefined)
        return <RelatedArticlesContainer {...otherProps} data={controller} />;
      else return null;
    }
  };

  const mapStateToProps = state => ({
    accessToken: get(state, 'user.authUser.accessToken'),
    controller: get(state, `uiController.controllers[${name}]`)
  });

  const mapDispatchToProps = {
    getUiController
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(NamedRelatedArticlesContainer);
};
