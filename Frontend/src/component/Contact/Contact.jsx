import React, { useState, useEffect } from "react";
import "./Contact.css";

const Contact = ({ isSidebarOpen }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setForm((prev) => ({ ...prev, email: storedEmail }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const recipientEmail = "firafisberhan4@gmail.com";
    const subject = encodeURIComponent(form.subject || "Feedback/Inquiry");
    const body = encodeURIComponent(
      `From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );

    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    // Optionally clear form after opening mail client
    setForm({
      name: "",
      email: localStorage.getItem("email") || "",
      subject: "",
      message: "",
    });
  };

  return (
    <div
      className={`contact-page ${isSidebarOpen ? "with-sidebar" : "full-width"
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
            disabled
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
