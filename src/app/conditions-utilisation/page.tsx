"use client";

import React from "react";

const colors = {
  primary: "#FF7F30",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#111111",
  lightGray: "#F5F5F5",
};

export default function ConditionsUtilisationPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: colors.black,
        color: colors.white,
        padding: "6rem 1.5rem 3rem",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 2.6rem)",
            marginBottom: "1.5rem",
          }}
        >
          Conditions d'utilisation Cliver
        </h1>
        <p style={{ color: colors.lightGray, lineHeight: 1.7 }}>
          Cette page présente les conditions générales d'utilisation du service
          Cliver. Vous pouvez synchroniser ce contenu avec celui de votre
          application mobile (écran TermsConditionsScreen) pour garder une base
          légale unique.
        </p>
      </div>
    </main>
  );
}
