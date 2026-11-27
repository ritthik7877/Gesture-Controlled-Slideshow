export interface Point {
  x: number
  y: number
}

export interface WristSample extends Point {
  time: number
}

export type SwipeDirection = 'left' | 'right'
export type GestureAction = 'next' | 'previous' | 'fullscreen' | 'reset'

export function distanceBetween(first: Point, second: Point): number {
  return Math.hypot(first.x - second.x, first.y - second.y)
}

export function detectPinch(
  thumbTip: Point,
  indexTip: Point,
  threshold = 0.12,
): boolean {
  return distanceBetween(thumbTip, indexTip) <= threshold
}

export function detectSwipe(
  samples: WristSample[],
  threshold = 0.14,
  maxDurationMs = 400,
): SwipeDirection | null {
  if (samples.length < 2) return null
  const latest = samples[samples.length - 1]
  const first = samples.find((sample) => latest.time - sample.time <= maxDurationMs)
  if (!first || first === latest || latest.time - first.time < 80) return null
  const delta = latest.x - first.x
  if (delta >= threshold) return 'right'
  if (delta <= -threshold) return 'left'
  return null
}

export function isOpenPalm(landmarks: Point[]): boolean {
  return [8, 12, 16, 20].every((tip, index) => {
    const pip = [6, 10, 14, 18][index]
    return landmarks[tip].y < landmarks[pip].y
  })
}

export function isClosedFist(landmarks: Point[]): boolean {
  return [8, 12, 16, 20].every((tip, index) => {
    const pip = [6, 10, 14, 18][index]
    return landmarks[tip].y > landmarks[pip].y
  })
}

export function clampZoom(value: number): number {
  return Math.min(2.4, Math.max(1, value))
}
