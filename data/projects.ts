import type { StaticImageData } from "next/image";
import deultimateVentures from "@/public/images/work/deultimate-ventures.jpg";
import domesticStaffingHub from "@/public/images/work/domestic-staffing-hub.jpg";
import eliteLearningInnovations from "@/public/images/work/elite-learning-innovations.jpg";
import zomariLuxeCleaning from "@/public/images/work/zomari-luxe-cleaning.jpg";

export type Project = {
  slug: string;
  name: string;
  /** One line on what we did / the outcome. Shown under the image and indexed by search engines. */
  summary: string;
  services: string[];
  image: StaticImageData;
  imageAlt: string;
  /** Case-study URL. Leave undefined until the page exists so we never link to a 404. */
  href?: string;
};

// Live client builds, screenshotted from each homepage on 2026-11-25.
// CONSENT: confirm each client is happy to be named and shown before this deploys.
// FEDTC (US) is also a client; left out here because its homepage is the weakest visually.
export const projects: Project[] = [
  {
    slug: "elite-learning-innovations",
    name: "Elite Learning Innovations",
    summary:
      "A tutoring website for UK families, built to turn visits into free consultations and trial lessons.",
    services: ["Web design", "Development"],
    image: eliteLearningInnovations,
    imageAlt:
      "Elite Learning Innovations homepage: a student studying beside the headline “Support that builds real confidence”",
  },
  {
    slug: "domestic-staffing-hub",
    name: "Domestic Staffing Hub",
    summary:
      "Staff requests, WhatsApp chat and a job-application path for a domestic staffing agency in Warri, Nigeria.",
    services: ["Web design", "Development", "Lead capture"],
    image: domesticStaffingHub,
    imageAlt:
      "Domestic Staffing Hub homepage with Request Staff and Chat on WhatsApp buttons beside photos of carers and household staff",
  },
  {
    slug: "zomari-luxe-cleaning",
    name: "Zomari Luxe Cleaning",
    summary:
      "Online booking and instant quotes for a cleaning company in Calgary, Canada.",
    services: ["Web design", "Development", "Online booking"],
    image: zomariLuxeCleaning,
    imageAlt:
      "Zomari Luxe Cleaning homepage with a Book Now button beside a photo of a freshly cleaned living room",
  },
  {
    slug: "deultimate-ventures",
    name: "DeUltimate Ventures",
    summary:
      "One clear home for a UK firm’s property, cleaning and education services.",
    services: ["Web design", "Development"],
    image: deultimateVentures,
    imageAlt:
      "DeUltimate Ventures homepage: the headline “Multi service delivery with standards you can trust” beside a contact card",
  },
];
