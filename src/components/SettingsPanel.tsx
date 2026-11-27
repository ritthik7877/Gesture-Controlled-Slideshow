import { Camera, Hand, SlidersHorizontal, X } from 'lucide-react'
import type { GestureSettings } from '../context/AppContext'
import type { CameraStatus } from '../hooks/useWebcam'

interface SettingsPanelProps {
  settings: GestureSettings
  onChange: (settings: Partial<GestureSettings>) => void
  cameraStatus: CameraStatus
  onClose: () => void
}

export function SettingsPanel({ settings, onChange, cameraStatus, onClose }: SettingsPanelProps) {
  return (
    <section className="settings-panel" aria-label="Presentation settings">
      <div className="settings-heading">
        <span><SlidersHorizontal size={16} /> QUICK SETTINGS</span>
        <button className="settings-dismiss" onClick={onClose} aria-label="Close settings"><X size={15} /></button>
      </div>
      <label className="setting-toggle-row">
        <span className="setting-symbol"><Hand size={17} /></span>
        <span className="setting-copy"><strong>Gesture control</strong><small>Navigate hands-free</small></span>
        <input aria-label="Gesture control" type="checkbox" checked={settings.gesturesOn} onChange={(event) => onChange({ gesturesOn: event.target.checked })} />
      </label>
      <label className="setting-toggle-row">
        <span className="setting-symbol"><Camera size={17} /></span>
        <span className="setting-copy"><strong>Camera</strong><small>{cameraStatus === 'ready' ? 'Connected' : cameraStatus === 'error' ? 'Needs attention' : 'Webcam access'}</small></span>
        <input aria-label="Camera on/off" type="checkbox" checked={settings.cameraOn} onChange={(event) => onChange({ cameraOn: event.target.checked })} />
      </label>
      <div className="range-setting">
        <div className="range-label"><label htmlFor="sensitivity"><strong>Swipe sensitivity</strong></label><span>{Math.round((0.3 - settings.sensitivity) / 0.24 * 100)}%</span></div>
        <input id="sensitivity" type="range" min="0.06" max="0.3" step="0.01" value={settings.sensitivity} onChange={(event) => onChange({ sensitivity: Number(event.target.value) })} />
        <div className="range-ends"><span>MORE SENSITIVE</span><span>LESS</span></div>
      </div>
      <div className="range-setting">
        <div className="range-label"><label htmlFor="cooldown"><strong>Gesture cooldown</strong></label><span>{settings.cooldownMs} ms</span></div>
        <input id="cooldown" type="range" min="400" max="1600" step="100" value={settings.cooldownMs} onChange={(event) => onChange({ cooldownMs: Number(event.target.value) })} />
        <div className="range-ends"><span>QUICK</span><span>STEADY</span></div>
      </div>
      <p className="settings-note">Changes are applied instantly. Camera access stays on this device.</p>
    </section>
  )
}
