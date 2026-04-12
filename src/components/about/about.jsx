import React from "react";
import "./about.css";
import ORPHAN  from '../../assets/meal.jpeg'
import IMG2  from '../../assets/img2.jpeg'
import IMG3  from '../../assets/img3.jpeg'

const About = () => {
  return (
    <div className="about-container" id="about  ">
      <div className="about-header fade-in">
        <h2>About uDonate</h2>
        <p>The Universal Donation Platform for Everyone, Everywhere</p>
      </div>

      <div className="about-section slide-in-left">
        <img
          src={ORPHAN}
          alt="Donation Impact"
        />
        <div className="about-text">
          <h3>Our Mission</h3>
          <p>
            At <strong>uDonate (Universal Donation)</strong>, we believe that
            generosity should know no borders. Our mission is to create a global
            space where acts of kindness can travel across oceans, reach across
            cultures, and touch lives in the deepest corners of the world.  
            <br /><br />
            We are driven by a simple but powerful vision: to make giving
            universal. Whether you are a student with a small allowance, a
            professional eager to give back, or an organization ready to make a
            larger impact, uDonate provides a platform where every single
            contribution matters.  
            <br /><br />
            In a world facing wars, disasters, inequality, and climate crises,
            our mission is to empower ordinary people to become extraordinary
            changemakers. Every click, every share, every donation is a ripple
            that spreads hope and transforms communities.
          </p>
        </div>
      </div>

      <div className="about-section slide-in-right">
        <img
          src={IMG2}
               alt="Helping Hands"
        />
        <div className="about-text">
          <h3>Why Universal?</h3>
          <p>
            Why did we choose the name <strong>Universal Donation</strong>?  
            Because kindness is not meant to be limited. We live in an age where
            technology connects us instantly, yet millions of people remain
            disconnected from compassion and aid. uDonate exists to bridge that
            gap.  
            <br /><br />
            It doesn’t matter where you live, what language you speak, or how
            much you are able to give—your donation joins a movement that
            unites humanity.  
            <br /><br />
            A few dollars might feed a child for a week. A larger gift might
            rebuild homes destroyed by disasters. But more importantly, every
            single donation tells someone, “You are not forgotten. You are not
            alone.”  
            <br /><br />
            That is the true meaning of being universal.
          </p>
        </div>
      </div>

      <div className="about-section slide-in-left">
        <img
          src={IMG3}
          alt="Community Support"
        />
        <div className="about-text">
          <h3>Our Vision</h3>
          <p>
            We envision a future where compassion is not the exception but the
            norm. Through <strong>uDonate</strong>, we aim to build a global
            culture of generosity, where people give not because they have
            excess, but because they have empathy.  
            <br /><br />
            Imagine a platform where someone in the UK can help a family in
            Ukraine rebuild their home. Where a donor in India can support a
            school in Brazil. Where kindness travels faster than tragedy.  
            <br /><br />
            That is the world we dream of—and every donation brings us one step
            closer to making it real.
          </p>
        </div>
      </div>

      <div className="about-footer fade-in">
        <h3>Join the Movement</h3>
        <p>
          uDonate is not just a platform. It is a movement—a revolution of
          kindness. Every voice matters. Every contribution counts. Together,
          we can create a legacy of hope for generations to come.  
          <br /><br />
          When you donate, you are not only giving money—you are giving
          strength, courage, dignity, and love. And in doing so, you become part
          of something greater than yourself: a universal community that
          believes in the power of humanity.  
          <br /><br />
          Let’s build a world where giving is not an obligation, but a way of
          life. Together, through uDonate, we can turn compassion into a force
          powerful enough to change the world.
        </p>
      </div>
    </div>
  );
};

export default About;
