import React from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes, reduxForm } from 'redux-form';
import PrimaryButton from '../../components/Forms/PrimaryButton';
import { ReduxCheckbox } from '../Forms/Checkbox';

const ALPollsQuestion = ({ pollsAnswer, polls: { question, multipleChoice }, submitting, handleSubmit, blur }) => {
  const hasMultipleChoice = multipleChoice !== 'no';

  const submitAnswer = answerId => () => {
    blur(`polls${answerId}`, true);
    setTimeout(handleSubmit);
  };

  return (
    <form className="pds-box-outer" onSubmit={handleSubmit}>
      <div className="pds-box-top">
        <div className="pds-question-outer">{question}</div>
        <div className="pds-answers">
          {pollsAnswer.map(poll => {
            if(!hasMultipleChoice)
              return (
                <div className="pds-answer" key={poll.id}>
                  <span className="pds-answer-group">
                    <PrimaryButton dark size={pollsAnswer.length >= 4 ? 'medium' : 'large'} onClick={submitAnswer(poll.id)}>
                      <div>
                        <div><span className="icon icon-angle-right"></span>&nbsp;{poll.text}</div>
                      </div>
                    </PrimaryButton>
                  </span>
                </div>
              );
            else
              return (
                <div className="pds-answer" key={poll.id}>
                  <span className="pds-answer-group">
                    <Field
                      component={ReduxCheckbox}
                      id={poll.id}
                      name={`polls${poll.id}`}
                      normalize={v => !!v}
                      label={poll.text}
                    />
                  </span>
                </div>
              );
          })}
        </div>

        {hasMultipleChoice && (
          <div className="pds-vote">
            <div className="pds-votebutton-outer">
              <PrimaryButton dark type="submit" disabled={submitting} size="medium">
                Vote
                <span className="icon icon-angle-right" />
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

ALPollsQuestion.propTypes = {
  ...propTypes,

  pollsAnswer: PropTypes.array.isRequired,
  polls: PropTypes.shape({
    question: PropTypes.string.isRequired,
    multipleChoice: PropTypes.string.isRequired
  }).isRequired,
  submitting: PropTypes.bool
};

export default reduxForm({
  form: 'ALPollsQuestion'
})(ALPollsQuestion);
