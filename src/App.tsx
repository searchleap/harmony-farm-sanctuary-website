import { useState } from 'react'
import { DesignSystem } from './components/DesignSystem'
import { Button } from './components/ui'
import { Palette, Eye } from 'lucide-react'

function App() {
  const [showDesignSystem, setShowDesignSystem] = useState(false)
  
  console.log('🌟 Harmony Farm Sanctuary App initialized')
  console.log('🎨 Design System available:', { showDesignSystem })
  
  if (showDesignSystem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-sanctuary-200 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl font-semibold text-sanctuary-800">Design System</h1>
            <Button 
              variant="outline" 
              onClick={() => setShowDesignSystem(false)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
        <DesignSystem />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-sanctuary-600 rounded-full flex items-center justify-center animate-gentle-bounce">
              <span className="text-white text-2xl">🏡</span>
            </div>
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-lg">❤️</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-sanctuary-800 mb-6">
            Harmony Farm Sanctuary
          </h1>
          
          <p className="text-xl md:text-2xl text-sanctuary-700 mb-8 leading-relaxed">
            A safe haven for rescued farm animals in the heart of Central Oregon
          </p>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-semibold text-sanctuary-800 mb-4">
              ✅ Task 2: Design System Complete
            </h2>
            <p className="text-sanctuary-700 mb-6">
              Component library with typography, buttons, cards, forms, and more
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm mb-6">
              <div className="bg-sanctuary-100 rounded-lg p-4">
                <div className="font-semibold text-sanctuary-800">UI Components</div>
                <div className="text-sanctuary-600">8 Core Components</div>
              </div>
              <div className="bg-earth-100 rounded-lg p-4">
                <div className="font-semibold text-earth-800">Typography</div>
                <div className="text-earth-600">Responsive System</div>
              </div>
              <div className="bg-green-100 rounded-lg p-4">
                <div className="font-semibold text-green-800">Brand Colors</div>
                <div className="text-green-600">Sanctuary Theme</div>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => setShowDesignSystem(true)}
              className="flex items-center gap-2"
            >
              <Palette className="w-5 h-5" />
              View Design System
            </Button>
          </div>
          
          <div className="text-sanctuary-600">
            <p>Next: Navigation & Routing System</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App