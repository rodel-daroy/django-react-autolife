import React from 'react';

const PollResultView = (props) => {
  const { pollResult } = props;
  return (
    <div className="pds-answer">
      <div className="pds-feedback-group">
        <label htmlFor="pol" className="pds-feedback-label">
          <span className="pds-answer-text"><span>{pollResult.text}</span></span>
          <span className="pds-feedback-result">
            <span className="pds-feedback-per">&nbsp;{pollResult.percent}%</span>
          </span>
        </label>
        <div className="pds-answer-feedback" id="PDI_feedback0">
          <div className="pds-answer-feedback-bar" style={{ width: `${pollResult.percent}%` }} />
        </div>
      </div>
    </div>
  );
};

export default PollResultView;

