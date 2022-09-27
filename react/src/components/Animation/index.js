import { TimelineMax } from 'gsap'
import PropTypes from 'prop-types'

export const stagger = (delay, interval) => offset => {
	return delay + (offset * interval)
}

export const slideIn = ({ x = 0, y = 50 } = {}) => ref => {
	const timeline = new TimelineMax()

	timeline.set(ref, { x, y, opacity: 0 }, 0)
	timeline.to(ref, .5, { x: 0, y: 0, clearProps: 'transform' }, 0)
	timeline.to(ref, .5, { opacity: 1, clearProps: 'opacity,transform' }, .1)

	return timeline
}

export const slideOut = ({ x = 0, y = -50 } = {}) => ref => {
	const timeline = new TimelineMax()

	timeline.to(ref, .5, { x, y }, 0)
	timeline.to(ref, .5, { opacity: 0 }, .1)

	return timeline
}

export const fadeIn = () => ref => {
	const timeline = new TimelineMax()

	timeline.fromTo(ref, .5, { opacity: 0 }, { opacity: 1, clearProps: 'opacity' })

	return timeline
}

export const fadeOut = () => ref => {
	const timeline = new TimelineMax()

	timeline.fromTo(ref, .5, { opacity: 1 }, { opacity: 0 })

	return timeline
}

export const AnimationOptionsPropTypes = {
	enter: PropTypes.func,
	leave: PropTypes.func,

	delayIn: PropTypes.func,
	delayOut: PropTypes.func,

	offset: PropTypes.func
}

export const offset = () => {
	let currentOffset = 0

	return () => currentOffset++
}

export function AnimationOptions(props) {
	Object.assign(this, {
		enter: slideIn(),
		leave: slideOut(),

		delayIn: stagger(0, 0.15),
		delayOut: stagger(0, 0.15),

		offset: offset()
	}, props)
}