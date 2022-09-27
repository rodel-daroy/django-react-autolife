import React, { Component } from "react";
class EditorialTemplates extends Component {
  render() {
    const { parmKey, location, params, previewData } = this.props;
    const Template = require("./" + "Default").default;
    return <Template location={location} params={params} />;
  }
}

export default EditorialTemplates;
