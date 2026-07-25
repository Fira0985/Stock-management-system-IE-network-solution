import React, { useState } from "react";
import "./Contact.css";
import { toast } from "react-toastify";
import { sendSelfMessage } from "../../services/emailService";

const Contact = ({ isSidebarOpen, mode = "contact" }) => {
  const isRequestAccess = mode === "request-access";

  const getEmptyForm = () =>
    isRequestAccess
      ? {
          name: "",
          organization: "",
          email: "",
          teamSize: "",
          message: "",
        }
      : {
          name: "",
          email: "",
          subject: "",
          message: "",
        };

  const [form, setForm] = useState(getEmptyForm());
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const fullMessage = isRequestAccess
        ? `Access Request\nOrganization: ${form.organization}\nEmail: ${form.email}\nTeam Size: ${form.teamSize}\n\n${form.message}`
        : `Subject: ${form.subject}\n\n${form.message}`;

      await sendSelfMessage({ name: form.name, message: fullMessage });
      toast.success(isRequestAccess ? "Access request sent successfully" : "Message sent successfully");
      setForm(getEmptyForm());
    } catch (err) {
      toast.error(isRequestAccess ? "Failed to send access request" : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`contact-page ${isSidebarOpen ? "with-sidebar" : "full-width"} ${isRequestAccess ? "request-access" : ""}`}>
      <div className="contact-content-wrapper">
        <div className="contact-header">
          <div className={`contact-badge ${isRequestAccess ? "request-access-badge" : ""}`}>
            {isRequestAccess ? "Access request" : "Support"}
          </div>
          <h1 className="contact-brand">Trackእቃ.</h1>
          <h2>{isRequestAccess ? "Request Access" : "Contact Us"}</h2>
          <p>
            {isRequestAccess
              ? "Tell us about your team and the access you need so we can guide you through setup."
              : "If you have any questions or feedback, feel free to reach out. We're here to help you manage your inventory better."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={`contact-form ${isRequestAccess ? "request-access-form" : ""}`}>
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

          {isRequestAccess ? (
            <>
              <label>
                Organization:
                <input
                  type="text"
                  name="organization"
                  value={form.organization}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Work Email:
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Team Size:
                <select
                  name="teamSize"
                  value={form.teamSize}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select team size</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="200+">200+</option>
                </select>
              </label>
            </>
          ) : (
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>
          )}

          {!isRequestAccess && (
            <label>
              Subject:
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              />
            </label>
          )}

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
            {loading ? "Sending..." : isRequestAccess ? "Send Request" : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
