---
name: Academy Elite
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3e484c'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6e797d'
  outline-variant: '#bec8cc'
  surface-tint: '#00677c'
  primary: '#005f72'
  on-primary: '#ffffff'
  primary-container: '#007991'
  on-primary-container: '#e0f6ff'
  inverse-primary: '#7bd3ed'
  secondary: '#914c00'
  on-secondary: '#ffffff'
  secondary-container: '#fc9433'
  on-secondary-container: '#673400'
  tertiary: '#005e72'
  on-tertiary: '#ffffff'
  tertiary-container: '#2c778c'
  on-tertiary-container: '#dff6ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b1ebff'
  primary-fixed-dim: '#7bd3ed'
  on-primary-fixed: '#001f27'
  on-primary-fixed-variant: '#004e5e'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77f'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#b2ebff'
  tertiary-fixed-dim: '#8bd1e8'
  on-tertiary-fixed: '#001f27'
  on-tertiary-fixed-variant: '#004e5f'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  teal-light: '#E6F4F6'
  orange-dark: '#E67E22'
  orange-light: '#FFF3E6'
  border-subtle: '#E2E8F0'
  text-primary: '#1F2937'
  text-secondary: '#475569'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is engineered for a premium Learning Management System (LMS) that balances educational authority with modern accessibility. It targets a multi-faceted user base—Students, Parents, Trainers, and Admins—requiring a UI that feels both rigorous and encouraging.

The aesthetic follows a **Corporate / Modern** movement, emphasizing high-quality white space, precise typography, and a refined tactile feel. By utilizing a "Structure vs. Action" color strategy, the interface guides users through complex learning paths without cognitive overload. The visual narrative is built on the pillars of clarity, reliability, and academic progress.

## Colors

This design system utilizes a strategic split-complementary palette to distinguish between infrastructure and interaction.

- **Primary Teal (#007991):** Represents the "Loom of Learning." Use this for the sidebar, navigation headers, progress bars, and structural iconography. It anchors the user in the environment.
- **Primary Orange (#FF9635):** The "Spark of Action." Reserved exclusively for high-intent CTAs such as "Start Course," "Submit Assignment," and "Enroll." 
- **The Neutral Foundation:** Backgrounds use a cool-toned slate (#F8FAFC) to reduce eye strain during long study sessions, while pure white (#FFFFFF) is reserved for interactive cards and surfaces.

## Typography

The system relies on **Inter** to deliver a neutral, highly legible experience across all technical and academic content. 

- **Weight Strategy:** Use `600` (Semi-bold) for section headers and card titles to create a strong visual hierarchy. Use `400` (Regular) for long-form course content to maximize readability.
- **Scale:** The type scale is generous, ensuring that even complex data tables (Admin view) or grade reports (Parent view) remain scannable.
- **Labels:** Small labels (e.g., "Course Category" or "Due Date") should use `label-sm` with a slight letter spacing increase to maintain clarity at small sizes.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **The 4px Rhythm:** All padding, margins, and component heights must be multiples of 4px. This ensures a mathematical harmony across the dashboard.
- **Container Strategy:** Content is housed in "Surfaces" (cards) with `24px` (lg) internal padding for desktop, scaling down to `16px` (md) for mobile.
- **Vertical Rhythm:** Group related items (like a lesson title and its description) with `8px` (sm) spacing; group unrelated sections (like Course Content and Instructor Bio) with `48px` (2xl) spacing.

## Elevation & Depth

This design system uses **Tonal Layers** combined with **Ambient Shadows** to create a focused, premium feel.

- **Level 0 (Background):** #F8FAFC. The base layer for the entire application.
- **Level 1 (Cards/Surfaces):** #FFFFFF with a subtle border (#E2E8F0) and a soft, diffused shadow (`0px 4px 6px -1px rgba(0, 0, 0, 0.05)`). This is the default state for course tiles and modules.
- **Level 2 (Hover/Active):** When a user interacts with a card, the shadow should deepen slightly to indicate lift, using a more pronounced but still soft shadow (`0px 10px 15px -3px rgba(0, 0, 0, 0.08)`).
- **Depth via Color:** Use `Light Teal` or `Light Orange` as non-elevated background tints for secondary information containers (e.g., "Note" boxes or "Quick Tips").

## Shapes

The shape language is purposefully **Rounded**, moving away from "sharp" corporate aesthetics to feel more welcoming and approachable for students.

- **Standard Elements (8px):** Used for input fields, small buttons, and tags.
- **Feature Elements (12px - 16px):** Used for primary course cards, modals, and profile avatars.
- **Large Containers (20px):** Used for main dashboard containers or celebratory "Course Completed" banners.
- **Selection Indicators:** Checkboxes and radio buttons should maintain a `4px` radius to align with the overall system logic.

## Components

### Buttons
- **Primary Action:** Solid Orange (#FF9635) with White text. Used for the main path of progression.
- **Secondary Structural:** Solid Teal (#007991) with White text. Used for navigation and dashboard utilities.
- **Ghost/Outline:** Teal border with Teal text. Used for "Cancel" or "View Details."

### Cards
- Surfaces must have a 1px border (#E2E8F0).
- Course cards include a top-aligned image, a 16px-padded content area, and a bottom-aligned progress bar in Teal.

### Form Inputs
- **Default State:** White background, 1px Gray-200 border, 8px corner radius.
- **Focus State:** 1px Teal border with a 3px Teal-light outer glow (halo).

### Progress Indicators
- Use a thick (8px height) bar for course progress. Background is `Teal-light`, and the fill is `Primary Teal`.

### Role-Specific Badges
- **Student:** Light Teal background, Dark Teal text.
- **Trainer:** Light Orange background, Dark Orange text.
- **Admin/Parent:** Neutral Slate backgrounds to denote oversight/management roles.

### Lists
- Use "Inset Lists" for lesson curricula. Each item has a hover state that tints the background `Teal-light` and changes the icon color to `Primary Teal`.