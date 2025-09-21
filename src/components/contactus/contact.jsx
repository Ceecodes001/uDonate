import React from 'react';
import './contact.css';
import { FaMailBulk } from 'react-icons/fa';

const Contact = () => {
  function submit() {
    alert('Success! 🎉 You are subscribed.');
  }

  return (
    <div className="contact">
      <h3>
        Contact Us <FaMailBulk />
      </h3> 
      
      <div className="content">
        <label htmlFor="input">Subscribe to our newsletter: </label>
        <input 
          type="email" 
          id="input" 
          name="email" 
          placeholder="Enter your email.."  
          required
        />
        <button type="button" onClick={submit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Contact;
