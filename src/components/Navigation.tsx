import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Heart, Home, Users, HandHeart, Calendar, ShoppingBag, BookOpen, Phone, Target, Newspaper } from 'lucide-react'
import { Button } from './ui'
import { cn } from '../utils/cn'

interface NavItem {
  label: string
  href: string
  icon: typeof Home
  description?: string
}

const navigationItems: NavItem[] = [
  { 
    label: 'Home', 
    href: '/', 
    icon: Home,
    description: 'Welcome to our sanctuary'
  },
  { 
    label: 'About Us', 
    href: '/about', 
    icon: Heart,
    description: 'Our mission and story'
  },
  { 
    label: 'Mission', 
    href: '/mission', 
    icon: Target,
    description: 'Our values and commitments'
  },
  { 
    label: 'Meet the Animals', 
    href: '/animals', 
    icon: Users,
    description: 'Rescued animals in our care'
  },
  { 
    label: 'Volunteer', 
    href: '/volunteer', 
    icon: HandHeart,
    description: 'Join our volunteer team'
  },
  { 
    label: 'Events', 
    href: '/events', 
    icon: Calendar,
    description: 'Tours and fundraisers'
  },
  { 
    label: 'Blog', 
    href: '/blog', 
    icon: Newspaper,
    description: 'Stories and updates'
  },
  { 
    label: 'Shop', 
    href: '/shop', 
    icon: ShoppingBag,
    description: 'Support us through merch'
  },
  { 
    label: 'Learn', 
    href: '/learn', 
    icon: BookOpen,
    description: 'Educational resources'
  },
  { 
    label: 'Contact', 
    href: '/contact', 
    icon: Phone,
    description: 'Visit and get in touch'
  }
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  
  console.log('🧭 Navigation rendered:', { isOpen, currentPath: location.pathname })
  
  const toggleMenu = () => {
    setIsOpen(!isOpen)
    console.log('🔄 Mobile menu toggled:', !isOpen)
  }
  
  const closeMenu = () => {
    setIsOpen(false)
    console.log('❌ Mobile menu closed')
  }
  
  const isActivePath = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }
  
  return (
    <nav className="bg-white shadow-lg border-b border-sanctuary-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            onClick={closeMenu}
          >
            <div className="w-10 h-10 bg-sanctuary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🏡</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-sanctuary-800">Harmony Farm</div>
              <div className="text-sm text-sanctuary-600">Sanctuary</div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = isActivePath(item.href)
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sanctuary-100 text-sanctuary-800'
                      : 'text-gray-600 hover:bg-sanctuary-50 hover:text-sanctuary-700'
                  )}
                  title={item.description}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              )
            })}
          </div>
          
          {/* Donate Button - Desktop */}
          <div className="hidden lg:flex items-center">
            <Link to="/donate">
              <Button 
                variant="donate" 
                size="sm"
                className="flex items-center"
              >
                <Heart className="w-4 h-4 mr-2" />
                Donate
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-sanctuary-700 hover:bg-sanctuary-50 focus:outline-none focus:ring-2 focus:ring-sanctuary-500 focus:ring-offset-2"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-sanctuary-100">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = isActivePath(item.href)
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors',
                    isActive
                      ? 'bg-sanctuary-100 text-sanctuary-800'
                      : 'text-gray-600 hover:bg-sanctuary-50 hover:text-sanctuary-700'
                  )}
                  onClick={closeMenu}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <div>
                    <div>{item.label}</div>
                    {item.description && (
                      <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                    )}
                  </div>
                </Link>
              )
            })}
            
            {/* Mobile Donate Button */}
            <div className="px-3 pt-4">
              <Link to="/donate" onClick={closeMenu} className="block">
                <Button 
                  variant="donate" 
                  size="md"
                  className="w-full justify-center"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Donate Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}