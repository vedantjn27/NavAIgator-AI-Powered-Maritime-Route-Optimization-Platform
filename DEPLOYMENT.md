# NavAIgator Deployment Guide

## Quick Start

### Development Environment

1. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

2. **Run development server:**
\`\`\`bash
npm run dev
\`\`\`

The app will be available at `http://localhost:3000`

### Environment Variables

The frontend connects to the backend API at: `https://navaigator.onrender.com`

If you need to change the API endpoint, update the `API_BASE` constant in:
- `/components/route-optimizer.tsx`
- `/components/simulation-comparison.tsx`

### Build and Deploy

1. **Build for production:**
\`\`\`bash
npm run build
\`\`\`

2. **Start production server:**
\`\`\`bash
npm start
\`\`\`

3. **Deploy to Vercel (recommended):**
\`\`\`bash
vercel deploy
\`\`\`

## Frontend Features

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Performance Optimizations
- Image optimization via Next.js Image component
- Dynamic imports for heavy components (Leaflet maps)
- CSS-in-JS with Tailwind for minimal bundle size
- Lazy loading of route data

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Customization

### Colors and Theme

Edit `/app/globals.css` to customize the color palette:

\`\`\`css
:root {
  --primary: oklch(0.35 0.14 250);      /* Primary blue */
  --accent: oklch(0.65 0.18 45);        /* Orange accent */
  --background: oklch(0.98 0 0);        /* Light background */
}

.dark {
  --primary: oklch(0.52 0.16 265);      /* Dark mode primary */
  --background: oklch(0.08 0 0);        /* Dark background */
}
\`\`\`

### Ports Configuration

To add or modify supported ports, update the backend's port list. The frontend fetches ports dynamically from the `/ports` endpoint.

### Ship Types

Ship types are fetched from the `/ship-types` endpoint. Modify these in the backend to add new ship specifications.

## Backend Integration

### API Endpoints

The frontend expects these endpoints:

**1. Get Ports**
\`\`\`
GET /ports
Response: Array<{name, latitude, longitude, weather_risk, piracy_risk, maritime_traffic}>
\`\`\`

**2. Get Ship Types**
\`\`\`
GET /ship-types
Response: Object<{ship_type: {ship_type, fuel_efficiency, max_speed, cargo_capacity}}>
\`\`\`

**3. Optimize Route**
\`\`\`
POST /optimize
Body: {
  start_port: string,
  end_port: string,
  ship_type: string,
  population_size: number,
  max_generations: number,
  mutation_rate: number,
  objectives: {time: number, cost: number, safety: number}
}
Response: {
  optimized_route: Array,
  generation_data: Array,
  fitness: Object,
  total_distance: number,
  weather_data: Array,
  piracy_data: Array,
  alternative_routes: Array
}
\`\`\`

**4. Simulate Route**
\`\`\`
POST /simulate
Body: {
  route: Array,
  ship_params: Object,
  weather_factor: number,
  piracy_factor: number,
  fuel_cost_multiplier: number
}
Response: {
  comparison_data: Array,
  updated_weather: Array,
  updated_piracy: Array
}
\`\`\`

## Troubleshooting

### Port 3000 already in use
\`\`\`bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
\`\`\`

### Build fails with Leaflet errors
\`\`\`bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Theme toggle not working
- Check that `next-themes` is in package.json
- Verify ThemeProvider is in layout.tsx
- Clear browser localStorage

### Maps not displaying
- Ensure Leaflet CSS is imported in leaflet-map.tsx
- Check browser console for CORS errors
- Verify MapContainer div has height

## Performance Tips

1. **Image Optimization**
   - Background images are pre-loaded with next/image
   - Uses responsive image sizes

2. **Code Splitting**
   - Map component uses dynamic import
   - Charts load on demand

3. **API Caching**
   - Ports and ship types fetched once on mount
   - No redundant API calls

4. **Bundle Size**
   - Tailwind CSS v4 produces minimal output
   - Tree-shaking removes unused code

## Security Considerations

1. **CORS**
   - Backend enables CORS for this origin
   - Frontend uses standard fetch API

2. **Data Handling**
   - All data processed client-side when possible
   - JSON export doesn't expose sensitive information

3. **Theme Preferences**
   - Stored in localStorage only (no server)
   - No authentication required for demo

## Monitoring

### Development
- Use browser DevTools for debugging
- Check Network tab for API calls
- Monitor Console for errors

### Production
- Set up error tracking (Sentry recommended)
- Monitor API response times
- Track user interactions with analytics

## Support

For deployment issues:
1. Check the README.md
2. Review API endpoint responses
3. Verify CORS settings
4. Check browser console for errors

---

**NavAIgator** - Deployment Ready  
*Intelligence That Knows the Way*
