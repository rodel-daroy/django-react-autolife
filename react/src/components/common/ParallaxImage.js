import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TweenMax } from 'gsap'
import { mediaQueryString } from '../../utils/style'

export default class ParallaxImage extends Component {
  constructor (props) {
    super(props)

    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMatchMedia = this.handleMatchMedia.bind(this)
  }

  componentDidMount () {
    this._mediaQuery = window.matchMedia(mediaQueryString('sm md lg'))
    this._mediaQuery.addListener(this.handleMatchMedia)

    this.handleMatchMedia(this._mediaQuery)
  }

  componentWillUnmount () {
    window.removeEventListener('mousemove', this.handleMouseMove)

    this._mediaQuery.removeListener(this.handleMatchMedia)
  }

  handleMatchMedia (e) {
    if (e.matches) {
      window.addEventListener('mousemove', this.handleMouseMove)
    } else {
      window.removeEventListener('mousemove', this.handleMouseMove)
    }
  }

  handleMouseMove (e) {
    const { speed } = this.props

    const width = window.innerWidth
    const height = window.innerHeight
    const posX = e.clientX
    const posY = e.clientY

    const offsetX = (posX / width - 0.5) * speed * 100
    const offsetY = (posY / height - 0.5) * speed * 100

    TweenMax.killTweensOf(this._background)
    TweenMax.to(this._background, 0.2, {
      xPercent: offsetX,
      yPercent: offsetY
    })
  }

  render () {
    const { image } = this.props

    return (
      <div className='parallax-image'>
        <div
          ref={ref => (this._background = ref)}
          className='parallax-image-outer'
        >
          <div
            className='parallax-image-inner'
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>
      </div>
    )
  }
}

ParallaxImage.propTypes = {
  image: PropTypes.string,
  speed: PropTypes.number
}

ParallaxImage.defaultProps = {
  speed: -0.02
}
