'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { RouteOptimizer } from '@/components/route-optimizer'
import { useTheme } from 'next-themes'

export default function Home() {
  const [showOptimizer, setShowOptimizer] = useState(false)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = mounted && currentTheme === 'dark'

  if (showOptimizer) {
    return <RouteOptimizer />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 overflow-hidden">
        {/* Background Image with Theme Support and Parallax */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {mounted && (
            <>
              <div 
                className="absolute inset-0 transition-transform duration-75 ease-out"
                style={{ 
                  transform: `translateY(${scrollY * 0.5}px) scale(1.1)`,
                }}
              >
                <Image
                  src={isDark 
                    ? "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop" 
                    : "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop&brightness=1.1&contrast=1.05"
                  }
                  alt="Maritime navigation background"
                  fill
                  className="object-cover transition-opacity duration-500"
                  priority
                  quality={100}
                />
              </div>
              <div className={`absolute inset-0 transition-opacity duration-500 ${
                isDark 
                  ? 'bg-gradient-to-b from-black/50 via-transparent to-black/60' 
                  : 'bg-gradient-to-b from-white/40 via-transparent to-white/40'
              }`} />
            </>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
          <div className="space-y-8 max-w-4xl text-center">
            {/* Badge */}
            <div className="inline-block animate-fade-in">
              <span className={`px-5 py-2.5 rounded-full text-sm font-semibold backdrop-blur-md border transition-all ${
                isDark
                  ? 'bg-blue-500/20 text-blue-300 border-blue-400/40 shadow-lg shadow-blue-500/20'
                  : 'bg-blue-50/80 text-blue-700 border-blue-300/60 shadow-md'
              }`}>
                🧭 AI-Powered Maritime Navigation
              </span>
            </div>
            
            {/* Main Logo/Title */}
            <div className="space-y-4">
              <h1 className={`text-7xl md:text-8xl font-black tracking-tight transition-all duration-500 ${
                isDark
                  ? 'text-white drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]'
                  : 'text-gray-900 drop-shadow-lg'
              }`}>
                NavAI<span className={`${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>gator</span>
              </h1>
              
              <div className={`h-1.5 w-32 mx-auto rounded-full ${
                isDark 
                  ? 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500'
                  : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600'
              }`} />
            </div>
            
            {/* Subtitle */}
            <h2 className={`text-2xl md:text-3xl font-bold transition-colors ${
              isDark ? 'text-blue-100' : 'text-gray-800'
            }`}>
              Optimize Your Maritime Routes
            </h2>
            
            {/* Description */}
            <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed transition-colors ${
              isDark 
                ? 'text-gray-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
                : 'text-gray-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]'
            }`} style={{
              textShadow: isDark 
                ? '0 2px 10px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)' 
                : '0 2px 8px rgba(255,255,255,0.9), 0 0 15px rgba(255,255,255,0.7)'
            }}>
              Harness the power of genetic algorithms to find optimal shipping routes that balance time, cost, and safety. Real-time weather analysis, piracy risk assessment, and dynamic route planning.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button
                onClick={() => setShowOptimizer(true)}
                className={`px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl ${
                  isDark
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 shadow-blue-500/50'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-blue-600/30'
                }`}
              >
                Start Optimizing →
              </button>
              <button className={`px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 backdrop-blur-md ${
                isDark
                  ? 'bg-white/10 text-white border-2 border-white/30 hover:bg-white/20'
                  : 'bg-white/80 text-gray-800 border-2 border-gray-300 hover:bg-white'
              }`}>
                Learn More
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl">
            {[
              {
                title: 'Genetic Algorithm',
                description: 'Advanced optimization using population-based search',
                icon: '🧬',
                color: isDark ? 'from-purple-500/20 to-pink-500/20' : 'from-purple-50 to-pink-50',
                border: isDark ? 'border-purple-400/30' : 'border-purple-300/50',
              },
              {
                title: 'Risk Analysis',
                description: 'Real-time weather, piracy, and traffic assessment',
                icon: '⚠️',
                color: isDark ? 'from-orange-500/20 to-red-500/20' : 'from-orange-50 to-red-50',
                border: isDark ? 'border-orange-400/30' : 'border-orange-300/50',
              },
              {
                title: 'Multi-Objective',
                description: 'Balance time, cost, and safety in your routes',
                icon: '⚙️',
                color: isDark ? 'from-blue-500/20 to-cyan-500/20' : 'from-blue-50 to-cyan-50',
                border: isDark ? 'border-blue-400/30' : 'border-blue-300/50',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-2xl backdrop-blur-lg border-2 transition-all hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${feature.color} ${feature.border} ${
                  isDark ? 'hover:border-white/50' : 'hover:border-gray-400'
                }`}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className={`font-bold text-xl mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-20 px-6 transition-colors ${
        isDark 
          ? 'bg-gradient-to-b from-gray-900 to-black' 
          : 'bg-gradient-to-b from-gray-50 to-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          <h3 className={`text-3xl font-bold text-center mb-12 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Trusted by Maritime Professionals
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: 'Ports Covered', value: '10+', icon: '🌊' },
              { label: 'Optimization Parameters', value: '50+', icon: '📊' },
              { label: 'Processing Speed', value: 'Real-time', icon: '⚡' },
              { label: 'Route Accuracy', value: '99%', icon: '🎯' },
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className={`text-center p-6 rounded-2xl transition-all hover:scale-105 ${
                  isDark 
                    ? 'bg-gray-800/50 border border-gray-700 hover:border-blue-500/50' 
                    : 'bg-white border border-gray-200 hover:border-blue-400 shadow-lg'
                }`}
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className={`text-4xl font-black mb-2 bg-gradient-to-r ${
                  isDark 
                    ? 'from-blue-400 to-cyan-400' 
                    : 'from-blue-600 to-cyan-600'
                } bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <p className={`font-semibold ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`py-20 px-6 transition-colors ${
        isDark ? 'bg-black' : 'bg-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto">
          <h3 className={`text-4xl font-bold text-center mb-16 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Select Your Route',
                description: 'Choose your start and end ports from our extensive network',
              },
              {
                step: '02',
                title: 'Configure Parameters',
                description: 'Set your priorities: time, cost, or safety optimization',
              },
              {
                step: '03',
                title: 'Get Optimal Route',
                description: 'Receive AI-optimized route with detailed risk analysis',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className={`text-8xl font-black opacity-10 absolute -top-8 -left-4 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {item.step}
                </div>
                <div className={`relative p-8 rounded-2xl ${
                  isDark 
                    ? 'bg-gray-900 border border-gray-800' 
                    : 'bg-white border border-gray-200 shadow-xl'
                }`}>
                  <h4 className={`text-xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.title}
                  </h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}