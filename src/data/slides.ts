export interface SlideData {
  title: string
  eyebrow: string
  bullets: string[]
  image?: string
  imageAlt?: string
  accent: string
  number: string
}

export const slides: SlideData[] = [
  {
    title: 'Make room for\nthe remarkable.',
    eyebrow: '01 — THE BIG IDEA',
    bullets: ['Start with a little more curiosity.', 'Make the complicated feel simple.', 'Leave space for what comes next.'],
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Sunrise over a still mountain lake',
    accent: 'lavender',
    number: '01',
  },
  {
    title: 'A new point\nof view.',
    eyebrow: '02 — FIND THE SIGNAL',
    bullets: ['Look beyond the obvious answer.', 'Small shifts create new perspectives.', 'Stay open to a better question.'],
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Ocean waves meeting a clear horizon',
    accent: 'peach',
    number: '02',
  },
  {
    title: 'Built around\nwhat matters.',
    eyebrow: '03 — THE HUMAN PART',
    bullets: ['Make every interaction feel considered.', 'Trade noise for clarity and intention.', 'Let the details do the talking.'],
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Soft light falling through a forest',
    accent: 'mint',
    number: '03',
  },
  {
    title: 'The best is\nahead of us.',
    eyebrow: '04 — WHAT COMES NEXT',
    bullets: ['Keep learning as you go.', 'Make progress visible, not perfect.', 'Create a little momentum every day.'],
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Mountain peaks rising into the clouds',
    accent: 'blue',
    number: '04',
  },
]
