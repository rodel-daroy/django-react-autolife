import React, { Component } from "react";
import TileView from "components/Tiles/TileView";
import { getUiController } from "redux/actions/uiController";
import get from "lodash/get";
import { connect } from "react-redux";
import { getTiles } from "./helpers";

const TileContainer = ({ tilesData, animate }) => {
  if (tilesData) return <TileView>{getTiles(tilesData, animate)}</TileView>;
  else return null;
};

export default TileContainer;

export const makeTileContainer = name => {
  const NamedTileContainer = class extends Component {
    constructor(props) {
      super(props);

      props.getUiController(props.accessToken, name);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.accessToken !== this.props.accessToken)
        nextProps.getUiController(nextProps.accessToken, name);
    }

    render() {
      const { controller } = this.props;
      if (controller && controller.loading === undefined)
        return <TileContainer tilesData={controller} />;
      else return null;
    }
  };

  const mapStateToProps = state => ({
    accessToken: get(state, "user.authUser.accessToken"),
    controller: get(state, `uiController.controllers[${name}]`)
  });

  const mapDispatchToProps = {
    getUiController
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(NamedTileContainer);
};
