---
name: Red Earth Expedition
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#5d3f3c'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#926f6b'
  outline-variant: '#e7bdb8'
  surface-tint: '#c00014'
  primary: '#ba0013'
  on-primary: '#ffffff'
  primary-container: '#e31e24'
  on-primary-container: '#fffafa'
  inverse-primary: '#ffb4ab'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#5a5c5c'
  on-tertiary: '#ffffff'
  tertiary-container: '#737474'
  on-tertiary-container: '#fbfbfb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000d'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  h1:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  h2:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  h3:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  button:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '700'
    lineHeight: '1.0'
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  section-gap: 80px
---

## Brand & Style
The brand personality is adventurous, rugged, and high-energy, designed to evoke the raw beauty of Madagascar's landscape and the thrill of exploration. The target audience includes eco-tourists, adventure seekers, and luxury travelers looking for professional, reliable guidance in untamed environments.

The design system employs a **High-Contrast / Bold** style influenced by modern editorial layouts. It utilizes aggressive color blocking, heavy borders, and precise structural alignment to convey confidence and expertise. The UI is characterized by sharp contrasts between deep blacks and vibrant reds, creating a "stop-and-look" aesthetic that reflects the urgency and excitement of travel.

## Colors
The palette is dominated by **Vibrant Red (#E31E24)**, used as the primary catalyst for action and brand recognition. This is paired with **Deep Black (#111111)** to provide a professional, grounded foundation that ensures high legibility and a premium feel.

- **Primary (Vibrant Red):** Used for the global header background, primary buttons, borders, icons, and all heading levels.
- **Secondary (Deep Black):** Used for navigation text (on white), body copy, and dark-themed section backgrounds.
- **Neutral:** A range of whites and off-whites for surface backgrounds to allow the red and black elements to pop without visual fatigue.

## Typography
The typography system balances the raw energy of **Montserrat** for headings with the systematic clarity of **Inter** for body text. 

- **Headings:** All H1 and H2 levels are rendered in Montserrat Bold/ExtraBold. They should appear in Vibrant Red on light backgrounds and White on the red header or dark sections.
- **Body:** Inter provides maximum readability for itinerary descriptions and travel details. 
- **Capitalization:** Use uppercase for labels, buttons, and H1/H2 titles to reinforce the rugged, impactful tone of the brand.

## Layout & Spacing
This design system uses a **Fixed Grid** model for desktop and a **Fluid** model for mobile. 

- **Desktop:** A 12-column grid with a 1280px max-width. Columns are separated by 24px gutters.
- **Mobile:** A 4-column fluid grid with 16px side margins. 
- **Rhythm:** Spacing follows an 8px baseline. Use larger 80px gaps between major sections to maintain a clean, professional "editorial" feel.
- **Reflow:** On mobile, side-by-side card layouts (e.g., tour packages) should stack vertically to maintain image impact and legibility.

## Elevation & Depth
In line with the rugged and high-contrast aesthetic, this design system avoids soft shadows and glassmorphism. Depth is achieved through **Bold Borders** and **Tonal Layering**.

- **Borders:** Use 2px solid Vibrant Red borders for cards, input fields, and active states. This creates a "blueprint" or "map" feel.
- **Stacking:** Surface levels are flat. Distinction between elements is created by alternating background colors (e.g., a white section followed by a light gray or black section).
- **Overlays:** Images should use a subtle 20% black tint to ensure white typography remains readable when placed directly over photographs of landscapes.

## Shapes
To emphasize a "rugged" and "technical" adventure feel, the design system utilizes **Sharp (0px)** corners for all UI elements. 

Every button, input field, card, and badge must have 90-degree angles. This geometric rigidity conveys precision and professional reliability, contrasting with the organic and chaotic nature of the wild landscapes being promoted.

## Components
- **Header:** Background is solid Vibrant Red (#E31E24). All navigation links and logos are White. 
- **Buttons:** Primary buttons are solid Red with White text and sharp corners. Hover state should darken the red slightly (#C62828).
- **Cards:** White background with a 2px solid Red border. Tour titles inside cards are Red.
- **Badges/Chips:** Used for "Adventure Level" or "Availability." Solid Red background with White uppercase text.
- **Input Fields:** 2px solid Red border with sharp corners. Labels should be Montserrat Bold in Black.
- **Icons:** All functional icons (arrows, social media, contact) must be rendered in Red.
- **Lists:** Use Red square bullets or Red chevron icons for list items to maintain brand consistency.
- **Navigation:** Modern, high-contrast bar. Active links should be underlined with a 3px Red stroke.