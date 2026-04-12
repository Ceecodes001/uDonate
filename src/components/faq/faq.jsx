import React, { useState } from "react";
import "./faq.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is this platform about?",
      answer:
        "Our platform is dedicated to making donations easy and transparent. You can support causes you care about directly through our website."
    },
    {
      question: "How do I start a donation?",
      answer:
        "Simply click on 'Start a Donation' in the footer or navigation bar, choose a campaign, and follow the payment instructions."
    },
    {
      question: "Is my donation secure?",
      answer:
        "Yes. We use secure payment gateways and encryption to ensure all donations are processed safely."
    },
    {
      question: "Can I get a receipt for my donation?",
      answer:
        "Absolutely. Once you complete a donation, you’ll receive a receipt by email for your records."
    },
    {
      question: "Can I share my testimony?",
      answer:
        "Yes! Visit the testimony page and submit your story. We love to hear how our platform has impacted you."
    },
    {
      question: "How can I contact support?",
      answer:
        "Go to the Contact Us section and fill out the form, or message us directly via the support page."
    },
    {
      question: "Do you accept international donations?",
      answer:
        "Yes. We support donations from different countries and currencies. Your contribution will reach the campaign regardless of where you live."
    }
  ];

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq" id="faq">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            key={index}
          >
            <div className="faq-question" onClick={() => toggleFaq(index)}>
              <span>{faq.question}</span>
              {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {activeIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
