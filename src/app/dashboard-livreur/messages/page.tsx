const colors = { primary: "#FF7F30", black: "#000000", white: "#FFFFFF", gray: "#111111", lightGray: "#F5F5F5" };
export default function DriverMessagesPage() {
  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Messages</h1>
      <p style={{ color: colors.lightGray }}>Conversations avec vos clients.</p>
    </div>
  );
}
