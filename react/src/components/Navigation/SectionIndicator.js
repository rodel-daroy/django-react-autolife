import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class SectionIndicator extends Component {
  constructor (props) {
    super(props)
  }

  handlePage = section => e => {
    const { onClick } = this.props;
    onClick(section)
  }

  render () {
    const { sections, currentSection, className } = this.props;
    return (
      <nav className={classnames('section-indicator', className)}>
        {sections.length > 0 &&
          <ul>
            {sections.map((section, index) => {
              return (
                <li key={index} className={classnames(currentSection == index && 'active', section.sectionComplete && 'sectionComplete')}>
                  <button className="btn btn-link" type="button" onClick={this.handlePage(index)}>
                    <div className="btn btn-circle">
                      {section.sectionComplete ? <span className="icon icon-checkmark"></span> : <span>{`0${index + 1}`}</span>}
                    </div>
                    <div className="section-indicator-name">
                      {section.sectionName}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>}
      </nav>
    )
  }
}

SectionIndicator.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    sectionName: PropTypes.node,
    sectionComplete: PropTypes.bool
  })),
  currentSection: PropTypes.number,
  className: PropTypes.string
}

SectionIndicator.defaultProps = {
  sections: [], 
  currentSection: 0,
  className: ''
};
