"use client";

import React from "react";

const colors = {
  primary: "#FF7F30",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#111111",
  lightGray: "#F5F5F5",
};

export default function PolitiqueConfidentialitePage() {
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
          Politique de confidentialité Cliver
        </h1>
        <p style={{ color: colors.lightGray, lineHeight: 1.7 }}>
          Cette page présente la politique de confidentialité de Cliver. Vous
          pouvez y recopier le contenu de votre écran
          PrivacyPolicyScreen dans l'application pour garder les mêmes
          informations légales partout.
        </p>
      </div>
    </main>
  );
}
