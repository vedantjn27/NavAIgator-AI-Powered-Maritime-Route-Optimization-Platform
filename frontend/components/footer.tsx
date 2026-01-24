'use client'

import { Mail, Github, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* About */}
          <div>
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center text-primary-foreground text-sm font-bold">
                N
              </div>
              NavAIgator
            </h3>
            <p className="text-sm text-muted-foreground">
              Intelligence That Knows the Way. Advanced maritime route optimization powered by genetic algorithms.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">Route Optimization</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Risk Analysis</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Simulation & Scenarios</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Real-time Analytics</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-xs text-muted-foreground text-center">
            © 2024 NavAIgator. All rights reserved. | Powered by AI-Driven Maritime Intelligence
          </p>
        </div>
      </div>
    </footer>
  )
}
