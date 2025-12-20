"use client";

import React from "react";
import { supabase } from "@/lib/supabaseClient";

const colors = { primary: "#FF7F30", black: "#000000", white: "#FFFFFF", gray: "#111111", lightGray: "#F5F5F5" };
export default function MyMissionsPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [rows, setRows] = React.useState<any[]>([]);
  const [acting, setActing] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    if (!supabase) {
      setError("Configuration Supabase manquante.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id;
      if (!uid) {
        setError("Session invalide.");
        return;
      }
      const { data, error } = await supabase
        .from('missions')
        .select('id, title, status, prix, created_at, start_address, end_address')
        .eq('livreur_id', uid)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) { setError(error.message); return; }
      setRows(data || []);
    } catch (e) {
      setError("Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const startMission = async (id: string) => {
    if (!supabase) return;
    setActing(id);
    try {
      const { error } = await supabase
        .from('missions')
        .update({ status: 'en_livraison' })
        .eq('id', id)
        .in('status', ['attribuée','en_attente']);
      if (error) { setError(error.message); return; }
      await load();
    } catch {
      setError("Impossible de démarrer.");
    } finally {
      setActing(null);
    }
  };

  const completeMission = async (id: string) => {
    if (!supabase) return;
    setActing(id);
    try {
      const { error } = await supabase
        .from('missions')
        .update({ status: 'livrée', delivery_confirmed_at: new Date().toISOString() })
        .eq('id', id)
        .in('status', ['attribuée','en_livraison']);
      if (error) { setError(error.message); return; }
      await load();
    } catch {
      setError("Impossible de terminer.");
    } finally {
      setActing(null);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Mes missions</h1>
      {error && <p style={{ color: '#ff6b6b', marginBottom: 8 }}>{error}</p>}
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
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ color: colors.primary, fontWeight: 700 }}>{Number(m.prix || 0).toLocaleString('fr-FR')} XOF</div>
                <div style={{ color: colors.lightGray, fontSize: 12 }}>{new Date(m.created_at).toLocaleString('fr-FR')} • {m.status}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button disabled={acting === m.id} onClick={() => startMission(m.id)} style={{ padding: '6px 10px', border: `1px solid ${colors.gray}`, borderRadius: 8, background: 'transparent', color: colors.white }}>Démarrer</button>
                  <button disabled={acting === m.id} onClick={() => completeMission(m.id)} style={{ padding: '6px 10px', background: colors.primary, color: colors.black, borderRadius: 8, fontWeight: 700 }}>Terminer</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
