"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("comp.contactForm");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError(t("fillError"));
      return;
    }
    const subject = encodeURIComponent(t("subject"));
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:support@freetoolsy.com?subject=${subject}&body=${body}`;
    setError(null);
    setSent(true);
  }

  return (
    <form onSubmit={submit} className="mt-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-ad" className="block text-sm font-medium text-text">
            {t("name")}
          </label>
          <input
            id="contact-ad"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("namePlaceholder")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="contact-eposta" className="block text-sm font-medium text-text">
            {t("email")}
          </label>
          <input
            id="contact-eposta"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("emailPlaceholder")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="contact-mesaj" className="block text-sm font-medium text-text">
          {t("message")}
        </label>
        <textarea
          id="contact-mesaj"
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={t("messagePlaceholder")}
          className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        {t("submit")}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>

      {sent && (
        <p className="mt-4 rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-muted">
          {t("sent")}{" "}
          <a
            href="mailto:support@freetoolsy.com"
            className="font-medium text-accent transition-opacity hover:opacity-80"
          >
            support@freetoolsy.com
          </a>
        </p>
      )}
    </form>
  );
}