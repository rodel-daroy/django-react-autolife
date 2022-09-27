import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TimelineMax } from 'gsap'

export default class StepIndicator extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.updateLayout(false)
  }

  componentWillUnmount () {
    if (this._timeline) {
      this._timeline.kill()
      delete this._timeline
    }
  }

  componentDidUpdate (prevProps, prevState) {
    this.updateLayout()
  }

  updateLayout (animate = true) {
    const { start, end, current } = this.props
    const fillHeight = current / (end - start + 1) * 100

    if (this._timeline) {
      this._timeline.kill()
      delete this._timeline
    }

    const timeline = new TimelineMax()

    timeline.to(this._fill, 1, { flexBasis: `${fillHeight}%` })
    timeline.to(this._empty, 1, { flexBasis: `${100 - fillHeight}%` }, 0)

    if (!animate) timeline.seek('+=0')

    this._timeline = timeline
  }

  render () {
    const { start, end, stepIndicator, current, className,stepBarFill,stepBarEmpty,stepStart, minimal, orientation } = this.props

    return (
      <div
        className={`step-indicator ${orientation} ${minimal && 'minimal'} ${className || ''} ${stepIndicator || ''}`}
      >
        {!minimal &&
          <div ref={ref => (this._start = ref)} className={`step-start ${stepStart}`} />}
        <div className={`step-bar`}>
          <div ref={ref => (this._fill = ref)} className={`step-bar-fill ${stepBarFill}`} />
          <div ref={ref => (this._empty = ref)} className={`step-bar-empty ${stepBarEmpty}`} />
        </div>
        {!minimal &&
          <div ref={ref => (this._end = ref)} className={`step-end ${stepStart}`} />}
      </div>
    )
  }
}

StepIndicator.propTypes = {
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  className: PropTypes.string,
  stepBarEmpty: PropTypes.string,
  stepBarFill: PropTypes.string,
  stepStart: PropTypes.string,
  minimal: PropTypes.bool,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']).isRequired
}

StepIndicator.defaultProps = {
  orientation: 'vertical',
  stepBarEmpty: '',
  stepBarFill: '',
  stepStart: '',
}
