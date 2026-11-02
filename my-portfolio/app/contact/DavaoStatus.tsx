"use client";

import { useEffect, useState } from "react";

const REFRESH_MS = 30_000;
const WAKE_HOUR = 7;
const TIME_ZONE = "Asia/Manila";

const clock = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
});
const hour24 = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hour: "numeric",
  hourCycle: "h23",
});

export function DavaoStatus() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  const awake = now !== null && Number(hour24.format(now)) >= WAKE_HOUR;
  const time = now ? clock.format(now).toLowerCase() : "";

  // Rendered after mount: a server-rendered time would be frozen by caching
  return (
    <p className="flex min-h-5 items-center gap-2 text-[13px] tabular-nums text-mute">
      {now && (
        <>
          <span
            aria-hidden="true"
            className={`size-[7px] rounded-full ${awake ? "bg-accent-now" : "bg-faint"}`}
          />
          <span>
            it&apos;s {time} in davao, {awake ? "i'm probably around." : "i'm asleep, i'll see it in the morning."}
          </span>
        </>
      )}
    </p>
  );
}
