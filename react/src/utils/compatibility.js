export const dispatchEvent = (eventName, element) => {
	let event

	if(typeof(Event) === 'function')
		event = new Event(eventName)
	else {
		event = document.createEvent('Event')
		event.initEvent(eventName, true, true)
	}

	element.dispatchEvent(event)
}

export const elementMatches = (element, selector) => {
	if(element.matches)
		return element.matches(selector)
	
	if(element.msMatchesSelector)
		return element.msMatchesSelector(selector)
}