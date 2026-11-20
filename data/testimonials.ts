export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** 1–5 */
  rating: number;
};

// PLACEHOLDER CONTENT. The Figma quotes came from another agency's site
// (one names "Visuvate"), so they must not be used. Replace these with real,
// attributable client testimonials before launch.
export const testimonials: Testimonial[] = [
  {
    quote:
      "Placeholder testimonial. Replace with a real quote from a Pagewell client about the experience of working together.",
    name: "Client name",
    role: "Role, Company",
    rating: 5,
  },
  {
    quote:
      "Placeholder testimonial. A second client quote, ideally mentioning a concrete result such as launch speed or enquiries.",
    name: "Client name",
    role: "Role, Company",
    rating: 5,
  },
  {
    quote:
      "Placeholder testimonial. A third client quote, ideally from a different industry or service than the first two.",
    name: "Client name",
    role: "Role, Company",
    rating: 5,
  },
];
