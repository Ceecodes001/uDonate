import React, { useState } from 'react';
import './styles.css';
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
        <p className="links">About Us</p>
        <p className="links">Campaigns</p>
        <p className="links">Contact Us</p>
        <p className="links">Donations</p>
        <p className="links">Support</p>
        <p className="links">Start a Campaign</p>
      </nav>
    </header>
  );
};

export default Header;
