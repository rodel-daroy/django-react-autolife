import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class GroupPanel extends Component {
  render () {
    const { headerImage, title, subtitle, children, footer, className } = this.props

    return (
      <section className={`group-panel ${className || ''}`}>
        <div className='group-panel-inner'>
          <header
            className='group-panel-header'
            style={{ backgroundImage: `url(${headerImage})` }}
          >
            {title && (
              <h2>{title}</h2>
            )}
          </header>
          <div className='group-panel-content'>
            <div className='group-panel-subtitle'>
              <h3>
                {subtitle}
              </h3>
            </div>
            <div className='group-panel-body'>
              {children}
            </div>
            {footer &&
              <footer className='group-panel-footer'>
                {footer}
              </footer>}
          </div>
        </div>
      </section>
    )
  }
}

GroupPanel.propTypes = {
  headerImage: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string
}
