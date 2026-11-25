// Service pages. One page per service, each aimed at one search. No prices:
// every page ends in the free audit. Keep claims to what we control.

export type ServiceIcon =
  "browser" | "search" | "map" | "sparkle" | "link" | "megaphone" | "cursor";

export type Service = {
  slug: string;
  name: string;
  icon: ServiceIcon;
  /** One line for cards and the meta description. */
  short: string;
  /** The page's h1. */
  title: string;
  intro: string;
  /** Three complaints in the owner's words. */
  symptoms: [string, string, string];
  whatWeDo: string[];
  steps: { title: string; time: string }[];
  faqs: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "website-design",
    name: "Website design & development",
    icon: "browser",
    short:
      "Fast, clear websites your team can update, built to rank from day one.",
    title: "Websites built to be found and chosen",
    intro:
      "A fast, clear website your team can update, built from day one to rank on Google and turn visitors into enquiries.",
    symptoms: [
      "Our site looks dated next to competitors.",
      "Only a developer can change anything.",
      "It’s slow on phones.",
    ],
    whatWeDo: [
      "Strategy first: who it’s for, what they search, what you want them to do",
      "Design in your brand, built in Webflow, WordPress, Shopify or Next.js",
      "Technical SEO from launch: speed, structure, schema and sitemap",
      "Tracking for calls, forms and WhatsApp clicks",
      "A CMS your team can use without us",
    ],
    steps: [
      { title: "Audit and plan", time: "Week 1" },
      { title: "Design", time: "Weeks 2–3" },
      { title: "Build", time: "Weeks 3–5" },
      { title: "Launch and handover", time: "Week 6" },
    ],
    faqs: [
      {
        q: "Which platform will you use?",
        a: "The one that fits what the site needs to do: Webflow for design-led marketing sites, WordPress for content-heavy sites, Shopify for stores and Next.js for custom builds. We recommend one after the audit.",
      },
      {
        q: "Can you redesign our current site?",
        a: "Yes. We keep the pages and content that already bring visitors, and set up redirects so you keep the search visibility you’ve earned.",
      },
      {
        q: "How much does a website cost?",
        a: "It depends on pages, features and platform. After the free audit you get a fixed written quote, and nothing starts until you approve it.",
      },
    ],
  },
  {
    slug: "seo",
    name: "SEO",
    icon: "search",
    short: "Get found on Google by people searching for exactly what you sell.",
    title: "SEO that gets you found by people ready to buy",
    intro:
      "We find what your customers type into Google, then make your website the best answer: technical fixes, the right pages and content that earns its place.",
    symptoms: [
      "We don’t show up for what we sell.",
      "Traffic comes, but from the wrong searches.",
      "A competitor with a worse site outranks us.",
    ],
    whatWeDo: [
      "Keyword research based on what buyers actually search",
      "Technical fixes: speed, indexing, structure and schema",
      "Service and location pages that each target one search",
      "Monthly content that answers buyer questions",
      "A one-page monthly report in plain English",
    ],
    steps: [
      { title: "Audit", time: "Week 1" },
      { title: "Fix the foundations", time: "Weeks 2–4" },
      { title: "Publish and improve", time: "Every month" },
      { title: "Report", time: "Every month" },
    ],
    faqs: [
      {
        q: "How long does SEO take?",
        a: "Most sites see movement in 60 to 90 days, which is why we work in three-month minimums. Technical fixes can show sooner.",
      },
      {
        q: "Can you guarantee first place on Google?",
        a: "No one honestly can. We guarantee the work: every deliverable listed for the month, or that month is free.",
      },
      {
        q: "Do you work on sites you didn’t build?",
        a: "Yes, on any platform you can give us access to.",
      },
    ],
  },
  {
    slug: "local-seo",
    name: "Local SEO",
    icon: "map",
    short:
      "Show up in Google Maps and local results when nearby customers search.",
    title: "Show up when locals search near them",
    intro:
      "We get your business into Google Maps and local results: a complete Google Business Profile, steady reviews and the same details everywhere you’re listed.",
    symptoms: [
      "We’re not in the map results.",
      "Competitors have more reviews.",
      "Our address and hours are wrong online.",
    ],
    whatWeDo: [
      "Google Business Profile set up and managed: photos, posts, services and Q&A",
      "A simple way to ask happy customers for reviews",
      "Local directory listings with matching details",
      "Location pages for each area you serve",
      "Call and direction tracking",
    ],
    steps: [
      { title: "Audit your listings", time: "Week 1" },
      { title: "Fix and complete them", time: "Weeks 2–3" },
      { title: "Build reviews", time: "Every month" },
      { title: "Report", time: "Every month" },
    ],
    faqs: [
      {
        q: "Do I need a physical address?",
        a: "No. Service-area businesses can show in local results without a public address.",
      },
      {
        q: "How do reviews help?",
        a: "The number, rating and freshness of reviews all affect who Google shows first, and they’re what customers compare.",
      },
      {
        q: "Which areas can you cover?",
        a: "Any town or city you genuinely serve, in the UK, Nigeria or elsewhere.",
      },
    ],
  },
  {
    slug: "ai-search",
    name: "AI search optimisation",
    icon: "sparkle",
    short:
      "Get your business recommended in ChatGPT, Google AI Overviews and Perplexity.",
    title: "Get recommended in AI answers",
    intro:
      "More people ask ChatGPT, Google’s AI Overviews and Perplexity who to hire. We make your business easy for them to find, understand and recommend.",
    symptoms: [
      "AI tools recommend our competitors.",
      "Our details don’t match across the web.",
      "Our pages don’t answer questions directly.",
    ],
    whatWeDo: [
      "Pages that answer buyer questions in plain, direct language",
      "Structured data so machines understand your business",
      "Matching business details across the web",
      "Mentions on trusted third-party sites",
      "Monthly checks of what AI tools say about you",
    ],
    steps: [
      { title: "Check what AI says", time: "Week 1" },
      { title: "Fix your pages", time: "Weeks 2–3" },
      { title: "Build mentions", time: "Every month" },
      { title: "Recheck and report", time: "Every month" },
    ],
    faqs: [
      {
        q: "Is this different from SEO?",
        a: "Mostly it’s good SEO plus being mentioned in the right places. We’re honest about that, and we do both together.",
      },
      {
        q: "Can you guarantee ChatGPT will mention us?",
        a: "No. We do the work that makes it likely and show you each month what changed.",
      },
      {
        q: "Do we need this now?",
        a: "If your customers research before they buy, it’s worth starting while your competitors haven’t.",
      },
    ],
  },
  {
    slug: "link-building",
    name: "Link building & digital PR",
    icon: "link",
    short: "Earn links from trusted websites so Google trusts yours.",
    title: "Links that make Google trust your site",
    intro:
      "Other trusted websites linking to yours is still one of the strongest signals Google uses. We earn those links through guest articles, PR and partnerships, never by buying them.",
    symptoms: [
      "Competitors with weaker sites outrank us.",
      "No other websites mention us.",
      "New pages take months to rank.",
    ],
    whatWeDo: [
      "Guest articles on relevant, real websites",
      "Digital PR: stories and expert comments for journalists",
      "Links from partners, suppliers and associations",
      "Turning existing mentions of you into links",
      "Quality directories only",
    ],
    steps: [
      { title: "Find opportunities", time: "Week 1" },
      { title: "Create the content", time: "Every month" },
      { title: "Outreach", time: "Every month" },
      { title: "Report every link", time: "Every month" },
    ],
    faqs: [
      {
        q: "Do you buy links?",
        a: "No. Google penalises paid link schemes, and recovering from a penalty costs far more than doing it properly.",
      },
      {
        q: "How many links will we get?",
        a: "A few strong links beat many weak ones. Your plan sets a monthly target, and you see every link we earn.",
      },
      {
        q: "Where do the articles appear?",
        a: "On real websites your customers read, in your industry or area. Never on link farms.",
      },
    ],
  },
  {
    slug: "paid-ads",
    name: "Google & Meta ads",
    icon: "megaphone",
    short: "Ads that bring enquiries, with every call and form tracked.",
    title: "Ads that bring enquiries, not just clicks",
    intro:
      "When you need customers now, we run Google and Meta ads that send people to pages built to convert, and track every call and form so you know what each enquiry cost.",
    symptoms: [
      "We tried ads and lost money.",
      "Lots of clicks, few enquiries.",
      "We can’t tell which ads work.",
    ],
    whatWeDo: [
      "Google Search, Performance Max and Meta campaigns",
      "A landing page built for each campaign",
      "Call, form and WhatsApp tracking",
      "Weekly tuning of bids, audiences and ads",
      "A monthly report on cost per enquiry",
    ],
    steps: [
      { title: "Set up tracking", time: "Week 1" },
      { title: "Build landing pages", time: "Week 2" },
      { title: "Launch and tune", time: "Every week" },
      { title: "Report", time: "Every month" },
    ],
    faqs: [
      {
        q: "How much should we spend on ads?",
        a: "Enough to learn quickly. We recommend a starting budget after the audit, and you pay Google and Meta directly.",
      },
      {
        q: "How fast will we see results?",
        a: "Ads bring traffic within days. The first month is mostly learning which searches and audiences turn into enquiries.",
      },
      {
        q: "Do we need a new website for ads?",
        a: "Not always. A focused landing page often does better than sending ads to your homepage.",
      },
    ],
  },
  {
    slug: "conversion",
    name: "Conversion & automation",
    icon: "cursor",
    short: "Turn more visitors into enquiries, and follow up automatically.",
    title: "Turn more of your visitors into customers",
    intro:
      "We fix what stops visitors getting in touch, then follow up automatically by email and WhatsApp so no enquiry goes cold.",
    symptoms: [
      "People visit but don’t get in touch.",
      "Enquiries wait days for a reply.",
      "We lose track of leads.",
    ],
    whatWeDo: [
      "Clear calls to action, faster pages and shorter forms",
      "One-tap call and WhatsApp buttons on phones",
      "Automatic email and WhatsApp follow-up",
      "A simple CRM so every lead has an owner",
      "Tests that show which changes work",
    ],
    steps: [
      { title: "Find the leaks", time: "Week 1" },
      { title: "Fix the path", time: "Weeks 2–3" },
      { title: "Automate follow-up", time: "Week 4" },
      { title: "Test and improve", time: "Every month" },
    ],
    faqs: [
      {
        q: "What is a conversion rate?",
        a: "The share of visitors who do what you want: call, book or send a form. Small improvements add up quickly.",
      },
      {
        q: "Which tools do you use?",
        a: "Whatever fits your business, from your existing email and WhatsApp to a CRM you can run yourself.",
      },
      {
        q: "Will automation feel robotic?",
        a: "No. Messages are written in your voice and hand over to a person as soon as someone replies.",
      },
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
