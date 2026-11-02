export type NowPiece = string | { highlight: string };

export const metaData = {
  baseUrl: "https://my-portfolio-sepia-zeta-23.vercel.app",
  title: "Sid Adrian Digamon",
  name: "Sid",
  description:
    "cs grad from ateneo de davao building back-ends. projects, experience, and what i'm listening to.",
  ogImage: "/og",
  now: [
    "going back to the ",
    { highlight: "fundamentals and good practices" },
    ", and building ",
    { highlight: "full-stack with AI in the loop" },
    ".",
  ] satisfies NowPiece[],
  nowUpdated: "2026-11",
};

export const socialLinks = {
  github: "https://github.com/sidadrian3",
  linkedin: "https://www.linkedin.com/in/sid-adrian-digamon-b885a3323/",
  instagram: "https://www.instagram.com/sidadrian/",
  facebook: "https://www.facebook.com/adrian.digamon",
  email: "sidadrian3@gmail.com",
};
