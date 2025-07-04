import React, { useState } from "react";
import "./Contact.css";

const Contact = ({ isSidebarOpen }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    // Optionally send to backend here
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div
      className={`contact-page ${
        isSidebarOpen ? "with-sidebar" : "full-width"
      }`}
    >
      <h2>📬 Contact Us</h2>
      <p>If you have any questions or feedback, feel free to reach out.</p>

      <form onSubmit={handleSubmit} className="contact-form">
        <label>
          Full Name:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email Address:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Subject:
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
          />
        </label>

        <label>
          Message:
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="5"
            required
          />
        </label>

        <button type="submit" className="purple-btn">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
