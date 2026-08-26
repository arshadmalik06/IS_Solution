# BIS AI Assistant — Design System

**Project:** SIH 2026 — Problem Statement 26107  
**Product:** AI-powered Intelligent Assistant for Indian Standards and BIS Services for Industries and Consumers  
**Frontend:** React + Vite + TypeScript + Tailwind CSS + Lucide Icons

---

## 1. Design Intent

The visual direction is based on the provided BIS AI Assistant reference image.

The product should feel like a **modern BIS digital product** rather than a generic AI/SaaS template.

Core qualities:

- Professional
- Trustworthy
- Technical
- Calm
- Premium
- Minimal
- Government/enterprise appropriate
- Modern without looking futuristic or artificial

### Primary visual concept

The landing page combines:

1. A dark matte environment.
2. BIS branding and restrained navigation.
3. Strong editorial hero typography on the left.
4. A lamp + document visual composition on the right.
5. A matte glass AI-answer preview over the visual.
6. Capability cards below the hero.
7. A consistent visual language carried into the actual AI chat workspace.

The lamp/document imagery represents **illumination, knowledge, standards, documents, and finding answers**.

The visual should communicate:

> **Question → BIS knowledge → Answer → Source**

---

# 2. NON-NEGOTIABLE MATTE FINISH RULE

This is one of the most important rules in the entire design system.

## EVERYTHING MUST LOOK MATTE.

The palette must feel:

- flat
- deep
- muted
- softly diffused
- low-reflection
- sophisticated

### Do NOT use

- Glossy gradients
- Metallic-looking UI
- Chrome effects
- Wet/glass reflections
- Strong specular highlights
- Bright bloom
- Neon glow
- Shiny blue buttons
- Excessive radial gradients
- Strong color flares
- High-contrast glass reflections

The UI should never look like polished plastic.

### Correct mental model

Think:

> **matte painted metal + smoked glass + soft studio lighting**

Not:

> **glossy glass + neon AI interface**

---

# 3. COLOR SYSTEM

The color palette should remain close to the supplied visual reference.

Use dark navy/charcoal as the dominant environment.

## Base colors

```css
--color-background: #050B12;
--color-background-soft: #08111B;
--color-surface: #0A1420;
--color-surface-elevated: #0D1825;

--color-border: rgba(150, 175, 200, 0.16);
--color-border-strong: rgba(150, 175, 200, 0.24);

--color-text-primary: #F2F0EA;
--color-text-secondary: #C2CBD5;
--color-text-muted: #8995A3;

--color-bis-blue: #1769D5;
--color-bis-blue-soft: #123A69;

--color-bis-red: #E9441F;
--color-bis-red-dark: #9E2D1C;

--color-success: #42A878;
--color-warning: #D69B43;
--color-error: #C94A43;
```

These values are starting design tokens, not permission to introduce bright gradients.

## Color proportions

Approximately:

- 70–80% dark navy/charcoal
- 10–15% muted surfaces
- 5–10% text/highlight colors
- very small amount of blue/red accent

Accent colors must remain controlled.

---

# 4. MATTE COLOR APPLICATION

## Background

Use a deep matte navy/charcoal base.

A very subtle tonal variation is acceptable.

Example:

```css
background: #050B12;
```

Optional extremely subtle background geometry may use:

```css
background: rgba(30, 55, 80, 0.10);
```

No strong gradient should be visible.

## Primary CTA

The primary CTA may use BIS red/orange:

```css
background: #E9441F;
color: #FFFFFF;
```

The finish must remain matte.

Do NOT add:

```css
linear-gradient(...)
radial-gradient(...)
box-shadow: 0 0 30px ...
```

A subtle diffuse shadow is acceptable.

## Blue accents

BIS blue is used for:

- secondary highlights
- icons
- active states
- informational accents
- selected states
- links/citations

Blue should not flood the entire interface.

---

# 5. TYPOGRAPHY

Use a modern neutral sans-serif.

Recommended stack:

```css
font-family:
Inter,
ui-sans-serif,
system-ui,
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
sans-serif;
```

The landing page should use a strong editorial hierarchy.

The chat interface should use comfortable, familiar AI-assistant typography.

## Typography scale

### Hero heading

Desktop:

```text
64–76px
font-weight: 650–750
line-height: 0.98–1.05
letter-spacing: -0.035em
```

Maximum width:

```text
600–700px
```

### Section heading

```text
34–44px
font-weight: 600–700
line-height: 1.1
```

### Card title

```text
17–20px
font-weight: 600
```

### Body

```text
15–17px
line-height: 1.55–1.7
```

### Small UI

```text
12–14px
line-height: 1.4–1.5
```

Do not make every element oversized.

---

# 6. GLOBAL LAYOUT

Use a centered content system.

Desktop content width:

```text
1200–1400px
```

Preferred maximum:

```text
1320px
```

Horizontal page padding:

```text
24px minimum
40–64px desktop where appropriate
```

All major landing sections should align to the same container:

- Header
- Hero
- Capability section
- How It Works
- About
- Footer

Do not allow content to stretch to the entire monitor.

---

# 7. BACKGROUND GEOMETRY

The reference uses large, subtle diagonal geometric structures.

Keep this concept.

Use:

- diagonal translucent planes
- low-opacity navy/slate shapes
- very soft tonal separation

The geometry must remain behind the content.

Opacity should be low enough that it is discovered rather than noticed immediately.

Do not use bright decorative shapes.

Do not add unrelated 3D objects.

---

# 8. HEADER

The header should be compact and horizontally balanced.

### Left

BIS logo and identity:

- BIS logo
- Bureau of Indian Standards
- supporting organization text if the official asset contains it

### Center

Navigation:

- Home
- About
- Features
- How it Works
- Capabilities
- About BIS

### Right

- Language selector
- Theme control if implemented
- Open Assistant CTA

### Header rules

- No overlap with hero.
- Vertically center all controls.
- Use consistent 16–28px gaps.
- Keep header height around 72–88px.
- Use a subtle bottom border if needed.
- Do not make the header a giant glass panel.

Active navigation:

- muted white text
- thin BIS-red underline
- no large pill

---

# 9. LANDING PAGE HERO

The hero is the primary visual composition.

Use a two-column desktop layout.

Approximate split:

```text
48–52% text
48–52% visual
```

## Left side

Order:

1. SIH badge
2. Hero heading
3. Supporting statement
4. Description
5. CTA row
6. Trust indicators

### Badge

Example:

`SIH 2026 • Problem Statement 26107`

Use a small matte outlined pill.

### Heading

Use:

```text
AI-Powered
BIS Assistant
```

The word `BIS` may use BIS red/orange.

Keep the rest warm off-white.

### Supporting text

Use:

> Your intelligent guide to Indian Standards and BIS services.

### Description

Explain:

- standards discovery
- certification
- hallmarking
- laboratories
- source-backed answers

Keep the paragraph width controlled.

---

# 10. HERO RIGHT-SIDE VISUAL

The right side is a major part of the design.

Use the provided lamp/document imagery.

The lamp should be integrated into the scene rather than displayed as a normal image.

## Composition

The visual should contain:

- lamp
- document stack
- dark environment
- subtle diagonal geometry
- matte AI response panel

The lamp can extend beyond the hero panel slightly.

This creates depth without using glossy effects.

## Image treatment

Allowed:

- soft shadow
- dark color grading
- subtle atmospheric blend
- controlled brightness
- gentle background integration

Avoid:

- excessive glow
- neon rim light
- shiny UI reflections
- unrealistic bloom

---

# 11. HERO AI PREVIEW CARD

Place a matte glass panel in front of/near the hero visual.

This panel demonstrates the product.

Example:

### User

> Which BIS standard applies to LED lamps?

### Assistant

> The applicable standard is IS 16102 (Part 1):2012...

Then show:

`IS 16102 (Part 1):2012 • Clause 4`

`View Source →`

This is a visual product demonstration.

It should resemble the actual chat product.

Do not make the card excessively transparent.

---

# 12. GLASSMORPHISM

Glassmorphism must be **matte glass**, not glossy glass.

## Surface

Example:

```css
background: rgba(9, 20, 32, 0.72);
backdrop-filter: blur(18px);
-webkit-backdrop-filter: blur(18px);
```

## Border

```css
border: 1px solid rgba(160, 180, 200, 0.14);
```

## Shadow

Use a diffuse dark shadow:

```css
box-shadow:
  0 16px 40px rgba(0, 0, 0, 0.22);
```

No glow.

## Important

Glass surfaces should have:

- low contrast
- muted transparency
- soft depth
- no white highlight streaks

---

# 13. CTA BUTTONS

## Primary

Matte BIS red/orange.

Example:

`Ask BIS AI →`

Properties:

- 44–52px height
- 14–18px horizontal padding
- 10–14px radius
- semibold text
- subtle diffuse shadow

Hover:

- slightly lighter matte red
- 1px upward movement
- slightly stronger diffuse shadow

No glossy shine.

## Secondary

Dark transparent/matte surface.

Example:

`Explore capabilities`

Use subtle border.

---

# 14. TRUST INDICATORS

Below the CTA row:

- Official-source guided
- Multilingual support
- Citations included

Use small icons and muted text.

Do not make these look like large feature cards.

---

# 15. CAPABILITY SECTION

Section label:

`WHAT CAN BIS AI HELP YOU WITH?`

Use a four-card grid.

Cards:

1. Find Standards
2. Certification Guidance
3. Hallmarking & HUID
4. Testing Laboratories

## Card design

Each card should have:

- icon circle
- title
- short description
- arrow/action

Card height should be consistent.

Use matte dark surfaces.

Example:

```css
background: rgba(9, 20, 32, 0.66);
border: 1px solid rgba(140, 170, 200, 0.14);
```

Hover:

- border becomes slightly more visible
- card moves 1–2px upward
- icon gains slight contrast

No glowing card shadows.

---

# 16. HOW BIS AI WORKS

Use a horizontal process on desktop.

```text
You Ask
   →
We Understand
   →
Search BIS Knowledge
   →
AI Generates Answer
   →
Source & Verify
```

Each step should have:

- icon
- title
- short description

Use small matte icon circles.

On mobile, convert to a vertical timeline.

---

# 17. ABOUT SECTION

Use a wide matte glass panel.

Explain that BIS AI Assistant helps:

- manufacturers
- MSMEs
- startups
- consumers
- students
- industry professionals

Core capabilities:

- Indian Standards
- certification
- hallmarking
- laboratories
- technical queries
- multilingual interaction
- source-backed answers

---

# 18. FOOTER

Keep the footer minimal.

Include:

- BIS branding
- About BIS
- Contact
- Privacy
- Terms
- other project-relevant links

Use subdued typography.

---

# 19. CHAT WORKSPACE

Route:

```text
/chat
```

The chat should use familiar ChatGPT-like usability while maintaining the BIS matte visual system.

Do not copy ChatGPT branding.

## Desktop layout

```text
┌────────────────────────────────────────────────────┐
│ Chat Header                                        │
├───────────────┬────────────────────────────────────┤
│ Sidebar       │ Conversation                       │
│               │                                    │
│               │ Messages                           │
│               │                                    │
│               │                                    │
│               │ Input                              │
└───────────────┴────────────────────────────────────┘
```

---

# 20. CHAT SIDEBAR

Include:

### Brand

BIS AI Assistant

### New Chat

Primary sidebar action.

### Recent Chats

Examples:

- LED lamps standard
- ISI Mark certification
- Hallmarking process
- Verify HUID
- Testing labs

### Explore

- Standards
- Certification
- Hallmarking
- Laboratories

### Bottom

Settings

Sidebar should be compact.

Desktop width:

```text
240–280px
```

Do not make it dominate the screen.

---

# 21. CHAT HEADER

Include:

`BIS AI ASSISTANT`

Right:

- language
- theme
- profile if needed

Keep it minimal.

---

# 22. CHAT TYPOGRAPHY & SPACING

Use familiar AI-chat proportions.

Conversation reading width:

```text
720–900px
```

Do not stretch messages across the entire screen.

Use generous but controlled vertical rhythm.

Typical spacing:

```text
message → message: 24–36px
paragraph → paragraph: 12–18px
citation → citation content: 8–12px
section → section: 24–32px
```

---

# 23. CHAT INPUT

The input should be:

- matte
- comfortable
- compact
- clearly separated from the conversation

Include:

- text input
- attachment/tool control if supported
- send button

Quick actions may appear above/below the input:

- Find Standard
- Certification Process
- Hallmarking Guide
- Testing Labs

---

# 24. ASSISTANT RESPONSES

Support:

- paragraphs
- headings
- bullet lists
- numbered lists
- tables
- structured information
- citations

Avoid huge uninterrupted text blocks.

---

# 25. BIS STRUCTURED ANSWERS

When actual backend data supports it, answers may contain:

```text
Applicable Standard

IS 16102 (Part 1):2012

Title
...

Scheme
...

Status
...

Requirements
...

Source
IS 16102 (Part 1):2012 • Clause 4
```

Only show information actually returned by the backend.

Never fabricate standards, clauses, schemes, laboratories, or verification results.

---

# 26. CITATION SYSTEM

Citations are a core feature.

Example:

`IS 16102 (Part 1):2012 • Clause 4`

Citations should be:

- compact
- readable
- matte
- clearly clickable
- visually subordinate to the answer

Hover:

- slightly brighter border
- subtle background change

No glow.

Click:

→ open Source Viewer.

---

# 27. SOURCE VIEWER

Desktop:

Right-side inspector drawer.

Mobile:

Full-screen/near-full-screen drawer.

Display available source data:

- Standard ID
- title
- document
- clause
- section
- source text
- metadata

The Source Viewer is the bridge between:

**AI answer → evidence**

It should feel like a professional document inspector.

---

# 28. RESPONSIVE DESIGN

Test at:

```text
1440px
1280px
1024px
768px
480px
390px
```

## Desktop

- two-column hero
- four capability cards
- sidebar + chat

## Tablet

- reduced hero typography
- reduced spacing
- adaptable card grid

## Mobile

- single-column hero
- image below text
- capability cards stacked
- sidebar becomes drawer
- source viewer becomes full-screen drawer
- chat becomes full width

Never allow horizontal overflow.

---

# 29. MICRO-INTERACTIONS

Use subtle interactions only.

Allowed:

- button hover
- card hover
- nav active state
- citation hover
- drawer transition
- input focus
- quick-action hover

Duration:

```text
150–250ms
```

Movement:

```text
1–2px maximum
```

No bouncing.

No large scaling.

No glowing transitions.

---

# 30. ACCESSIBILITY

Use:

- semantic HTML
- keyboard navigation
- visible focus states
- accessible buttons
- ARIA labels where appropriate
- accessible drawers/dialogs
- adequate contrast

Do not communicate meaning through color alone.

---

# 31. IMAGE GUIDELINES

Use actual project image assets when available.

For the lamp/document hero asset:

- preserve its recognizable form
- integrate it into the dark environment
- maintain realistic proportions
- use soft matte lighting
- avoid oversharpening
- avoid exaggerated glow

The image should support the interface rather than overpower it.

---

# 32. DO NOT CHANGE THESE THINGS

An implementation agent must NOT:

1. Change the overall dark matte aesthetic.
2. Turn the palette into purple/blue AI gradients.
3. Make buttons glossy.
4. Add neon glow.
5. Add excessive reflections.
6. Turn glass surfaces into shiny chrome.
7. Add random 3D objects.
8. Add the original lamp website's branding.
9. Replace the hero composition with a generic SaaS hero.
10. Remove the lamp/document storytelling concept.
11. Stretch content edge-to-edge.
12. Make the hero typography excessively large.
13. Add excessive animation.
14. Replace the BIS identity with generic AI branding.
15. Invent backend data.
16. Invent citations or standards.

---

# 33. IMPLEMENTATION PRINCIPLES

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide icons

Prefer CSS variables/design tokens for global colors.

Prefer reusable components.

Keep layout logic separate from API logic.

Do not create one enormous component.

Do not use arbitrary CSS hacks to fix spacing.

Establish a consistent container and spacing system first.

---

# 34. QUALITY CHECKLIST

Before considering the design complete, verify:

### Visual

- [ ] Background is dark matte.
- [ ] Colors are matte rather than glossy.
- [ ] No neon glow exists.
- [ ] No excessive gradients exist.
- [ ] Glass surfaces look like smoked/matte glass.
- [ ] Hero composition matches the reference.
- [ ] Lamp/document visual is integrated naturally.
- [ ] BIS branding is respected.
- [ ] Capability cards align correctly.

### Layout

- [ ] Header does not overlap hero.
- [ ] All major sections share the same container.
- [ ] Hero has balanced left/right composition.
- [ ] Typography hierarchy is controlled.
- [ ] Cards have consistent dimensions.
- [ ] Chat sidebar has intentional width.
- [ ] Chat messages have comfortable reading width.
- [ ] No horizontal overflow.

### Interaction

- [ ] Hover states are subtle.
- [ ] Focus states are visible.
- [ ] Citations are clickable.
- [ ] Source Viewer has clear open/close behavior.
- [ ] Responsive navigation works.

### Matte finish

- [ ] No glossy button gradients.
- [ ] No chrome effect.
- [ ] No strong specular highlights.
- [ ] No neon bloom.
- [ ] No excessive glass reflections.
- [ ] Shadows are diffuse and restrained.

---

# 35. FINAL DESIGN PRINCIPLE

The final product should look like:

> **A serious BIS knowledge product with the usability of a modern AI assistant.**

The visual hierarchy should always prioritize:

```text
BIS TRUST
    ↓
USER QUESTION
    ↓
AI ANSWER
    ↓
SOURCE / CLAUSE
```

The design should feel sophisticated because of:

- proportion
- typography
- spacing
- matte surfaces
- restrained color
- composition

—not because of excessive effects.

**MATTE > GLOSS**

**CLARITY > DECORATION**

**TRUST > FLASHINESS**

**EVIDENCE > AI HYPE**
