const colors = { primary: "#FF7F30", black: "#000000", white: "#FFFFFF", gray: "#111111", lightGray: "#F5F5F5" };
export default function ClientHistoryPage() {
  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Historique</h1>
      <p style={{ color: colors.lightGray }}>Vos missions passées s'afficheront ici.</p>
    </div>
  );
}
