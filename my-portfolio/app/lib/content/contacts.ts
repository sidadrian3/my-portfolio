import { socialLinks } from "app/config";

export type ContactRow = { label: string; handle: string; href: string; copy?: boolean };

export const contacts: ContactRow[] = [
  { label: "Email", handle: socialLinks.email, href: `mailto:${socialLinks.email}`, copy: true },
  { label: "LinkedIn", handle: "sid-adrian-digamon", href: socialLinks.linkedin },
  { label: "GitHub", handle: "sidadrian3", href: socialLinks.github },
  { label: "Instagram", handle: "@sidadrian", href: socialLinks.instagram },
  { label: "Facebook", handle: "adrian.digamon", href: socialLinks.facebook },
];
