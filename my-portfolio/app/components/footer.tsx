"use client";

import React from "react";
import {
  FaXTwitter,
  FaGithub,
  FaInstagram,
  FaRss,
  FaLinkedinIn,
} from "react-icons/fa6";
import { TbMailFilled } from "react-icons/tb";
import { metaData, socialLinks } from "app/config";

const YEAR = new Date().getFullYear();

function SocialLink({ href, icon: Icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-transform transform hover:scale-105"
    >
      <Icon />
    </a>
  );
}

function SocialLinks() {
  return (
    <div className="  flex text-xl gap-3.5 transition-opacity duration-300 hover:opacity-90">
      <SocialLink href={socialLinks.github} icon={FaGithub} />
      <SocialLink href={socialLinks.instagram} icon={FaInstagram} />
      <SocialLink href={socialLinks.linkedin} icon={FaLinkedinIn} />
      <a
        href="/rss.xml"
        target="_self"
        className="transition-transform transform hover:scale-105"
      >
        <FaRss />
      </a>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="w-full pt-8 pb-4 mt-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/[0.06]">
      <div className="flex flex-col items-center md:items-start gap-1">
        <p className="text-sm text-white/50 font-medium">
          Sid Adrian B. Digamon
        </p>
        <p className="text-xs text-white/30">
          sidadrian3@gmail.com
        </p>
      </div>
      <SocialLinks />
    </footer>
  );
}
