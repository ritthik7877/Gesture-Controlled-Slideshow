import { useEffect, useRef } from 'react'
import { Camera, RefreshCw, VideoOff } from 'lucide-react'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import type { RefObject } from 'react'
import type { CameraStatus } from '../hooks/useWebcam'
import type { TrackerStatus } from '../hooks/useHandTracker'

interface WebcamPreviewProps {
  videoRef: RefObject<HTMLVideoElement | null>
  landmarks: NormalizedLandmark[] | null
  enabled: boolean
  cameraStatus: CameraStatus
  trackerStatus: TrackerStatus
  error?: string
  onRetry: () => void
}

const connections: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
]

export function WebcamPreview({ videoRef, landmarks, enabled, cameraStatus, trackerStatus, error, onRetry }: WebcamPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const ratio = window.devicePixelRatio || 1
    canvas.width = width * ratio
    canvas.height = height * ratio
    context.setTransform(-ratio, 0, 0, ratio, width * ratio, 0)
    context.clearRect(0, 0, width, height)
    if (!landmarks) return

    context.strokeStyle = 'rgba(190, 245, 207, .8)'
    context.lineWidth = 1.5
    connections.forEach(([start, end]) => {
      context.beginPath()
      context.moveTo(landmarks[start].x * width, landmarks[start].y * height)
      context.lineTo(landmarks[end].x * width, landmarks[end].y * height)
      context.stroke()
    })
    context.fillStyle = '#d7ffdf'
    landmarks.forEach((point) => {
      context.beginPath()
      context.arc(point.x * width, point.y * height, 2.25, 0, Math.PI * 2)
      context.fill()
    })
  }, [landmarks])

  if (!enabled) {
    return <div className="camera-off-card"><VideoOff size={16} /><span>Camera is off</span></div>
  }

  return (
    <aside className="webcam-card" aria-label="Webcam and hand tracking preview">
      <div className="webcam-media">
        <video ref={videoRef} autoPlay muted playsInline aria-label="Mirrored webcam preview" />
        <canvas ref={canvasRef} aria-hidden="true" />
        {cameraStatus !== 'ready' && (
          <div className="webcam-placeholder">
            {cameraStatus === 'error' ? <VideoOff size={20} /> : <Camera size={20} />}
            <span>{cameraStatus === 'requesting' ? 'Connecting…' : cameraStatus === 'error' ? 'Camera unavailable' : 'Starting camera'}</span>
          </div>
        )}
      </div>
      <div className="webcam-info">
        <span className="webcam-status-dot" />
        <span>{trackerStatus === 'loading' ? 'Loading hand tracker…' : trackerStatus === 'ready' ? 'Hand tracking ready' : cameraStatus === 'error' ? 'Camera needs attention' : 'Waiting for hand'}</span>
        {cameraStatus === 'error' && <button className="retry-button" onClick={onRetry} aria-label="Retry camera access"><RefreshCw size={13} /></button>}
      </div>
      {error && <p className="camera-error" role="status">{error}</p>}
    </aside>
  )
}
