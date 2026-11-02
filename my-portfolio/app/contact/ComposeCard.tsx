"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { defaultTopic, type NoteTopic } from "app/lib/content/contacts";
import { CopyEmailButton } from "./CopyEmailButton";

const MESSAGE_LIMIT = 1000;
const COUNTER_FROM = 900;
const SENDING_MS = 1800;
const TYPE_MS = 22;

const row =
  "row-focus rise grid grid-cols-1 gap-x-3 gap-y-1.5 border-b border-line px-[18px] py-3 sm:grid-cols-[72px_minmax(0,1fr)]";
const rowLabel = "row-label text-[13px] text-faint";

const arrowProps = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function ComposeCard({ email, topics }: { email: string; topics: NoteTopic[] }) {
  const [topicId, setTopicId] = useState<NoteTopic["id"]>(defaultTopic);
  // null means the subject is fully shown; a number is how many letters of it are typed so far
  const [typed, setTyped] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const typer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const sendTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(
    () => () => {
      clearInterval(typer.current);
      clearTimeout(sendTimer.current);
    },
    [],
  );

  const topic = topics.find((t) => t.id === topicId) ?? topics[0];
  const body = message.trim();
  const mailHref =
    `mailto:${email}?subject=${encodeURIComponent(topic.subject)}` +
    (body ? `&body=${encodeURIComponent(body)}` : "");

  const pickTopic = (next: NoteTopic) => {
    setTopicId(next.id);
    clearInterval(typer.current);
    if (reduceMotion) {
      setTyped(null);
      return;
    }
    let count = 0;
    setTyped(0);
    typer.current = setInterval(() => {
      count += 1;
      if (count >= next.subject.length) {
        clearInterval(typer.current);
        setTyped(null);
        return;
      }
      setTyped(count);
    }, TYPE_MS);
  };

  const markSending = () => {
    setSending(true);
    clearTimeout(sendTimer.current);
    sendTimer.current = setTimeout(() => setSending(false), SENDING_MS);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-hi">
      <div className="row-focus rise grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 border-b border-line px-[18px] py-1.5 [animation-delay:80ms] sm:grid-cols-[72px_minmax(0,1fr)_auto]">
        <span className={`${rowLabel} max-sm:col-span-full max-sm:pt-2`}>to</span>
        <a href={`mailto:${email}`} className="flex min-h-11 min-w-0 items-center break-all text-base font-[550] tracking-[-0.01em] text-ink">
          {email}
        </a>
        <CopyEmailButton email={email} />
      </div>

      <div className={`${row} items-center [animation-delay:140ms]`}>
        <span id="note-about" className={rowLabel}>
          about
        </span>
        <div role="radiogroup" aria-labelledby="note-about" className="flex flex-wrap gap-1.5">
          {topics.map((t) => (
            <label key={t.id} className="cursor-pointer">
              <input
                type="radio"
                name="topic"
                value={t.id}
                checked={t.id === topicId}
                onChange={() => pickTopic(t)}
                className="peer sr-only"
              />
              <span className="chip-pop inline-flex min-h-10 items-center rounded-full border border-line px-3.5 text-[13px] text-mute transition-colors hover:text-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-bg peer-checked:hover:text-bg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                {t.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className={`${row} items-center [animation-delay:200ms]`}>
        <span className={rowLabel}>subject</span>
        <div>
          <p aria-hidden="true" className="min-h-[22px] text-base text-ink">
            {typed === null ? topic.subject : topic.subject.slice(0, typed)}
            {typed !== null && <span className="caret" />}
          </p>
          <span aria-live="polite" className="sr-only">
            {topic.subject}
          </span>
        </div>
      </div>

      <div className={`${row} items-start [animation-delay:260ms]`}>
        <label htmlFor="note-message" className={`${rowLabel} sm:pt-0.5`}>
          message
        </label>
        <div className="flex flex-col gap-1">
          <textarea
            id="note-message"
            rows={3}
            maxLength={MESSAGE_LIMIT}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="optional, anything you want me to know up front"
            className="w-full resize-none rounded bg-transparent text-[15px] leading-normal text-ink placeholder:text-faint"
          />
          {message.length > COUNTER_FROM && (
            <span className="self-end text-xs tabular-nums text-faint">
              {message.length} / {MESSAGE_LIMIT}
            </span>
          )}
        </div>
      </div>

      <div className="rise flex flex-wrap items-center justify-between gap-3 px-[18px] py-3 [animation-delay:320ms]">
        <span className="text-xs text-faint">
          {body ? "your message goes in the body." : "opens your mail app with this filled in."}
        </span>
        <a
          href={mailHref}
          onClick={markSending}
          className="send press inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-[18px] text-sm font-semibold text-bg"
        >
          {sending ? "opening your mail app…" : "write the email"}
          <span aria-hidden="true" className="fly">
            <svg {...arrowProps} className="fly-out">
              <path d="M7 17L17 7M8 7h9v9" />
            </svg>
            <svg {...arrowProps} className="fly-in">
              <path d="M7 17L17 7M8 7h9v9" />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}
