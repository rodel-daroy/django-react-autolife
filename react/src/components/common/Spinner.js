import React, { Component } from 'react'
import PropTypes from 'prop-types'

const Spinner = props => {
  const { pulse, color, scale } = props

  return (
    <div className={`spinner ${pulse ? 'pulse' : ''}`}>
      <div className='logo-outer'>
        <div className={`logo ${color}`}>
          <div className='logo-inner' style={{ transform: `scale(${scale})` }} />
        </div>
      </div>
    </div>
  )
}

Spinner.propTypes = {
  pulse: PropTypes.bool,
  color: PropTypes.oneOf(['white', 'darkblue', 'lightgrey']),
  scale: PropTypes.number
}

Spinner.defaultProps = {
  pulse: true,
  color: 'white',
  scale: 1
}

export default Spinner
