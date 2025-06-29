import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { 
  HomePage, 
  AboutPage, 
  MissionPage,
  AnimalsPage, 
  VolunteerPage, 
  EventsPage, 
  ShopPage, 
  LearnPage, 
  ContactPage, 
  DonatePage 
} from './pages'

function App() {
  console.log('🌟 Harmony Farm Sanctuary App initialized with React Router')
  
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
            <Route path="/volunteer" element={<VolunteerPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/donate" element={<DonatePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App