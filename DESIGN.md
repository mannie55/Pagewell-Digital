# Pagewell design system

How the Pagewell site looks and moves, and the rules for changing it. The values live in [`app/globals.css`](app/globals.css); this file explains what they are for. When the two disagree, the CSS wins: fix this file.

The look is Apple-minimal on the original Figma design system: lots of white, one accent colour (Flamingo), fills rather than outlines, and motion that is used on purpose rather than everywhere.

## Colour

### Scales

| Neutral            | Hex       | Flamingo            | Hex       |
| ------------------ | --------- | ------------------- | --------- |
| `neutral-lightest` | `#f2f2f2` | `flamingo-lightest` | `#fef0e9` |
| `neutral-lighter`  | `#d9d9d9` | `flamingo-lighter`  | `#fde1d4` |
| `neutral-light`    | `#b3b3b3` | `flamingo-light`    | `#f89669` |
| `neutral`          | `#808080` | `flamingo`          | `#f56a2a` |
| `neutral-dark`     | `#4d4d4d` | `flamingo-dark`     | `#c45421` |
| `neutral-darker`   | `#1b1b1b` | `flamingo-darker`   | `#622a10` |
| `neutral-darkest`  | `#020202` | `flamingo-darkest`  | `#491f0c` |

Flamingo is the only accent: accent words, step numbers, icon tiles, the brand button, the address bar on phones (`#f56a2a`).

### Roles

Use a role, not an opacity. `text-neutral-darkest/60` and friends are gone; don't bring them back.

| Role             | Job                                          | On light    | On dark   |
| ---------------- | -------------------------------------------- | ----------- | --------- |
| `text-muted`     | Secondary text: labels, captions, small body | darkest 60% | white 60% |
| `text-soft`      | Lead text: intros, subheads                  | darkest 70% | white 75% |
| `bg-tint`        | Quiet fill: pills, tags, secondary buttons   | darkest 5%  | white 10% |
| `bg-tint-strong` | Hover on a tint                              | darkest 10% | white 20% |

The roles read the colour scheme of the element they sit in:

- `.scheme-1` white, `.scheme-2` flamingo-lightest, `.scheme-3` neutral-lightest: light sections.
- `.scheme-dark`: a whole dark section (the Work bands). Sets the background and white text too.
- `.on-dark`: a dark card inside a light section (hero card, bento dark tiles, stats card, dark service cards). Flips the roles only; the card keeps its own background, and sets `text-white` itself if its children inherit text colour.

The roles are declared in `@theme inline` on purpose. A plain `@theme` alias resolves once at the page root, and dark cards then get dark text.

## Type

Instrument Sans for everything. Instrument Serif for the one accent word in a headline (italic, `accent-serif`) and for the big stat numbers.

| Token        | 375px | 1440px and up | Line height |
| ------------ | ----- | ------------- | ----------- |
| `heading-h1` | 40px  | 84px          | 1.1         |
| `heading-h2` | 34px  | 60px          | 1.1         |
| `heading-h3` | 28px  | 48px          | 1.1         |
| `heading-h4` | 22px  | 40px          | 1.1         |
| `heading-h5` | 20px  | 32px          | 1.1         |
| `heading-h6` | 18px  | 26px          | 1.1         |

Headings scale smoothly between 375px and 1440px with `clamp(min, a + b, max)`, where `b = (max − min) / 1065px` (written in `vw`) and `a = min − 375px · b` (written in `rem`, so text still grows with browser zoom). There is no jump at a breakpoint. The hero H1 and page H1s use the `heading-h2` size.

Body text: `text-tiny` 12px, `text-small` 16px, `text-regular` 18px, `text-medium` 20px, `text-large` 26px, all at line-height 1.5. Headlines use `text-balance`; paragraphs get `text-wrap: pretty` from the base layer.

## Layout and spacing

- **Page container** (`container-page`): max 1520px wide, 20px side gutter on phones, 32px from 768px. The hero card and nav use the same 20px inset on phones.
- **Section rhythm**: 56px top and bottom on phones (`py-14`), 80–112px from 768px (`md:py-20` to `md:py-28`).
- **Cards**: 20px padding on phones (`p-5`), 24–40px from 768px. Radius 8px everywhere (`rounded-sm`, `-md`, `-lg` are all 8px).
- **Section header** (`section-header`): label, heading and intro 16px apart. Used by every home section and `PageHeader`; the home About stage keeps its own spacing for its choreography.
- **Long words**: the body wraps over-long words (`overflow-wrap: break-word`). A domain or email inside a flex row adds `wrap-anywhere`. Tiny fixed labels (illustration nodes, stat labels) use `wrap-normal` so they never split mid-word.
- **Tap targets**: small links add `tap-target`, which makes them at least 44 × 44px on touch screens and leaves mouse layouts alone.
- **Widths to check**: 350px (small phone), 768px (tablet), 1440px (desktop).

## Components

| Component                    | File                                                               | Rules                                                                                                                                                                                                                                |
| ---------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Button`                     | `components/ui/button.tsx`                                         | `primary` (black on light, white on dark; "Contact us" everywhere), `secondary` (tint), `link`. `brand` (Flamingo) exists but is unused: keep the primary action black. Pass `tone="dark"` on dark sections so the focus ring shows. |
| `Tag`                        | `components/ui/tag.tsx`                                            | The only pill. `as="p" muted` for a section label, plain for a card chip. Turns light on dark surfaces by itself.                                                                                                                    |
| `RevealHeading`              | `components/ui/reveal-heading.tsx`                                 | `effect="fade"` by default; `"words"` only where Motion allows; `"none"` for card titles.                                                                                                                                            |
| `RevealOnScroll`             | `components/ui/reveal-on-scroll.tsx`                               | Blocks rise 20px into place once, no blur.                                                                                                                                                                                           |
| `PageHeader`                 | `components/layout/page-header.tsx`                                | Breadcrumbs, label, the page's one H1, intro, "Contact us" (caught by the nav).                                                                                                                                                      |
| `CtaBand` + `CardVideo`      | `components/sections/cta-band.tsx`, `components/ui/card-video.tsx` | The Flamingo card that closes inner pages, liquid video in multiply.                                                                                                                                                                 |
| `ProjectMedia`               | `components/sections/project-media.tsx`                            | Client screenshot framed on a blurred backdrop in that client's accent.                                                                                                                                                              |
| `HeroVideo`                  | `components/sections/hero-video.tsx`                               | Desktop and mobile cuts by screen width.                                                                                                                                                                                             |
| `ScreenColumns`              | `components/sections/screen-columns.tsx`                           | Our client landing pages drifting in two columns, as decoration in the bento.                                                                                                                                                        |
| `SentenceForm`               | `components/ui/sentence-form.tsx`                                  | The contact form written as a sentence. Choices come from `data/services.ts`, passed in by the server.                                                                                                                               |
| `ServiceIcon`                | `components/ui/service-icon.tsx`                                   | Phosphor fill icons for services.                                                                                                                                                                                                    |
| `BottomBlur`, `SmoothScroll` | `components/ui/`                                                   | Soft blur along the bottom of the viewport; Lenis wheel smoothing (off under reduced motion).                                                                                                                                        |

## Motion

- **Section headings** fade up 10px once (`effect="fade"`).
- **Word-by-word blur** is for a few lines visitors must see: the hero H1, the bento headline ("Your website isn't broken. It's invisible."), the home contact heading, and the home About stage, which keeps its full staged choreography. Ask before adding another.
- **Card titles** don't animate (`effect="none"`). Body copy never animates.
- **Word-split text stays accessible**: `splitForReveal` (`lib/split-words.tsx`) hides the word boxes from screen readers and gives them the sentence: `aria-label` on a heading, visually hidden text on a paragraph.
- **Reduced motion**: everything shows at once, videos show their posters, the landing-page columns and illustration loops stop, Lenis stays off.

## Motifs

- **Halftone seam** between sections: `public/images/seam-dots.svg`, generated by `scripts/seam-dots-svg.mjs`, placed with `SectionSeam`.
- **Dot field**: a 16px grid of soft dots, masked so it fades out (hero, bento dark card).
- **Flamingo glow** rising behind the hero buttons.
- **Hero notch**: a white tab cut 60px into the bottom of the hero card, with curved fillets, holding "Contact us" and "Our services".

## Calls to action

- **"Contact us"** is the primary action everywhere and goes to `/contact`. The nav catches the page's own button as you scroll.
- **"Get a free audit"** appears only where the audit is the point (the bento's orange tile and the Work strip) and also goes to `/contact`. The promise is "three written findings within a few working days".
- **No prices** anywhere on the site.

## Video

- **Hero**: WebM desktop cut (about 2.7 MB) and mobile cut (about 0.7 MB), each with a poster. Plays only while on screen.
- **CTA cards**: one liquid loop (about 0.8 MB) shared by every Flamingo CTA card. Mounts only when the card is near the viewport.
- Every video shows its poster under reduced motion or Data Saver, and is decorative (the text on top carries the meaning). Older Safari, which can't play WebM, shows the poster.

## Browser surfaces

Selected text is flamingo-lighter (flamingo-dark with white text on dark surfaces), the typing caret is flamingo-dark, the scrollbar is thin and neutral, and `theme-color` paints the phone address bar `#f56a2a`.

## Checking a change

`npm run test:e2e` builds the site and runs the Playwright suite:

- `desktop-look`: full-page pictures of seven pages at 1440px. Re-take one only in the commit that changes that page on purpose, after reviewing the diff.
- `mobile-layout`: no page scrolls sideways at 350px or 768px.
- `routes`, `contact`, `headings`: status codes, the 404, home card links, the contact form and email, and accessible heading names.

Animation timing (the hero words, the About stage) isn't covered by the pictures: check it by eye with motion on.
