export type Photo = { src: string; alt: string; caption: string };

const caption = "[event] · [place] · [date]";

export const photos: Photo[] = [
  {
    src: "/photos/photo1.jpg",
    alt: "A group of students in light blue shirts and white uniforms posing together on a stage in an event hall",
    caption,
  },
  {
    src: "/photos/photo2.jpg",
    alt: "A group selfie in a computer lab, with a smiling student in front giving a thumbs up and others behind making hand signs",
    caption,
  },
  {
    src: "/photos/photo3.jpg",
    alt: "A speaker standing at a podium facing a seated audience in a dark auditorium, with an IT Week 2025 banner across the bottom",
    caption,
  },
  {
    src: "/photos/photo4.jpg",
    alt: "A crowded group selfie in a computer lab, with students smiling and giving thumbs up in front of rows of monitors",
    caption,
  },
];
