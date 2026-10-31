import type { IconType } from "react-icons";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import { socialLinks } from "app/config";

const links: { label: string; href: string; icon: IconType; external: boolean }[] = [
  { label: "GitHub", href: socialLinks.github, icon: FaGithub, external: true },
  { label: "LinkedIn", href: socialLinks.linkedin, icon: FaLinkedinIn, external: true },
  { label: "Instagram", href: socialLinks.instagram, icon: FaInstagram, external: true },
  { label: "Facebook", href: socialLinks.facebook, icon: FaFacebook, external: true },
  { label: "Email", href: `mailto:${socialLinks.email}`, icon: FiMail, external: false },
];

export default function Footer() {
  return (
    <footer className="mt-8 flex items-center justify-between gap-4 py-4">
      <p className="text-sm text-mute">Sid Adrian B. Digamon</p>
      <ul className="-mr-2.5 flex items-center">
        {links.map(({ label, href, icon: Icon, external }) => (
          <li key={label}>
            <a
              href={href}
              aria-label={label}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
              className="flex h-10 w-10 items-center justify-center text-mute transition-colors hover:text-ink"
            >
              <Icon size={18} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
