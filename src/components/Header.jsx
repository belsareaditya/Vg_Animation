import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Header(){
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const onBack = () => navigate(-1)

  const isBackPage = location.pathname === '/subscriptions' || location.pathname === '/pay'

  return (
    <div className="flex items-center justify-between w-full">
      {isBackPage ? (
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-lg font-bold hover:bg-white/10"
          aria-label="Back to previous"
        >
          <span className="text-xl">←</span>
          <span>Back to Previous</span>
        </button>
      ) : (
        <Link to={user?'/vault':'/'} className="flex items-center gap-3 group">
          <div className="grid place-items-center size-9 rounded-xl bg-white/10 border border-white/10">🔐</div>
          <h1 className="text-2xl font-extrabold tracking-tight group-hover:text-white">Vault Guard</h1>
        </Link>
      )}

      <div className="flex items-center gap-2">
        {user && (
          <Link to="/subscriptions" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
            Subscriptions
          </Link>
        )}
        {!user && (
          <Link to="/login" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
            Login
          </Link>
        )}
      </div>
    </div>
  )
}
