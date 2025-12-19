# Design Guidelines: Community Discovery Platform

## Design Approach

**Selected Approach:** Reference-Based Design  
**Primary References:** Airbnb (discovery & cards), Meetup (community profiles), LinkedIn (professional trust), Notion (dashboard clarity)

**Design Philosophy:** Create an approachable, vibrant platform that celebrates India's diverse communities while maintaining professional credibility. The design should feel welcoming to both community organizers and members, with clear navigation and engaging visual hierarchy.

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary Brand: 261 85% 55% (Vibrant Purple - trust & community)
- Primary Hover: 261 85% 48%
- Secondary: 347 87% 54% (Coral - energy & warmth)
- Accent: 171 77% 48% (Teal - growth & connection)
- Background: 0 0% 100%
- Surface: 240 5% 96%
- Border: 240 6% 90%
- Text Primary: 240 10% 10%
- Text Secondary: 240 5% 45%

**Dark Mode:**
- Primary Brand: 261 70% 60%
- Primary Hover: 261 70% 65%
- Secondary: 347 80% 58%
- Accent: 171 70% 52%
- Background: 240 10% 8%
- Surface: 240 8% 12%
- Border: 240 6% 20%
- Text Primary: 0 0% 95%
- Text Secondary: 240 5% 65%

### B. Typography

**Font Families:**
- Headings: "Inter" (700, 600, 500) - Modern, clean, professional
- Body: "Inter" (400, 500) - Excellent readability
- Accent/Display: "Cal Sans" or "Cabinet Grotesk" for hero headlines

**Scale:**
- Hero: text-5xl to text-7xl (font-bold)
- H1: text-4xl (font-bold)
- H2: text-3xl (font-semibold)
- H3: text-2xl (font-semibold)
- H4: text-xl (font-medium)
- Body Large: text-lg
- Body: text-base
- Small: text-sm
- Caption: text-xs

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24, 32  
**Common Patterns:**
- Section padding: py-16 md:py-24 lg:py-32
- Card padding: p-6 md:p-8
- Component gaps: gap-4, gap-6, gap-8
- Container: max-w-7xl mx-auto px-4 md:px-6 lg:px-8

**Grid System:**
- Featured communities: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Events: grid-cols-1 lg:grid-cols-2
- Stats/metrics: grid-cols-2 lg:grid-cols-4
- Dashboard: Sidebar (64-72 width) + Main content area

### D. Component Library

**Navigation:**
- Sticky header with logo, main nav links, search icon, and auth CTAs
- Mobile: Hamburger menu with slide-in drawer
- Breadcrumbs for deep navigation (Zone → State → City)

**Hero Section:**
- Large impactful image showcasing diverse Indian communities
- Centered headline + tagline
- Prominent search bar with autocomplete (Zone/State/City/Domain)
- Trust indicators below (e.g., "5000+ Communities • 200+ Cities • 50,000+ Members")

**Cards:**
- Community cards: Image (aspect-video), title, location badge, domain tag, member count, hover scale (1.02)
- Event cards: Date badge (positioned absolute top-left), title, location, time, RSVP count
- Rounded corners: rounded-xl for cards, rounded-lg for smaller elements
- Shadow: shadow-sm with hover:shadow-lg transition

**Filters & Search:**
- Horizontal filter tabs (Zone, Domain) with pill-style active states
- Dropdown cascading filters (Zone → State → City)
- Toggle for map/list view (icons: grid/map)
- Search with icon, clear button, and loading states

**Buttons:**
- Primary: bg-primary with white text, rounded-lg, px-6 py-3
- Secondary: border-2 border-primary text-primary, same padding
- On images: backdrop-blur-md bg-white/20 border-white/40
- Icon buttons: rounded-full p-2 hover:bg-surface

**Forms:**
- Inputs: border-2 rounded-lg px-4 py-3 focus:border-primary
- Labels: text-sm font-medium mb-2
- Validation: Red for errors, green for success with inline icons

**Dashboards:**
- Sidebar navigation: Vertical list with icons, active states with primary background
- Stats cards: Grid layout with icon, number (large), label (small), trend indicator
- Tables: Striped rows, hover states, sortable headers, pagination

### E. Page-Specific Layouts

**Homepage:**
- Hero with large background image (Indian communities gathering)
- Search bar overlaid on hero
- Featured communities (3-column grid)
- Browse by Domain (4-6 category cards with icons)
- Trending events (carousel or 2-column grid)
- Statistics section (4-column)
- CTA section for organizers (split layout: text + image)

**Explore Communities:**
- Sticky filter bar at top
- Breadcrumb navigation
- Results count and view toggle
- Map view: 60% map + 40% sidebar with scrollable cards
- List view: 3-column grid with pagination

**Community Profile:**
- Cover image banner
- Profile section: Logo/avatar, name, location, domain tags, member count
- Tabs: About, Events, POCs, Reviews
- Sidebar: Social links, contact CTA, quick stats
- Reviews: 2-column grid with ratings, avatars, timestamps

**Dashboards:**
- Left sidebar (240px) with navigation
- Top bar: User profile, notifications, search
- Main content: Cards for quick actions, tables for data, charts for analytics
- Responsive: Sidebar collapses to hamburger on mobile

### F. Visual Enhancements

**Images:**
- Hero: Large, vibrant image of diverse communities (1920x800px)
- Community cards: Aspect-video thumbnails
- Profile covers: Wide banners (1200x300px)
- Placeholder: Gradient backgrounds with community initials when no image

**Icons:**
- Use Heroicons via CDN
- Consistent 20px/24px sizing
- Stroke-width: 1.5 for line icons

**Micro-interactions:**
- Card hover: translate-y-[-4px] + shadow increase
- Button hover: slight scale or brightness change
- Loading states: Skeleton screens with shimmer effect
- Smooth transitions: transition-all duration-200 ease-in-out

**Animations:** Minimal - fade-in on scroll for sections, smooth hover transitions only

---

## Key Design Principles

1. **Trust & Credibility:** Professional aesthetic with user testimonials, verification badges
2. **Discoverability:** Prominent search, clear filtering, map integration
3. **Community-First:** Vibrant colors celebrating diversity, human-centric imagery
4. **Mobile-Responsive:** Touch-friendly targets (min 44px), readable text (min 16px)
5. **Consistency:** Unified spacing, color usage, and component patterns across all pages