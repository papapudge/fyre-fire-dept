"use client"

import { useState, useEffect } from "react"

interface ScrollState {
  isScrolling: boolean
  scrollDirection: 'up' | 'down'
  scrollY: number
  scrollProgress: number
  isAtTop: boolean
  isAtBottom: boolean
}

export function useScrollBehavior() {
  const [scrollState, setScrollState] = useState<ScrollState>({
    isScrolling: false,
    scrollDirection: 'down',
    scrollY: 0,
    scrollProgress: 0,
    isAtTop: true,
    isAtBottom: false
  })

  useEffect(() => {
    let scrollTimer: NodeJS.Timeout
    let lastScrollY = 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = documentHeight > 0 ? (currentScrollY / documentHeight) * 100 : 0

      // Determine scroll direction
      let scrollDirection: 'up' | 'down' = 'down'
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        scrollDirection = 'down'
      } else if (currentScrollY < lastScrollY) {
        scrollDirection = 'up'
      }

      setScrollState({
        isScrolling: true,
        scrollDirection,
        scrollY: currentScrollY,
        scrollProgress,
        isAtTop: currentScrollY < 10,
        isAtBottom: currentScrollY >= documentHeight - 10
      })

      lastScrollY = currentScrollY

      // Clear existing timer
      clearTimeout(scrollTimer)
      
      // Set timer to detect when scrolling stops
      scrollTimer = setTimeout(() => {
        setScrollState(prev => ({
          ...prev,
          isScrolling: false
        }))
      }, 150)
    }

    // Listen to window scroll
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Also listen to main content scroll if it exists
    const mainElement = document.querySelector('main')
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll)
      }
      clearTimeout(scrollTimer)
    }
  }, [])

  return scrollState
}

// Hook for scroll-based animations
export function useScrollAnimation(threshold: number = 0.1) {
  const scrollState = useScrollBehavior()
  
  return {
    shouldAnimate: scrollState.scrollProgress > threshold,
    scrollProgress: scrollState.scrollProgress,
    isScrolling: scrollState.isScrolling,
    scrollDirection: scrollState.scrollDirection
  }
}

// Hook for scroll-based visibility
export function useScrollVisibility(threshold: number = 0.5) {
  const scrollState = useScrollBehavior()
  
  return {
    isVisible: scrollState.scrollProgress > threshold,
    scrollProgress: scrollState.scrollProgress,
    isScrolling: scrollState.isScrolling
  }
}
