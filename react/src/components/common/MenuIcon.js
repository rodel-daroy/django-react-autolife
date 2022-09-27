import React, { Component } from 'react'
import PropTypes from 'prop-types'

const MenuIcon = props => {
  const { expanded } = props

  return (
    <div className={`menu-icon ${expanded ? 'expanded' : ''}`}>
      <div className='menu-icon-inner'>
        <div className='menu-icon-line line-1' />
        <div className='menu-icon-line line-2' />
        <div className='menu-icon-line line-3' />
      </div>
    </div>
  )
}

MenuIcon.propTypes = {
  expanded: PropTypes.bool
}

MenuIcon.defaultProps = {
  expanded: false
}

export default MenuIcon
