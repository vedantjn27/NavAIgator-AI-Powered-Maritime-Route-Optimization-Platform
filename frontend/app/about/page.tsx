'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Cpu, Globe, Shield, TrendingUp, Zap, Users } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-transparent to-accent/10 py-20 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold text-foreground">About NavAIgator</h1>
            <p className="text-xl text-muted-foreground">
              Revolutionizing maritime logistics with intelligent route optimization
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
          {/* What is NavAIgator */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">What is NavAIgator?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                NavAIgator is an advanced maritime route optimization platform powered by genetic algorithms and AI-driven 
                decision making. It analyzes multiple factors including weather conditions, piracy risks, maritime traffic, 
                fuel costs, and travel time to generate optimal shipping routes that meet your specific business objectives.
              </p>
            </div>
          </section>

          {/* Key Features */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Cpu,
                  title: 'Genetic Algorithm',
                  description: 'Evolutionary optimization with population-based search for finding superior routes',
                },
                {
                  icon: Globe,
                  title: 'Global Coverage',
                  description: 'Support for 10+ major ports across Indian Ocean, African coasts, and beyond',
                },
                {
                  icon: Shield,
                  title: 'Risk Analysis',
                  description: 'Real-time assessment of weather, piracy, and maritime traffic hazards',
                },
                {
                  icon: Zap,
                  title: 'Real-time Optimization',
                  description: 'Instant route generation with advanced computational efficiency',
                },
                {
                  icon: TrendingUp,
                  title: 'Multi-Objective',
                  description: 'Balance time, cost, and safety with customizable priority weights',
                },
                {
                  icon: Users,
                  title: 'Simulation Engine',
                  description: 'Test routes under different scenarios and weather conditions',
                },
              ].map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle>{feature.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          {/* How It Works */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Configuration',
                  description:
                    'Select your start and end ports, ship type, and optimization priorities (time, cost, safety)',
                },
                {
                  step: '2',
                  title: 'Algorithm Execution',
                  description:
                    'Genetic algorithm evolves routes over multiple generations, optimizing based on your objectives',
                },
                {
                  step: '3',
                  title: 'Analysis',
                  description:
                    'Comprehensive risk assessment including weather patterns, piracy hotspots, and traffic analysis',
                },
                {
                  step: '4',
                  title: 'Visualization',
                  description:
                    'Interactive maps showing the optimized route with all waypoints and risk zones highlighted',
                },
                {
                  step: '5',
                  title: 'Simulation',
                  description:
                    'Test alternative routes and scenarios to understand performance under different conditions',
                },
                {
                  step: '6',
                  title: 'Export & Deploy',
                  description:
                    'Export detailed route summaries and metrics for integration with your logistics systems',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-primary-foreground font-semibold">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Technology Stack */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-4">Backend</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• FastAPI (Python)</li>
                  <li>• Genetic Algorithm Engine</li>
                  <li>• Real-time Data Processing</li>
                  <li>• Haversine Distance Calculations</li>
                </ul>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-4">Frontend</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Next.js 16 with React 19</li>
                  <li>• Leaflet Maps Integration</li>
                  <li>• Recharts Visualizations</li>
                  <li>• Tailwind CSS v4</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Supported Ports */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Supported Ports</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: 'Chennai', region: 'South India' },
                { name: 'Mumbai', region: 'West India' },
                { name: 'Colombo', region: 'Sri Lanka' },
                { name: 'Kochi', region: 'South India' },
                { name: 'Male', region: 'Maldives' },
                { name: 'Durban', region: 'South Africa' },
                { name: 'Muscat', region: 'Oman' },
                { name: 'Mombasa', region: 'Kenya' },
                { name: 'Port Louis', region: 'Mauritius' },
                { name: 'Jakarta', region: 'Indonesia' },
              ].map((port, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-border bg-card/50">
                  <p className="font-semibold text-foreground">{port.name}</p>
                  <p className="text-sm text-muted-foreground">{port.region}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact CTA */}
          <section className="py-12 px-8 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Ready to Optimize Your Routes?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start using NavAIgator today to reduce shipping costs, save time, and improve safety across your maritime logistics.
            </p>
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Get Started Now
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
