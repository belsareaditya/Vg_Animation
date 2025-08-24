
import React from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function LogoutFab(){
  const { user, logout } = useAuth()
  if(!user) return null
  return (
    <button
      onClick={logout}
      title="Logout"
      className="fixed right-4 top-[84px] z-40 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-red-500/20 hover:border-red-400 hover:text-red-200 transition-colors"
      aria-label="Logout"
    >
      <span className="inline-flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 7V5a2 2 0 0 1 2-2h7v18h-7a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 12H3m0 0 3-3m-3 3 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Logout
      </span>
    </button>
  )
}
