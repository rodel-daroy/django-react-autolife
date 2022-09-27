import React from 'react'
import Youtube from './Youtube'

import './style.scss'

const VIDEO_IDS = [
	'_tmErCs-Zto',
	'al2Vox7a4kc',
	'v0zZorVQsx4',
	'bwZBf0QcQS8',
	'_veBzt9fFNw',
	't5aKf5KEdYA',
	'V1NOlZ42xgM',
	'OtkDZ0OKKC0',
	'cGWvDH0dArY',
	'QqDlYaIWzXM',
	'qKIwXfus_io',
	'02HlqfiQpks',
	'4VgwtI8fLmQ',
	'HfKZI0ERkUg',
	'dNo_qaNcd6A',
	'PZmAiJpCW74',
	'7e9jwjuosX8',
	'29gmxXvcSmY'
]

const Videos = props => (
	<div className="video-container">
		{VIDEO_IDS.map((id, i) => (
			<Youtube videoId={id} />
		))}
	</div>
)

export default Videos