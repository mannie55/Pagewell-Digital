import type { StaticImageData } from "next/image";
import member1 from "@/public/images/team/member-1.jpg";
import member2 from "@/public/images/team/member-2.jpg";
import member3 from "@/public/images/team/member-3.png";

export type TeamMember = {
  name: string;
  role: string;
  photo: StaticImageData;
  /** Tailwind object-fit/position classes that frame the face, matching the Figma crop. */
  framing: string;
};

// PLACEHOLDER: Figma repeats one name and role on all three cards. Replace each
// with the real name and role of the person in the photo before launch.
export const team: TeamMember[] = [
  {
    name: "Ifeanyi Chidoka",
    role: "Snr. Software Engr.",
    photo: member3,
    // This file is stored stretched tall; filling the near-square frame restores
    // the true proportions, exactly as the Figma card does.
    framing: "object-fill",
  },
  {
    name: "Ifeanyi Chidoka",
    role: "Snr. Software Engr.",
    photo: member1,
    framing: "object-cover object-[50%_37%]",
  },
  {
    name: "Ifeanyi Chidoka",
    role: "Snr. Software Engr.",
    photo: member2,
    framing: "object-cover object-top",
  },
];
