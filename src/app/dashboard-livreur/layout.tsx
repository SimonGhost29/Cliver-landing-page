"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Package, MessageCircle, Wallet, Clock, Settings, History, MapPin, LogOut } from "lucide-react";

const colors = {
  primary: "#FF7F30",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#111111",
  lightGray: "#F5F5F5",
};

export default function DashboardLivreurLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!supabase) {
        router.replace("/login-livreur");
        return;
      }
      const { data } = await supabase.auth.getUser();
      const role = (data.user?.user_metadata as any)?.role;
      if (!data.user || role !== "livreur") {
        router.replace("/login-livreur");
        return;
      }
      setChecking(false);
    };
    verify();
  }, [router]);

  if (checking) {
    return (
      <main style={{ minHeight: "100vh", backgroundColor: colors.black, color: colors.white, display: "grid", placeItems: "center" }}>
        <p>Chargement de votre espace livreur…</p>
      </main>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "100vh", backgroundColor: colors.black, color: colors.white }}>
      <aside style={{ borderRight: `1px solid ${colors.gray}`, padding: "1.25rem", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
          <Package size={18} color={colors.primary} /> Espace livreur
        </div>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            <li><a href="/dashboard-livreur" style={{ color: colors.white, textDecoration: "none" }}>Aperçu</a></li>
            <li><a href="/dashboard-livreur/missions-disponibles" style={{ color: colors.white, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><MapPin size={16} /> Missions disponibles</a></li>
            <li><a href="/dashboard-livreur/mes-missions" style={{ color: colors.white, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Clock size={16} /> Mes missions</a></li>
            <li><a href="/dashboard-livreur/gains" style={{ color: colors.white, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Wallet size={16} /> Gains</a></li>
            <li><a href="/dashboard-livreur/messages" style={{ color: colors.white, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><MessageCircle size={16} /> Messages</a></li>
            <li><a href="/dashboard-livreur/profil" style={{ color: colors.white, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Settings size={16} /> Profil & Paramètres</a></li>
          </ul>
        </nav>
        <button
          onClick={async () => {
            if (!supabase || signingOut) return;
            setSigningOut(true);
            await supabase.auth.signOut();
            router.replace("/login-livreur");
          }}
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "transparent",
            color: colors.lightGray,
            border: `1px solid ${colors.gray}`,
            borderRadius: 8,
            padding: "8px 10px",
            cursor: "pointer",
          }}
        >
          <LogOut size={16} /> {signingOut ? "Déconnexion…" : "Se déconnecter"}
        </button>
      </aside>
      <main style={{ padding: "1.5rem" }}>{children}</main>
    </div>
  );
}
