import React, { Component } from 'react'
import PropTypes from 'prop-types'
import without from 'lodash/without'
import range from 'lodash/range'
import { TweenMax, TimelineMax } from 'gsap'
import ParallaxImage from './ParallaxImage'

export default class ParallaxCarousel extends Component {
  constructor (props) {
    super(props)

    this._parallax = []
  }

  initializeBackground = () => {
    const { images } = this.props
    let { activeStep } = this.props
    if (isNaN(activeStep)) activeStep = 0

    TweenMax.set(this._parallax, { visibility: 'hidden' })
    TweenMax.set(this._parallax[activeStep % images.length], {
      visibility: 'visible',
      yPercent: 0
    })
  }

  animateBackground = (activeStep = 0, previousStep = 0) => {
    const { images } = this.props

    const fromParallax = this._parallax[previousStep % images.length]
    const toParallax = this._parallax[activeStep % images.length]

    if (this._parallaxTimeline) {
      this._parallaxTimeline.kill()
      delete this._parallaxTimeline
    }

    const timeline = new TimelineMax()

    timeline.set(
      without(this._parallax, [fromParallax, toParallax]),
      { visibility: 'hidden' },
      0
    )
    timeline.set([fromParallax, toParallax], { visibility: 'visible' }, 0)

    if (activeStep > previousStep) {
      timeline.set(toParallax, { yPercent: 100 }, 0)

      timeline.to(fromParallax, 0.5, { yPercent: -100 }, 0)
      timeline.to(toParallax, 0.5, { yPercent: 0 }, 0)
    } else {
      timeline.set(toParallax, { yPercent: -100 }, 0)

      timeline.to(fromParallax, 0.5, { yPercent: 100 }, 0)
      timeline.to(toParallax, 0.5, { yPercent: 0 }, 0)
    }

    this._parallaxTimeline = timeline
  }

  componentDidMount () {
    this.initializeBackground()
  }

  componentWillUnmount () {
    if (this._parallaxTimeline) {
      this._parallaxTimeline.kill()
      delete this._parallaxTimeline
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (
      !isNaN(this.props.activeStep) &&
      this.props.activeStep !== prevProps.activeStep
    ) {
      this.animateBackground(this.props.activeStep, prevProps.activeStep)
    }
  }

  render () {
    const { images } = this.props
    console.log(this.props, 'images')
    const steps = range(0, images.length).map(i =>
      <div
        ref={ref => (this._parallax[i] = ref)}
        key={i}
        className='parallax-outer'
      >
        <div className='fade-top' />
        <ParallaxImage image={images[i]} />
        <div className='fade-bottom' />
      </div>
    )

    return (
      <div className='parallax-container'>
        {steps}
      </div>
    )
  }
}

ParallaxCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeStep: PropTypes.number
}

ParallaxCarousel.defaultProps = {
  activeStep: 0
}
