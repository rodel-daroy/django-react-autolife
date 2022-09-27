import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { footerItems, footerTitle, footerLinks } from 'config/constants'
import Logo from '../Common/Logo'

const FooterMobile = props =>
  <footer className='main-footer-mobile'>
    <div className='footer-legal'>
      <div style={{ padding: 16 }}>
        <Logo kind='Symbol-AllWhite' />
      </div>

      <div style={{ padding: 16 }}>
        <ul className='legal-links'>
          {footerLinks.data.map((data, i) =>
            <li key={i}>
              <a className='btn btn-link dark' href='#'>
                {data.label}
              </a>
            </li>
          )}
        </ul>
      </div>

      <div style={{ fontSize: 10 }}>
        &copy; AutoLife 2017/2018, All Rights Reserved
      </div>
    </div>
  </footer>

export default FooterMobile
