# NavAIgator Configuration Guide

## Quick Configuration Reference

### Backend API Endpoint

**Location:** Various component files  
**Current Value:** `https://navaigator.onrender.com`

To change the API endpoint:

1. Open `/components/route-optimizer.tsx`
2. Find: `const API_BASE = 'https://navaigator.onrender.com'`
3. Replace with your endpoint URL

Also update in `/components/simulation-comparison.tsx` if needed.

---

## Color Customization

### Edit Theme Colors

**File:** `/app/globals.css`

#### Light Mode Palette

\`\`\`css
:root {
  /* Primary Colors */
  --primary: oklch(0.35 0.14 250);           /* Deep blue */
  --primary-foreground: oklch(0.99 0 0);     /* White text */
  
  /* Accent Colors */
  --accent: oklch(0.65 0.18 45);             /* Ocean gold */
  --accent-foreground: oklch(0.12 0 0);      /* Dark text */
  
  /* Backgrounds */
  --background: oklch(0.98 0 0);             /* Near white */
  --card: oklch(0.99 0 0);                   /* Pure white */
  
  /* Text & Borders */
  --foreground: oklch(0.12 0 0);             /* Nearly black */
  --muted-foreground: oklch(0.45 0 0);       /* Gray text */
  --border: oklch(0.88 0 0);                 /* Light border */
}
\`\`\`

#### Dark Mode Palette

\`\`\`css
.dark {
  /* Primary Colors */
  --primary: oklch(0.52 0.16 265);           /* Bright blue */
  --primary-foreground: oklch(0.99 0 0);     /* White text */
  
  /* Accent Colors */
  --accent: oklch(0.65 0.18 45);             /* Gold accent */
  --accent-foreground: oklch(0.08 0 0);      /* Dark background */
  
  /* Backgrounds */
  --background: oklch(0.08 0 0);             /* Deep navy */
  --card: oklch(0.12 0 0);                   /* Navy card */
  
  /* Text */
  --foreground: oklch(0.97 0 0);             /* Near white */
  --muted-foreground: oklch(0.65 0 0);       /* Gray text */
  --border: oklch(0.2 0 0);                  /* Dark border */
}
\`\`\`

### Using OKLch Color Format

The colors use OKLch format: `oklch(lightness chroma hue)`

- **Lightness**: 0-1 (0=black, 1=white)
- **Chroma**: 0-0.3+ (0=gray, higher=more saturated)
- **Hue**: 0-360 (color angle)

Common hues:
- 45°: Orange/Gold
- 250°: Blue
- 200°: Cyan
- 160°: Teal

---

## Typography Customization

### Change Font Family

**File:** `/app/globals.css`

\`\`\`css
@theme inline {
  --font-sans: 'YourFont', 'YourFont Fallback';
  --font-mono: 'YourMonoFont', 'YourMonoFont Fallback';
}
\`\`\`

**File:** `/app/layout.tsx`

\`\`\`typescript
import { YourFont, YourMono } from 'next/font/google'

const _font = YourFont({ subsets: ["latin"] });
const _monoFont = YourMono({ subsets: ["latin"] });
\`\`\`

---

## Component Customization

### Hero Section Text

**File:** `/app/page.tsx`

\`\`\`typescript
// Line ~45-47
<h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
  Optimize Your<br />
  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
    Maritime Routes  {/* Change this text */}
  </span>
</h1>

// Line ~51
<p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
  {/* Change this description */}
</p>
\`\`\`

### Feature Cards

**File:** `/app/page.tsx`

\`\`\`typescript
// Line ~60-75
{[
  {
    title: 'Feature Title',
    description: 'Feature description',
    icon: '🧬',
  },
  // Add more features here
]}
\`\`\`

### Navigation Links

**File:** `/components/header.tsx`

Add links to the header navigation by extending the header component.

---

## API Configuration

### Ports Configuration

Ports are fetched from backend: `GET /ports`

To add or remove supported ports, update your backend's port list.

Frontend automatically displays all returned ports in dropdowns.

### Ship Types Configuration

Ship types are fetched from: `GET /ship-types`

Backend response format:
\`\`\`json
{
  "Cargo": {
    "ship_type": "Cargo",
    "fuel_efficiency": 0.8,
    "max_speed": 20.0,
    "cargo_capacity": 5000.0
  }
}
\`\`\`

---

## Map Customization

### Leaflet Map Tiles

**File:** `/components/leaflet-map.tsx`

\`\`\`typescript
// Line ~25
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19,
}).addTo(map.current)
\`\`\`

Alternative tile providers:

\`\`\`typescript
// Satellite
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}')

// Dark theme
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png')

// Light theme
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png')
\`\`\`

### Marker Customization

Edit marker colors in `/components/leaflet-map.tsx`:

\`\`\`typescript
const color = 'green' // Can be: 'red', 'blue', 'green', etc.
const icon = '▶'      // Change icon symbols
\`\`\`

---

## Chart Customization

### Chart Colors

**File:** `/components/risk-analysis-dashboard.tsx` and others

\`\`\`typescript
<Bar dataKey="weather" fill="#fbbf24" name="Weather Risk %" />
<Bar dataKey="piracy" fill="#ef4444" name="Piracy Risk %" />
<Bar dataKey="traffic" fill="#8b5cf6" name="Traffic Risk %" />
\`\`\`

Tailwind color codes:
- `#fbbf24` - Amber/Gold
- `#ef4444` - Red
- `#8b5cf6` - Purple
- `#3b82f6` - Blue
- `#10b981` - Green

### Chart Dimensions

Adjust chart heights by changing `height` props:

\`\`\`typescript
<ResponsiveContainer width="100%" height={300}>  {/* Change 300 */}
\`\`\`

---

## Responsive Design Breakpoints

**File:** `/app/globals.css` and component classes

Current breakpoints (Tailwind):
- `md:` - 768px (tablets)
- `lg:` - 1024px (desktops)
- `xl:` - 1280px (large desktops)

Change layout for different devices:

\`\`\`typescript
// Mobile: 1 column
// Tablet: 2 columns
// Desktop: 3 columns
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
\`\`\`

---

## Theme Toggle

### Modify Theme Detection

**File:** `/components/header.tsx`

\`\`\`typescript
const { theme, setTheme } = useTheme()

// Current: Toggle on button click
// Modify setTheme() logic as needed
\`\`\`

### Disable Theme Toggle

Remove the theme button from header:

\`\`\`typescript
// Delete or comment out the Button component
// in /components/header.tsx (lines ~26-32)
\`\`\`

---

## Loading States & Animations

### Update Loading Text

**File:** `/components/route-optimizer.tsx`

\`\`\`typescript
<p className="text-muted-foreground">Optimizing route...</p>  {/* Change text */}
\`\`\`

### Modify Animation Speed

**File:** `/app/globals.css`

\`\`\`css
/* Currently uses Tailwind animate-spin */
<Loader2 className="w-8 h-8 animate-spin text-primary" />

/* To slow down, add in globals.css: */
@layer utilities {
  .animate-spin-slow {
    animation: spin 3s linear infinite;
  }
}
\`\`\`

---

## Footer Content

**File:** `/components/footer.tsx`

Update footer information:
- Company name and description
- Feature links
- Social media URLs
- Copyright year

---

## SEO Configuration

### Page Title & Description

**File:** `/app/layout.tsx`

\`\`\`typescript
export const metadata: Metadata = {
  title: 'NavAIgator - Intelligence That Knows the Way',
  description: 'AI-powered maritime route optimization...',
}
\`\`\`

### Open Graph Tags

Add to layout.tsx metadata:

\`\`\`typescript
openGraph: {
  title: 'NavAIgator',
  description: 'Maritime route optimization',
  images: [{ url: '/og-image.jpg' }],
},
\`\`\`

---

## Performance Tuning

### Disable Analytics

**File:** `/app/layout.tsx`

Remove or comment out:
\`\`\`typescript
import { Analytics } from '@vercel/analytics/next'
// ...
<Analytics />
\`\`\`

### Image Optimization

All background images in `/public/images/` are automatically optimized by Next.js.

To add new images:
1. Place in `/public/images/`
2. Reference with `<Image>` component
3. Specify width/height for optimization

---

## Debugging

### Enable Console Logging

Components already include debug logs prefixed with `[v0]`:

\`\`\`typescript
console.log("[v0] Route optimization complete:", data)
\`\`\`

View in browser DevTools → Console tab

### API Debug

View API calls in DevTools → Network tab:
- Check request/response payloads
- Monitor response times
- Verify CORS headers

---

## Common Customizations Checklist

- [ ] Update API endpoint URL
- [ ] Change theme colors in globals.css
- [ ] Update hero section text and imagery
- [ ] Modify feature cards and descriptions
- [ ] Configure supported ports in backend
- [ ] Adjust chart colors and dimensions
- [ ] Update footer links and information
- [ ] Change app title and metadata
- [ ] Configure SEO settings
- [ ] Test on mobile devices
- [ ] Update analytics tracking
- [ ] Set up error monitoring

---

## Need Help?

1. Check `/README.md` for documentation
2. Review `/PROJECT_SUMMARY.md` for feature overview
3. See `/DEPLOYMENT.md` for deployment help
4. Check browser console for error messages
5. Inspect network tab for API issues

---

**NavAIgator Configuration**  
*Intelligence That Knows the Way*
