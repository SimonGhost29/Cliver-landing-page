"use client";

import React from "react";
import { supabase } from "@/lib/supabaseClient";

const colors = {
  primary: "#FF7F30",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#111111",
  lightGray: "#F5F5F5",
};

export default function DashboardClientPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [kpi, setKpi] = React.useState({ ongoing: 0, done: 0, monthSpend: 0 });
  const [recent, setRecent] = React.useState<any[]>([]);

  React.useEffect(() => {
    const load = async () => {
      if (!supabase) {
        setError("Configuration Supabase manquante.");
        setLoading(false);
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

        // Compteurs en-tête
        const statusesOngoing = ['en_attente','attribuée','en_livraison','payment_initiated'];
        const { count: ongoingCount } = await supabase
          .from('missions')
          .select('id', { count: 'exact', head: true })
          .eq('client_id', uid)
          .in('status', statusesOngoing);

        const { count: doneCount } = await supabase
          .from('missions')
          .select('id', { count: 'exact', head: true })
          .eq('client_id', uid)
          .eq('status', 'livrée');

        // Dépenses du mois
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const { data: monthMissions } = await supabase
          .from('missions')
          .select('prix, created_at')
          .eq('client_id', uid)
          .eq('status', 'livrée')
          .gte('created_at', monthStart);
        const monthSpend = (monthMissions || []).reduce((sum: number, m: any) => sum + (Number(m.prix) || 0), 0);

        // Dernières missions
        const { data: last } = await supabase
          .from('missions')
          .select('id, title, status, prix, created_at, start_address, end_address')
          .eq('client_id', uid)
          .order('created_at', { ascending: false })
          .limit(5);

        setKpi({ ongoing: ongoingCount || 0, done: doneCount || 0, monthSpend });
        setRecent(last || []);
      } catch (e) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", marginBottom: 12 }}>Aperçu</h1>
      {error && <p style={{ color: '#ff6b6b', marginBottom: 12 }}>{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[{ label: "Missions en cours", value: kpi.ongoing }, { label: "Missions terminées", value: kpi.done }, { label: "Dépenses ce mois", value: `${kpi.monthSpend.toLocaleString('fr-FR')} XOF` }].map((item, i) => (
          <div key={i} style={{ backgroundColor: colors.gray, borderRadius: 10, padding: 16 }}>
            <div style={{ color: colors.lightGray, fontSize: 12 }}>{item.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{loading ? '...' : item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: colors.gray, borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, marginBottom: 8 }}>Créer une nouvelle mission</h2>
        <p style={{ color: colors.lightGray, marginBottom: 12 }}>Décrivez votre livraison et choisissez vos préférences.</p>
        <a href="/dashboard-client/nouvelle-mission" style={{ display: "inline-block", padding: "10px 14px", backgroundColor: colors.primary, color: colors.black, borderRadius: 8, fontWeight: 700 }}>Commencer</a>
      </div>

      <div style={{ backgroundColor: colors.gray, borderRadius: 10, padding: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, marginBottom: 8 }}>Dernières missions</h2>
        {loading ? (
          <p style={{ color: colors.lightGray }}>Chargement…</p>
        ) : recent.length === 0 ? (
          <p style={{ color: colors.lightGray }}>Aucune mission récente.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recent.map((m) => (
              <li key={m.id} style={{ backgroundColor: '#0f0f0f', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{m.title || 'Mission'}</div>
                  <div style={{ color: colors.lightGray, fontSize: 12 }}>{m.start_address || '—'} → {m.end_address || '—'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: colors.primary, fontWeight: 700 }}>{Number(m.prix || 0).toLocaleString('fr-FR')} XOF</div>
                  <div style={{ color: colors.lightGray, fontSize: 12 }}>{new Date(m.created_at).toLocaleString('fr-FR')}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
