import './App.css'
import {Element} from 'react-scroll'
import HEADER from './components/head/header'
import BODY from './components/body/body'
import ABOUT from './components/about/about'
import TESTIMONY from './components/testimony/testimony'
import CONTACT from './components/contactus/contact'
import FOOTER from './components/footer/footer'
import FAQ  from './components/faq/faq'
function App() {
  

  return (
    <>
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
    </>
  )
}

export default App
