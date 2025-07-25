import React, { useState } from "react";
import "./Contact.css";
import { toast } from "react-toastify";
import { sendSelfMessage } from "../../services/emailService";

const Contact = ({ isSidebarOpen }) => {
  const [form, setForm] = useState({
    name: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fullMessage = `Subject: ${form.subject}\n\n${form.message}`;
      await sendSelfMessage({ name: form.name, message: fullMessage });
      toast.success("Message sent successfully");
      setForm({ name: "", subject: "", message: "" });
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`contact-page ${isSidebarOpen ? "with-sidebar" : "full-width"}`}>

      <div className="contact-content-wrapper">
        <div className="contact-header">

          <h1 className="contact-brand">Trackእቃ.</h1>
          <h2>📬 Contact Us</h2>
          <p>
            If you have any questions or feedback, feel free to reach out.
            We're here to help you manage your inventory better.
          </p>
        </div>

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

          <button type="submit" className={`purple-btn ${loading ? "loading" : ""}`} disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
