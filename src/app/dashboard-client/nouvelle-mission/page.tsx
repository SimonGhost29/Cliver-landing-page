"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const colors = { primary: "#FF7F30", black: "#000000", white: "#FFFFFF", gray: "#111111", lightGray: "#F5F5F5" };
export default function ClientNewMissionPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!supabase) {
      setError("Configuration Supabase manquante.");
      return;
    }
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") || "").trim();
    const description = String(form.get("description") || "").trim();
    const start_address = String(form.get("start_address") || "").trim();
    const end_address = String(form.get("end_address") || "").trim();
    const recipient_name = String(form.get("recipient_name") || "").trim();
    const recipient_phone = String(form.get("recipient_phone") || "").trim();
    const scheduled_at_raw = String(form.get("scheduled_at") || "").trim();

    if (!title || !start_address || !end_address) {
      setError("Veuillez renseigner au minimum le titre, l'adresse de départ et d'arrivée.");
      return;
    }

    try {
      setLoading(true);
      const { data: userData, error: uErr } = await supabase.auth.getUser();
      if (uErr || !userData?.user) {
        setError("Session invalide. Veuillez vous reconnecter.");
        return;
      }
      const uid = userData.user.id;
      const scheduled_at = scheduled_at_raw ? new Date(scheduled_at_raw).toISOString() : null;

      const { error: insertErr } = await supabase.from("missions").insert({
        client_id: uid,
        title,
        description,
        start_address,
        end_address,
        recipient_name: recipient_name || null,
        recipient_phone: recipient_phone || null,
        scheduled_at,
        delivery_type: "me",
        status: "en_attente",
        prix: 0,
      });

      if (insertErr) {
        setError(insertErr.message || "Impossible de créer la mission.");
        return;
      }
      router.replace("/dashboard-client/missions");
    } catch (e) {
      setError("Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Nouvelle mission</h1>
      {error && <p style={{ color: "#ff6b6b", marginBottom: 12 }}>{error}</p>}
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 640 }}>
        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Titre</label>
          <input name="title" placeholder="Ex: Livraison documents" style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${colors.gray}`, background: "#0f0f0f", color: colors.white }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Description</label>
          <textarea name="description" placeholder="Détails utiles au livreur" rows={3} style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${colors.gray}`, background: "#0f0f0f", color: colors.white }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Adresse de départ</label>
          <input name="start_address" placeholder="Adresse de départ" style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${colors.gray}`, background: "#0f0f0f", color: colors.white }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Adresse d'arrivée</label>
          <input name="end_address" placeholder="Adresse d'arrivée" style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${colors.gray}`, background: "#0f0f0f", color: colors.white }} />
        </div>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <label style={{ display: "block", marginBottom: 6 }}>Nom du destinataire (optionnel)</label>
            <input name="recipient_name" placeholder="Nom du destinataire" style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${colors.gray}`, background: "#0f0f0f", color: colors.white }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 6 }}>Téléphone du destinataire (optionnel)</label>
            <input name="recipient_phone" placeholder="Téléphone" style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${colors.gray}`, background: "#0f0f0f", color: colors.white }} />
          </div>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Horaire souhaité (optionnel)</label>
          <input type="datetime-local" name="scheduled_at" style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${colors.gray}`, background: "#0f0f0f", color: colors.white }} />
        </div>

        <button disabled={loading} type="submit" style={{ padding: "10px 14px", backgroundColor: colors.primary, color: colors.black, borderRadius: 8, fontWeight: 700 }}>
          {loading ? "Création…" : "Créer la mission"}
        </button>
      </form>
    </div>
  );
}
