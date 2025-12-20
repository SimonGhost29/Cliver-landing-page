"use client";

import React from "react";
import { supabase } from "@/lib/supabaseClient";

const colors = { primary: "#FF7F30", black: "#000000", white: "#FFFFFF", gray: "#111111", lightGray: "#F5F5F5" };
export default function ClientPaymentsPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [rows, setRows] = React.useState<any[]>([]);

  React.useEffect(() => {
    const load = async () => {
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
          .from('transactions')
          .select('id, type, amount, status, payment_method, description, created_at')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
          .limit(50);
        if (error) { setError(error.message); return; }
        setRows(data || []);
      } catch (e) {
        setError("Erreur lors du chargement.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Paiements</h1>
      {error && <p style={{ color: '#ff6b6b', marginBottom: 8 }}>{error}</p>}
      {loading ? (
        <p style={{ color: colors.lightGray }}>Chargement…</p>
      ) : rows.length === 0 ? (
        <p style={{ color: colors.lightGray }}>Aucun paiement.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: colors.lightGray }}>
              <th style={{ padding: '8px 6px', borderBottom: `1px solid ${colors.gray}` }}>Date</th>
              <th style={{ padding: '8px 6px', borderBottom: `1px solid ${colors.gray}` }}>Type</th>
              <th style={{ padding: '8px 6px', borderBottom: `1px solid ${colors.gray}` }}>Montant</th>
              <th style={{ padding: '8px 6px', borderBottom: `1px solid ${colors.gray}` }}>Statut</th>
              <th style={{ padding: '8px 6px', borderBottom: `1px solid ${colors.gray}` }}>Méthode</th>
              <th style={{ padding: '8px 6px', borderBottom: `1px solid ${colors.gray}` }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <td style={{ padding: '8px 6px', borderBottom: `1px solid ${colors.gray}` }}>{new Date(t.created_at).toLocaleString('fr-FR')}</td>
                <td style={{ padding: '8px 6px', borderBottom: `1px solid ${colors.gray}` }}>{t.type}</td>
                <td style={{ padding: '8px 6px', borderBottom: `1px solid ${colors.gray}`, color: colors.primary, fontWeight: 700 }}>{Number(t.amount || 0).toLocaleString('fr-FR')} XOF</td>
                <td style={{ padding: '8px 6px', borderBottom: `1px solid ${colors.gray}` }}>{t.status}</td>
                <td style={{ padding: '8px 6px', borderBottom: `1px solid ${colors.gray}` }}>{t.payment_method || '—'}</td>
                <td style={{ padding: '8px 6px', borderBottom: `1px solid ${colors.gray}`, color: colors.lightGray }}>{t.description || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
