import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { 
  HomePage, 
  AboutPage, 
  MissionPage,
  AnimalsPage, 
  AnimalProfilePage,
  VolunteerPage, 
  EventsPage, 
  ShopPage, 
  LearnPage, 
  ContactPage, 
  DonatePage 
} from './pages'
import { BlogPage } from './pages/BlogPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { BlogCategoryPage } from './pages/BlogCategoryPage'
import { BlogSearchPage } from './pages/BlogSearchPage'
import { FAQPage } from './pages/FAQPage'
import { ResourcesPage } from './pages/ResourcesPage'
import { ResourceDetailPage } from './pages/ResourceDetailPage'
import StoreTestPage from './components/store/StoreTestPage'
import { initPerformanceMonitoring, preloadCriticalResources } from './utils/performance'

function App() {
  console.log('🌟 Harmony Farm Sanctuary App initialized with React Router')
  
  // Initialize performance monitoring
  useEffect(() => {
    initPerformanceMonitoring()
    
    // Preload critical resources
    const criticalResources = [
      // Critical fonts
      '/fonts/inter-var.woff2',
      // Critical images (if any)
      '/images/hero-sanctuary.webp',
      '/images/logo.webp'
    ]
    
    // Only preload if browser supports it
    if ('link' in document.createElement('link')) {
      preloadCriticalResources(criticalResources)
    }
  }, [])
  
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/mission" element={<MissionPage />} />
            <Route path="/animals" element={<AnimalsPage />} />
            <Route path="/animals/:id" element={<AnimalProfilePage />} />
            <Route path="/volunteer" element={<VolunteerPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/search" element={<BlogSearchPage />} />
            <Route path="/blog/category/:categorySlug" element={<BlogCategoryPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/:id" element={<ResourceDetailPage />} />
            <Route path="/store-test" element={<StoreTestPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App