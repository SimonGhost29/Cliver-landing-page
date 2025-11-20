"use client";

import React from "react";
import { CheckCircle, User, Mail, Lock } from "lucide-react";

const colors = {
  primary: "#FF7F30",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#111111",
  lightGray: "#F5F5F5",
};

export default function ClientPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: colors.black,
        color: colors.white,
        padding: "6rem 1.5rem 3rem",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2.5rem",
        }}
      >
        <section>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 2.6rem)",
              marginBottom: "1rem",
            }}
          >
            Découvrez Cliver côté <span style={{ color: colors.primary }}>client</span>
          </h1>
          <p
            style={{
              color: colors.lightGray,
              marginBottom: "1.75rem",
              lineHeight: 1.6,
            }}
          >
            Créez vos missions en quelques secondes, suivez votre livreur en
            temps réel et payez en toute sécurité depuis votre smartphone.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              "Création de missions ultra simple et rapide",
              "Suivi temps réel du livreur sur la carte",
              "Notifications à chaque étape de la livraison",
              "Paiements sécurisés et historique complet",
            ].map((item) => (
              <li
                key={item}
                style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}
              >
                <CheckCircle size={20} color={colors.primary} />
                <span style={{ color: colors.lightGray }}>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          style={{
            backgroundColor: colors.gray,
            padding: "2rem 1.75rem",
            borderRadius: 12,
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              color: colors.primary,
            }}
          >
            Créez votre compte client
          </h2>
          <p style={{ color: colors.lightGray, marginBottom: "1.5rem" }}>
            Inscrivez-vous pour être parmi les premiers à profiter de Cliver
            dans votre ville.
          </p>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label htmlFor="client-name">Nom complet</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: colors.black,
                  padding: "0.75rem 0.9rem",
                  borderRadius: 8,
                }}
              >
                <User size={18} color={colors.primary} />
                <input
                  id="client-name"
                  type="text"
                  required
                  placeholder="Votre nom et prénom"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: colors.white,
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label htmlFor="client-email">Adresse email</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: colors.black,
                  padding: "0.75rem 0.9rem",
                  borderRadius: 8,
                }}
              >
                <Mail size={18} color={colors.primary} />
                <input
                  id="client-email"
                  type="email"
                  required
                  placeholder="vous@exemple.com"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: colors.white,
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label htmlFor="client-password">Mot de passe</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: colors.black,
                  padding: "0.75rem 0.9rem",
                  borderRadius: 8,
                }}
              >
                <Lock size={18} color={colors.primary} />
                <input
                  id="client-password"
                  type="password"
                  required
                  placeholder="Choisissez un mot de passe"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: colors.white,
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: "0.5rem",
                padding: "0.85rem 1.5rem",
                borderRadius: 8,
                border: "none",
                backgroundColor: colors.primary,
                color: colors.black,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              S'inscrire comme client
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
