"use client";

import { useState } from "react";
import { clouds, services } from "@/content/site";

/** Composes an email in the visitor's mail client — no data is sent to any server. */
export function ContactForm({ email }: { email: string }) {
  const [f, setF] = useState({ name: "", company: "", mail: "", cloud: "Not sure yet", service: "Migration", message: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `${f.service} — ${f.cloud} — ${f.company || f.name}`;
    const body = `Name: ${f.name}\nCompany: ${f.company}\nEmail: ${f.mail}\nCloud: ${f.cloud}\nService: ${f.service}\n\n${f.message}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <form className="form" onSubmit={submit} style={{ maxWidth: 640 }}>
      <div className="field-grid">
        <div className="field">
          <label htmlFor="n">Name</label>
          <input id="n" type="text" required value={f.name} onChange={set("name")} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="c">Company</label>
          <input id="c" type="text" value={f.company} onChange={set("company")} autoComplete="organization" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="m">Work email</label>
        <input id="m" type="email" required value={f.mail} onChange={set("mail")} autoComplete="email" />
      </div>
      <div className="field-grid">
        <div className="field">
          <label htmlFor="cl">Cloud</label>
          <select id="cl" value={f.cloud} onChange={set("cloud")}>
            <option>Not sure yet</option>
            {clouds.map((c) => (
              <option key={c.slug}>{c.name}</option>
            ))}
            <option>Multi-cloud</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="s">Service</label>
          <select id="s" value={f.service} onChange={set("service")}>
            {services.map((s) => (
              <option key={s.slug}>{s.title}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="msg">What are you trying to do?</label>
        <textarea id="msg" value={f.message} onChange={set("message")} placeholder="e.g. Exit our Mumbai DC by March: ~180 VMs, 40 SQL Server databases, SAP ECC. RBI-regulated." />
      </div>
      <div>
        <button className="btn accent" type="submit">
          Compose email
        </button>
        <p className="tiny muted" style={{ marginTop: 8 }}>
          Opens your email client with the details filled in. Nothing is stored on this website.
        </p>
      </div>
    </form>
  );
}
