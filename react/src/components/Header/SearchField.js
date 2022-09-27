import React from "react";
import { reduxForm, Field, propTypes } from "redux-form";
import { withRouter } from "react-router-dom";
import { ReduxHeaderField } from "components/Forms/HeaderField";
import { required } from "utils/validations";
import omit from "lodash/omit";

let SearchField = props => {
  const { handleSubmit, history } = props;

  const onSubmit = handleSubmit(data => {
    console.log(data, "data-search");
    history.push(`/search/?keyword=${data.searchText}`);
  });

  return (
    <Field
      {...omit(props, [...Object.keys(propTypes), "_reduxForm"])}

      name="searchText"
      component={ReduxHeaderField}
      iconClassName="icon icon-search"
      placeholder="Search"
      caption="Search"
      onSubmit={onSubmit}
      validate={[required]}
    />
  );
};

SearchField = reduxForm({
  form: "SearchField"
})(SearchField);

export default withRouter(SearchField);
