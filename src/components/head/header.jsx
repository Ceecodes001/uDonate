import React, { useState } from 'react';
import './styles.css';
import {Link} from 'react-scroll';
import { FaHandHoldingHeart, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <h1 className="logo">
        uDonate <FaHandHoldingHeart />
      </h1>

      {/* Hamburger Button */}
      <button 
        className="menu-toggle" 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Menu"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Nav Links */}
      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
       
          <Link className="links" to="about" smooth={true} duration={500} onClick={() => setMenuOpen(false)}  spy={true} offset={-70} >
          About Us
          </Link>
          
          
                  <Link className="links" to="#" smooth={true} duration={500} onClick={() => setMenuOpen(false)}  spy={true} offset={-70} >
       Campaigns</Link>
           <Link className="links" to="contact" smooth={true} duration={500} onClick={() => setMenuOpen(false)}  spy={true} offset={-70} >
       Contact Us</Link>
          <Link className="links" to="#" smooth={true} duration={500} onClick={() => setMenuOpen(false)}  spy={true} offset={-70} >
       Donations</Link>
      
           <Link className="links" to="testimony" smooth={true} duration={500} onClick={() => setMenuOpen(false)}  spy={true} offset={-70} >
       Testimony</Link>
          <Link className="links" to="faq" smooth={true} duration={500} onClick={() => setMenuOpen(false)}  spy={true} offset={-70} >
        FAQs</Link>
      </nav>
    </header>
  );
};

export default Header;
