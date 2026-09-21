import React, { useState } from "react";
import "./ContactForm.css";

// Formulaire de contact obligatoire avant de démarrer une discussion
function ContactForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Le nom est requis.";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Merci de saisir un email valide.";
    }
    if (!form.phone.trim() || form.phone.trim().length < 6) {
      newErrors.phone = "Merci de saisir un numéro de téléphone valide.";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(form);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2 className="contact-form-title">Avant de commencer 👋</h2>
      <p className="contact-form-subtitle">
        Laissez-nous vos coordonnées pour démarrer votre discussion avec le Skin Care Assistant.
      </p>

      <div className="form-row">
        <label htmlFor="name">Nom complet</label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Votre nom"
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="vous@exemple.com"
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="phone">Téléphone</label>
        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+33 6 12 34 56 78"
        />
        {errors.phone && <span className="field-error">{errors.phone}</span>}
      </div>

      <button className="btn btn-primary contact-form-submit" type="submit">
        Continuer
      </button>
    </form>
  );
}

export default ContactForm;
