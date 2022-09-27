import React, { Component } from "react";
import { connect } from "react-redux";
import { extractNumberFromString } from "../../utils/format";
import get from "lodash/get";
import { postPollsData } from "../../redux/actions/homeActions";
import ResizeSensor from "css-element-queries/src/ResizeSensor";
import { SCREEN_XS_MAX, SCREEN_SM_MAX, SCREEN_MD_MAX } from "../../utils/style";
import ALPollsQuestion from "./ALPollsQuestion";
import ALPollsResult from "./ALPollsResult";

const SIZES = [
  [SCREEN_XS_MAX, "xs"],
  [SCREEN_SM_MAX, "sm"],
  [SCREEN_MD_MAX, "md"]
];

class ALPollsView extends Component {
  state = {};

  componentDidMount() {
    this._resizeSensor = new ResizeSensor(this._container, this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    this._resizeSensor.detach();
  }

  handleResize = () => {
    const width = this._container.clientWidth;
    let currentSize = "lg";

    for (const [sizeWidth, sizeName] of SIZES) {
      if (width <= sizeWidth) {
        currentSize = sizeName;
        break;
      }
    }

    if (currentSize !== this.state.currentSize)
      this.setState({
        currentSize
      });
  };

  submitPollsData = values => {
    const { user, postPollsData, tile } = this.props;
    const polls = tile.poll_tile.poll;
    const getKeys = Object.keys(values);
    const answerId = extractNumberFromString(getKeys[0]);
    const email = get(user, "authUser.user.user_details.email");
    if (answerId) {
      postPollsData(answerId, { email, poll_id: polls.id });
    }
  };

  renderPollsData() {
    const { tile, pollResult } = this.props;
    const polls = tile.poll_tile.poll;
    const pollsAnswer = polls.answers.answer;
    if (pollResult && pollResult[polls.id]) {
      const resultData =
        pollResult[polls.id].data.demands.demand[0].result.answers;
      return (
        <ALPollsResult
          resultData={resultData.answer}
          pollId={polls.id}
          tile={tile}
        />
      );
    }
    return (
      <ALPollsQuestion
        pollsAnswer={pollsAnswer}
        polls={polls}
        onSubmit={this.submitPollsData}
      />
    );
  }

  render() {
    const { currentSize } = this.state;

    return (
      <div
        ref={ref => (this._container = ref)}
        className={`pds-box ${currentSize}`}
      >
        {this.renderPollsData()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    pollResult: state.home.pollResult
  };
}

const mapDispatchToProps = {
  postPollsData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ALPollsView);
