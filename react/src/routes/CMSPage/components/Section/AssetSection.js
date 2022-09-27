import React from 'react';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  TagRenderSelectField,
  TagRenderSelectListField
} from '../RFInputField';
import { sortListByAlphabetsOrder } from '../../../../utils/sort';
import { getAssetNameList } from '../../../../redux/actions/contentTabActions';

class AssetSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: []
    };
    this.currentValue = {
      assets: '',
      location: ''
    };
    this.loadData = false;
  }

  componentDidMount() {
    this.props.getAssetNameList(get(this.props, 'user.authUser.accessToken'));
  }

  componentDidUpdate() {
    var { assets } = this.props;
    if (!this.loadData && assets && assets.length > 0) {
      this.loadData = true;
      this.setState({ assets: assets });
    }
  }

  onChangeSelectAssets = e => {
    this.currentValue.assets = e.target.value;
  };

  onChangeSelectLocation = e => {
    this.currentValue.location = e.target.value;
  };

  checkLocationExist = () => {
    const { assets } = this.state;
    for (var row = 0; row < assets.length; row++) {
      if (assets[row].template_location === this.currentValue.location) {
        return true;
      }
    }
    return false;
  };

  addAssets = () => {
    var errorMessage = false;
    if (this.currentValue.assets === '') {
      errorMessage = 'Please select assets';
    } else if (this.currentValue.location === '') {
      errorMessage = 'Please select template location';
    } else if (this.checkLocationExist()) {
      errorMessage = 'Template Location has been already used';
    }
    //if location already assigned
    if (errorMessage) {
      toast.error(errorMessage, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      var { assets } = this.state;
      const { FormatAssetNameList } = this.props;
      var assetObjectList =
        FormatAssetNameList[parseInt(this.currentValue.assets)];
      var assetObject = {
        name: assetObjectList.name,
        asset_id: assetObjectList.id,
        asset_type: assetObjectList.asset_type
      };
      assetObject.template_location = this.currentValue.location;
      assets.push(assetObject);
      this.setState({ assets: assets });
      this.props.setAssets(assets);
    }
  };
  trashAssetConfirm = index => {
    var { assets } = this.state;
    if (assets.hasOwnProperty(index)) {
      assets.splice(index, 1);
      this.setState({ assets: assets });
      this.props.setAssets(assets);
      toast.success('Asset has been trashed successfully', {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  };
  trashAsset = index => {
    confirmAlert({
      title: ' ',
      message: 'Are you sure, you want to trash Asset from the list.?',
      confirmLabel: 'Ok',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        this.trashAssetConfirm(index);
      }
    });
  };
  render() {
    const { assetNameList, currentConfigValues } = this.props;
    var objectKeysData = [];
    console.log(currentConfigValues, 'currentConfig');
    if (currentConfigValues) {
      objectKeysData = Object.keys(currentConfigValues);
    }
    if (currentConfigValues == undefined) {
      objectKeysData = [];
    }
    this.props.setAssets(this.state.assets);
    return (
      <div className="row">
        <div className="col-sm-10 col-sm-offset-1 bordered-column">
          <h4 className="column-heading">Assets</h4>
          <div className="form-group">
            <div className="col-sm-5 col-md-4">
              <Field
                name="article_partner_source"
                component={TagRenderSelectField}
                empty="Assets Names"
                selectLists={sortListByAlphabetsOrder(assetNameList)}
                onChange={this.onChangeSelectAssets}
              />
            </div>
            <div className="col-sm-5 col-md-4">
              <Field
                name="article_location"
                component={TagRenderSelectListField}
                empty="Template Locations"
                selectLists={currentConfigValues}
                contentType="assets"
                onChange={this.onChangeSelectLocation}
              />
            </div>
            <div
              className="col-sm-2 col-md-2 fa-icon cursor-pointer"
              onClick={this.addAssets}
            >
              <i className="fa fa-plus" />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <br />
              <br />
              <br />
            </div>
            <div className="col-sm-6 table-responsive">
              <table className="table table-hover">
                <tbody>
                  <tr>
                    <th>#</th>
                    <th>Asset Name</th>
                    <th>Asset Type</th>
                    <th>Template Location</th>
                    <th />
                  </tr>
                  {this.state.assets.map((asset, index) => {
                    if (
                      objectKeysData.length > 0 &&
                      currentConfigValues.hasOwnProperty(
                        asset.template_location
                      ) &&
                      !currentConfigValues[asset.template_location].disable
                    ) {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{asset.name}</td>
                          <td>{asset.asset_type}</td>
                          <td>
                            {currentConfigValues[asset.template_location].label}
                          </td>
                          <td
                            className="cursor-pointer"
                            onClick={() => {
                              this.trashAsset(index);
                            }}
                          >
                            <i className="fa fa-trash" />
                          </td>
                        </tr>
                      );
                    }
                    return '';
                  })}
                </tbody>
              </table>
            </div>
            <div className="col-sm-6">
              <section
                className="col-sm-12 bordered-column info"
                style={{ marginTop: '20px' }}
              >
                <h4 className="column-heading">Note</h4>
                <p style={{ fontWeight: '400' }}>
                  The template you selected has asset spots for
                </p>
                <br />
                {objectKeysData.map(index => {
                  if (
                    !currentConfigValues[index].disable &&
                    currentConfigValues[index].type === 'assets'
                  ) {
                    return (
                      <p key={index}>{currentConfigValues[index].label}</p>
                    );
                  }
                })}
              </section>
            </div>
            <div className="col-sm-12">
              <br />
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    assetNameList: state.CMSContentDetails.assetNameList,
    templateLocationList: state.CMSContentDetails.templateLocationList,
    FormatAssetNameList: state.CMSContentDetails.FormatAssetNameList,
    user: state.user
  };
}

const mapDispatchToProps = {
  getAssetNameList
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetSection);
