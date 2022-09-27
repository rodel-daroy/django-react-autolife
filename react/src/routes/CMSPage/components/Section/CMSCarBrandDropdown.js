import React, { Component } from "react";
import { Field, reduxForm, change } from "redux-form";
import { TagRenderDependSelectField } from "../RFInputField";
import { connect } from "react-redux";
import get from "lodash/get";
import { toast } from "react-toastify";
import { sortListByAlphabetsOrder } from "../../../../utils/sort";
import {
  getCarManufacturerList,
  getCarMakeList,
  getCarModelList,
  getCarModelYearList
} from "../../../../redux/actions/CMSCarBrandSectionActions";

class CMSCarBrandDropdown extends Component {
  constructor(props, context) {
    super(props);
    this.currentValues = {
      manufacturer: "",
      make: "",
      model: "",
      year: ""
    };
    this.list = [];
  }

  componentDidMount() {
    this.props.getCarManufacturerList(
      get(this.props, "user.authUser.accessToken")
    );
  }

  manufacturerDropdown = e => {
    const id = e.target.value;
    this.currentValues = {
      manufacturer: parseInt(id),
      make: "",
      model: "",
      year: ""
    };
    this.props.getCarMakeList(id, get(this.props, "user.authUser.accessToken"));
  };

  makeDropdown = e => {
    const id = e.target.value;
    this.currentValues["make"] = parseInt(id);
    this.currentValues["model"] = "";
    this.props.getCarModelList(
      id,
      get(this.props, "user.authUser.accessToken")
    );
  };

  modelDropdown = e => {
    var value = e.target.value;
    this.currentValues["model"] = parseInt(value);
    this.currentValues["year"] = "";
    this.props.getCarModelYearList(
      value,
      get(this.props, "user.authUser.accessToken")
    );
  };
  yearDropdown = e => {
    var value = e.target.value;
    this.currentValues["year"] = value;
  };
  checkExist = (manufacturer, make = false, model = false, year = false) => {
    const list = this.list;
    for (var row = 0; row < list.length; row++) {
      var rowData = list[row];
      if (
        rowData.manufacturer === manufacturer &&
        rowData.make === make &&
        rowData.model === model &&
        rowData.year === year
      ) {
        return true;
      }
    }
    return false;
  };
  addManufactureRow = () => {
    const { FormatManufactureList } = this.props;
    if (this.currentValues.manufacturer === "") {
      toast.error("Please select manufacturer", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else if (
      this.checkExist(FormatManufactureList[this.currentValues.manufacturer])
    ) {
      toast.error("This selection has been already added", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      var list = this.list;
      list.push({
        manufacturer: FormatManufactureList[this.currentValues.manufacturer],
        make: false,
        model: false,
        year: false
      });
      this.props.addManufactureBind(list);
    }
  };

  addMakeRow = () => {
    const { FormatManufactureList, FormatMakeList } = this.props;
    if (
      this.currentValues.manufacturer === "" ||
      this.currentValues.make === ""
    ) {
      toast.error("Please select manufacturer and make", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else if (
      this.checkExist(
        FormatManufactureList[this.currentValues.manufacturer],
        FormatMakeList[this.currentValues.make]
      )
    ) {
      toast.error("This selection has been already added", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      var list = this.list;
      list.push({
        manufacturer: FormatManufactureList[this.currentValues.manufacturer],
        make: FormatMakeList[this.currentValues.make],
        model: false,
        year: false
      });
      this.props.addManufactureBind(list);
    }
  };

  addModelRow = () => {
    const {
      FormatManufactureList,
      FormatMakeList,
      FormatModelList
    } = this.props;
    if (
      this.currentValues.manufacturer === "" ||
      this.currentValues.make === "" ||
      this.currentValues.model === ""
    ) {
      toast.error("Please select manufacturer, make and model ", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else if (
      this.checkExist(
        FormatManufactureList[this.currentValues.manufacturer],
        FormatMakeList[this.currentValues.make],
        FormatModelList[this.currentValues.model]
      )
    ) {
      toast.error("This selection has been already added", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      var list = this.list;
      list.push({
        manufacturer: FormatManufactureList[this.currentValues.manufacturer],
        make: FormatMakeList[this.currentValues.make],
        model: FormatModelList[this.currentValues.model],
        year: false
      });
      this.props.addManufactureBind(list);
    }
  };

  addYearRow = () => {
    const {
      FormatManufactureList,
      FormatMakeList,
      FormatModelList,
      FormatModelYearList
    } = this.props;
    if (
      this.currentValues.manufacturer === "" ||
      this.currentValues.make === "" ||
      this.currentValues.model === "" ||
      this.currentValues.year === ""
    ) {
      toast.error("Please select manufacturer, make, model and year ", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else if (
      this.checkExist(
        FormatManufactureList[this.currentValues.manufacturer],
        FormatMakeList[this.currentValues.make],
        FormatModelList[this.currentValues.model],
        FormatModelYearList[this.currentValues.year]
      )
    ) {
      toast.error("This selection has been already added", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      var list = this.list;
      list.push({
        manufacturer: FormatManufactureList[this.currentValues.manufacturer],
        make: FormatMakeList[this.currentValues.make],
        model: FormatModelList[this.currentValues.model],
        year: FormatModelYearList[this.currentValues.year]
      });
      this.props.addManufactureBind(list);
    }
  };

  render() {
    this.list = this.props.list;
    const { manufactureList, makeList, modelList, modelYearList } = this.props;

    return (
      <div>
        <div className="form-group">
          <div className="col-md-10">
            <Field
              name="manufacturerList"
              component={TagRenderDependSelectField}
              empty="Manufacturer"
              onChange={this.manufacturerDropdown}
              selectLists={sortListByAlphabetsOrder(manufactureList)}
            />
          </div>
          <div className="col-xs-2 add-icon cursor-pointer">
            <i className="fa fa-plus" onClick={this.addManufactureRow} />
          </div>
        </div>

        <div className="form-group">
          <div className="col-md-10">
            <Field
              name="make"
              component={TagRenderDependSelectField}
              empty="Make"
              selectLists={sortListByAlphabetsOrder(makeList)}
              onChange={this.makeDropdown}
            />
          </div>
          <div className="col-xs-2 add-icon cursor-pointer">
            <i className="fa fa-plus" onClick={this.addMakeRow} />
          </div>
        </div>

        <div className="form-group">
          <div className="col-md-10">
            <Field
              name="model"
              component={TagRenderDependSelectField}
              empty="Model"
              selectLists={sortListByAlphabetsOrder(modelList)}
              onChange={this.modelDropdown}
            />
          </div>
          <div className="col-xs-2 add-icon cursor-pointer">
            <i className="fa fa-plus" onClick={this.addModelRow} />
          </div>
        </div>

        <div className="form-group">
          <div className="col-md-10">
            <Field
              name="year"
              component={TagRenderDependSelectField}
              empty="Year"
              selectLists={sortListByAlphabetsOrder(modelYearList)}
              onChange={this.yearDropdown}
            />
          </div>
          <div className="col-xs-2 add-icon cursor-pointer">
            <i className="fa fa-plus" onClick={this.addYearRow} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    manufactureList: state.carBrandDetail.manufactureList,
    makeList: state.carBrandDetail.makeList,
    modelList: state.carBrandDetail.modelList,
    modelYearList: state.carBrandDetail.modelYearList,
    FormatManufactureList: state.carBrandDetail.FormatManufactureList,
    FormatMakeList: state.carBrandDetail.FormatMakeList,
    FormatModelList: state.carBrandDetail.FormatModelList,
    FormatModelYearList: state.carBrandDetail.FormatModelYearList,
    user: state.user
  };
}

const mapDispatchToProps = {
  getCarManufacturerList,
  getCarMakeList,
  getCarModelList,
  getCarModelYearList
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CMSCarBrandDropdown);
