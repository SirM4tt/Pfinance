import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Clear stale PWA service workers that may cache old broken CSS
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister())
  })
}

createRoot(document.getElementById('root')).render(<App />)
