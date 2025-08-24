import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export const themes = {
  ocean:    { name:'Ocean',    vars:{ bg:'#061623', text:'#e6f6ff', grad1:'rgba(56,189,248,.20)',  grad2:'rgba(14,165,233,.18)', accent:'#38bdf8', accent2:'#06b6d4' } },
  sunset:   { name:'Sunset',   vars:{ bg:'#1b0c10', text:'#ffe7e7', grad1:'rgba(251,113,133,.22)', grad2:'rgba(249,115,22,.18)',  accent:'#fb7185', accent2:'#f97316' } },
  forest:   { name:'Forest',   vars:{ bg:'#0a1410', text:'#eafbef', grad1:'rgba(34,197,94,.22)',   grad2:'rgba(16,185,129,.22)',  accent:'#22c55e', accent2:'#10b981' } },
  midnight: { name:'Midnight', vars:{ bg:'#0a0a18', text:'#e6e6ff', grad1:'rgba(99,102,241,.20)',  grad2:'rgba(139,92,246,.18)',  accent:'#6366f1', accent2:'#8b5cf6' } },
  candy:    { name:'Candy',    vars:{ bg:'#1a0b17', text:'#ffeefe', grad1:'rgba(244,114,182,.24)', grad2:'rgba(192,132,252,.22)', accent:'#f472b6', accent2:'#c084fc' } },
  neon:     { name:'Neon',     vars:{ bg:'#070b0c', text:'#eafffb', grad1:'rgba(34,197,94,.28)',   grad2:'rgba(20,184,166,.24)',  accent:'#22c55e', accent2:'#14b8a6' } },
  aurora:   { name:'Aurora',   vars:{ bg:'#0a0f14', text:'#e7f6ff', grad1:'rgba(56,189,248,.20)',  grad2:'rgba(34,197,94,.22)',   accent:'#60a5fa', accent2:'#22c55e' } },
  royal:    { name:'Royal',    vars:{ bg:'#0f0b19', text:'#efe7ff', grad1:'rgba(99,102,241,.24)',  grad2:'rgba(168,85,247,.22)',  accent:'#7c3aed', accent2:'#a78bfa' } },
  sand:     { name:'Sand',     vars:{ bg:'#121313', text:'#f8fafc', grad1:'rgba(245,158,11,.22)',  grad2:'rgba(251,146,60,.22)',  accent:'#f59e0b', accent2:'#fb923c' } },
  rose:     { name:'Rose',     vars:{ bg:'#1a0b0f', text:'#ffe4e6', grad1:'rgba(244,63,94,.26)',   grad2:'rgba(251,113,133,.22)', accent:'#f43f5e', accent2:'#fb7185' } },
  glacier:  { name:'Glacier',  vars:{ bg:'#08131a', text:'#ebf8ff', grad1:'rgba(125,211,252,.22)', grad2:'rgba(59,130,246,.20)',  accent:'#60a5fa', accent2:'#93c5fd' } },
  ember:    { name:'Ember',    vars:{ bg:'#180b0b', text:'#ffeaea', grad1:'rgba(239,68,68,.24)',   grad2:'rgba(251,146,60,.20)',  accent:'#ef4444', accent2:'#fb923c' } },
  citrus:   { name:'Citrus',   vars:{ bg:'#101306', text:'#f7ffe6', grad1:'rgba(132,204,22,.24)',  grad2:'rgba(250,204,21,.22)',  accent:'#84cc16', accent2:'#facc15' } },
  lagoon:   { name:'Lagoon',   vars:{ bg:'#061817', text:'#e6fffb', grad1:'rgba(34,197,94,.24)',   grad2:'rgba(59,130,246,.20)',  accent:'#10b981', accent2:'#3b82f6' } },
  orchid:   { name:'Orchid',   vars:{ bg:'#18091a', text:'#ffe9ff', grad1:'rgba(147,51,234,.28)',  grad2:'rgba(244,114,182,.22)', accent:'#a855f7', accent2:'#f472b6' } },
  graphite: { name:'Graphite', vars:{ bg:'#0c0c0c', text:'#e7e7e7', grad1:'rgba(156,163,175,.28)', grad2:'rgba(75,85,99,.24)',    accent:'#9ca3af', accent2:'#6b7280' } },
  solar:    { name:'Solar',    vars:{ bg:'#120f08', text:'#fff7e6', grad1:'rgba(250,204,21,.30)',  grad2:'rgba(245,158,11,.26)',  accent:'#fbbf24', accent2:'#f59e0b' } },
  mint:     { name:'Mint',     vars:{ bg:'#08140f', text:'#eafff7', grad1:'rgba(16,185,129,.28)',  grad2:'rgba(45,212,191,.24)',  accent:'#10b981', accent2:'#2dd4bf' } },
  plum:     { name:'Plum',     vars:{ bg:'#130818', text:'#f6eaff', grad1:'rgba(168,85,247,.28)',  grad2:'rgba(236,72,153,.24)',  accent:'#a78bfa', accent2:'#ec4899' } },
  cobalt:   { name:'Cobalt',   vars:{ bg:'#070c1a', text:'#e6efff', grad1:'rgba(59,130,246,.30)',  grad2:'rgba(99,102,241,.26)',  accent:'#3b82f6', accent2:'#6366f1' } },
}
const keys = Object.keys(themes)
const ThemeContext = createContext(null)
export const useTheme = () => useContext(ThemeContext)

function apply(vars){
  const r = document.documentElement.style
  r.setProperty('--bg', vars.bg)
  r.setProperty('--text', vars.text)
  r.setProperty('--grad1', vars.grad1)
  r.setProperty('--grad2', vars.grad2)
  r.setProperty('--accent', vars.accent)
  r.setProperty('--accent-2', vars.accent2)
}

export function ThemeProvider({ children }){
  const [key, setKey] = useState(()=> localStorage.getItem('vg_theme') || 'midnight')
  useEffect(()=>{ const t = themes[key] || themes.midnight; apply(t.vars); localStorage.setItem('vg_theme', key) }, [key])
  const cycleTheme = () => { const idx = keys.indexOf(key); const next = keys[(idx + 1) % keys.length]; setKey(next) }
  const value = useMemo(()=>({ key, setKey, cycleTheme, themes, keys }), [key])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
