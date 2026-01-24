# NavAIgator - Quick Start Guide

## 5-Minute Setup

### 1. Install & Run
\`\`\`bash
npm install
npm run dev
\`\`\`

Open: `http://localhost:3000`

### 2. Navigate the App

| Path | Purpose |
|------|---------|
| `/` | Landing page & hero |
| `/about` | About & features |
| `/optimizer` | Main dashboard (accessed via button) |

### 3. Use Route Optimizer

1. **Click "Start Optimizing"** on home page
2. **Configure Route:**
   - Select start port (e.g., Chennai)
   - Select end port (e.g., Mumbai)
   - Choose ship type
3. **Set Priorities:**
   - Time: Move slider left
   - Cost: Move slider middle
   - Safety: Move slider right
4. **Click "Optimize Route"**
5. **View Results:**
   - Route Map - See the optimized path
   - Risk Analysis - Check hazards
   - Comparison - Compare alternatives
   - Summary - Export data

---

## Key Files to Know

### Pages
- `app/page.tsx` - Home page
- `app/about/page.tsx` - About page
- `app/layout.tsx` - Root layout

### Components
- `components/header.tsx` - Navigation + theme toggle
- `components/route-optimizer.tsx` - Main dashboard
- `components/route-config.tsx` - Settings panel
- `components/map-visualization.tsx` - Map display
- `components/risk-analysis-dashboard.tsx` - Charts
- `components/simulation-comparison.tsx` - Testing

### Styling
- `app/globals.css` - Colors, fonts, themes

---

## Common Tasks

### Change API Endpoint

**File:** `components/route-optimizer.tsx` (Line ~21)
\`\`\`typescript
const API_BASE = 'https://your-backend-url.com'
\`\`\`

### Change App Colors

**File:** `app/globals.css` (Lines ~7-30)
\`\`\`css
:root {
  --primary: oklch(0.35 0.14 250);    /* Change blue */
  --accent: oklch(0.65 0.18 45);      /* Change gold */
}
\`\`\`

### Add/Remove Ports

Ports are fetched from backend `GET /ports` endpoint.
Update backend to add new ports - frontend auto-updates.

### Change Hero Text

**File:** `app/page.tsx` (Lines ~45-50)
\`\`\`typescript
<h1>Your New Title Here</h1>
<p>Your description here</p>
\`\`\`

### Export Data

Click "Export Summary as JSON" in the Summary tab.
File downloads as `route-summary-[timestamp].json`

---

## Troubleshooting

### "Cannot connect to backend"
- Check backend is running
- Verify API_BASE URL is correct
- Check CORS settings

### "Maps not loading"
- Clear browser cache
- Check Leaflet CSS is imported
- Verify network connection

### "Theme toggle not working"
- Clear localStorage
- Check next-themes is installed
- Verify browser JavaScript enabled

### "Build fails"
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
npm run build
\`\`\`

---

## What Each Tab Shows

### Route Map
- Blue line = your route
- Green circle = start port
- Blue circles = waypoints
- Red circle = end port
- Yellow zones = weather risk
- Red zones = piracy risk

### Risk Analysis
- Bar chart = risk by location
- Line chart = optimization progress
- Radar chart = performance metrics
- Progress bars = total risk

### Comparison
- Alternative routes comparison
- Simulation scenario testing
- Weather impact analysis
- Cost adjustments

### Summary
- Route overview
- Key metrics (distance, time, cost)
- All waypoints with coordinates
- Risk scores for each port
- JSON export button

---

## API Reference Quick Look

### Your Backend Must Provide:

\`\`\`
GET /ports
→ [{name, latitude, longitude, weather_risk, piracy_risk, maritime_traffic}]

GET /ship-types  
→ {Cargo: {ship_type, fuel_efficiency, max_speed, cargo_capacity}, ...}

POST /optimize
← {optimized_route, generation_data, fitness, total_distance, weather_data, piracy_data, alternative_routes}

POST /simulate
← {comparison_data, updated_weather, updated_piracy}
\`\`\`

---

## Deployment Checklist

Before going to production:

- [ ] Update API endpoint URL
- [ ] Test all features with real backend
- [ ] Check day/night modes work
- [ ] Test on mobile devices
- [ ] Update social media links in footer
- [ ] Update copyright year
- [ ] Run `npm run build` successfully
- [ ] Deploy to Vercel or your server
- [ ] Test in production
- [ ] Set up monitoring/analytics

---

## Feature Overview

| Feature | How to Access |
|---------|---------------|
| Route Optimization | Click "Start Optimizing" |
| Change Theme | Sun/Moon icon in header |
| View Risk Analysis | Route Map → Risk Analysis tab |
| Compare Routes | Risk Analysis → Comparison tab |
| Run Simulation | Comparison tab → Run Simulation |
| Export Data | Summary tab → Export button |
| Learn More | Footer → About page |

---

## Performance Tips

✅ **Do:**
- Use modern browser (Chrome, Firefox, Safari, Edge)
- Test on broadband connection initially
- Let optimization complete fully
- Check browser console for errors

❌ **Don't:**
- Change API endpoint mid-optimization
- Close browser during route optimization
- Use very old browsers
- Disable JavaScript

---

## Directory Commands

\`\`\`bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Check code quality

# Monitoring
npm run build -- --debug    # Build with debug info
\`\`\`

---

## Next Steps

1. ✅ **Setup Complete** - App is running
2. **Test It** - Try optimizing a route
3. **Customize** - Update colors, text, API endpoint
4. **Deploy** - Push to production
5. **Monitor** - Track usage and errors

---

## Documentation Files

- **README.md** - Full documentation
- **DEPLOYMENT.md** - Deployment guide
- **CONFIG.md** - Customization reference
- **FEATURES.md** - All features list
- **PROJECT_SUMMARY.md** - Complete overview
- **QUICK_START.md** - This file

---

## Get Help

1. Check the relevant doc file above
2. Look in browser console for errors
3. Check network tab for API issues
4. Review code comments
5. Check component structure

---

## Emergency Fixes

### If everything breaks:
\`\`\`bash
# Reset everything
rm -rf node_modules package-lock.json .next
npm install
npm run dev
\`\`\`

### If build fails:
\`\`\`bash
npm run build -- --debug
# Check error output
\`\`\`

### If backend won't connect:
\`\`\`javascript
// In console, test:
fetch('https://navaigator.onrender.com/ports')
  .then(r => r.json())
  .then(d => console.log(d))
\`\`\`

---

## Support Resources

- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev
- Tailwind Docs: https://tailwindcss.com
- Recharts Docs: https://recharts.org
- Leaflet Docs: https://leafletjs.com

---

**You're all set! Happy optimizing! 🚢**

NavAIgator - *Intelligence That Knows the Way*
