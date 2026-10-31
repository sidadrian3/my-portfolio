import type { Metadata } from "next";
import { contacts } from "app/lib/content/contacts";
import { CopyEmailButton } from "./CopyEmailButton";
import { PageHeader } from "app/components/PageHeader";

export const metadata: Metadata = {
  title: "Contact",
  description: "best way to reach me is email.",
};

const linkClass = "text-[15px] text-ink";

export default function Contact() {
  return (
    <div className="flex w-full flex-col">
      <PageHeader title="contact">best way to reach me is email. i actually reply.</PageHeader>
      <ul className="ruled">
        {contacts.map(({ label, handle, href, copy }) => (
          <li key={label} className="grid grid-cols-[96px_1fr_auto] items-center">
            <span className="py-3 text-[15px] text-faint">{label}</span>
            {copy ? (
              <>
                <a href={href} aria-label={`${label}: ${handle}`} className={`${linkClass} min-w-0 break-all py-3`}>
                  {handle}
                </a>
                <CopyEmailButton email={handle} />
              </>
            ) : (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label}: ${handle}`}
                className={`${linkClass} col-span-2 flex items-center justify-between py-3`}
              >
                {handle}
                <span aria-hidden="true" className="ruled-arrow text-mute">
                  ↗
                </span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
