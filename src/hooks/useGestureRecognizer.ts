import { useEffect, useRef } from 'react'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import {
  clampZoom,
  detectPinch,
  detectSwipe,
  isClosedFist,
  isOpenPalm,
} from '../lib/gestureUtils'
import type { GestureAction, WristSample } from '../lib/gestureUtils'

interface GestureOptions {
  landmarks: NormalizedLandmark[] | null
  enabled: boolean
  sensitivity: number
  cooldownMs: number
  onGesture: (action: GestureAction) => void
  onZoom: (zoom: number) => void
  canZoom: boolean
}

export function useGestureRecognizer({
  landmarks,
  enabled,
  sensitivity,
  cooldownMs,
  onGesture,
  onZoom,
  canZoom,
}: GestureOptions) {
  const samples = useRef<WristSample[]>([])
  const lastTrigger = useRef(0)
  const openPalmSince = useRef<number | null>(null)
  const fistSince = useRef<number | null>(null)
  const openPalmConsumed = useRef(false)
  const fistConsumed = useRef(false)
  const wasPinching = useRef(false)
  const pinchStartDistance = useRef(0)
  const pinchStartZoom = useRef(1)
  const zoomRef = useRef(1)

  useEffect(() => {
    zoomRef.current = 1
    if (!enabled) {
      samples.current = []
      openPalmSince.current = null
      fistSince.current = null
      wasPinching.current = false
      onZoom(1)
    }
  }, [enabled, onZoom])

  useEffect(() => {
    if (!enabled || !landmarks || landmarks.length < 21) {
      samples.current = []
      openPalmSince.current = null
      fistSince.current = null
      openPalmConsumed.current = false
      fistConsumed.current = false
      wasPinching.current = false
      return
    }

    const now = performance.now()
    const wrist = landmarks[0]
    samples.current.push({ x: 1 - wrist.x, y: wrist.y, time: now })
    samples.current = samples.current.filter((sample) => now - sample.time <= 400)

    const cooldownReady = now - lastTrigger.current >= cooldownMs
    if (cooldownReady) {
      const swipe = detectSwipe(samples.current, sensitivity)
      if (swipe) {
        lastTrigger.current = now
        samples.current = []
        onGesture(swipe === 'left' ? 'next' : 'previous')
      }
    }

    const palm = isOpenPalm(landmarks)
    if (palm) {
      if (openPalmSince.current === null) openPalmSince.current = now
      if (!openPalmConsumed.current && now - openPalmSince.current >= 1000 && now - lastTrigger.current >= cooldownMs) {
        openPalmConsumed.current = true
        lastTrigger.current = now
        onGesture('fullscreen')
      }
    } else {
      openPalmSince.current = null
      openPalmConsumed.current = false
    }

    const fist = isClosedFist(landmarks)
    if (fist) {
      if (fistSince.current === null) fistSince.current = now
      if (!fistConsumed.current && now - fistSince.current >= 1000 && now - lastTrigger.current >= cooldownMs) {
        fistConsumed.current = true
        lastTrigger.current = now
        onGesture('reset')
      }
    } else {
      fistSince.current = null
      fistConsumed.current = false
    }

    if (canZoom) {
      const thumb = landmarks[4]
      const index = landmarks[8]
      const distance = Math.hypot(thumb.x - index.x, thumb.y - index.y)
      const pinch = detectPinch(thumb, index, wasPinching.current ? 0.2 : 0.12)
      if (pinch && !wasPinching.current) {
        wasPinching.current = true
        pinchStartDistance.current = distance
        pinchStartZoom.current = zoomRef.current
      } else if (pinch && wasPinching.current) {
        const zoom = clampZoom(pinchStartZoom.current + (distance - pinchStartDistance.current) * 6)
        zoomRef.current = zoom
        onZoom(zoom)
      } else if (!pinch && wasPinching.current && distance > 0.2) {
        wasPinching.current = false
      }
    } else if (wasPinching.current) {
      wasPinching.current = false
      zoomRef.current = 1
      onZoom(1)
    }
  }, [landmarks, enabled, sensitivity, cooldownMs, onGesture, onZoom, canZoom])
}
