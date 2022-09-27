import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

class ListItem extends Component {
  // propTypes: {
  //     label: PropTypes.string,
  //     onClick: PropTypes.func,
  //     value: PropTypes.oneOfType([
  //         PropTypes.number,
  //         PropTypes.string
  //     ])
  // },

  handleClick = () => {
    if (this.props.disabled) {
      return;
    }
    const { onClick, value } = this.props;
    onClick(value);
  };

  render() {
    const { disabled, highlighted, label } = this.props;
    const className = "msts__list-item";

    return (
      <li
        className={classNames(
          className,
          disabled && `${className}_disabled`,
          highlighted && `${className}_highlighted`
        )}
        onClick={this.handleClick}
      >
        {label}
      </li>
    );
  }
}

export default class MultiselectTwoSides extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availableOptions: [],
      selectedOptions: []
    };
    this.value = true;
  }
  renderOutPut = () => {
    const { value } = this.props;
    this.filterAvailable(value);
  };
  componentWillMount() {
    this.renderOutPut();
  }
  componentWillReceiveProps() {
    if (this.value) {
      this.renderOutPut();
    }
  }
  filterAvailable(value) {
    const { options } = this.props;
    const current_id = this.props.params ? this.props.params.id : "";
    var selectedOptionsContainer = {};
    var selectedOptions = [];
    var availableOptions = [];
    for (var i = 0; i < options.length; i++) {
      if (value.indexOf(options[i].id) !== -1) {
        selectedOptionsContainer[options[i].id] = options[i];
        //selectedOptions.push(options[i])
      } else if (options[i].id != current_id) {
        availableOptions.push(options[i]);
      }
    }
    for (var i = 0; i < value.length; i++) {
      selectedOptions.push(selectedOptionsContainer[value[i]]);
    }
    const SortedOptions = availableOptions
      ? availableOptions.sort((obj1, obj2) => {
          if (obj1.content_name < obj2.content_name) return -1;
          else if (obj1.content_name > obj2.content_name) return 1;
          return 0;
        })
      : "";
    this.setState({
      selectedOptions: selectedOptions,
      availableOptions: SortedOptions
    });
  }
  allRemoveHandleClick = () => {
    var { name } = this.props;
    this.props.change(name, []);
    this.filterAvailable([]);
  };
  allAddHandleClick = () => {
    var { options, name } = this.props;
    var defaultValue = [];
    for (var i = 0; i < options.length; i++) {
      if (defaultValue.indexOf(options[i].id) === -1) {
        defaultValue.push(options[i].id);
      }
    }
    this.props.change(name, defaultValue);
    this.filterAvailable(defaultValue);
    this.value = false;
  };
  handleClick = listValue => {
    const { value, name } = this.props;
    var defaultValue = [];
    for (var row = 0; row < value.length; row++) {
      defaultValue.push(value[row]);
    }
    defaultValue.push(listValue);
    this.props.change(name, defaultValue);
    this.filterAvailable(defaultValue);
    this.value = false;
  };
  handleRemoveClick = listValue => {
    var { name, value } = this.props;
    var defaultValue = [];
    for (var row = 0; row < value.length; row++) {
      defaultValue.push(value[row]);
    }
    var index = defaultValue.indexOf(listValue);
    if (index !== -1) {
      defaultValue.splice(index, 1);
      this.props.change(name, defaultValue);
      this.filterAvailable(defaultValue);
      this.value = false;
    }
  };

  render() {
    const { options } = this.props;
    return (
      <div>
        <div className="col-sm-5">
          <div className="form-group">
            <label className="control-label" style={{ paddingLeft: "15px" }}>
              All Articles
            </label>
            <div className="col-sm-12">
              <ul className="msts__list">
                {this.state.availableOptions.map(
                  (item, index) =>
                    item.content_name.length > 2 &&
                    item && (
                      <ListItem
                        key={item.id}
                        onClick={this.handleClick}
                        label={item.content_name}
                        value={item.id}
                      />
                    )
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-sm-2 side-arrows-sec">
          <button
            type="button"
            className="cursor-pointer"
            onClick={this.allRemoveHandleClick}
          >
            <i className="fa fa-angle-left" />
            <i className="fa fa-angle-left" />
          </button>
          <button
            type="button"
            className="cursor-pointer"
            onClick={this.allAddHandleClick}
          >
            <i className="fa fa-angle-right" />
            <i className="fa fa-angle-right" />
          </button>
        </div>
        <div className="col-sm-5">
          <div className="form-group">
            <label className="control-label">Selected Articles</label>
            <div className="col-sm-12">
              <ul className="msts__list">
                {this.state.selectedOptions.map(
                  (item, index) =>
                    item && (
                      <ListItem
                        key={item.id}
                        onClick={this.handleRemoveClick}
                        label={item.content_name}
                        value={item.id}
                      />
                    )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
