import type { SlideData } from '../data/slides'

interface SlideProps {
  slide: SlideData
  zoom: number
}

export function Slide({ slide, zoom }: SlideProps) {
  return (
    <article
      className="slide-content"
      aria-live="polite"
      aria-label={slide.title.replace('\n', ' ')}
    >
      <div className="slide-copy">
        <p className="slide-eyebrow"><span />{slide.eyebrow}</p>
        <h2>{slide.title.split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h2>
        <ul className="slide-bullets">
          {slide.bullets.map((bullet, index) => (
            <li key={bullet}><span className="bullet-index">0{index + 1}</span>{bullet}</li>
          ))}
        </ul>
        <p className="slide-signoff"><span className={`signoff-mark accent-${slide.accent}`} /> Make your next move</p>
      </div>
      {slide.image && (
        <div className={`slide-image-frame accent-${slide.accent}`}>
          <img
            src={slide.image}
            alt={slide.imageAlt ?? ''}
            className="slide-image"
            style={{ transform: `scale(${zoom})` }}
          />
          <div className="image-caption">
            <span>FIELD NOTES</span>
            <span>{slide.number} / 04</span>
          </div>
          <span className="image-sparkle" aria-hidden="true">✳</span>
          <span className="image-zoom-indicator" aria-live="polite">{Math.round(zoom * 100)}%</span>
        </div>
      )}
    </article>
  )
}
