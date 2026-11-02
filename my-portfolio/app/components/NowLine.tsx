import type { NowPiece } from "../config";

const HIGHLIGHT_DELAYS_MS = [700, 1000];

function monthYear(updated: string) {
  const [year, month] = updated.split("-").map(Number);
  const name = new Date(Date.UTC(year, month - 1, 1)).toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  return `${name.toLowerCase()} ${year}`;
}

export function NowLine({ pieces, updated }: { pieces: NowPiece[]; updated: string }) {
  let wordIndex = 0;
  let highlightIndex = 0;

  const renderWords = (text: string) =>
    text.split(/(\s+)/).map((part, i) => {
      if (part === "") return null;
      if (/^\s+$/.test(part)) return part;
      const index = wordIndex++;
      // Word joiner keeps trailing punctuation on the same line as the word before it.
      const glue = /^[,.;:!?]+$/.test(part) ? "\u2060" : "";
      return (
        <span key={i}>
          {glue}
          <span className="now-word">
            <span style={{ "--i": index } as React.CSSProperties}>{part}</span>
          </span>
        </span>
      );
    });

  return (
    <>
      <p className="text-[15px] text-mute">
        {pieces.map((piece, i) => {
          if (typeof piece === "string") return <span key={i}>{renderWords(piece)}</span>;
          const delay = HIGHLIGHT_DELAYS_MS[Math.min(highlightIndex++, HIGHLIGHT_DELAYS_MS.length - 1)];
          return (
            <span key={i} className="now-hl" style={{ "--d": `${delay}ms` } as React.CSSProperties}>
              {renderWords(piece.highlight)}
            </span>
          );
        })}
      </p>
      <p className="now-stamp mt-2 flex items-center gap-2 text-[13px] text-faint">
        <span aria-hidden className="size-1.5 rounded-full bg-accent-now" />
        updated {monthYear(updated)}
      </p>
    </>
  );
}
