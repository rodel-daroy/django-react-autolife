import React, { Component } from "react";
import PropTypes from "prop-types";
import Accordion from "./Accordion";

export default class AccordionGroup extends Component {
  handleChange(index) {
    const { onChange } = this.props;

    if (onChange) onChange(index);
  }

  renderChild(child, index, open) {
    let children = React.Children.toArray(child.props.children);

    let headerIndex = children.findIndex(el => el.type === Accordion.Header);
    if (headerIndex !== -1) {
      const onOpen = this.handleChange.bind(this, index);
      const onClose = this.handleChange.bind(this, -1);

      let header = React.cloneElement(children[headerIndex], {
        open,
        onOpen,
        onClose
      });
      children[headerIndex] = header;
    }

    let bodyIndex = children.findIndex(el => el.type === Accordion.Body);
    if (bodyIndex !== -1) {
      let body = React.cloneElement(children[bodyIndex], {
        open
      });
      children[bodyIndex] = body;
    }

    let render = React.cloneElement(child, {
      open,
      children,
      role: "treeitem"
    });

    return render;
  }

  render() {
    const { index, collapse } = this.props;
    let children = React.Children.toArray(this.props.children).filter(
      child => child.type === Accordion
    );

    return (
      <div
        className={`accordion-group ${collapse ? "collapsed" : ""}`}
        role="tree"
      >
        {children.map((child, i) => this.renderChild(child, i, index === i))}
      </div>
    );
  }
}

AccordionGroup.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  collapse: PropTypes.bool
};

AccordionGroup.defaultProps = {
  index: -1
};
