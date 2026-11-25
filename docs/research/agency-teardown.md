# Agency teardown: what we learned from 27 sites

Researched 2026-11-25 for the website-growth rebuild ([decision memo](../memos/website-growth-repositioning.md)).

**What was read:** homepage plus 1–2 inner pages (service, case study, contact) of 27 sites in four groups:
- **UK growth/Webflow agencies:** Summit Digital, Spurwing, 3SIX5, theCSS Agency, WebsiteSquirrel, Flow Guys.
- **Design studios:** Produlis, N4, Flowtrix, Supasaito, Design by Structure, Skrol, Mainflow.
- **Copy/positioning leaders:** RocketAir, Brightscout, SmallGiants, OFF+BRAND, Current, Polar Hedgehog, newdot.
- **Trust sellers and niche agencies:** three Budapest dental clinics (selling to nervous international patients), Blue Collar Builds, ADDED, Emerson Ward.

Kashmir Clinic (no content returned) and Sellwell (blocked) weren't readable. Text was read, not rendered pages, so motion and visual polish weren't judged.

## The 10 things that separate the best from the rest

| # | Pattern | Who does it best | How Pagewell uses it |
|---|---|---|---|
| 1 | **Hero names the buyer and the result,** not the studio's personality | Brightscout, Polar Hedgehog, Produlis ("More leads and bookings, measured, not promised.") | Hero: "The website growth your business needs" + "Your website is live. Is it bringing you customers?" |
| 2 | **"Sound familiar?" problem list** in the customer's own words, before any offer | Summit, WebsiteSquirrel, Supasaito; dental clinics lead with symptoms ("toothache", "missing tooth"), each linking to one treatment page | New Problem section: four owner complaints, what each costs, what fixes it. Each will link to its service page once those exist |
| 3 | **One primary CTA, repeated,** with a small first step instead of "contact sales" | theCSS ($49 audit in 2 working days), Current ("Get a free snapshot"), Flowtrix (free audit), Spurwing (call framed as a decision aid) | One CTA everywhere: "Get a free audit", capped at three written findings so each one is about 30 minutes of work ([template](../templates/free-audit.md)) |
| 4 | **A response-time promise next to the CTA.** Rare, so it stands out | Current ("within one business day"), Spurwing ("same working day"), Flow Guys ("within a few hours") | "Free: three written findings within two working days." Only if the team can keep it |
| 5 | **Specific proof beats totals.** One named client + one number + a timeframe; never a "Results" heading with no numbers | N4 (metric strip at the top of each case study), Produlis (before/after table: Lighthouse 61 → 98). Bad: Summit's "Measurable results" with no numbers, Skrol's "100% client satisfaction" | Removed our unsourced "98% client satisfaction"; case studies get a metric strip only when we have real numbers |
| 6 | **A named human owns the relationship** | Produlis (you book with the Head of Agency), dental clinics (named patient coordinator, doctor credentials with a "verified on" date) | Contact page names who replies; About shows real founders with prior experience |
| 7 | **Process with outputs:** what you do, what we do, what you get at each step | Brightscout (each phase has an "Outcome" line), Deutscher Zahnarzt (4 steps ending in "just set off") | Process section rewritten as 4 steps, starting from the audit |
| 8 | **FAQ that handles objections honestly** (timeline, who works on my account, how payment works) | RocketAir, ADDED ("Do you only work with Webflow?"), Spurwing | FAQ rewritten around buyer fears, including how pricing works without published prices |
| 9 | **Small on purpose** stated as a benefit | newdot ("Staying small is a choice"), Polar ("a limited number of projects each quarter", only credible because it's a real limit) | About: three people, the people you talk to do the work. No fake scarcity |
| 10 | **Nobody speaks to Nigeria + UK.** No agency in the set names both markets | (gap) | "Built for businesses in the UK, Canada, the US and Nigeria." WhatsApp for Nigeria, a UK number for UK clients |

## What we deliberately did NOT take

- **Published prices.** 5 of the 6 UK growth agencies publish a number. We chose not to (founder decision): the contact form is the goal. In their place: a "How pricing works" FAQ answer (fixed written quote after the audit, nothing starts without it) and a "what's included" list on each service page.
- **Budget questions on the contact form.** RocketAir ($50k+), Brightscout ($25k+) and OFF+BRAND (£20k+) use them to screen out exactly our buyer. We ask what's wrong instead.
- **Logo walls of tools presented as clients,** unsourced stat counters, invented awards. All of these turned up in the set, and on our own concept builds.
- **Jargon in buyer-facing headings:** "lifecycle", "experience optimization", "AEO", "Design Intelligence". Service pages say "show up in Google and AI answers", not "AEO".
- **Mega-menus, discount popups, emoji in headings, playful budget tiers, several competing CTAs.** Each one cheapens a premium, minimal site.

## Blueprints for each page type

### Home (new order)
1. Hero: buyer + loss + one CTA *(done)*
2. Proof strip: verifiable stats + tools *(stat fixed; client logos once approved)*
3. **Sound familiar?** Four complaints → cost → fix *(done)*
4. Services as the three jobs: get found, get chosen, get enquiries
5. Work: client work first, concepts labelled
6. How it works: 4 steps from the audit, plus the monthly guarantee
7. About: belief line, small on purpose, named founders
8. FAQ: objections
9. Contact CTA with response promise

### Service page (×7)
H1 = service + who it's for → "Sound familiar?" (3 complaints) → what's actually wrong, in plain words → **"Same business, two ways"** side-by-side (Supasaito's "same change, two ways") → what we do each month (fixed list) → 4 steps with timeframes → one proof card → 4–6 FAQs → CTA + response promise.

### Case study
Outcome-led H1 → one-line scope ("Audit → rebuild → local SEO → monthly reporting", from Design by Structure) + facts (business type, market, platform, timeline) → metric strip, **only with real numbers** (N4) → the problem as a loss → what changed (3 bullets) → before/after screenshots or table (Produlis) → named quote (name, role, business, town) → CTA. Concepts: a "Concept project" label and "What we delivered" instead of outcomes.

### Contact (the conversion page)
- **Fields (5, 3 required):** name, email, WhatsApp/phone (optional), website URL (optional, since some have no site yet), "What's not working?" (the four complaints + "I need a new website" + "Not sure").
- **No budget question.**
- **After submit:** "What happens next" in 3 steps, the name of who will reply, the response promise, and an optional calendar link (Flowtrix puts booking on the confirmation step).

### About
Belief line ("A website isn't finished when it launches…") → small on purpose → founders with real backgrounds and photos → how we work → where we are → registered business details.

## Copy bank (adapted, not copied)

- "Your website isn't broken. It's invisible." *(used)*
- "A website isn't finished when it launches. It's finished when it brings you customers." *(used, as the signature line to repeat)*
- "Tell us what's not working. We'll show you what we'd fix first." (after Current)
- "No pitch deck, no pressure. Just what we found." (after Current)
- "The people you talk to are the people who do the work." (after newdot)
- "Leave the call knowing what's wrong, what to fix first and what it will cost." (after Spurwing's decision-aid framing)

## Problems on our own site found through this lens

- *(fixed)* "98% client satisfaction" was unsourced → replaced with "4 countries served" (verifiable from live client sites).
- **Confirm or replace:** "10+ years of experience" and "50+ websites deployed".
- **Still placeholders:** testimonials, team names/roles, WhatsApp number, social links, legal page links (`data/`, `lib/site.ts`).
- `copyrightYear` is hardcoded to 2026. Stale footers showed up on 5 sites in this set (©2015–2018, ©2022, ©2024, ©20XX).
