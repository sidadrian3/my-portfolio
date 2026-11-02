import type { Metadata } from "next";
import { socialLinks } from "app/config";
import { contacts, noteTopics } from "app/lib/content/contacts";
import { PageHeader } from "app/components/PageHeader";
import { ComposeCard } from "./ComposeCard";
import { DavaoStatus } from "./DavaoStatus";

export const metadata: Metadata = {
  title: "Contact",
  description: "write me a note. i actually reply.",
};

const socials = contacts.filter((c) => !c.copy);

export default function Contact() {
  return (
    <div className="flex w-full flex-col">
      <div className="rise">
        <PageHeader title="contact">best way to reach me is email. i actually reply.</PageHeader>
        <DavaoStatus />
      </div>
      <div className="mt-6">
        <ComposeCard email={socialLinks.email} topics={noteTopics} />
      </div>
      <div className="rise mt-7 [animation-delay:400ms]">
        <h2 className="mb-2.5 text-sm font-semibold text-ink">or find me on</h2>
        <ul className="flex flex-wrap gap-1.5">
          {socials.map(({ label, handle, href }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label}: ${handle}`}
                className="lift inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-3.5 text-[13px] transition-colors hover:bg-hi"
              >
                <span className="text-faint">{label}</span>
                <span className="text-ink">{handle}</span>
                <span aria-hidden="true" className="lift-arrow text-mute">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
