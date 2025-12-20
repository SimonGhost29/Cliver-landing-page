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

export default function DashboardLivreurPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [kpi, setKpi] = React.useState({ available: 0, today: 0, dayEarnings: 0 });
  const [available, setAvailable] = React.useState<any[]>([]);

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

        // Disponibles (en_attente, non assignées)
        const { count: availableCount } = await supabase
          .from('missions')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'en_attente')
          .is('livreur_id', null);

        // Missions du jour pour le livreur
        const startDay = new Date();
        startDay.setHours(0,0,0,0);
        const { data: todayMissions } = await supabase
          .from('missions')
          .select('prix, created_at')
          .eq('livreur_id', uid)
          .gte('created_at', startDay.toISOString());
        const todayCount = (todayMissions || []).length;

        // Gains du jour (missions livrées aujourd'hui)
        const { data: todayDelivered } = await supabase
          .from('missions')
          .select('prix, created_at')
          .eq('livreur_id', uid)
          .eq('status', 'livrée')
          .gte('created_at', startDay.toISOString());
        const dayEarnings = (todayDelivered || []).reduce((sum: number, m: any) => sum + (Number(m.prix) || 0), 0);

        // Dernières missions disponibles
        const { data: avail } = await supabase
          .from('missions')
          .select('id, title, start_address, end_address, prix, created_at')
          .eq('status', 'en_attente')
          .is('livreur_id', null)
          .order('created_at', { ascending: false })
          .limit(5);

        setKpi({ available: availableCount || 0, today: todayCount, dayEarnings });
        setAvailable(avail || []);
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
        {[{ label: "Missions disponibles", value: kpi.available }, { label: "Missions aujourd'hui", value: kpi.today }, { label: "Gains du jour", value: `${kpi.dayEarnings.toLocaleString('fr-FR')} XOF` }].map((item, i) => (
          <div key={i} style={{ backgroundColor: colors.gray, borderRadius: 10, padding: 16 }}>
            <div style={{ color: colors.lightGray, fontSize: 12 }}>{item.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{loading ? '...' : item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: colors.gray, borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, marginBottom: 8 }}>Trouver une mission</h2>
        <p style={{ color: colors.lightGray, marginBottom: 12 }}>Découvrez les missions disponibles près de vous.</p>
        <a href="/dashboard-livreur/missions-disponibles" style={{ display: "inline-block", padding: "10px 14px", backgroundColor: colors.primary, color: colors.black, borderRadius: 8, fontWeight: 700 }}>Voir les missions</a>
      </div>

      <div style={{ backgroundColor: colors.gray, borderRadius: 10, padding: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, marginBottom: 8 }}>Missions disponibles récentes</h2>
        {loading ? (
          <p style={{ color: colors.lightGray }}>Chargement…</p>
        ) : available.length === 0 ? (
          <p style={{ color: colors.lightGray }}>Aucune mission disponible.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {available.map((m) => (
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
