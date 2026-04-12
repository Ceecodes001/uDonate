import React from 'react';
import './footer.css';
import { useNavigate, Link as RouterLink } from "react-router-dom";
 
import { FaInfoCircle, FaMailBulk, FaQuoteLeft, FaDonate } from 'react-icons/fa';
import { Link as ScrollLink } from 'react-scroll';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <h3>Quick Links</h3>
        <ul>
          <li>
            <ScrollLink
              to="about"
              smooth={true}
              duration={600}
              offset={-80}
              spy={true}
              activeClass="active"
            >
              <FaInfoCircle /> About
            </ScrollLink>
          </li>
          <li>
            <ScrollLink
              to="contact"
              smooth={true}
              duration={600}
              offset={-80}
              spy={true}
              activeClass="active"
            >
              <FaMailBulk /> Contact
            </ScrollLink>
          </li>
          <li>
            <ScrollLink
              to="testimony"
              smooth={true}
              duration={600}
              offset={-80}
              spy={true}
              activeClass="active"
            >
              <FaQuoteLeft /> Testimony
            </ScrollLink>
          </li>
          <li>
   <RouterLink 
          to="/donation" 
          className="links"
          onClick={() => setMenuOpen(false)}
        >
          Donate Now
        </RouterLink>

          </li>
        </ul>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} uDonate. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
