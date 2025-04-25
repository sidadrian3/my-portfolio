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
    <a href={href} target="_blank" rel="noopener noreferrer" className="transition-transform transform hover:scale-105"
>
      <Icon />
    </a>
  );
}

function SocialLinks() {
  return (
    <div className="  flex text-lg gap-3.5 transition-opacity duration-300 hover:opacity-90">
      {/* <SocialLink href={socialLinks.twitter} icon={FaXTwitter} /> */}
      <SocialLink href={socialLinks.github} icon={FaGithub}  />
      <SocialLink href={socialLinks.instagram} icon={FaInstagram} />
      <SocialLink href={socialLinks.linkedin} icon={FaLinkedinIn} />
      {/* <SocialLink href={socialLinks.email} icon={TbMailFilled} /> */}
      <a href="/rss.xml" target="_self" className="transition-transform transform hover:scale-105"
 >
        <FaRss />
      </a>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="  flex flex-col lg:flex-row justify-between items-center lg:mt-12 mt-12 text-[#1C1C1C] dark:text-[#D4D4D4]">
      <p className="  mb-4 lg:mb-0 text-sm">sidadrian3@gmail.com / sabdigamon@addu.edu.ph</p>
      <SocialLinks />
      <style jsx>{`
        @media screen and (max-width: 480px) {
          footer {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </footer>
  );
}