"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }
    const subject = encodeURIComponent("FreetoolsY iletişim");
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:destek@freetoolsy.com?subject=${subject}&body=${body}`;
    setError(null);
    setSent(true);
  }

  return (
    <form onSubmit={submit} className="mt-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="iletisim-ad" className="block text-sm font-medium text-text">
            Adınız
          </label>
          <input
            id="iletisim-ad"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Adınız Soyadınız"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="iletisim-eposta" className="block text-sm font-medium text-text">
            E-posta
          </label>
          <input
            id="iletisim-eposta"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ornek@eposta.com"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="iletisim-mesaj" className="block text-sm font-medium text-text">
          Mesajınız
        </label>
        <textarea
          id="iletisim-mesaj"
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Sorunuzu veya geri bildiriminizi buraya yazın…"
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
        Gönder
      </button>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Form, mesajınızı e-posta uygulamanızla paylaşmak için
        destek@freetoolsy.com adresine yönlendirir. Verileriniz bu sitede
        saklanmaz.
      </p>

      {sent && (
        <p className="mt-4 rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-muted">
          Mesajınız hazır; e-posta uygulamanız açıldı. Teşekkürler! Bize{" "}
          <a
            href="mailto:destek@freetoolsy.com"
            className="font-medium text-accent transition-opacity hover:opacity-80"
          >
            destek@freetoolsy.com
          </a>{" "}
          adresinden de ulaşabilirsiniz.
        </p>
      )}
    </form>
  );
}