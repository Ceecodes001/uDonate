import React from 'react'
import {Element} from 'react-scroll'
import HEADER from './head/header'
import BODY from './body/body'
import ABOUT from './about/about'
import TESTIMONY from './testimony/testimony'
import CONTACT from './contactus/contact'
import FOOTER from './footer/footer'
import FAQ  from './faq/faq'

const entry = () => {
  return (
    <div>
      
      <HEADER/>

      <BODY/>
      <Element name="about">
      <ABOUT/>
      </Element>
      <Element name="testimony">
      <TESTIMONY/>
      </Element>
      <Element name="contact">
      <CONTACT/>
     
      </Element>
      <Element name="faq">
     <FAQ/>

     </Element>
    
      <Element name="footer">
     <FOOTER/>

     </Element>
  
    </div>
  )
}

export default entry
