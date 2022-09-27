import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import kebabCase from 'lodash/kebabCase'

import halw from '../../styles/img/logos/Al-Logo-Horizontal-AllWhite.svg'
import hc from '../../styles/img/logos/Al-Logo-Horizontal-Colour.svg'
import hwr from '../../styles/img/logos/Al-Logo-Horizontal-White&Red.svg'
import sc from '../../styles/img/logos/Al-Logo-Stacked-Colour.svg'
import swb from '../../styles/img/logos/Al-Logo-Stacked-White&Black.svg'
import swr from '../../styles/img/logos/Al-Logo-Stacked-White&Red.svg'
import syc from '../../styles/img/logos/Al-Logo-Symbol-Colour.svg'
import syr from '../../styles/img/logos/Al-Logo-Symbol-Red.svg'
import syw from '../../styles/img/logos/Al-Logo-Symbol-White.svg'
import syaw from '../../styles/img/logos/Al-Logo-Symbol-AllWhite.svg'

const LOGO_KINDS = {
  'Horizontal-AllWhite': halw,
  'Horizontal-Colour': hc,
  'Horizontal-White&Red': hwr,
  'Stacked-Colour': sc,
  'Stacked-White&Black': swb,
  'Stacked-White&Red': swr,
  'Symbol-Colour': syc,
  'Symbol-Red': syr,
  'Symbol-White': syw,
  'Symbol-AllWhite': syaw
}

const Logo = props => {
  const { kind, className, noLink } = props

  const image = (
    <div
      className='logo-image'
      style={{ backgroundImage: `url(${LOGO_KINDS[kind]})` }}
    />
  )

  return (
    <div className={`logo-container ${className || ''}`}>
      <div className={`logo ${kebabCase(kind)}`}>
        {!noLink && (
          <Link to={`/`} className='logo-inner'>
            {image}
          </Link>
        )}

        {noLink && (
          <div className="logo-inner">
            {image}
          </div>
        )}
      </div>
    </div>
  )
}

Logo.propTypes = {
  kind: PropTypes.oneOf(Object.keys(LOGO_KINDS)).isRequired,
  className: PropTypes.string,
  noLink: PropTypes.bool
}

Logo.defaultProps = {
  kind: Object.keys(LOGO_KINDS)[0]
}

export default Logo
export { LOGO_KINDS }
