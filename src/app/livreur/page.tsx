"use client";

import React from "react";
import { CheckCircle, User, Phone, MapPin } from "lucide-react";

const colors = {
  primary: "#FF7F30",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#111111",
  lightGray: "#F5F5F5",
};

export default function LivreurPage() {
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
            Cliver côté <span style={{ color: colors.primary }}>livreur</span>
          </h1>
          <p
            style={{
              color: colors.lightGray,
              marginBottom: "1.75rem",
              lineHeight: 1.6,
            }}
          >
            Recevez des missions proches de vous, optimisez vos trajets et
            augmentez vos revenus grâce à une plateforme pensée pour les livreurs.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              "Missions géolocalisées autour de vous",
              "Suivi d'itinéraire et navigation intégrée",
              "Historique des gains et paiements sécurisés",
              "Système de notation pour valoriser votre sérieux",
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
            Devenez livreur Cliver
          </h2>
          <p style={{ color: colors.lightGray, marginBottom: "1.5rem" }}>
            Laissez vos coordonnées pour être contacté lorsque les missions
            seront disponibles dans votre zone.
          </p>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label htmlFor="livreur-name">Nom complet</label>
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
                  id="livreur-name"
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
              <label htmlFor="livreur-phone">Numéro de téléphone</label>
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
                <Phone size={18} color={colors.primary} />
                <input
                  id="livreur-phone"
                  type="tel"
                  required
                  placeholder="Ex : +33 6 12 34 56 78"
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
              <label htmlFor="livreur-city">Ville / Zone de livraison</label>
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
                <MapPin size={18} color={colors.primary} />
                <input
                  id="livreur-city"
                  type="text"
                  required
                  placeholder="Votre ville / quartier"
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
              S'inscrire comme livreur
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
