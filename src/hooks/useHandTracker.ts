import { useEffect, useState } from 'react'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'

export type TrackerStatus = 'idle' | 'loading' | 'ready' | 'error'

const TASKS_VISION_VERSION = '1.2.3'
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

export function useHandTracker(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  stream: MediaStream | null,
  enabled: boolean,
) {
  const [status, setStatus] = useState<TrackerStatus>('idle')
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[] | null>(null)

  useEffect(() => {
    let active = true
    let animationId = 0
    let landmarker: HandLandmarker | null = null
    let lastVideoTime = -1

    if (!enabled || !stream) {
      setStatus('idle')
      setLandmarks(null)
      return
    }

    setStatus('loading')
    void (async () => {
      try {
        const files = await FilesetResolver.forVisionTasks(
          `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`,
        )
        if (!active) return
        landmarker = await HandLandmarker.createFromOptions(files, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numHands: 1,
        })
        if (!active) {
          landmarker.close()
          return
        }
        setStatus('ready')

        const detectFrame = () => {
          const video = videoRef.current
          if (!active || !video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !landmarker) {
            if (active) animationId = requestAnimationFrame(detectFrame)
            return
          }
          try {
            if (video.currentTime !== lastVideoTime) {
              lastVideoTime = video.currentTime
              const result = landmarker.detectForVideo(video, performance.now())
              setLandmarks(result.landmarks[0] ?? null)
            }
          } catch (error) {
            console.error('MediaPipe hand detection failed:', error)
            setStatus('error')
            setLandmarks(null)
            landmarker.close()
            landmarker = null
            return
          }
          animationId = requestAnimationFrame(detectFrame)
        }
        animationId = requestAnimationFrame(detectFrame)
      } catch (error) {
        if (active) {
          console.error('MediaPipe hand tracking failed to initialize:', error)
          setStatus('error')
        }
      }
    })()

    return () => {
      active = false
      cancelAnimationFrame(animationId)
      landmarker?.close()
    }
  }, [enabled, stream, videoRef])

  return { status, landmarks }
}
