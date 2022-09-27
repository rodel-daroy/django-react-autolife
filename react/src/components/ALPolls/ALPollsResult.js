import React  from 'react';
import { pollUrl, pollsFooter } from '../../config/constants';
import PollResultView from './PollResultView';
import orderBy from 'lodash/orderBy';

const BottomUrl = (props) => {
  const { pollId, text, url } = props;
  return (
    <a href={`${pollUrl}/${pollId}/${url}/`} target="_blank">{text}</a>
  );
};

const ALPollsResults = (props) => {
  const { resultData, pollId, tile } = props;
  let totalVote = 0;
  resultData.forEach((elem) => {
    totalVote += elem.total;
  });
  return (
    <div className="pds-box-outer">
      <div className="pds-box-top">
        <h2 className="pds-question-outer">{tile.poll_tile.poll.question}</h2>
        <div className="pds-answers">
          {orderBy(resultData, ['percent'], ['desc']).map(pollResult => (
            <PollResultView pollResult={pollResult} key={pollResult.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ALPollsResults;
