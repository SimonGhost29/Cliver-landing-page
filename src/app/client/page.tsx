"use client";

import React from "react";
import { CheckCircle, User, Mail, Lock, Phone } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const colors = {
  primary: "#FF7F30",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#111111",
  lightGray: "#F5F5F5",
};

export default function ClientPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleGoogleSignUp = async () => {
    setError(null);
    setSuccess(null);

    if (!supabase) {
      setError(
        "Configuration Supabase manquante. Vérifiez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
      return;
    }

    try {
      setLoading(true);
      const { error: oAuthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (oAuthError) {
        setError(oAuthError.message || "Erreur lors de la connexion avec Google.");
      }
    } catch (err) {
      setError("Erreur inattendue lors de la connexion avec Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    const pseudo = String(formData.get("pseudo") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const acceptConditions = formData.get("acceptConditions") === "on";

    if (!name || !email || !password || !phone) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (!acceptConditions) {
      setError("Vous devez accepter les conditions pour continuer.");
      return;
    }

    if (!supabase) {
      setError(
        "Configuration Supabase manquante. Vérifiez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
      return;
    }

    try {
      setLoading(true);
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullname: name,
            phone,
            role: "client",
            pseudo: pseudo || null,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("Un compte avec cet email existe déjà.");
        } else {
          setError(signUpError.message || "Erreur lors de la création du compte.");
        }
        return;
      }

      setSuccess("Compte créé avec succès. Vérifiez votre email pour confirmer votre inscription.");
      e.currentTarget.reset();
    } catch (err) {
      setError("Erreur inattendue. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
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
                  name="name"
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
              <label htmlFor="client-pseudo">Pseudo (optionnel)</label>
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
                  id="client-pseudo"
                  name="pseudo"
                  type="text"
                  placeholder="Votre pseudo (facultatif)"
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
              <label htmlFor="client-phone">Numéro de téléphone</label>
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
                  id="client-phone"
                  name="phone"
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

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
                fontSize: "0.85rem",
                color: colors.lightGray,
              }}
            >
              <input
                type="checkbox"
                name="acceptConditions"
                style={{ marginTop: 3 }}
              />
              <span>
                J'accepte les
                {" "}
                <a
                  href="/conditions-utilisation"
                  style={{ color: colors.primary, textDecoration: "underline" }}
                >
                  conditions d'utilisation
                </a>{" "}
                et la
                {" "}
                <a
                  href="/politique-confidentialite"
                  style={{ color: colors.primary, textDecoration: "underline" }}
                >
                  politique de confidentialité
                </a>{" "}
                de Cliver.
              </span>
            </label>

            {error && (
              <p
                style={{
                  margin: "0.5rem 0 0",
                  color: "#ff6b6b",
                  fontSize: "0.85rem",
                }}
              >
                {error}
              </p>
            )}

            {success && (
              <p
                style={{
                  margin: "0.5rem 0 0",
                  color: colors.primary,
                  fontSize: "0.85rem",
                }}
              >
                {success}
              </p>
            )}

            <button
              type="button"
              onClick={handleGoogleSignUp}
              style={{
                marginTop: "1rem",
                padding: "0.85rem 1.5rem",
                borderRadius: 8,
                border: "1px solid #FFFFFF22",
                backgroundColor: "transparent",
                color: colors.white,
                fontWeight: 500,
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
              disabled={loading}
            >
              <img
                src="/images/google_logo.png"
                alt="Google"
                style={{ width: 18, height: 18 }}
              />
              <span>Continuer avec Google</span>
            </button>

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
                  name="email"
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
                  name="password"
                  type="password"
                  required
                  placeholder="Choisissez un mot de passe (6 caractères minimum)"
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
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? "Création du compte..." : "S'inscrire comme client"}
            </button>

            <p
              style={{
                marginTop: "0.75rem",
                fontSize: "0.9rem",
                color: colors.lightGray,
              }}
            >
              Déjà inscrit ?{" "}
              <a
                href="/login-client"
                style={{ color: colors.primary, textDecoration: "underline" }}
              >
                Se connecter
              </a>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
