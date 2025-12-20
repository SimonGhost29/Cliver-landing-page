"use client";

import React from "react";
import { supabase } from "@/lib/supabaseClient";

const colors = { primary: "#FF7F30", black: "#000000", white: "#FFFFFF", gray: "#111111", lightGray: "#F5F5F5" };
export default function ClientMessagesPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [missions, setMissions] = React.useState<any[]>([]);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [selected, setSelected] = React.useState<string | "all">("all");
  const [text, setText] = React.useState("");

  const load = React.useCallback(async () => {
    if (!supabase) { setError("Configuration Supabase manquante."); setLoading(false); return; }
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id;
      if (!uid) { setError("Session invalide."); return; }

      const { data: myMissions, error: mErr } = await supabase
        .from('missions')
        .select('id, title, livreur_id')
        .eq('client_id', uid)
        .order('created_at', { ascending: false })
        .limit(100);
      if (mErr) { setError(mErr.message); return; }
      setMissions(myMissions || []);
      const ids = (myMissions || []).map((m: any) => m.id);
      if (ids.length === 0) { setMessages([]); return; }

      const { data: msgs, error: msgErr } = await supabase
        .from('messages')
        .select('id, mission_id, sender_id, receiver_id, content, created_at')
        .in('mission_id', ids)
        .order('created_at', { ascending: false })
        .limit(100);
      if (msgErr) { setError(msgErr.message); return; }
      setMessages(msgs || []);
    } catch (e) {
      setError("Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const send = async () => {
    if (!supabase) return;
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData?.user?.id;
    if (!uid) { setError("Session invalide."); return; }
    const mid = selected === "all" ? missions[0]?.id : selected;
    if (!mid || !text.trim()) return;
    const mission = missions.find((m) => m.id === mid);
    const receiver = mission?.livreur_id || null;
    const { error } = await supabase.from('messages').insert({ mission_id: mid, sender_id: uid, receiver_id: receiver, content: text.trim() });
    if (!error) {
      setText("");
      await load();
    } else {
      setError(error.message);
    }
  };

  const filtered = selected === "all" ? messages : messages.filter((m) => m.mission_id === selected);

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Messages</h1>
      {error && <p style={{ color: '#ff6b6b', marginBottom: 8 }}>{error}</p>}
      {loading ? (
        <p style={{ color: colors.lightGray }}>Chargement…</p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
            <label>Mission:</label>
            <select value={selected} onChange={(e) => setSelected(e.target.value)} style={{ padding: '6px 10px', background: '#0f0f0f', color: colors.white, borderRadius: 8, border: `1px solid ${colors.gray}` }}>
              <option value="all">Toutes</option>
              {missions.map((m) => (
                <option key={m.id} value={m.id}>{m.title || m.id}</option>
              ))}
            </select>
          </div>
          {filtered.length === 0 ? (
            <p style={{ color: colors.lightGray }}>Aucun message.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((msg) => (
                <li key={msg.id} style={{ background: '#0f0f0f', borderRadius: 8, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ color: colors.lightGray, fontSize: 12 }}>{new Date(msg.created_at).toLocaleString('fr-FR')}</div>
                    <div style={{ fontWeight: 600 }}>{missions.find(m => m.id === msg.mission_id)?.title || msg.mission_id}</div>
                  </div>
                  <div style={{ marginTop: 6 }}>{msg.content}</div>
                </li>
              ))}
            </ul>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Votre message" style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${colors.gray}`, background: '#0f0f0f', color: colors.white }} />
            <button onClick={send} style={{ padding: '10px 14px', background: colors.primary, color: colors.black, borderRadius: 8, fontWeight: 700 }}>Envoyer</button>
          </div>
        </>
      )}
    </div>
  );
}
