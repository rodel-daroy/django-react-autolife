import React from "react";
import PropTypes from "prop-types";
import { Field } from "redux-form";
import Media from "react-media";
import sortBy from "lodash/sortBy";
import { mediaQuery } from "../../../../utils/style";
import ToggleButton, {
  ReduxToggleButton
} from "../../../../components/Forms/ToggleButton";
import RegisterChoicesList from "../../../../components/Register/RegisterChoicesList";

const Choice = props => (
  <Field
    name={props.choice.fieldName}
    caption={props.choice.name}
    image={props.choice.logo}
    subHeading={props.choice.tag_line}
    pulse={props.pulse}
    component={ReduxToggleButton}
    normalize={v => !!v}
  />
);

const EditChoices = props => {
  const { title, alpha, fieldName, editing, onEdit } = props;

  let choices = props.choices || [];
  choices = choices.map((choice, i) => ({
    ...choice,
    fieldName: `${fieldName}[${i}].is_checked`
  }));

  if (alpha) {
    choices = sortBy(choices, ["name"]);
  }

  let selectedChoices = [];
  if (choices) {
    selectedChoices = choices.filter(choice => choice.is_checked);
  }

  return (
    <section className="page-section">
      <header className="page-section-header">
        <div className="page-section-title-bar">
          <div className="page-section-title">{title}</div>

          {!editing && (
            <div className="page-section-title-commands">
              <button
                type="button"
                className="btn btn-link primary-link edit-button"
                onClick={onEdit}
              >
                {" "}
                &gt; Edit
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="page-section-content">
        {!editing && (
          <div className="interest-container">
            <div className="interest-container-inner">
              {selectedChoices.map((choice, i) => (
                <div className="interest" key={i}>
                  <ToggleButton
                    caption={choice.name}
                    image={choice.logo}
                    subHeading={choice.tag_line}
                    checked
                    disabled
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {editing && (
          <div className="profile-choices">
            <Media query={mediaQuery("xs sm")}>
              {matches => (
                <RegisterChoicesList
                  alpha={alpha}
                  choices={choices}
                  choiceComponent={Choice}
                  name={choice => choice.name}
                  checked={choice => choice.is_checked}
                  pageSize={6}
                  columnSize={3}
                  visibleColumns={matches ? 1 : 2}
                  navStyle={matches ? "stepper" : "paginator"}
                />
              )}
            </Media>
          </div>
        )}
      </div>
    </section>
  );
};

EditChoices.propTypes = {
  title: PropTypes.node,
  choices: PropTypes.array,
  alpha: PropTypes.bool,
  fieldName: PropTypes.string.isRequired,
  submitting: PropTypes.bool,
  editing: PropTypes.bool,
  onEdit: PropTypes.func
};

export default EditChoices;
