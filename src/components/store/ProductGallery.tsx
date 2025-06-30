// ProductGallery Component - Image carousel and zoom functionality
// Task 13: Phase 2 - Product Display Components

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react'
import { ProductImage } from '../../types/store'
import { cn } from '../../utils/cn'

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
  variant?: 'default' | 'compact' | 'fullscreen'
  showThumbnails?: boolean
  showZoom?: boolean
  className?: string
}

export function ProductGallery({
  images,
  productName,
  variant = 'default',
  showThumbnails = true,
  showZoom = true,
  className
}: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })

  console.log('🖼️ ProductGallery rendered:', { 
    imagesCount: images.length, 
    currentIndex: currentImageIndex,
    variant 
  })

  const currentImage = images[currentImageIndex] || images[0]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
    console.log('➡️ Next image:', currentImageIndex + 1)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    console.log('⬅️ Previous image:', currentImageIndex - 1)
  }

  const selectImage = (index: number) => {
    setCurrentImageIndex(index)
    console.log('🎯 Selected image:', index)
  }

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed)
    console.log('🔍 Zoom toggled:', !isZoomed)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      previousImage()
    } else if (e.key === 'ArrowRight') {
      nextImage()
    } else if (e.key === 'Escape') {
      setIsZoomed(false)
    }
  }

  if (images.length === 0) {
    return (
      <div className={cn(
        'bg-gray-200 rounded-lg flex items-center justify-center',
        variant === 'compact' ? 'aspect-square' : 'aspect-[4/3]',
        className
      )}>
        <span className="text-gray-500">No images available</span>
      </div>
    )
  }

  // Compact variant for smaller spaces
  if (variant === 'compact') {
    return (
      <div className={cn('relative group', className)}>
        <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            className="w-full h-full object-cover"
          />
          
          {images.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      index === currentImageIndex
                        ? 'bg-white'
                        : 'bg-white bg-opacity-50'
                    )}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // Fullscreen variant (modal-like)
  if (variant === 'fullscreen') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
        <div className="relative max-w-4xl max-h-full">
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            aria-label="Close fullscreen"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative">
            <img
              src={currentImage.url}
              alt={currentImage.alt}
              className="max-w-full max-h-[80vh] object-contain"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
          
          {showThumbnails && images.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => selectImage(index)}
                  className={cn(
                    'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                    index === currentImageIndex
                      ? 'border-white'
                      : 'border-transparent hover:border-gray-400'
                  )}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default variant - full featured gallery
  return (
    <div className={cn('space-y-4', className)} onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Main image display */}
      <div className="relative group">
        <div 
          className={cn(
            'relative overflow-hidden rounded-lg bg-gray-100 cursor-zoom-in',
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          )}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <div className="aspect-[4/3] relative">
            <img
              src={currentImage.url}
              alt={currentImage.alt}
              className={cn(
                'w-full h-full object-cover transition-transform duration-300',
                isZoomed ? 'scale-150' : 'scale-100'
              )}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : {}
              }
            />
          </div>
          
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          
          {/* Zoom indicator */}
          {showZoom && (
            <button
              onClick={handleZoomToggle}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          )}
          
          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-black bg-opacity-50 text-white rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>
      
      {/* Thumbnail grid */}
      {showThumbnails && images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => selectImage(index)}
              className={cn(
                'aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105',
                index === currentImageIndex
                  ? 'border-sanctuary-500 ring-2 ring-sanctuary-200'
                  : 'border-gray-200 hover:border-sanctuary-300'
              )}
              aria-label={`View ${image.alt}`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Image info */}
      {currentImage.alt && (
        <p className="text-sm text-gray-600 text-center">
          {currentImage.alt}
        </p>
      )}
    </div>
  )
}