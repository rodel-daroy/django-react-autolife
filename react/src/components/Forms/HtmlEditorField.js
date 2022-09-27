import React, { useCallback } from "react";
import { FieldPropTypes } from "./";
import Field from "./Field";
import HtmlEditor from "./HtmlEditor";
import { makeReduxField } from "./";

const HtmlEditorField = ({ ...otherProps }) => {
  const inputComponent = useCallback(props => <HtmlEditor {...props} />, []);

  return (
    <Field {...otherProps} inputComponent={inputComponent} />
  );
};

HtmlEditorField.propTypes = {
  ...FieldPropTypes
};
 
export default HtmlEditorField;
export const ReduxHtmlEditorField = makeReduxField(HtmlEditorField);