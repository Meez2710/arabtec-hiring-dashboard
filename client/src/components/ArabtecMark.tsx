export function ArabtecMark({ size = 40, showWordmark = false }: { size?: number; showWordmark?: boolean }) {
  return (
    <span className="inline-flex items-center" style={{ gap: size * 0.35 }}>
      <img src="/arabtec-logo.svg" alt="Arabtec" style={{ height: size, width: "auto" }} />
      {showWordmark && (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: size * 0.82,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: "var(--brand)",
          }}
        >
          Arabtec
        </span>
      )}
    </span>
  );
}
