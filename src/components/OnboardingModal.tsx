import { useEffect } from 'react'
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Hand, Maximize2, MoveUpRight, X } from 'lucide-react'

const gestures = [
  { icon: ArrowLeftRight, title: 'Swipe left or right', description: 'Move your hand across the frame to change slides.' },
  { icon: Hand, title: 'Open palm · hold 1 sec', description: 'Show an open hand to enter or exit fullscreen.' },
  { icon: ArrowDownLeft, title: 'Closed fist · hold 1 sec', description: 'Make a fist to return to the first slide.' },
  { icon: MoveUpRight, title: 'Pinch to zoom', description: 'Pinch the image, then spread or close your fingers.' },
]

export function OnboardingModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="onboarding-modal" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
        <button className="modal-close" onClick={onClose} aria-label="Close gesture guide"><X size={17} /></button>
        <div className="modal-icon"><Maximize2 size={19} /></div>
        <p className="eyebrow">YOUR HANDS, YOUR SHORTCUTS</p>
        <h2 id="onboarding-title">A few gestures.<br /><span>And you’re off.</span></h2>
        <p className="modal-description">Keep your hand in view of the camera and move naturally.</p>
        <ul className="gesture-list">
          {gestures.map(({ icon: Icon, title, description }, index) => (
            <li key={title}>
              <span className="gesture-icon"><Icon size={18} /></span>
              <span><strong>{title}</strong><small>{description}</small></span>
              <span className="gesture-step">0{index + 1}</span>
            </li>
          ))}
        </ul>
        <div className="modal-tip"><ArrowUpRight size={15} /><span>Prefer the keyboard? Use <kbd>←</kbd> and <kbd>→</kbd> anytime.</span></div>
        <button className="modal-cta" onClick={onClose}>Got it, let’s go <ArrowUpRight size={16} /></button>
      </section>
    </div>
  )
}
