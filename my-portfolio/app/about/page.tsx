import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PhotoFan } from "app/components/PhotoFan";
import { Section } from "app/components/Section";
import { education, experience, type TimelineEntry } from "app/lib/content/experience";
import { hobbies } from "app/lib/content/hobbies";
import { photos } from "app/lib/content/photos";
import { PageHeader } from "app/components/PageHeader";
import { RevealOnce } from "app/components/RevealOnce";

export const metadata: Metadata = {
  title: "About",
  description: "Experience, education and what i do off the clock.",
};

function yearsLabel({ start, end, current }: TimelineEntry) {
  if (end) return `${start}–${end}`;
  return current ? `${start}–now` : start;
}

function TimelineRail({ entries }: { entries: TimelineEntry[] }) {
  return (
    <RevealOnce>
      <ol>
        {entries.map((entry, index) => {
          const first = index === 0;
          const last = index === entries.length - 1;
          return (
            <li
              key={entry.org}
              style={{ "--i": index } as CSSProperties}
              className="group grid grid-cols-[24px_minmax(0,1fr)] gap-x-4 sm:grid-cols-[96px_24px_minmax(0,1fr)]"
            >
              <span className="tl-text hidden pt-[3px] text-right text-[13px] tabular-nums text-faint transition-colors duration-200 group-hover:text-ink sm:block">
                {yearsLabel(entry)}
              </span>
              <span aria-hidden="true" className="relative flex justify-center">
                <span
                  className={`tl-line absolute w-px origin-top bg-faint/40 ${first ? "top-[11px]" : "top-0"} ${
                    last ? "bottom-[calc(100%-11px)]" : "bottom-0"
                  }`}
                />
                <span
                  className={`tl-dot relative mt-[7px] size-[9px] rounded-full border-[1.5px] bg-bg transition-[transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.3] group-hover:border-ink group-hover:bg-ink motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
                    entry.current ? "border-accent-now" : "border-faint"
                  }`}
                />
              </span>
              <div className="tl-text pb-7 transition-transform duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                <p className="text-[15px] font-medium text-ink">{entry.org}</p>
                <p className="text-[15px] text-mute transition-colors duration-200 group-hover:text-ink/85">
                  {entry.role}
                  <span className="text-faint sm:hidden"> · {yearsLabel(entry)}</span>
                </p>
                {entry.line && (
                  <p className="mt-1.5 text-[15px] text-mute transition-colors duration-200 group-hover:text-ink/85">
                    {entry.line}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </RevealOnce>
  );
}

export default function About() {
  return (
    <div className="flex w-full flex-col">
      <PageHeader title="about">the longer version.</PageHeader>
      <Section label="Snapshots" stacked className="text-center">
        <PhotoFan photos={photos} />
      </Section>
      <Section label="Experience" stacked className="[animation:none]">
        <TimelineRail entries={experience} />
      </Section>
      <Section label="Education" stacked className="[animation:none]">
        <TimelineRail entries={education} />
      </Section>
      <Section label="Off the clock" stacked>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {hobbies.map((hobby) => (
            <div key={hobby.title}>
              <h3 className="text-[15px] font-medium text-ink">{hobby.title}</h3>
              <p className="mt-1 text-[14px] leading-[1.45] text-mute">{hobby.line}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
