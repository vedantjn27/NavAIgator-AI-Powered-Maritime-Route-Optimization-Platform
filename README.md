# NavAIgator - Intelligence That Knows the Way

A professional, AI-powered maritime route optimization platform built with Next.js and React. NavAIgator uses genetic algorithms to generate optimal shipping routes that balance time, cost, and safety considerations.

## Features

### Core Optimization
- **Genetic Algorithm Engine**: Advanced evolutionary computation for finding superior routes
- **Multi-Objective Optimization**: Balance between travel time, fuel costs, and safety
- **Real-time Processing**: Instant route generation with configurable parameters

### Risk Analysis
- **Weather Risk Assessment**: Real-time weather pattern analysis along routes
- **Piracy Hotspot Detection**: Identification of high-risk maritime zones
- **Traffic Analysis**: Maritime traffic density monitoring
- **Combined Risk Scoring**: Weighted risk calculations for comprehensive hazard assessment

### Analytics & Visualization
- **Interactive Maps**: Leaflet-based map visualization with route overlays
- **Risk Dashboards**: Comprehensive risk metrics by waypoint
- **Optimization Progress**: Genetic algorithm convergence visualization
- **Alternative Routes**: Comparison of multiple optimization scenarios
- **Simulation Engine**: Test routes under different weather/cost scenarios

### User Experience
- **Day/Night Mode**: Full theme support with system preference detection
- **Professional UI**: Modern design with maritime aesthetic
- **Responsive Design**: Mobile-friendly interface
- **Data Export**: JSON export of route summaries

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Recharts** - Data visualization library
- **Leaflet** - Interactive mapping
- **Shadcn/ui** - Component library
- **Lucide Icons** - Icon system
- **Next-themes** - Theme management

### Backend
- **FastAPI** - Python web framework
- **Genetic Algorithm** - Custom optimization engine
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd navaigator
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables (if needed)
```bash
cp .env.example .env.local
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production
```bash
npm run build
npm start
```

## Project Structure

```
/app                          # Next.js App Router
  /page.tsx                   # Landing page with hero section
  /about                      # About page
  /layout.tsx                 # Root layout with theme provider
  /globals.css                # Global styles and design tokens

/components                   # React components
  /header.tsx                 # Header with theme toggle
  /footer.tsx                 # Footer component
  /route-optimizer.tsx        # Main optimization interface
  /route-config.tsx           # Configuration panel
  /map-visualization.tsx      # Map display component
  /leaflet-map.tsx            # Leaflet map implementation
  /risk-analysis-dashboard.tsx # Risk analytics
  /simulation-comparison.tsx  # Simulation engine
  /route-summary.tsx          # Results summary
  /ui/*                       # Shadcn UI components

/public                       # Static assets
  /images                     # Background and maritime imagery
```

## Usage

### 1. Landing Page
- View platform features and benefits
- Access navigation to optimization tool
- Toggle between day and night mode

### 2. Route Optimization
- Select start and end ports from 10+ supported locations
- Choose ship type (Cargo, Container, Tanker, Passenger)
- Set optimization priorities (time, cost, safety)
- Configure algorithm parameters (population size, generations)

### 3. View Results
- **Route Map Tab**: Interactive map with route visualization, risk zones, and weather patterns
- **Risk Analysis Tab**: Detailed risk breakdown by waypoint, optimization progress, and fitness metrics
- **Comparison Tab**: Alternative routes and scenario simulations
- **Summary Tab**: Complete route details, waypoint information, and export options

### 4. Simulation
- Test routes under different conditions
- Adjust weather impact and fuel cost factors
- Compare original vs. simulated performance
- Analyze percentage changes in key metrics

## API Integration

The frontend connects to the backend API at: `https://navaigator.onrender.com`

### Key Endpoints Used
- `GET /ports` - List available ports
- `GET /ship-types` - Available ship types with specifications
- `POST /optimize` - Route optimization request
- `POST /simulate` - Scenario simulation
- `POST /risk-analysis` - Risk assessment

## Design System

### Color Palette
- **Primary**: Deep maritime blue (#3b82f6 in light mode, variable in dark)
- **Accent**: Ocean gold/orange (#fbbf24 for highlights)
- **Background**: Clean white in light mode, dark navy in dark mode
- **Cards**: Subtle contrast with hover states

### Typography
- **Headings**: Geist font family, bold weights
- **Body**: Geist font family, regular weights
- **Monospace**: Geist Mono for technical data

### Responsive Design
- Mobile-first approach
- Breakpoints: md (768px), lg (1024px)
- Touch-friendly interactive elements
- Flexible grid layouts

## Features Highlights

### Smart Configuration
- Slider-based controls for all parameters
- Real-time preview of priority weights
- Advanced settings expandable section
- Ship type specifications display

### Rich Visualizations
- Line charts for optimization progress
- Bar charts for risk comparison
- Radar charts for multi-dimensional metrics
- Scatter plots for route analysis
- Interactive maps with custom markers

### Export Capabilities
- JSON export of complete route summary
- Copy route as text
- Download simulation reports
- Waypoint coordinate export

## Performance Considerations

- Lazy-loaded map components
- Optimized chart rendering with Recharts
- Client-side data processing
- Efficient API calls with error handling
- Progressive enhancement approach

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Theme Support

- **Light Mode**: Clean, professional maritime aesthetic
- **Dark Mode**: Eye-friendly dark background with vibrant accents
- **System Preference**: Automatically respects OS theme settings
- **Manual Toggle**: Easy switching via header button

## Future Enhancements

- Real-time weather API integration
- Piracy database integration
- Marine traffic data feeds
- Historical route data analysis
- Team collaboration features
- Advanced scheduling
- Mobile native apps

## Troubleshooting

### Map not loading
- Ensure you're on a modern browser with JavaScript enabled
- Check network tab for Leaflet CDN resources
- Verify CORS settings if using custom backend

### Backend connection issues
- Confirm backend API is running
- Check backend CORS configuration
- Verify API endpoint URL in components

### Theme not persisting
- Clear browser cache/localStorage
- Ensure next-themes is properly initialized
- Check browser's theme preference settings

## License

This project is proprietary and confidential.

## Support

For issues, questions, or feature requests, please contact the development team.

---

**NavAIgator** - Intelligent Maritime Route Optimization  
*Intelligence That Knows the Way*
