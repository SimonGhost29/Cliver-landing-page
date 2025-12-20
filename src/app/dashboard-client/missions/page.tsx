"use client";

import React from "react";
import { supabase } from "@/lib/supabaseClient";

const colors = { primary: "#FF7F30", black: "#000000", white: "#FFFFFF", gray: "#111111", lightGray: "#F5F5F5" };
const TABS = [
  { key: "all", label: "Toutes" },
  { key: "ongoing", label: "En cours" },
  { key: "done", label: "Livrées" },
  { key: "cancelled", label: "Annulées" },
] as const;

export default function ClientMissionsPage() {
  const [tab, setTab] = React.useState<(typeof TABS)[number]["key"]>("all");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [rows, setRows] = React.useState<any[]>([]);

  const load = React.useCallback(async () => {
    if (!supabase) {
      setError("Configuration Supabase manquante.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data: userData, error: uErr } = await supabase.auth.getUser();
      if (uErr || !userData?.user) {
        setError("Session invalide.");
        return;
      }
      const uid = userData.user.id;
      let q = supabase
        .from('missions')
        .select('id, title, status, prix, created_at, start_address, end_address')
        .eq('client_id', uid)
        .order('created_at', { ascending: false })
        .limit(50);
      if (tab === 'ongoing') {
        q = q.in('status', ['en_attente','attribuée','en_livraison','payment_initiated']);
      } else if (tab === 'done') {
        q = q.eq('status', 'livrée');
      } else if (tab === 'cancelled') {
        q = q.eq('status', 'annulée');
      }
      const { data, error } = await q;
      if (error) {
        setError(error.message);
        return;
      }
      setRows(data || []);
    } catch (e) {
      setError("Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  React.useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>Mes missions</h1>
        <a href="/dashboard-client/nouvelle-mission" style={{ padding: '8px 12px', background: colors.primary, color: colors.black, borderRadius: 8, fontWeight: 700 }}>Nouvelle mission</a>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${colors.gray}`, background: tab === t.key ? colors.primary : 'transparent', color: tab === t.key ? colors.black : colors.white, cursor: 'pointer' }}>{t.label}</button>
        ))}
      </div>

      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      {loading ? (
        <p style={{ color: colors.lightGray }}>Chargement…</p>
      ) : rows.length === 0 ? (
        <p style={{ color: colors.lightGray }}>Aucune mission.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rows.map((m) => (
            <li key={m.id} style={{ backgroundColor: '#0f0f0f', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{m.title || 'Mission'}</div>
                <div style={{ color: colors.lightGray, fontSize: 12 }}>{m.start_address || '—'} → {m.end_address || '—'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: colors.primary, fontWeight: 700 }}>{Number(m.prix || 0).toLocaleString('fr-FR')} XOF</div>
                <div style={{ color: colors.lightGray, fontSize: 12 }}>{new Date(m.created_at).toLocaleString('fr-FR')} • {m.status}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
