import { useEffect } from 'react'
import { applyTheme } from '../../lib/themes'

export default function ThemeProvider({ themeId, children }) {
  useEffect(() => {
    applyTheme(themeId || 'navy')
  }, [themeId])

  return children
}
