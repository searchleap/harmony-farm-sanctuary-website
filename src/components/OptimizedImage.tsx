import { useState, useRef, useEffect } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  priority?: boolean
  placeholder?: string
  sizes?: string
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  priority = false,
  placeholder: _placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+',
  sizes,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority) // Load immediately if priority
  const imgRef = useRef<HTMLImageElement>(null)
  
  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters viewport
        threshold: 0.1
      }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [priority])
  
  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
    console.log('📸 Image loaded:', { src: src.substring(0, 50), alt })
  }
  
  const handleError = () => {
    setHasError(true)
    onError?.()
    console.error('📸 Image load error:', { src, alt })
  }
  
  // Generate responsive srcSet for different screen sizes
  const generateSrcSet = (baseSrc: string) => {
    if (baseSrc.includes('unsplash.com')) {
      // For Unsplash images, generate multiple sizes
      const sizes = [400, 800, 1200, 1600]
      return sizes
        .map(size => `${baseSrc}?w=${size}&q=80 ${size}w`)
        .join(', ')
    }
    return undefined
  }
  
  const srcSet = generateSrcSet(src)
  
  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      {/* Placeholder/Loading state */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center border border-gray-200">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Image unavailable</div>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      {(isInView || priority) && (
        <img
          src={src}
          alt={alt}
          className={`
            w-full h-full object-cover transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            ${hasError ? 'hidden' : ''}
          `}
          width={width}
          height={height}
          loading={loading}
          srcSet={srcSet}
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
        />
      )}
    </div>
  )
}