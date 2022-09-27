import React, { Component } from "react";
import PropTypes from "prop-types";
import PrimaryButton from "../../components/Forms/PrimaryButton";

class LoadMoreThumbnails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: 12,
      showLoadLess: false,
      showLoadMore: true
    };
  }

  loadMore = () => {
    const { count, onClickLoadMore } = this.props;
    if (this.state.load <= count) {
      this.setState({ load: this.state.load + 12 }, () => {
        return (
          this.updateLoadMoreState(this.state.load),
          onClickLoadMore(this.state.load)
        );
      });
    }
  };

  updateLoadMoreState = limit => {
    const { count } = this.props;
    if (limit >= count) {
      this.setState({
        showLoadMore: false,
        showLoadLess: true
      });
    }
  };

  loadLess = () => {
    const { onClickLoadLess } = this.props;
    this.setState(
      {
        load: 12
      },
      () => {
        return (
          this.updateLoadLessState(this.state.load),
          onClickLoadLess(this.state.load)
        );
      }
    );
  };

  updateLoadLessState(limit) {
    if (limit == 12) {
      this.setState({
        showLoadMore: true,
        showLoadLess: false
      });
    }
  }

  render() {
    const { count } = this.props;
    const { showLoadMore } = this.state;

    if (showLoadMore && count > 12)
      return (
        <div className="container-fluid">
          <div className="row" style={{ margin: "100px 0" }}>
            <div className="col-xs-12 text-center">
              <PrimaryButton onClick={this.loadMore}>+ Load more</PrimaryButton>
            </div>
          </div>
        </div>
      );
    else return null;
  }
}

LoadMoreThumbnails.propTypes = {
  count: PropTypes.number,
  onClickLoadLess: PropTypes.func,
  onClickLoadMore: PropTypes.func
};

export default LoadMoreThumbnails;
