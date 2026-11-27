import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

export function GestureToast({ message }: { message: string }) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1750)
    return () => window.clearTimeout(timer)
  }, [])

  if (!visible) return null
  return <div className="gesture-toast" role="status"><span><Check size={13} /></span>{message}</div>
}
