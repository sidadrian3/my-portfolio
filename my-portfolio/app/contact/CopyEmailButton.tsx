"use client";

import { useEffect, useRef, useState } from "react";

const RESET_MS = 1500;
const label =
  "col-start-1 row-start-1 transition-[opacity,filter] duration-150 ease-out motion-reduce:transition-none";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      window.location.href = `mailto:${email}`;
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), RESET_MS);
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="press -mr-2 inline-grid min-h-10 min-w-10 items-center justify-items-end px-2 text-[15px] text-mute hover:text-ink"
      >
        <span
          aria-hidden={copied}
          className={`${label} ${copied ? "opacity-0 blur-[2px]" : "opacity-100 blur-0"}`}
        >
          copy
        </span>
        <span
          aria-hidden={!copied}
          className={`${label} ${copied ? "opacity-100 blur-0" : "opacity-0 blur-[2px]"}`}
        >
          copied
        </span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "email copied" : ""}
      </span>
    </>
  );
}
