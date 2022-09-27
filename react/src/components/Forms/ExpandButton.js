import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ExpandIcon from '../common/ExpandIcon';
import RadialButton from './RadialButton'
import omit from 'lodash/omit'

const ExpandButton = props => {
  const { expanded, className } = props;
  const newProps = {
    expanded,
    className
  }

  return (
    <RadialButton
      className={`${expanded ? 'expanded' : ''} ${className || ''}`}
      {...omit(props, Object.keys(newProps))}
    >
      <ExpandIcon expanded={expanded} />
    </RadialButton>
  )
}

ExpandButton.propTypes = {
  expanded: PropTypes.bool,
  className: PropTypes.string
}

export default ExpandButton
