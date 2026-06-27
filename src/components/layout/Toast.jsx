import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] px-4 py-2.5 rounded-full text-sm font-medium shadow-lg glass-card theme-heading">
          {toast}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
