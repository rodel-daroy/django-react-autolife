import React from 'react'
import { FacebookButton, YoutubeButton, InstagramButton, TwitterButton } from '../common/SocialButton'

export default () => {
  return (
    <div className='social-sec_div'>
      <ul className='share-list'>
        <li>
          <FacebookButton />
        </li>
        <li>
          <YoutubeButton />
        </li>
        <li>
          <InstagramButton />
        </li>
        <li>
          <TwitterButton />
        </li>
      </ul>
    </div>
  )
}
