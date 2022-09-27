import React from "react";
import CMSCarBrandDropdown from "./CMSCarBrandDropdown";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

class CMSCarBrandSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
    this.loadData = false;
  }
  componentDidUpdate() {
    var { listValue } = this.props;
    if (!this.loadData && listValue && listValue.length > 0) {
      this.loadData = true;
      this.setState({ list: listValue });
    }
  }
  addManufactureBind = (list, message) => {
    this.setState({ list: list });
    this.props.setBrands(list);
  };
  trashBrandConfirm = (index, id) => {
    var { list } = this.state;
    if (list.hasOwnProperty(index)) {
      list.splice(index, 1);
      this.setState({ list: list });
      this.props.setBrands(list);
      toast.success("Car brand has been trashed successfully", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  };
  trashBrand = (index, id) => {
    confirmAlert({
      title: " ",
      message: "Are you sure, you want to trash Car brand from the list ?",
      confirmLabel: "Ok",
      cancelLabel: "Cancel",
      onConfirm: () => {
        this.trashBrandConfirm(index, id);
      }
    });
  };
  render() {
    return (
      <div className="col-md-6 col-lg-5" style={{ marginTop: "50px" }}>
        <div className="row">
          <div className="col-sm-12 top-block-space">
            <section className="col-sm-12 bordered-column car-brand">
              <h4 className="column-heading">Car Brand</h4>
              <CMSCarBrandDropdown
                addManufactureBind={this.addManufactureBind}
                list={this.state.list}
              />
              <div className="row">
                <div className="col-sm-9 table-responsive">
                  <table className="table table-hover">
                    <tbody>
                      <tr>
                        <th>#</th>
                        <th>Manufacture</th>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Year</th>
                        <th />
                      </tr>
                      {this.state.list.map((brand, index) => {
                        return (
                          <tr key={"listbrand-" + index}>
                            <td>{index + 1}</td>
                            <td>{brand.manufacturer.name}</td>
                            <td>{brand.make ? brand.make.name : ""}</td>
                            <td>{brand.model ? brand.model.name : ""}</td>
                            <td>{brand.year ? brand.year.name : ""}</td>
                            <td
                              className="cursor-pointer"
                              onClick={() => {
                                this.trashBrand(index, false);
                              }}
                            >
                              <i className="fa fa-trash" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default CMSCarBrandSection;
