import { registerSW } from 'virtual:pwa-register'

const UPDATE_EVENT = 'pwa-update-available'

export function onPwaUpdateAvailable(callback) {
  window.addEventListener(UPDATE_EVENT, callback)
  return () => window.removeEventListener(UPDATE_EVENT, callback)
}

function notifyUpdateAvailable() {
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT))
}

function watchRegistration(registration) {
  if (!registration) return

  if (registration.waiting && navigator.serviceWorker.controller) {
    notifyUpdateAvailable()
  }

  registration.addEventListener('updatefound', () => {
    const worker = registration.installing
    if (!worker) return

    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        notifyUpdateAvailable()
      }
    })
  })

  const checkForUpdates = () => registration.update().catch(() => {})
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForUpdates()
  })
  window.addEventListener('focus', checkForUpdates)
  setInterval(checkForUpdates, 60 * 60 * 1000)
}

export function initPwa() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return

  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true
    window.location.reload()
  })

  registerSW({
    immediate: true,
    onNeedRefresh() {
      notifyUpdateAvailable()
    },
    onRegisteredSW(_swUrl, registration) {
      watchRegistration(registration)
    },
  })
}

export async function applyPwaUpdate() {
  const registration = await navigator.serviceWorker.getRegistration()
  if (registration?.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    return
  }
  window.location.reload()
}
