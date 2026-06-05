import { useState } from "react";
import "../styles/publicPages.css";

export default function Contact() {
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg("Message submitted successfully.");
  };

  return (
    <div className="page-section">
      <section className="banner-section">
        <h1>Contact Us</h1>
        <p>Need help with AnarMitra? Send us your message.</p>
      </section>

      <section className="info-section">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Send Message</h2>
          <p>Our agriculture support team will contact you.</p>

          {msg && <div className="success-box">{msg}</div>}

          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea rows="5" placeholder="Your Message" required></textarea>

          <button className="primary-btn" type="submit">
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}