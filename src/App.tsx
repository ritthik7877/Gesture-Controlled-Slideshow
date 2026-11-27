import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, CircleHelp, Settings2, Sparkles } from 'lucide-react'
import { GestureToast } from './components/GestureToast'
import { OnboardingModal } from './components/OnboardingModal'
import { SettingsPanel } from './components/SettingsPanel'
import { Slideshow } from './components/Slideshow'
import { WebcamPreview } from './components/WebcamPreview'
import { AppProvider, useAppState } from './context/AppContext'
import { slides } from './data/slides'
import { useGestureRecognizer } from './hooks/useGestureRecognizer'
import { useHandTracker } from './hooks/useHandTracker'
import { useWebcam } from './hooks/useWebcam'
import type { GestureAction } from './lib/gestureUtils'
import './App.css'

function GestureDeck() {
  const { currentIndex, setCurrentIndex, settings, updateSettings } = useAppState()
  const [showSettings, setShowSettings] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null)
  const [zoom, setZoom] = useState(1)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { stream, error: cameraError, status: cameraStatus, retryCamera } = useWebcam(settings.cameraOn)
  const { status: trackerStatus, landmarks } = useHandTracker(videoRef, stream, settings.cameraOn)

  const showToast = useCallback((message: string) => {
    setToast({ message, id: Date.now() })
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(slides.length - 1, index)))
    setZoom(1)
  }, [setCurrentIndex])

  const handleGesture = useCallback((action: GestureAction) => {
    switch (action) {
      case 'next':
        goToSlide(currentIndex + 1)
        showToast('Next →')
        break
      case 'previous':
        goToSlide(currentIndex - 1)
        showToast('Previous ←')
        break
      case 'reset':
        goToSlide(0)
        showToast('Back to the beginning')
        break
      case 'fullscreen':
        void toggleFullscreen()
          .then(() => showToast('Fullscreen'))
          .catch(() => showToast('Fullscreen is unavailable'))
        break
    }
  }, [currentIndex, goToSlide, showToast])

  useGestureRecognizer({
    landmarks,
    enabled: settings.gesturesOn && settings.cameraOn && cameraStatus === 'ready',
    sensitivity: settings.sensitivity,
    cooldownMs: settings.cooldownMs,
    onGesture: handleGesture,
    onZoom: setZoom,
    canZoom: Boolean(slides[currentIndex]?.image),
  })

  useEffect(() => {
    if (videoRef.current && stream && videoRef.current.srcObject !== stream) {
      videoRef.current.srcObject = stream
      void videoRef.current.play().catch(() => {
        // The preview remains available when playback is started by the browser.
      })
    }
  }, [stream])

  const cameraMessage = cameraError
    ? cameraError
    : trackerStatus === 'error'
      ? 'Hand tracking could not start. Check your connection and reload the page.'
      : undefined

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Gesture Room home">
          <span className="brand-mark"><Sparkles size={17} /></span>
          <span>gesture<span className="brand-light">room</span></span>
        </a>
        <div className="topbar-actions">
          <span className={`tracking-pill ${settings.gesturesOn && cameraStatus === 'ready' ? 'is-live' : ''}`}>
            <span className="status-dot" />
            {settings.gesturesOn && cameraStatus === 'ready' ? 'GESTURES LIVE' : 'KEYBOARD READY'}
          </span>
          <button className="icon-button" onClick={() => setShowOnboarding(true)} aria-label="Show gesture guide" title="Gesture guide">
            <CircleHelp size={18} />
          </button>
          <button className={`icon-button ${showSettings ? 'selected' : ''}`} onClick={() => setShowSettings((value) => !value)} aria-label="Toggle settings" aria-expanded={showSettings} title="Settings">
            <Settings2 size={18} />
          </button>
        </div>
      </header>

      <section className="intro-row" aria-label="Presentation status">
        <div>
          <p className="eyebrow"><span className="eyebrow-line" /> A HANDS-FREE PRESENTATION SPACE</p>
          <h1>Ideas, in <span>motion.</span></h1>
        </div>
        <div className={`camera-state ${cameraStatus === 'ready' ? 'camera-ready' : ''}`}>
          <Camera size={15} />
          {cameraStatus === 'ready'
            ? 'Camera connected'
            : cameraStatus === 'requesting'
              ? 'Connecting camera…'
              : cameraStatus === 'off'
                ? 'Camera off'
                : cameraMessage
                  ? 'Camera unavailable'
                  : 'Camera starting'}
        </div>
      </section>

      <div className="workspace">
        <Slideshow zoom={zoom} onNavigate={goToSlide} onToast={showToast} />
        <aside className={`settings-drawer ${showSettings ? 'drawer-open' : ''}`} aria-hidden={!showSettings} inert={!showSettings}>
          <SettingsPanel settings={settings} onChange={updateSettings} cameraStatus={cameraStatus} onClose={() => setShowSettings(false)} />
        </aside>
      </div>

      <footer className="page-footer">
        <span><span className="footer-orb" /> Your space to present</span>
        <span>Built for the flow state <span aria-hidden="true">✳</span></span>
      </footer>

      <WebcamPreview
        videoRef={videoRef}
        landmarks={landmarks}
        enabled={settings.cameraOn}
        cameraStatus={cameraStatus}
        trackerStatus={trackerStatus}
        error={cameraMessage}
        onRetry={retryCamera}
      />
      {toast && <GestureToast key={toast.id} message={toast.message} />}
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
    </main>
  )
}

async function toggleFullscreen() {
  if (document.fullscreenElement) {
    await document.exitFullscreen()
  } else {
    await document.documentElement.requestFullscreen()
  }
}

export default function App() {
  return (
    <AppProvider>
      <GestureDeck />
    </AppProvider>
  )
}
