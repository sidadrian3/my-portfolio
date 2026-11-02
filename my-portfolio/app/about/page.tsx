import type { Metadata } from "next";
import { PhotoFan } from "app/components/PhotoFan";
import { Section } from "app/components/Section";
import { education, experience, type TimelineEntry } from "app/lib/content/experience";
import { hobbies } from "app/lib/content/hobbies";
import { photos } from "app/lib/content/photos";
import { PageHeader } from "app/components/PageHeader";

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
    <ol>
      {entries.map((entry, index) => {
        const first = index === 0;
        const last = index === entries.length - 1;
        return (
          <li
            key={entry.org}
            className="grid grid-cols-[24px_minmax(0,1fr)] gap-x-4 sm:grid-cols-[96px_24px_minmax(0,1fr)]"
          >
            <span className="hidden pt-[3px] text-right text-[13px] tabular-nums text-faint sm:block">
              {yearsLabel(entry)}
            </span>
            <span aria-hidden="true" className="relative flex justify-center">
              <span
                className={`absolute w-px bg-faint/40 ${first ? "top-[11px]" : "top-0"} ${
                  last ? "bottom-[calc(100%-11px)]" : "bottom-0"
                }`}
              />
              <span
                className={`relative mt-[7px] size-[9px] rounded-full border-[1.5px] bg-bg ${
                  entry.current ? "border-accent-now" : "border-faint"
                }`}
              />
            </span>
            <div className="pb-7">
              <p className="text-[15px] font-medium text-ink">{entry.org}</p>
              <p className="text-[15px] text-mute">
                {entry.role}
                <span className="text-faint sm:hidden"> · {yearsLabel(entry)}</span>
              </p>
              {entry.line && <p className="mt-1.5 text-[15px] text-mute">{entry.line}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function About() {
  return (
    <div className="flex w-full flex-col">
      <PageHeader title="about">the longer version.</PageHeader>
      <Section label="Experience" stacked>
        <TimelineRail entries={experience} />
      </Section>
      <Section label="Education" stacked>
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
      <Section label="Snapshots" stacked className="text-center">
        <PhotoFan photos={photos} />
      </Section>
    </div>
  );
}
