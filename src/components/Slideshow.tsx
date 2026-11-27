import { useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { useAppState } from '../context/AppContext'
import { slides } from '../data/slides'
import { Slide } from './Slide'

interface SlideshowProps {
  zoom: number
  onNavigate: (index: number) => void
  onToast: (message: string) => void
}

export function Slideshow({ zoom, onNavigate, onToast }: SlideshowProps) {
  const { currentIndex } = useAppState()

  const navigate = useCallback((delta: number) => {
    const nextIndex = Math.max(0, Math.min(slides.length - 1, currentIndex + delta))
    if (nextIndex !== currentIndex) onNavigate(nextIndex)
  }, [currentIndex, onNavigate])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target
      if (target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        navigate(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        navigate(-1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigate])

  const fullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch (error) {
      console.error('Could not change fullscreen mode:', error)
      onToast('Fullscreen is unavailable in this browser')
    }
  }

  return (
    <section className="presentation-card" aria-label="Slideshow presentation">
      <div className="presentation-topline">
        <span className="deck-label"><span className="deck-icon">✳</span> THE CREATIVE BRIEF</span>
        <button className="fullscreen-button" onClick={() => void fullscreen()} aria-label="Toggle fullscreen">
          <Maximize2 size={14} /><span>FULLSCREEN</span>
        </button>
      </div>

      <div className="slide-stage" key={currentIndex}>
        <Slide slide={slides[currentIndex]} zoom={zoom} />
      </div>

      <div className="presentation-controls">
        <div className="slide-pagination" aria-label={`Slide ${currentIndex + 1} of ${slides.length}`}>
          <span className="current-slide-number">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="pagination-divider" />
          <span className="total-slides">{String(slides.length).padStart(2, '0')}</span>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }} />
          </div>
        </div>
        <div className="navigation-buttons">
          <span className="keyboard-hint"><kbd>←</kbd><kbd>→</kbd> TO NAVIGATE</span>
          <button className="nav-button" onClick={() => navigate(-1)} disabled={currentIndex === 0} aria-label="Previous slide">
            <ChevronLeft size={18} />
          </button>
          <button className="nav-button next-button" onClick={() => navigate(1)} disabled={currentIndex === slides.length - 1} aria-label="Next slide">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
