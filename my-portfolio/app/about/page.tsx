import type { Metadata } from "next";
import { PhotoStack } from "app/components/PhotoStack";
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

function TimelineList({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ul className="ruled">
      {entries.map((entry) => (
        <li key={entry.org} className="py-3.5">
          <div className="flex items-baseline gap-3">
            <span
              aria-hidden="true"
              className={`relative -top-px size-2 shrink-0 rounded-full ${
                entry.current ? "bg-accent-now" : "bg-faint"
              }`}
            />
            <span className="min-w-0 flex-1 text-[15px]">
              <span className="font-medium text-ink">{entry.org}</span>
              <span className="text-faint"> · </span>
              <span className="text-mute">{entry.role}</span>
            </span>
            <span className="text-[13px] tabular-nums text-faint">{yearsLabel(entry)}</span>
          </div>
          {entry.line && <p className="mt-0.5 pl-5 text-[15px] text-mute">{entry.line}</p>}
        </li>
      ))}
    </ul>
  );
}

export default function About() {
  return (
    <div className="flex w-full flex-col">
      <PageHeader title="about">the longer version.</PageHeader>
      <PhotoStack photos={photos} />
      <Section label="Experience">
        <TimelineList entries={experience} />
      </Section>
      <Section label="Education">
        <TimelineList entries={education} />
      </Section>
      <Section label="Off the clock">
        <div className="grid gap-6 sm:grid-cols-2">
          {hobbies.map((hobby) => (
            <div key={hobby.title}>
              <h3 className="text-[15px] font-medium text-ink">{hobby.title}</h3>
              <p className="mt-0.5 text-[15px] text-mute">{hobby.line}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
