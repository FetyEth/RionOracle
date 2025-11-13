"use client";

import { useMemo, useState, Fragment } from "react";
import { Check, X, Info, Search } from "lucide-react";

/* --------- tokens (honor your CSS vars; no default green) --------- */
const TOKENS = {
  brand: "var(--brand, #D0FF00)", // your neon yellow
  hair: "var(--hair, rgba(255,255,255,0.10))",
  card: "var(--card, #0B0B0D)",
  textSubtle: "var(--subtle, rgba(255,255,255,0.40))",
  textMuted: "var(--muted, rgba(255,255,255,0.65))",
  ring: "color-mix(in oklab, var(--brand, #D0FF00) 40%, transparent)", // focus ring
  ringOffset: "#000",
  yesBg: "rgba(255,255,255,0.10)",
  noBg: "rgba(255,255,255,0.06)",
};

/* --------------------------- types + sample data --------------------------- */
type Row = {
  feature: string;
  rion: boolean;
  chainlink: boolean;
  others: boolean;
  group?: string;
  note?: "beta" | "soon";
};

const DATA: Row[] = [
  {
    feature: "BLS Signatures",
    rion: true,
    chainlink: false,
    others: false,
    group: "Crypto Primitives",
  },
  {
    feature: "BNB Native",
    rion: true,
    chainlink: false,
    others: true,
    group: "Deployment",
  },
  {
    feature: "HTTP-402 Receipts",
    rion: true,
    chainlink: false,
    others: false,
    group: "Agents / Pull",
    note: "beta",
  },
  {
    feature: "Merkle Proofs",
    rion: true,
    chainlink: false,
    others: true,
    group: "Proofs",
  },
  {
    feature: "Public Disputes",
    rion: true,
    chainlink: false,
    others: false,
    group: "Assurance",
  },
  {
    feature: "User Insurance",
    rion: true,
    chainlink: false,
    others: false,
    group: "Assurance",
  },
];

const DESCRIPTIONS: Record<string, string> = {
  "BLS Signatures":
    "Aggregate BLS signatures for compact multi-signer verification.",
  "BNB Native": "First-class deployment and low-latency final rounds on BNB.",
  "HTTP-402 Receipts":
    "Pay-per-request signed reports with cryptographic receipts.",
  "Merkle Proofs": "Inclusion proofs verifiable on-chain.",
  "Public Disputes": "Open, evidence-backed challenges.",
  "User Insurance": "Backstopped coverage with slashing & payouts.",
};

type SortKey = "feature" | "rion" | "chainlink" | "others";

/* -------------------------------- component -------------------------------- */
export function ComparisonSection({
  data = DATA,
  stickyOffset = 0, // set to your navbar height if you want the header sticky under nav
}: {
  data?: Row[];
  stickyOffset?: number;
}) {
  const [query, setQuery] = useState("");
  const [diffOnly, setDiffOnly] = useState(true);
  const [compact, setCompact] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("feature");
  const [desc, setDesc] = useState(false);

  const filtered = useMemo(() => {
    let rows = data;

    // text search over feature, group, description (case-insensitive)
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((r) => {
        const hay =
          r.feature.toLowerCase() +
          " " +
          (r.group?.toLowerCase() ?? "") +
          " " +
          (DESCRIPTIONS[r.feature]?.toLowerCase() ?? "");
        return hay.includes(q);
      });
    }

    if (diffOnly) {
      rows = rows.filter(
        (r) => !(r.rion === r.chainlink && r.chainlink === r.others)
      );
    }

    // sort (booleans: true > false)
    rows = [...rows].sort((a, b) => {
      const dir = desc ? -1 : 1;
      if (sortBy === "feature") return a.feature.localeCompare(b.feature) * dir;
      const av = Number(a[sortBy]);
      const bv = Number(b[sortBy]);
      if (av === bv) return a.feature.localeCompare(b.feature) * dir;
      return (av - bv) * dir;
    });

    return rows;
  }, [data, query, diffOnly, sortBy, desc]);

  const pad = compact ? "p-3" : "p-4";
  const text = compact ? "text-[13px]" : "text-sm";

  const groups = groupBy(filtered, (r) => r.group || "General");
  const hasResults = filtered.length > 0;

  /* ============================ EMPTY STATE (FIX) ============================ */
  if (!hasResults) {
    return (
      <section className="relative py-16 md:py-20 bg-black">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-10">
          {/* header */}
          <div className="relative z-10 px-5 md:px-10">
            <div className="mb-3 text-[13px] font-medium uppercase tracking-[0.18em] text-white/40">
              RION Serverless Oracle
            </div>

            <h2 className="text-left font-extrabold leading-[1.06] tracking-tight text-white">
              <span className="block text-[clamp(2.2rem,5vw,3.4rem)]">
                Feature
                <span className="bg-[linear-gradient(90deg,#D0FF00_0%,#ccff3d_40%,#f1ffe6_85%)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                  comparison
                </span>{" "}
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-[15px] md:text-[16px] leading-relaxed text-white/80">
              Clear, apples-to-apples differences. No noise.
            </p>

            <div
              className="mt-10 h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)",
              }}
            />
          </div>

          {/* controls (keep visible so user can recover) */}
          <div className="mt-6 mb-5 flex w-full max-w-5xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <label className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/45" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search features, groups, descriptions…"
                  className="w-full rounded-full border bg-transparent pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    borderColor: TOKENS.hair,
                    boxShadow: "none",
                    // @ts-ignore
                    "--tw-ring-color": TOKENS.ring,
                    "--tw-ring-offset-color": TOKENS.ringOffset,
                  }}
                  aria-label="Search features"
                />
              </label>

              <Toggle
                pressed={diffOnly}
                onToggle={() => setDiffOnly((s) => !s)}
                label={diffOnly ? "Only differences" : "Show all"}
              />
              <Toggle
                pressed={compact}
                onToggle={() => setCompact((s) => !s)}
                label={compact ? "Compact" : "Comfort"}
              />
            </div>

            <Picker
              label="Sort"
              value={`${sortBy}:${desc ? "desc" : "asc"}`}
              onChange={(v) => {
                const [k, d] = v.split(":");
                setSortBy(k as SortKey);
                setDesc(d === "desc");
              }}
              options={[
                { label: "Feature (A→Z)", value: "feature:asc" },
                { label: "Feature (Z→A)", value: "feature:desc" },
                { label: "RION first", value: "rion:desc" },
                { label: "Chainlink first", value: "chainlink:desc" },
                { label: "Others first", value: "others:desc" },
              ]}
            />
          </div>

          {/* empty message */}
          <div
            className="rounded-xl border p-6 text-sm text-white"
            style={{
              borderColor: TOKENS.hair,
              background: TOKENS.card,
              color: TOKENS.textMuted,
            }}
          >
            <span className="text-[#e3e3e3]">
              No matches. Try a different term, or{" "}
            </span>
            <button
              className="underline hover:no-underline text-white"
              onClick={() => {
                setQuery("");
                // keep other toggles as-is
              }}
            >
              clear search
            </button>
            .
          </div>

          <p
            className="mx-auto mt-6 max-w-5xl text-xs"
            style={{ color: TOKENS.textSubtle }}
          >
            Notes: “Others” includes comparable oracle networks and
            rollup-native feeds. Availability and parity may vary by chain.
          </p>
        </div>
      </section>
    );
  }
  /* ========================== END EMPTY STATE (FIX) ========================== */

  return (
    <section className="relative py-16 md:py-20 bg-black">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* header styled like your WhyRion section (left, hairline) */}
        <div className="relative z-10">
          <div className="mb-3 text-[13px] font-medium uppercase tracking-[0.18em] text-white/40">
            RION Serverless Oracle
          </div>

          <h2 className="text-left font-extrabold leading-[1.06] tracking-tight text-white">
            <span className="block text-[clamp(2.2rem,5vw,3.4rem)]">
              Feature
              <span className="bg-[linear-gradient(90deg,#D0FF00_0%,#ccff3d_40%,#f1ffe6_85%)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                comparison
              </span>{" "}
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-[15px] md:text-[16px] leading-relaxed text-white/80">
            Clear, apples-to-apples differences. No noise.
          </p>

          <div
            className="mt-10 h-px w-full"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)",
            }}
          />
        </div>

        {/* controls row */}
        <div className="mt-6 mb-5 flex w-full max-w-5xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <label className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/45" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search features, groups, descriptions…"
                className="w-full rounded-full border bg-transparent pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  borderColor: TOKENS.hair,
                  boxShadow: "none",
                  // @ts-ignore
                  "--tw-ring-color": TOKENS.ring,
                  "--tw-ring-offset-color": TOKENS.ringOffset,
                }}
                aria-label="Search features"
              />
            </label>

            <Toggle
              pressed={diffOnly}
              onToggle={() => setDiffOnly((s) => !s)}
              label={diffOnly ? "Only differences" : "Show all"}
            />
            <Toggle
              pressed={compact}
              onToggle={() => setCompact((s) => !s)}
              label={compact ? "Compact" : "Comfort"}
            />
          </div>

          <Picker
            label="Sort"
            value={`${sortBy}:${desc ? "desc" : "asc"}`}
            onChange={(v) => {
              const [k, d] = v.split(":");
              setSortBy(k as SortKey);
              setDesc(d === "desc");
            }}
            options={[
              { label: "Feature (A→Z)", value: "feature:asc" },
              { label: "Feature (Z→A)", value: "feature:desc" },
              { label: "RION first", value: "rion:desc" },
              { label: "Chainlink first", value: "chainlink:desc" },
              { label: "Others first", value: "others:desc" },
            ]}
          />
        </div>

        {/* table */}
        <div
          className="overflow-hidden rounded-xl border"
          style={{ borderColor: TOKENS.hair, background: TOKENS.card }}
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <colgroup>
                <col className="w-[40%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
              </colgroup>

              <thead
                className="sticky z-10"
                style={{ top: `${stickyOffset}px`, background: TOKENS.card }}
              >
                <tr className="border-b" style={{ borderColor: TOKENS.hair }}>
                  <th
                    className={`${pad} text-left text-sm font-semibold text-white`}
                  >
                    Feature
                  </th>
                  <th
                    className={`${pad} text-center text-sm font-semibold text-white`}
                  >
                    RION
                  </th>
                  <th
                    className={`${pad} text-center text-sm font-semibold text-white/70`}
                  >
                    Chainlink
                  </th>
                  <th
                    className={`${pad} text-center text-sm font-semibold text-white/70`}
                  >
                    Others
                  </th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(groups).map(([group, rows], gi) => (
                  <Fragment key={group}>
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-2 text-[11px] uppercase tracking-wide text-white/45 bg-black"
                      >
                        {group}
                      </td>
                    </tr>

                    {rows.map((item, idx) => {
                      const zebra = (gi + idx) % 2 ? "bg-white/[0.02]" : "";
                      const d = DESCRIPTIONS[item.feature];
                      return (
                        <tr key={item.feature} className={zebra}>
                          <th
                            scope="row"
                            className={`sticky left-0 bg-inherit ${pad} ${text} font-medium`}
                          >
                            <span className="inline-flex items-center gap-2 text-white">
                              {item.feature}
                              {item.note ? <Note note={item.note} /> : null}
                              {d ? (
                                <Info
                                  className="h-4 w-4 text-white/40"
                                  aria-hidden
                                />
                              ) : null}
                            </span>
                          </th>
                          <td className={`${pad} text-center`}>
                            <YesNo yes={item.rion} brand />
                          </td>
                          <td className={`${pad} text-center`}>
                            <YesNo yes={item.chainlink} />
                          </td>
                          <td className={`${pad} text-center`}>
                            <YesNo yes={item.others} />
                          </td>
                        </tr>
                      );
                    })}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p
          className="mx-auto mt-6 max-w-5xl text-xs"
          style={{ color: TOKENS.textSubtle }}
        >
          Notes: “Others” includes comparable oracle networks and rollup-native
          feeds. Availability and parity may vary by chain.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------- sub bits ------------------------------- */

function groupBy<T, K extends string>(
  arr: T[],
  key: (x: T) => K
): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

function Toggle({
  pressed,
  onToggle,
  label,
}: {
  pressed: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={pressed}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition-colors
        ${
          pressed
            ? "bg-white/5 text-white border-white/20"
            : "text-white/80 hover:text-white border-white/15"
        }`}
    >
      <Info className="h-3.5 w-3.5 text-white/55" />
      {label}
    </button>
  );
}

function Picker({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label
      className="inline-flex items-center gap-2 text-xs"
      style={{ color: TOKENS.textSubtle }}
    >
      <span>{label}</span>
      <select
        className="rounded-full border bg-transparent px-3 py-2 text-xs text-white outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          borderColor: TOKENS.hair,
          // @ts-ignore
          "--tw-ring-color": TOKENS.ring,
          "--tw-ring-offset-color": TOKENS.ringOffset,
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0b0b0d]">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Note({ note }: { note: "beta" | "soon" }) {
  const s =
    note === "beta"
      ? { text: "Beta", bg: "rgba(208,255,0,0.10)", fg: TOKENS.brand }
      : {
          text: "Soon",
          bg: "rgba(255,255,255,0.10)",
          fg: "rgba(255,255,255,0.90)",
        };
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.text}
    </span>
  );
}

function YesNo({ yes, brand = false }: { yes: boolean; brand?: boolean }) {
  if (yes) {
    return (
      <span
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
        style={{
          background: brand ? "rgba(208,255,0,0.10)" : TOKENS.yesBg,
          color: brand ? TOKENS.brand : "rgba(255,255,255,0.88)",
        }}
        title="Available"
      >
        <Check className="h-4 w-4" /> Yes
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
      style={{ background: TOKENS.noBg, color: "rgba(255,255,255,0.55)" }}
      title="Not available"
    >
      <X className="h-4 w-4" /> No
    </span>
  );
}
