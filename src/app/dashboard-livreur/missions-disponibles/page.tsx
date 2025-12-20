"use client";

import React from "react";
import { supabase } from "@/lib/supabaseClient";

const colors = { primary: "#FF7F30", black: "#000000", white: "#FFFFFF", gray: "#111111", lightGray: "#F5F5F5" };
export default function AvailableMissionsPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [rows, setRows] = React.useState<any[]>([]);
  const [accepting, setAccepting] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    if (!supabase) {
      setError("Configuration Supabase manquante.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('missions')
        .select('id, title, start_address, end_address, prix, created_at')
        .eq('status', 'en_attente')
        .is('livreur_id', null)
        .order('created_at', { ascending: false })
        .limit(50);
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
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const accept = async (id: string) => {
    if (!supabase) return;
    try {
      setAccepting(id);
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id;
      if (!uid) {
        setError("Session invalide.");
        return;
      }
      const { error } = await supabase
        .from('missions')
        .update({ livreur_id: uid, status: 'attribuée' })
        .eq('id', id)
        .eq('status', 'en_attente')
        .is('livreur_id', null);
      if (error) {
        setError(error.message);
        return;
      }
      await load();
    } catch (e) {
      setError("Impossible d'accepter la mission.");
    } finally {
      setAccepting(null);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Missions disponibles</h1>
      {error && <p style={{ color: '#ff6b6b', marginBottom: 8 }}>{error}</p>}
      {loading ? (
        <p style={{ color: colors.lightGray }}>Chargement…</p>
      ) : rows.length === 0 ? (
        <p style={{ color: colors.lightGray }}>Aucune mission à proximité.</p>
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
                <div style={{ color: colors.lightGray, fontSize: 12 }}>{new Date(m.created_at).toLocaleString('fr-FR')}</div>
                <button disabled={accepting === m.id} onClick={() => accept(m.id)} style={{ marginTop: 8, padding: '6px 10px', background: colors.primary, color: colors.black, borderRadius: 8, fontWeight: 700 }}>
                  {accepting === m.id ? 'Affectation…' : 'Accepter'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
