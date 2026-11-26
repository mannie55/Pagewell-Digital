import Image, { type StaticImageData } from "next/image";
import { StatNumber } from "@/components/ui/stat-number";
import astro from "@/public/logos/tools/astro.png";
import figma from "@/public/logos/tools/figma.png";
import framer from "@/public/logos/tools/framer.png";
import nextjs from "@/public/logos/tools/nextjs.png";
import shopify from "@/public/logos/tools/shopify.png";
import webflow from "@/public/logos/tools/webflow.png";
import wordpress from "@/public/logos/tools/wordpress.png";

// Each label is split over two lines on purpose.
const stats = [
  { value: 10, suffix: "+", label: ["Years of", "experience"] },
  { value: 50, suffix: "+", label: ["Websites", "deployed"] },
  // Verifiable: client sites live in the UK, Nigeria, Canada and the US.
  { value: 4, suffix: "", label: ["Countries", "served"] },
];

const tools: { name: string; logo: StaticImageData }[] = [
  { name: "Webflow", logo: webflow },
  { name: "WordPress", logo: wordpress },
  { name: "Astro", logo: astro },
  { name: "Framer", logo: framer },
  { name: "Next.js", logo: nextjs },
  { name: "Shopify", logo: shopify },
  { name: "Figma", logo: figma },
];

/** Experience stats card + "Built with" tool logo grid, sitting directly under the hero. */
export function SocialProofSection() {
  return (
    <section
      aria-labelledby="social-proof-heading"
      className="container-page grid gap-5 py-5 lg:grid-cols-2"
    >
      <div className="bg-flamingo-darkest on-dark flex flex-col justify-between gap-10 rounded-lg px-5 py-6 text-white md:px-8 lg:min-h-[18.375rem]">
        <h2
          id="social-proof-heading"
          className="heading-h6 text-soft font-sans"
        >
          Experience you can build on.
        </h2>

        <dl className="grid grid-cols-3 gap-4 md:gap-6">
          {stats.map((stat) => (
            // justify-end tops the reversed column, so the three numbers line
            // up even when one label runs longer.
            <div
              key={stat.label[0]}
              className="flex flex-col-reverse justify-end gap-1"
            >
              {/* Always two whole-word lines: below 400px three columns are
                  only ~70-80px wide, so the label steps down to 12px. */}
              <dt className="text-tiny text-soft min-[400px]:text-small md:text-regular font-medium wrap-normal">
                {stat.label[0]} <br />
                {stat.label[1]}
              </dt>
              <dd className="heading-h1 flex items-start font-serif">
                <StatNumber value={stat.value} />
                <span className="heading-h4 text-flamingo">{stat.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="border-border bg-border grid grid-cols-4 grid-rows-2 gap-px overflow-hidden rounded-lg border">
        <p className="text-small md:text-medium flex items-center justify-center bg-white p-2 text-center font-medium">
          Built with
        </p>
        <ul className="contents">
          {tools.map((tool) => (
            <li
              key={tool.name}
              className="flex min-h-24 items-center justify-center bg-white p-4"
            >
              <Image
                src={tool.logo}
                alt={tool.name}
                width={50}
                height={50}
                className="size-8 object-contain opacity-60 md:size-[3.125rem]"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
