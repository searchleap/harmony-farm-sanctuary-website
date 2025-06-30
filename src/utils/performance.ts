// Performance Monitoring and Optimization Utilities
// Tools for tracking page performance, bundle analysis, and optimization

interface PerformanceMetrics {
  pageLoadTime: number
  domContentLoaded: number
  firstPaint: number
  firstContentfulPaint: number
  largestContentfulPaint?: number
  firstInputDelay?: number
  cumulativeLayoutShift?: number
  timeToInteractive?: number
}

interface ResourceTiming {
  name: string
  type: string
  size: number
  duration: number
  transferSize: number
}

// Measure and log page performance metrics
export const measurePagePerformance = (): PerformanceMetrics | null => {
  if (typeof window === 'undefined' || !window.performance) {
    return null
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const paintEntries = performance.getEntriesByType('paint')
  
  const metrics: PerformanceMetrics = {
    pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    firstPaint: 0,
    firstContentfulPaint: 0
  }
  
  // Get paint timings
  paintEntries.forEach(entry => {
    if (entry.name === 'first-paint') {
      metrics.firstPaint = entry.startTime
    } else if (entry.name === 'first-contentful-paint') {
      metrics.firstContentfulPaint = entry.startTime
    }
  })
  
  // Get Web Vitals if supported
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      metrics.largestContentfulPaint = lastEntry.startTime
    }).observe({ entryTypes: ['largest-contentful-paint'] })
    
    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        if (entry.name === 'first-input') {
          metrics.firstInputDelay = (entry as any).processingStart - entry.startTime
        }
      })
    }).observe({ entryTypes: ['first-input'] })
    
    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      let clsValue = 0
      list.getEntries().forEach(entry => {
        const layoutShiftEntry = entry as any
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value
        }
      })
      metrics.cumulativeLayoutShift = clsValue
    }).observe({ entryTypes: ['layout-shift'] })
  }
  
  console.log('⚡ Page Performance Metrics:', metrics)
  return metrics
}

// Analyze resource loading performance
export const analyzeResourcePerformance = (): ResourceTiming[] => {
  if (typeof window === 'undefined' || !window.performance) {
    return []
  }

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  
  const resourceTimings: ResourceTiming[] = resources.map(resource => ({
    name: resource.name,
    type: getResourceType(resource.name),
    size: resource.transferSize || 0,
    duration: resource.responseEnd - resource.requestStart,
    transferSize: resource.transferSize || 0
  }))
  
  // Sort by duration (slowest first)
  resourceTimings.sort((a, b) => b.duration - a.duration)
  
  console.log('🔍 Resource Performance Analysis:', resourceTimings.slice(0, 10))
  return resourceTimings
}

// Determine resource type from URL
const getResourceType = (url: string): string => {
  if (url.includes('.js')) return 'script'
  if (url.includes('.css')) return 'stylesheet'
  if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image'
  if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'font'
  if (url.includes('api/') || url.includes('.json')) return 'api'
  return 'other'
}

// Memory usage monitoring
export const getMemoryUsage = (): any => {
  if (typeof window === 'undefined' || !(performance as any).memory) {
    return null
  }

  const memory = (performance as any).memory
  
  const memoryInfo = {
    usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
    totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
    jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
    usagePercentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
  }
  
  console.log('🧠 Memory Usage:', memoryInfo)
  return memoryInfo
}

// Bundle size analysis helper
export const logBundleInfo = () => {
  if (typeof window === 'undefined') return
  
  const scripts = Array.from(document.querySelectorAll('script[src]'))
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
  
  const bundleInfo = {
    scripts: scripts.length,
    stylesheets: stylesheets.length,
    totalResources: scripts.length + stylesheets.length
  }
  
  console.log('📦 Bundle Info:', bundleInfo)
  return bundleInfo
}

// Performance scoring based on Web Vitals
export const calculatePerformanceScore = (metrics: PerformanceMetrics): number => {
  let score = 100
  
  // Largest Contentful Paint (LCP) - Good: ≤2.5s, Poor: >4.0s
  if (metrics.largestContentfulPaint) {
    if (metrics.largestContentfulPaint > 4000) score -= 30
    else if (metrics.largestContentfulPaint > 2500) score -= 15
  }
  
  // First Input Delay (FID) - Good: ≤100ms, Poor: >300ms
  if (metrics.firstInputDelay) {
    if (metrics.firstInputDelay > 300) score -= 25
    else if (metrics.firstInputDelay > 100) score -= 10
  }
  
  // Cumulative Layout Shift (CLS) - Good: ≤0.1, Poor: >0.25
  if (metrics.cumulativeLayoutShift) {
    if (metrics.cumulativeLayoutShift > 0.25) score -= 25
    else if (metrics.cumulativeLayoutShift > 0.1) score -= 10
  }
  
  // First Contentful Paint - Good: ≤1.8s, Poor: >3.0s
  if (metrics.firstContentfulPaint > 3000) score -= 15
  else if (metrics.firstContentfulPaint > 1800) score -= 8
  
  return Math.max(0, score)
}

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return
  
  // Wait for page load to measure performance
  window.addEventListener('load', () => {
    setTimeout(() => {
      const metrics = measurePagePerformance()
      analyzeResourcePerformance()
      getMemoryUsage()
      logBundleInfo()
      
      if (metrics) {
        const score = calculatePerformanceScore(metrics)
        console.log(`⭐ Performance Score: ${score}/100`)
      }
      
      // Send to analytics service (when implemented)
      // sendPerformanceData({ metrics, resources, memory, bundle, score })
      
    }, 1000) // Wait 1 second after load for accurate measurements
  })
}

// Preload critical resources
export const preloadCriticalResources = (urls: string[]) => {
  urls.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'preload'
    
    if (url.includes('.js')) {
      link.as = 'script'
    } else if (url.includes('.css')) {
      link.as = 'style'
    } else if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      link.as = 'image'
    } else if (url.match(/\.(woff|woff2)$/i)) {
      link.as = 'font'
      link.crossOrigin = 'anonymous'
    }
    
    link.href = url
    document.head.appendChild(link)
    
    console.log('🚀 Preloading resource:', url)
  })
}