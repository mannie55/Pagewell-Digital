import type { StaticImageData } from "next/image";
import deultimateVentures from "@/public/images/work/deultimate-ventures.jpg";
import domesticStaffingHub from "@/public/images/work/domestic-staffing-hub.jpg";
import eliteLearningInnovations from "@/public/images/work/elite-learning-innovations.jpg";
import zomariLuxeCleaning from "@/public/images/work/zomari-luxe-cleaning.jpg";

export type Project = {
  slug: string;
  name: string;
  /** One line on what we did. Shown on the card and as the case study's intro. */
  summary: string;
  services: string[];
  image: StaticImageData;
  imageAlt: string;
  /** The live site. */
  url: string;
  market: string;
  industry: string;
  /** The client site's own accent; tints the card backdrop. */
  accent: string;
  /** What the business does and what the website is for. Facts only, no invented results. */
  overview: string;
  /** What the website does for the business, as visitors see it. */
  built: string[];
};

// Live client builds, screenshotted from each homepage on 2026-11-25.
// Every fact below is visible on the live site; no results are claimed until we can measure them.
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
    url: "https://elitelearninginnovations.co.uk/",
    market: "United Kingdom",
    industry: "Online tutoring",
    accent: "#e4572e",
    overview:
      "Elite Learning Innovations offers personalised online tutoring for primary and secondary students across the UK, from SATs and the 11+ to GCSE and A Level. The website introduces their approach to parents and leads every visit to one next step: a free consultation or a trial lesson.",
    built: [
      "A homepage that leads with what parents want: confident, well-prepared children",
      "A page for each stage of school, from primary to A Level",
      "Free consultation and trial lesson buttons throughout",
      "WhatsApp chat for quick questions",
      "Safeguarding, privacy and terms pages parents look for",
    ],
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
    url: "https://www.domesticstaffinghub.com/",
    market: "Nigeria",
    industry: "Domestic staffing",
    accent: "#1e3a8a",
    overview:
      "Domestic Staffing Hub places chefs, drivers, home tutors, nannies, caregivers and housekeepers with homes and businesses in Warri, Nigeria. The website serves both sides of the business: families request staff in a few taps, and job seekers apply to join.",
    built: [
      "A staff request form that starts from the service a family needs",
      "WhatsApp chat for every service",
      "A separate path for job seekers to apply",
      "A page for each staffing service",
      "A photo gallery",
    ],
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
    url: "https://zomariluxecleaning.com/",
    market: "Canada",
    industry: "Residential & commercial cleaning",
    accent: "#0ea5b7",
    overview:
      "Zomari Luxe Cleaning offers residential, commercial, deep, Airbnb and move-in/out cleaning in Calgary, with eco-friendly options. The website turns interest into bookings: visitors pick a service and book, or ask for a quote, without picking up the phone.",
    built: [
      "Online booking that starts from the service a visitor picked",
      "A quote request form",
      "A page for each type of clean",
      "A careers page for recruiting cleaners",
      "FAQs that answer the usual questions before they're asked",
    ],
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
    url: "https://www.deultimateventures.co.uk/",
    market: "United Kingdom",
    industry: "Property, cleaning & education",
    accent: "#2563eb",
    overview:
      "DeUltimate Ventures is a UK company working across property management, professional cleaning and education consultancy. The website gives three different services one clear, professional home, with a direct line to the team on the first screen.",
    built: [
      "One page that explains three divisions without mixing them up",
      "Email, phone and WhatsApp on the first screen",
      "A consultation request as the main next step",
      "A clear service area: England and Wales",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
