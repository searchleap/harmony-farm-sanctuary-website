import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Heart, Home, Users, HandHeart, Calendar, ShoppingBag, Phone, Target, Newspaper, HelpCircle, Download, ChevronDown, BookOpen, Info } from 'lucide-react'
import { Button } from './ui'
import { cn } from '../utils/cn'

interface NavItem {
  label: string
  href: string
  icon: typeof Home
  description?: string
}

interface DropdownGroup {
  label: string
  icon: typeof Home
  items: NavItem[]
}

// Primary navigation items (always visible)
const primaryNavItems: NavItem[] = [
  { 
    label: 'Home', 
    href: '/', 
    icon: Home,
    description: 'Welcome to our sanctuary'
  },
  { 
    label: 'Animals', 
    href: '/animals', 
    icon: Users,
    description: 'Meet our rescued animals'
  },
  { 
    label: 'Get Involved', 
    href: '/volunteer', 
    icon: HandHeart,
    description: 'Volunteer and help'
  },
  { 
    label: 'Visit Us', 
    href: '/contact', 
    icon: Phone,
    description: 'Plan your visit'
  }
]

// Dropdown groups for secondary items
const dropdownGroups: DropdownGroup[] = [
  {
    label: 'About',
    icon: Info,
    items: [
      { label: 'Our Story', href: '/about', icon: Heart, description: 'How we started' },
      { label: 'Mission & Values', href: '/mission', icon: Target, description: 'What drives us' },
      { label: 'Blog & News', href: '/blog', icon: Newspaper, description: 'Latest updates' }
    ]
  },
  {
    label: 'Learn',
    icon: BookOpen,
    items: [
      { label: 'FAQ', href: '/faq', icon: HelpCircle, description: 'Common questions' },
      { label: 'Resources', href: '/resources', icon: Download, description: 'Educational materials' },
      { label: 'Events & Tours', href: '/events', icon: Calendar, description: 'Upcoming events' }
    ]
  },
  {
    label: 'Support',
    icon: ShoppingBag,
    items: [
      { label: 'Shop', href: '/shop', icon: ShoppingBag, description: 'Merchandise store' }
    ]
  }
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const location = useLocation()
  
  console.log('🧭 Navigation rendered:', { isOpen, currentPath: location.pathname })
  
  const toggleMenu = () => {
    setIsOpen(!isOpen)
    setActiveDropdown(null)
    console.log('🔄 Mobile menu toggled:', !isOpen)
  }
  
  const closeMenu = () => {
    setIsOpen(false)
    setActiveDropdown(null)
    console.log('❌ Mobile menu closed')
  }
  
  const handleDropdownToggle = (groupLabel: string) => {
    setActiveDropdown(activeDropdown === groupLabel ? null : groupLabel)
  }
  
  const isActivePath = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }
  
  const isGroupActive = (group: DropdownGroup) => {
    return group.items.some(item => isActivePath(item.href))
  }
  
  return (
    <nav className="bg-white shadow-sm border-b border-sanctuary-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-4 hover:opacity-80 transition-opacity group"
            onClick={closeMenu}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-sanctuary-600 to-sanctuary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white text-2xl">🏡</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-2xl font-bold text-sanctuary-800 leading-tight">Harmony Farm</div>
              <div className="text-sm text-sanctuary-600 font-medium">Sanctuary</div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Primary Navigation */}
            {primaryNavItems.map((item) => {
              const isActive = isActivePath(item.href)
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sanctuary-100 text-sanctuary-800 shadow-sm'
                      : 'text-gray-700 hover:bg-sanctuary-50 hover:text-sanctuary-700 hover:shadow-sm'
                  )}
                  title={item.description}
                >
                  {item.label}
                </Link>
              )
            })}
            
            {/* Dropdown Groups */}
            {dropdownGroups.map((group) => {
              const isActive = isGroupActive(group)
              const isDropdownOpen = activeDropdown === group.label
              
              return (
                <div key={group.label} className="relative">
                  <button
                    onClick={() => handleDropdownToggle(group.label)}
                    className={cn(
                      'flex items-center px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive || isDropdownOpen
                        ? 'bg-sanctuary-100 text-sanctuary-800 shadow-sm'
                        : 'text-gray-700 hover:bg-sanctuary-50 hover:text-sanctuary-700 hover:shadow-sm'
                    )}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    {group.label}
                    <ChevronDown className={cn(
                      "w-4 h-4 ml-2 transition-transform duration-200",
                      isDropdownOpen && "rotate-180"
                    )} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-sanctuary-100 py-2 z-50">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon
                        const isItemActive = isActivePath(item.href)
                        
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                              'flex items-start px-4 py-3 hover:bg-sanctuary-50 transition-colors',
                              isItemActive && 'bg-sanctuary-50 text-sanctuary-800'
                            )}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <ItemIcon className="w-4 h-4 mr-3 mt-0.5 text-sanctuary-600" />
                            <div>
                              <div className="font-medium text-gray-900">{item.label}</div>
                              <div className="text-sm text-gray-500 mt-0.5">{item.description}</div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Donate Button - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link to="/donate">
              <Button 
                variant="donate" 
                size="lg"
                className="flex items-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <Heart className="w-4 h-4 mr-2" />
                Donate
              </Button>
            </Link>
            
            {/* Admin Access - Development */}
            <Link 
              to="/admin"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded"
            >
              Admin
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="p-3 rounded-lg text-gray-600 hover:text-sanctuary-700 hover:bg-sanctuary-50 focus:outline-none focus:ring-2 focus:ring-sanctuary-500 focus:ring-offset-2 transition-colors"
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
          <div className="px-4 pt-2 pb-4 space-y-2 bg-white border-t border-sanctuary-100 shadow-lg">
            {/* Primary Items */}
            {primaryNavItems.map((item) => {
              const Icon = item.icon
              const isActive = isActivePath(item.href)
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center px-4 py-4 rounded-lg text-base font-medium transition-colors',
                    isActive
                      ? 'bg-sanctuary-100 text-sanctuary-800'
                      : 'text-gray-700 hover:bg-sanctuary-50 hover:text-sanctuary-700'
                  )}
                  onClick={closeMenu}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <div>
                    <div>{item.label}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{item.description}</div>
                  </div>
                </Link>
              )
            })}
            
            {/* Dropdown Groups */}
            {dropdownGroups.map((group) => (
              <div key={group.label} className="space-y-1">
                <button
                  onClick={() => handleDropdownToggle(group.label)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-sanctuary-50 transition-colors"
                >
                  <div className="flex items-center">
                    <group.icon className="w-5 h-5 mr-3" />
                    {group.label}
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    activeDropdown === group.label && "rotate-180"
                  )} />
                </button>
                
                {activeDropdown === group.label && (
                  <div className="ml-8 space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const isActive = isActivePath(item.href)
                      
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          className={cn(
                            'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-sanctuary-100 text-sanctuary-800'
                              : 'text-gray-600 hover:bg-sanctuary-50 hover:text-sanctuary-700'
                          )}
                          onClick={closeMenu}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          <div>
                            <div>{item.label}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
            
            {/* Mobile Donate Button */}
            <div className="pt-4 border-t border-sanctuary-100">
              <Link to="/donate" onClick={closeMenu} className="block mb-3">
                <Button 
                  variant="donate" 
                  size="lg"
                  className="w-full justify-center shadow-lg"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Donate Now
                </Button>
              </Link>
              
              {/* Admin Access - Development */}
              <Link 
                to="/admin" 
                onClick={closeMenu}
                className="block text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}