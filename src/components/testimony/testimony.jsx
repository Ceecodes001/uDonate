import React, { useState, useEffect } from "react";
import "./testimony.css";
import MAN from '../../assets/white guy.jpeg'

const testimonialsData = [
  {
    name: "Sarah Johnson",
    role: "Teacher, USA",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: `Before uDonate, I often felt powerless when I saw global tragedies on the news. Now, I know that even a small contribution can have a huge ripple effect. 
    Through uDonate, I supported an education program in Africa. Weeks later, I received updates showing children smiling with new books in their hands. 
    That single act of kindness reminded me that generosity truly transcends distance.`
  },
  {
    name: "Ahmed Khan",
    role: "Entrepreneur, Pakistan",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: `When floods devastated parts of my region, uDonate helped channel international aid quickly. 
    I witnessed families receive food and medical care because people across the globe gave instantly. 
    uDonate isn’t just a platform—it’s a lifeline, a bridge of humanity that restores hope in times of despair.`
  },
  {
    name: "Maria Lopez",
    role: "Student, Brazil",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    text: `As a student, I don’t have much to give, but uDonate showed me that small donations can create big change. 
    I donated to a clean water project and later saw videos of communities celebrating because they finally had safe drinking water. 
    That experience taught me that compassion, not the size of the gift, is what truly matters.`
  },
  {
    name: "David Brown",
    role: "Doctor, UK",
    image: "https://randomuser.me/api/portraits/men/56.jpg",
    text: `I’ve worked in healthcare for years, and I know how critical resources are in emergencies. 
    uDonate’s platform allowed me to directly support medical relief in conflict zones. 
    The speed, transparency, and global unity I experienced gave me faith that technology can serve humanity in the most meaningful ways.`
  }
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 7s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonialsData.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="testimonials-container">
      <div className="testimonials-header fade-in">
        <h2>What People Say About uDonate</h2>
        <p>
          Real stories from real people around the world who have been touched
          by the power of universal giving.
        </p>
      </div>

      <div className="testimonial-card slide-in">
        <img
          src={testimonialsData[current].image}
          alt={testimonialsData[current].name}
          className="testimonial-img"
        />
        <div className="testimonial-text">
          <p>"{testimonialsData[current].text}"</p>
          <h3>{testimonialsData[current].name}</h3>
          <span>{testimonialsData[current].role}</span>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="testimonial-dots">
        {testimonialsData.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
