import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
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
import ShopifyTestPage from './components/store/ShopifyTestPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminPage from './pages/admin/AdminPage'
import AnalyticsPage from './pages/admin/AnalyticsPage'
import SettingsPage from './pages/admin/SettingsPage'
import BackupPage from './pages/admin/BackupPage'
import AdminTestingPage from './pages/admin/AdminTestingPage'
import { AnimalsPage as AdminAnimalsPage } from './pages/admin/AnimalsPage'
import { BlogPage as AdminBlogPage } from './pages/admin/BlogPage'
import { FAQPage as AdminFAQPage } from './pages/admin/FAQPage'
import { ResourcesPage as AdminResourcesPage } from './pages/admin/ResourcesPage'
import { VolunteersPage as AdminVolunteersPage } from './pages/admin/VolunteersPage'
import { InquiriesPage as AdminInquiriesPage } from './pages/admin/InquiriesPage'
import { DonationsPage as AdminDonationsPage } from './pages/admin/DonationsPage'
import { EventsPage as AdminEventsPage } from './pages/admin/EventsPage'
import { ShopPage as AdminShopPage } from './pages/admin/ShopPage'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
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
    <AdminAuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminPage />} />
              <Route path="analytics" element={
                <ProtectedRoute resource="analytics" action="read">
                  <AnalyticsPage />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute resource="settings" action="read">
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="backup" element={
                <ProtectedRoute resource="settings" action="read">
                  <BackupPage />
                </ProtectedRoute>
              } />
              <Route path="testing" element={
                <ProtectedRoute resource="admin" action="read">
                  <AdminTestingPage />
                </ProtectedRoute>
              } />
              <Route path="animals" element={
                <ProtectedRoute resource="animals" action="read">
                  <AdminAnimalsPage />
                </ProtectedRoute>
              } />
              <Route path="blog" element={
                <ProtectedRoute resource="blog" action="read">
                  <AdminBlogPage />
                </ProtectedRoute>
              } />
              <Route path="faq" element={
                <ProtectedRoute resource="faq" action="read">
                  <AdminFAQPage />
                </ProtectedRoute>
              } />
              <Route path="resources" element={
                <ProtectedRoute resource="resources" action="read">
                  <AdminResourcesPage />
                </ProtectedRoute>
              } />
              <Route path="volunteers" element={
                <ProtectedRoute resource="volunteers" action="read">
                  <AdminVolunteersPage />
                </ProtectedRoute>
              } />
              <Route path="inquiries" element={
                <ProtectedRoute resource="inquiries" action="read">
                  <AdminInquiriesPage />
                </ProtectedRoute>
              } />
              <Route path="donations" element={
                <ProtectedRoute resource="donations" action="read">
                  <AdminDonationsPage />
                </ProtectedRoute>
              } />
              <Route path="events" element={
                <ProtectedRoute resource="settings" action="read">
                  <AdminEventsPage />
                </ProtectedRoute>
              } />
              <Route path="shop" element={
                <ProtectedRoute resource="settings" action="read">
                  <AdminShopPage />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Public Routes */}
            <Route path="/*" element={
              <>
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
                    <Route path="/shopify-test" element={<ShopifyTestPage />} />
                  </Routes>
                </main>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AdminAuthProvider>
  )
}

export default App