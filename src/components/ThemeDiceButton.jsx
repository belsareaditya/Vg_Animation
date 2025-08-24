import React, { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext.jsx'
export default function ThemeDiceButton(){
  const { cycleTheme } = useTheme()
  const [pop, setPop] = useState(false)
  const onClick = () => { setPop(true); setTimeout(()=> setPop(false), 600); cycleTheme() }
  return (
    <button
      className={`theme-fab ${pop ? 'dice-anim' : ''}`}
      aria-label="Change theme"
      onClick={onClick}
      style={{ background:`linear-gradient(135deg, var(--accent), var(--accent-2))` }}
      title="Change Theme"
    >
      <span className="dice inline-block">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="4" fill="url(#g)"/>
          <circle cx="8" cy="8" r="1.6" fill="#fff"/>
          <circle cx="12" cy="12" r="1.6" fill="#fff"/>
          <circle cx="16" cy="16" r="1.6" fill="#fff"/>
          <defs>
            <linearGradient id="g" x1="3" y1="3" x2="21" y2="21">
              <stop offset="0" stopColor="var(--accent)"/>
              <stop offset="1" stopColor="var(--accent-2)"/>
            </linearGradient>
          </defs>
        </svg>
      </span>
    </button>
  )
}
