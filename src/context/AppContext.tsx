import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export interface GestureSettings {
  gesturesOn: boolean
  cameraOn: boolean
  sensitivity: number
  cooldownMs: number
}

interface AppState {
  currentIndex: number
  setCurrentIndex: (index: number) => void
  settings: GestureSettings
  updateSettings: (settings: Partial<GestureSettings>) => void
}

const AppContext = createContext<AppState | null>(null)
const defaultSettings: GestureSettings = {
  gesturesOn: true,
  cameraOn: true,
  sensitivity: 0.14,
  cooldownMs: 800,
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [settings, setSettings] = useState(defaultSettings)
  const value = useMemo<AppState>(() => ({
    currentIndex,
    setCurrentIndex,
    settings,
    updateSettings: (next) => setSettings((previous) => ({ ...previous, ...next })),
  }), [currentIndex, settings])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppState() {
  const value = useContext(AppContext)
  if (!value) throw new Error('useAppState must be used within AppProvider')
  return value
}
