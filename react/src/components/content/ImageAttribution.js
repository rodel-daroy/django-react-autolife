import React, { Component } from 'react'

const ImageAttribution = props => props.children ? (
	<div className="image-attribution">
		<div className="image-attribution-inner">
			<span className="icon icon-camera"></span> {props.children}
		</div>
	</div>
) : null

export default ImageAttribution