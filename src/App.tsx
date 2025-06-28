import { Heart, Home } from 'lucide-react'

function App() {
  console.log('🌟 Harmony Farm Sanctuary App initialized')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Home className="w-12 h-12 text-sanctuary-600 animate-gentle-bounce" />
            <Heart className="w-8 h-8 text-red-500 animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-sanctuary-800 mb-6">
            Harmony Farm Sanctuary
          </h1>
          
          <p className="text-xl md:text-2xl text-sanctuary-700 mb-8 leading-relaxed">
            A safe haven for rescued farm animals in the heart of Central Oregon
          </p>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-sanctuary-800 mb-4">
              🚀 Development Environment Ready
            </h2>
            <p className="text-sanctuary-700 mb-6">
              Phase 1 foundation is being built with React, TypeScript, and Tailwind CSS
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-sanctuary-100 rounded-lg p-4">
                <div className="font-semibold text-sanctuary-800">React 18</div>
                <div className="text-sanctuary-600">Modern UI Framework</div>
              </div>
              <div className="bg-earth-100 rounded-lg p-4">
                <div className="font-semibold text-earth-800">TypeScript</div>
                <div className="text-earth-600">Type Safety</div>
              </div>
              <div className="bg-green-100 rounded-lg p-4">
                <div className="font-semibold text-green-800">Tailwind CSS</div>
                <div className="text-green-600">Responsive Design</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-sanctuary-600">
            <p>Next: Design System & Navigation Components</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App