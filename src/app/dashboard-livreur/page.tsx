const colors = {
  primary: "#FF7F30",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#111111",
  lightGray: "#F5F5F5",
};

export default function DashboardLivreurPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: colors.black,
        color: colors.white,
        padding: "6rem 1.5rem 3rem",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 2.6rem)",
            marginBottom: "0.75rem",
          }}
        >
          Espace livreur Cliver
        </h1>
        <p style={{ color: colors.lightGray, marginBottom: "1.5rem" }}>
          Vous êtes connecté en tant que livreur. Cette page pourra accueillir
          plus tard votre véritable tableau de bord (missions disponibles,
          gains, etc.).
        </p>
      </div>
    </main>
  );
}
