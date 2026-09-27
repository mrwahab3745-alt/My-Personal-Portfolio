import { useEffect, useRef, useState } from "react";

function Contact() {
  const requestControllerRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ message: "", className: "" });
  const [nextUrl] = useState(() => `${window.location.origin}${window.location.pathname}#contact`);

  useEffect(() => () => requestControllerRef.current?.abort(), []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    if (!name || !email || !message) {
      setFormStatus({ message: "Please fill out all fields.", className: "is-error" });
      return;
    }

    requestControllerRef.current?.abort();
    const requestController = new AbortController();
    requestControllerRef.current = requestController;
    setIsSubmitting(true);
    setFormStatus({ message: "Sending message...", className: "" });

    try {
      const response = await fetch("https://formsubmit.co/ajax/mrwahab3745@gmail.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
        signal: requestController.signal
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Failed to send message.");
      }

      setFormStatus({
        message: "Message sent successfully. I will get back to you shortly.",
        className: "is-success"
      });
      form.reset();
    } catch (error) {
      if (error.name !== "AbortError") {
        setFormStatus({
          message: error?.message || "Something went wrong. Please try again.",
          className: "is-error"
        });
      }
    } finally {
      if (!requestController.signal.aborted) {
        requestControllerRef.current = null;
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section id="contact" className="section contact reveal-on-scroll">
      <div className="section-head">
        <p className="eyebrow">Contact</p>
        <h2>Let us build something excellent</h2>
        <p className="section-lead">Tell me about your timeline, goals, and budget range — I reply within one business day.</p>
      </div>
      <div className="contact-layout">
        <form id="contact-form" className="contact-form glass-card" action="https://formsubmit.co/mrwahab3745@gmail.com" method="POST" noValidate onSubmit={handleSubmit}>
          <input type="hidden" name="_subject" defaultValue="New Portfolio Contact Message" />
          <input type="hidden" name="_template" defaultValue="table" />
          <input type="hidden" name="_captcha" defaultValue="false" />
          <input type="hidden" name="_next" defaultValue={nextUrl} data-dynamic-next />
          <input type="text" name="_honey" className="honeypot" tabIndex="-1" autoComplete="off" aria-hidden="true" defaultValue="" />
          <label className="field">
            <span>Name</span>
            <input type="text" id="name" name="name" placeholder="Your name" autoComplete="name" required />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" id="email" name="email" placeholder="you@example.com" autoComplete="email" required />
          </label>
          <label className="field">
            <span>Message</span>
            <textarea id="message" name="message" placeholder="Project details, links, or questions" required></textarea>
          </label>
          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>Send message</button>
          <p id="form-status" className={`form-status ${formStatus.className}`} role="status" aria-live="polite">{formStatus.message}</p>
        </form>
        <aside className="contact-aside glass-card fade-in" aria-label="Professional links">
          <p className="contact-aside-title">Direct channels</p>
          <div className="social-links">
            <a href="https://github.com/mrwahab3745-alt" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56l-.02-1.97c-3.2.69-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.25.72-1.54-2.56-.29-5.25-1.28-5.25-5.72 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.03 0 0 .97-.31 3.17 1.18a11.1 11.1 0 0 1 5.78 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.57.24 2.74.12 3.03.74.81 1.18 1.84 1.18 3.1 0 4.45-2.69 5.42-5.26 5.7.41.36.78 1.08.78 2.18l-.01 3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"></path></svg>
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/wahab-ahmad-6a6514320/" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 0 0 5.01 2.5 2.5 0 0 0 0-5Zm-2 6.75h4v12.25h-4V10.25Zm7 0h3.84v1.67h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.66 4.8 6.11v6.52h-4v-5.78c0-1.38-.02-3.16-1.93-3.16-1.93 0-2.23 1.5-2.23 3.06v5.88h-4V10.25Z"></path></svg>
              <span>LinkedIn</span>
            </a>
            <a href="mailto:mrwahab3745@gmail.com" className="social-link">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v13.5A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V5.25Zm2.14-.24 6.55 5.53a.5.5 0 0 0 .62 0l6.55-5.53H5.14Zm13.86 2.1-5.44 4.59a2.5 2.5 0 0 1-3.22 0L5 7.11v11.64c0 .14.11.25.25.25h13.5a.25.25 0 0 0 .25-.25V7.11Z"></path></svg>
              <span>Email</span>
            </a>
            <a href="https://www.upwork.com/" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg className="social-icon-upwork" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M18.561 3.3c-2.544 0-4.635 2.027-5.092 4.697-1.133-1.587-2.013-3.726-2.412-5.71H8.547v7.23C8.547 11.23 7.82 12 6.914 12c-.906 0-1.633-.77-1.633-1.783V2.287H2.774v7.93c0 2.416 1.854 4.384 4.14 4.384 2.287 0 4.141-1.968 4.141-4.384V8.53c.433 1.25.969 2.5 1.633 3.518-.328 1.488-1.312 4.14-3.414 4.14-.131 0-.256-.007-.375-.021v2.556c.306.05.625.078.96.078 2.506 0 4.455-1.464 5.304-3.834.79 1.587 2.125 3.756 4.341 3.756 2.544 0 4.635-2.027 4.635-4.697V8c-.01-2.6-2.1-4.7-4.646-4.7zm0 9.07c0 1.25-.969 2.271-2.148 2.271-1.18 0-2.149-1.021-2.149-2.271V8c0-1.25.97-2.271 2.149-2.271 1.18 0 2.148 1.021 2.148 2.271v4.37z"></path>
              </svg>
              <span>Upwork</span>
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Contact;