import { useCallback, useEffect, useState } from 'react'

export type CameraStatus = 'off' | 'requesting' | 'ready' | 'error'

interface WebcamState {
  stream: MediaStream | null
  status: CameraStatus
  error: string | null
}

function cameraErrorMessage(error: unknown): string {
  if (error instanceof DOMException && error.name === 'NotAllowedError') {
    return 'Camera permission was denied. Allow camera access in your browser settings, then retry.'
  }
  if (error instanceof DOMException && error.name === 'NotFoundError') {
    return 'No camera was found. Connect a camera or continue with keyboard controls.'
  }
  return 'Could not access the camera. Check that it is connected and not being used by another app.'
}

export function useWebcam(enabled: boolean) {
  const [state, setState] = useState<WebcamState>({
    stream: null,
    status: enabled ? 'requesting' : 'off',
    error: null,
  })
  const [retryToken, setRetryToken] = useState(0)
  const retryCamera = useCallback(() => setRetryToken((value) => value + 1), [])

  useEffect(() => {
    let active = true
    let requestedStream: MediaStream | null = null

    if (!enabled) {
      setState({ stream: null, status: 'off', error: null })
      return
    }

    setState({ stream: null, status: 'requesting', error: null })
    if (!navigator.mediaDevices?.getUserMedia) {
      setState({
        stream: null,
        status: 'error',
        error: 'Camera access is unavailable. Use HTTPS or localhost and a supported browser.',
      })
      return
    }

    void navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((stream) => {
        requestedStream = stream
        if (!active) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        setState({ stream, status: 'ready', error: null })
      })
      .catch((error: unknown) => {
        if (active) setState({ stream: null, status: 'error', error: cameraErrorMessage(error) })
      })

    return () => {
      active = false
      requestedStream?.getTracks().forEach((track) => track.stop())
    }
  }, [enabled, retryToken])

  return { ...state, retryCamera }
}
