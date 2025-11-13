import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const roundId = params.id

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        backgroundImage: "radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" />
          <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div style={{ fontSize: "48px", fontWeight: "bold", color: "#fff" }}>RION Proof Verified</div>
      </div>

      <div style={{ fontSize: "24px", color: "#9ca3af", marginBottom: "16px" }}>
        BNB/USD Round {roundId.slice(0, 16)}...
      </div>

      <div style={{ display: "flex", gap: "32px", fontSize: "18px", color: "#d1d5db" }}>
        <div>✓ Signature valid</div>
        <div>✓ Freshness 1.7s</div>
        <div>✓ Receipts included</div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
