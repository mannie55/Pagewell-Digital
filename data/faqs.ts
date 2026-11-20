export type Faq = { question: string; answer: string };

// Questions are from the Figma file, which has no answers. These are DRAFT
// answers written from what the rest of the site says: review before launch,
// and add real price ranges and timelines if you want to publish them.
export const faqs: Faq[] = [
  {
    question: "How much does a website project cost?",
    answer:
      "It depends on the size of the site, the features you need and the platform. After a first call we define the scope, timeline and budget in writing, so you know the full cost before any work starts.",
  },
  {
    question: "How long does a website project take?",
    answer:
      "Timelines depend on scope and how quickly content and feedback come together. We agree on a timeline in writing during the strategy stage and keep you informed with regular check-ins until launch.",
  },
  {
    question: "Can you rebuild or migrate an existing website?",
    answer:
      "Yes. We can redesign your current site or move it to a new platform, carrying over the content that matters and planning redirects so the visibility you have already earned is protected.",
  },
  {
    question: "Can our team update the website without a developer?",
    answer:
      "Yes. We build with a CMS your team can manage, so everyday changes to pages and content don't need a developer.",
  },
  {
    question: "Will the website help us get found in search and AI answers?",
    answer:
      "That is part of the plan. We combine technical SEO, search-led content and AI search optimisation so the right people can find your business in Google and in AI answers. No one can honestly guarantee rankings, but we build the foundations that earn them.",
  },
  {
    question: "Which platform should we choose: Webflow, WordPress or Shopify?",
    answer:
      "It comes down to what the site needs to do. Webflow suits design-led marketing sites, WordPress suits content-heavy sites that rely on plugins, and Shopify suits online stores. We recommend one during strategy, based on your goals and your team.",
  },
  {
    question: "What happens after launch?",
    answer:
      "We test across devices, launch with you and stay available for updates and ongoing support, so the website keeps working for you after it goes live.",
  },
  {
    question: "How do you use AI in your process?",
    answer:
      "We use AI to move faster and catch more, while people make every creative and strategic call. You work directly with the team designing and building your project.",
  },
];
