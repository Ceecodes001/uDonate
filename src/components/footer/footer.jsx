import React from 'react';
import './footer.css';
import { FaInfoCircle, FaMailBulk, FaQuoteLeft, FaDonate } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <h3>Quick Links</h3>
        <ul>
          <li>
            <a href="#about">
              <FaInfoCircle /> About
            </a>
          </li>
          <li>
            <a href="#contact">
              <FaMailBulk /> Contact
            </a>
          </li>
          <li>
            <a href="#testimony">
              <FaQuoteLeft /> Testimony
            </a>
          </li>
          <li>
            <a href="#donation">
              <FaDonate /> Start a Donation
            </a>
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
