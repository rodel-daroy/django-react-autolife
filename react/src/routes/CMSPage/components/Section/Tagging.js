import React, { Component } from "react";
import { Field } from "redux-form";
import { TagInputNumber } from "../RFInputField";
const number = value =>
  value && isNaN(Number(value)) ? "Must be a number" : undefined;
const tag = value =>
  value && (value < -10 || value > 10) ? "Enter between -10 to 10 " : undefined;

const Tag = props => {
  const _tag = props.tag;
  return (
    <div className="form-group">
      <label className="control-label col-sm-7">{_tag.label}</label>
      <div className="col-sm-5">
        <Field
          component={TagInputNumber}
          id={_tag.id}
          name={"" + _tag.id}
          type="text"
          validate={[number, tag]}
          addStyle={props.label ? props.label == "Interests" : ""}
        />
      </div>
    </div>
  );
};
const TwoRowContent = props => {
  const { tagging, label } = props;

  const _firstRow = tagging.slice(0, 4);
  const _secondRow = tagging.slice(4, tagging.length);
  return (
    <div>
      <div className="col-sm-5">
        {_firstRow.map(function(tag) {
          return <Tag tag={tag} key={tag.id} label={label} />;
        })}
      </div>
      <div className="col-sm-7">
        {_secondRow.map(function(tag) {
          return <Tag tag={tag} key={tag.id} label={label} />;
        })}
      </div>
    </div>
  );
};
const OneRowContent = props => {
  const { tagging } = props;
  return (
    <div>
      {tagging.map(function(tag) {
        return <Tag tag={tag} key={tag.id} />;
      })}
    </div>
  );
};
export default class Tagging extends Component {
  render() {
    const { tagging, label } = this.props;
    const twoRows = tagging.length > 4;
    return (
      <div>
        {twoRows ? (
          <TwoRowContent tagging={tagging} label={label} />
        ) : (
          <OneRowContent tagging={tagging} label={label} />
        )}
      </div>
    );
  }
}
