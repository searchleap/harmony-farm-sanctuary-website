import { useEffect } from 'react'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  robots?: string
  
  // Open Graph
  ogType?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  ogSiteName?: string
  
  // Twitter
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  twitterSite?: string
  twitterCreator?: string
  
  // Article specific
  articlePublishedTime?: string
  articleModifiedTime?: string
  articleAuthor?: string
  articleSection?: string
  articleTag?: string
  
  // Structured data
  structuredData?: object
}

export function SEOHead({
  title,
  description,
  keywords,
  canonical,
  robots = 'index, follow',
  
  ogType = 'website',
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogSiteName = 'Harmony Farm Sanctuary',
  
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterSite = '@HarmonyFarmSanctuary',
  twitterCreator,
  
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
  articleSection,
  articleTag,
  
  structuredData
}: SEOHeadProps) {
  
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title
    }
    
    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, useProperty = false) => {
      const attribute = useProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      
      if (element) {
        element.setAttribute('content', content)
      } else {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        element.setAttribute('content', content)
        document.head.appendChild(element)
      }
    }
    
    // Helper function to update or create link tags
    const updateLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`)
      
      if (element) {
        element.setAttribute('href', href)
      } else {
        element = document.createElement('link')
        element.setAttribute('rel', rel)
        element.setAttribute('href', href)
        document.head.appendChild(element)
      }
    }
    
    // Update basic meta tags
    if (description) updateMetaTag('description', description)
    if (keywords) updateMetaTag('keywords', keywords)
    if (robots) updateMetaTag('robots', robots)
    
    // Update Open Graph tags
    updateMetaTag('og:type', ogType, true)
    if (ogTitle) updateMetaTag('og:title', ogTitle, true)
    if (ogDescription) updateMetaTag('og:description', ogDescription, true)
    if (ogImage) updateMetaTag('og:image', ogImage, true)
    if (ogUrl) updateMetaTag('og:url', ogUrl, true)
    updateMetaTag('og:site_name', ogSiteName, true)
    
    // Update Twitter Card tags
    updateMetaTag('twitter:card', twitterCard)
    if (twitterTitle) updateMetaTag('twitter:title', twitterTitle)
    if (twitterDescription) updateMetaTag('twitter:description', twitterDescription)
    if (twitterImage) updateMetaTag('twitter:image', twitterImage)
    updateMetaTag('twitter:site', twitterSite)
    if (twitterCreator) updateMetaTag('twitter:creator', twitterCreator)
    
    // Update article-specific tags
    if (articlePublishedTime) updateMetaTag('article:published_time', articlePublishedTime, true)
    if (articleModifiedTime) updateMetaTag('article:modified_time', articleModifiedTime, true)
    if (articleAuthor) updateMetaTag('article:author', articleAuthor, true)
    if (articleSection) updateMetaTag('article:section', articleSection, true)
    if (articleTag) updateMetaTag('article:tag', articleTag, true)
    
    // Update canonical URL
    if (canonical) {
      updateLinkTag('canonical', canonical)
    }
    
    // Add structured data
    if (structuredData) {
      // Remove existing structured data script
      const existingScript = document.querySelector('script[type="application/ld+json"]')
      if (existingScript) {
        existingScript.remove()
      }
      
      // Add new structured data script
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }
    
    console.log('🔍 SEO meta tags updated:', { 
      title, 
      description: description?.substring(0, 50),
      ogImage: ogImage?.substring(0, 50),
      structuredData: !!structuredData
    })
    
    // Cleanup function (optional - for when component unmounts)
    return () => {
      // Could clean up meta tags here if needed
    }
  }, [
    title, description, keywords, canonical, robots,
    ogType, ogTitle, ogDescription, ogImage, ogUrl, ogSiteName,
    twitterCard, twitterTitle, twitterDescription, twitterImage, twitterSite, twitterCreator,
    articlePublishedTime, articleModifiedTime, articleAuthor, articleSection, articleTag,
    structuredData
  ])
  
  // This component doesn't render anything
  return null
}