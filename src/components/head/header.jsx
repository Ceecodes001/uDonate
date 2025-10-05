import React, { useState } from 'react';
import './styles.css';
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from 'react-scroll';
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

      {/* Navigation Links */}
      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <ScrollLink 
          className="links" 
          to="about" 
          smooth={true} 
          duration={500} 
          onClick={() => setMenuOpen(false)}  
          spy={true} 
          offset={-70}
        >
          About Us
        </ScrollLink>

        {/* ✅ Campaigns now routes to the donation page */}
        <RouterLink 
          to="/donation" 
          className="links" 
          onClick={() => setMenuOpen(false)}
        >
          Campaigns
        </RouterLink>

        <ScrollLink 
          className="links" 
          to="contact" 
          smooth={true} 
          duration={500} 
          onClick={() => setMenuOpen(false)}  
          spy={true} 
          offset={-70}
        >
          Contact Us
        </ScrollLink>

        {/* ✅ Donate Now - same route as Campaigns */}
        <RouterLink 
          to="/donation" 
          className="links"
          onClick={() => setMenuOpen(false)}
        >
          Donate Now
        </RouterLink>

        <ScrollLink 
          className="links" 
          to="testimony" 
          smooth={true} 
          duration={500} 
          onClick={() => setMenuOpen(false)}  
          spy={true} 
          offset={-70}
        >
          Testimony
        </ScrollLink>

        <ScrollLink 
          className="links" 
          to="faq" 
          smooth={true} 
          duration={500} 
          onClick={() => setMenuOpen(false)}  
          spy={true} 
          offset={-70}
        >
          FAQs
        </ScrollLink>
      </nav>
    </header>
  );
};

export default Header;
