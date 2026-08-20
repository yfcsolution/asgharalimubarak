"use client";

import { useState, type FormEvent } from "react";

type ContactFormProps = {
  email: string;
};

type Status = "idle" | "ready" | "error";

export function ContactForm({ email }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const fromEmail = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !fromEmail || !subject || !message) {
      setStatus("error");
      return;
    }

    const body = [
      `Name: ${name}`,
      `Email: ${fromEmail}`,
      "",
      message,
    ].join("\n");

    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setStatus("ready");
    form.reset();
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <label>
        Name
        <input name="name" type="text" autoComplete="name" required />
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Subject
        <input name="subject" type="text" required />
      </label>
      <label>
        Message
        <textarea name="message" rows={6} required />
      </label>
      <button type="submit" className="btn-primary">
        Send Message
      </button>
      {status === "error" ? (
        <p className="meta" role="alert">
          Please complete all fields before sending.
        </p>
      ) : null}
      {status === "ready" ? (
        <p className="meta" role="status">
          Your email app should open with the message addressed to {email}.
        </p>
      ) : null}
    </form>
  );
}
