import { describe, expect, it } from 'vitest'
import { detectPinch, detectSwipe, distanceBetween } from './gestureUtils'

describe('distanceBetween and detectPinch', () => {
  it('measures landmark distance and recognizes a pinch at the threshold', () => {
    const thumb = { x: 0.4, y: 0.5 }
    const index = { x: 0.48, y: 0.5 }
    expect(distanceBetween(thumb, index)).toBeCloseTo(0.08)
    expect(detectPinch(thumb, index, 0.1)).toBe(true)
    expect(detectPinch(thumb, index, 0.05)).toBe(false)
  })
})

describe('detectSwipe', () => {
  it('detects left and right swipes using the recent wrist samples', () => {
    expect(detectSwipe([
      { x: 0.7, y: 0.5, time: 100 },
      { x: 0.5, y: 0.5, time: 280 },
    ], 0.14)).toBe('left')
    expect(detectSwipe([
      { x: 0.2, y: 0.5, time: 100 },
      { x: 0.4, y: 0.5, time: 280 },
    ], 0.14)).toBe('right')
  })

  it('ignores movements below threshold, stale samples, and incomplete histories', () => {
    expect(detectSwipe([{ x: 0.2, y: 0.5, time: 100 }])).toBeNull()
    expect(detectSwipe([
      { x: 0.2, y: 0.5, time: 100 },
      { x: 0.25, y: 0.5, time: 250 },
    ], 0.14)).toBeNull()
    expect(detectSwipe([
      { x: 0.2, y: 0.5, time: 100 },
      { x: 0.5, y: 0.5, time: 700 },
    ], 0.14)).toBeNull()
  })
})
