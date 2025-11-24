"use client";

import React from "react";
import { Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const colors = {
  primary: "#FF7F30",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#111111",
  lightGray: "#F5F5F5",
};

export default function LoginLivreurPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
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
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Identifiants incorrects.");
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (!userError && userData?.user) {
        const role = (userData.user.user_metadata as any)?.role;

        if (role === "client") {
          router.push("/dashboard-client");
        } else if (role === "livreur") {
          router.push("/dashboard-livreur");
        } else {
          router.push("/");
        }
      } else {
        router.push("/");
      }

      // TODO: rediriger vers le bon espace livreur (ex: /home-livreur) une fois prêt
    } catch (err) {
      setError("Erreur inattendue. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);

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

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: colors.black,
        color: colors.white,
        padding: "6rem 1.5rem 3rem",
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 2.4rem)",
            marginBottom: "0.75rem",
          }}
        >
          Connexion livreur
        </h1>
        <p style={{ color: colors.lightGray, marginBottom: "1.5rem" }}>
          Connectez-vous à votre compte livreur Cliver.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label htmlFor="login-email">Adresse email</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: colors.gray,
                padding: "0.75rem 0.9rem",
                borderRadius: 8,
              }}
            >
              <Mail size={18} color={colors.primary} />
              <input
                id="login-email"
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
            <label htmlFor="login-password">Mot de passe</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: colors.gray,
                padding: "0.75rem 0.9rem",
                borderRadius: 8,
              }}
            >
              <Lock size={18} color={colors.primary} />
              <input
                id="login-password"
                name="password"
                type="password"
                required
                placeholder="Votre mot de passe"
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
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGoogleLogin}
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

        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.9rem",
            color: colors.lightGray,
          }}
        >
          Pas encore de compte ?{" "}
          <a
            href="/livreur"
            style={{ color: colors.primary, textDecoration: "underline" }}
          >
            Créer un compte livreur
          </a>
        </p>

        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "0.8rem",
            color: colors.lightGray,
          }}
        >
          En vous connectant, vous acceptez nos{" "}
          <a
            href="/conditions-utilisation"
            style={{ color: colors.primary, textDecoration: "underline" }}
          >
            conditions d'utilisation
          </a>{" "}
          et notre{" "}
          <a
            href="/politique-confidentialite"
            style={{ color: colors.primary, textDecoration: "underline" }}
          >
            politique de confidentialité
          </a>
          .
        </p>
      </div>
    </main>
  );
}
