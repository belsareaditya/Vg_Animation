import React, { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

const categories = [
  { key: 'all', label: 'All', icon: '🔑' },
  { key: 'token', label: 'Tokens', icon: '🧩' },
  { key: 'passkey', label: 'Passkeys', icon: '🧿' },
  { key: 'backup', label: 'Backup', icon: '🔐' },
  { key: 'app', label: 'App', icon: '📱' },
  { key: 'wifi', label: 'Wi-Fi', icon: '📶' },
]

export default function Vault(){
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isUnlocked, setUnlocked] = useState(false)
  const [filterKey, setFilterKey] = useState('all')
  const [query, setQuery] = useState('')
  const [creds, setCreds] = useState([])

  // UI states
  const [visible, setVisible] = useState({})
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  // -------- Form state --------
  const [cat, setCat] = useState('token')
  const [tokenName, setTokenName] = useState('')
  const [tokenPassword, setTokenPassword] = useState('')
  const [passkeys, setPasskeys] = useState([{ app:'', password:'' }])
  const [backupApp, setBackupApp] = useState('')
  const [backupCodes, setBackupCodes] = useState([''])
  const [appName, setAppName] = useState('')
  const [appPassword, setAppPassword] = useState('')
  const [wifiSsid, setWifiSsid] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')

  const addPasskeyRow = () => setPasskeys(r => [...r, { app:'', password:'' }])
  const updatePasskey = (i, field, val) => setPasskeys(rows => rows.map((r,idx)=> idx===i? {...r, [field]:val} : r))
  const removePasskeyRow = (i) => setPasskeys(rows => rows.length>1 ? rows.filter((_,idx)=>idx!==i) : rows)
  const addBackupCode = () => setBackupCodes(arr => [...arr, ''])
  const updateBackupCode = (i, val) => setBackupCodes(arr => arr.map((v,idx)=> idx===i? val : v))
  const removeBackupCode = (i) => setBackupCodes(arr => arr.length>1 ? arr.filter((_,idx)=>idx!==i) : arr)

  const resetForm = () => {
    setTokenName(''); setTokenPassword('');
    setPasskeys([{ app:'', password:'' }]);
    setBackupApp(''); setBackupCodes(['']);
    setAppName(''); setAppPassword('');
    setWifiSsid(''); setWifiPassword('');
  }

  const onAdd = (e) => {
    e.preventDefault()
    let newCred = null
    if(cat === 'token'){
      if(!tokenName.trim() || !tokenPassword.trim()){ alert('Please fill Token Name and Token Password'); return }
      newCred = { id: Date.now().toString(), category:'token', site: tokenName.trim(), token:{ name: tokenName.trim(), password: tokenPassword.trim() } }
    }else if(cat === 'passkey'){
      const rows = passkeys.map(p => ({ app:p.app.trim(), password:p.password.trim() })).filter(p => p.app || p.password)
      if(rows.length===0 || rows.some(p => !p.app || !p.password)){ alert('Add at least one Passkey with App Name and Password'); return }
      newCred = { id: Date.now().toString(), category:'passkey', site: rows.map(r=>r.app).join(', '), passkeys: rows }
    }else if(cat === 'backup'){
      const codes = backupCodes.map(c => c.trim()).filter(Boolean)
      if(!backupApp.trim() || codes.length===0){ alert('Enter App Name and at least one Backup Code'); return }
      newCred = { id: Date.now().toString(), category:'backup', site: backupApp.trim(), app: backupApp.trim(), codes }
    }else if(cat === 'app'){
      if(!appName.trim() || !appPassword.trim()){ alert('Please fill App Name and App Password'); return }
      newCred = { id: Date.now().toString(), category:'app', site: appName.trim(), app: appName.trim(), password: appPassword.trim() }
    }else if(cat === 'wifi'){
      if(!wifiSsid.trim() || !wifiPassword.trim()){ alert('Please fill SSID Name and Wifi Password'); return }
      newCred = { id: Date.now().toString(), category:'wifi', site: wifiSsid.trim(), ssid: wifiSsid.trim(), password: wifiPassword.trim() }
    }
    if(!newCred) return
    setCreds(prev => [newCred, ...prev])
    resetForm()
  }

  const mask = (s) => s ? '•'.repeat(Math.min(10, Math.max(6, s.length))) : ''

  // ---- Search across all fields ----
  const searchableText = (c) => {
    const parts = [c.site, c.email, c.category]
    if(c.category === 'token'){ parts.push(c?.token?.name, c?.token?.password) }
    else if(c.category === 'passkey'){ (c.passkeys||[]).forEach(p => parts.push(p.app, p.password)) }
    else if(c.category === 'backup'){ parts.push(c?.app, ...(c.codes||[])) }
    else if(c.category === 'app'){ parts.push(c?.app, c?.password) }
    else if(c.category === 'wifi'){ parts.push(c?.ssid, c?.password) }
    return (parts.filter(Boolean).join(' ') || '').toLowerCase()
  }

  const filteredByQuery = useMemo(() => {
    const q = (query || '').toLowerCase().trim()
    if(!q) return creds
    return creds.filter(c => searchableText(c).includes(q))
  }, [creds, query])

  const catCount = (key) => key === 'all' ? filteredByQuery.length : filteredByQuery.filter(c => c.category === key).length
  const filtered = useMemo(() => filteredByQuery.filter(c => (filterKey==='all' ? true : c.category === filterKey)), [filteredByQuery, filterKey])

  // Inline actions
  const toggleView = (c) => {
    if(!isUnlocked){ alert('Unlock controls to view credentials.'); return }
    setVisible(v => ({ ...v, [c.id]: !v[c.id] }))
  }
  const askDelete = (id) => {
    if(!isUnlocked){ alert('Unlock controls to delete.'); return }
    setConfirmDeleteId(id)
  }
  const cancelDelete = () => setConfirmDeleteId(null)
  const doDelete = (id) => { setCreds(prev => prev.filter(x => x.id !== id)); setConfirmDeleteId(null) }

  // ESC closes popover
  useEffect(() => {
    const onEsc = (e) => { if(e.key === 'Escape') setConfirmDeleteId(null) }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [])

  return (
    <div style={{ fontSize: '18px' /* base boost */ }}>
      {/* Header */}
      <header className="flex justify-end items-center mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setUnlocked(v => !v)}
            className="btn border border-white/20 bg-white/10"
            style={{ padding: '12px 16px', fontSize: '18px' }}
          >
            {isUnlocked? '🔓 Unlocked' : '🔒 Locked'}
          </button>
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-[320px_1fr]">
        {/* Sidebar */}
        <aside className="p-6 rounded-2xl h-max sticky top-4 bg-white/5 border border-white/10 backdrop-blur">
          <div>
            <h3 className="font-extrabold" style={{ fontSize: '26px' }}>Passwords</h3>
            <input
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              placeholder="Search"
              className="mt-3 w-full input"
              style={{ height: '52px', fontSize: '18px' }}
            />
          </div>
          <div className="grid gap-3 mt-4">
            {categories.map(c => (
              <button
                key={c.key}
                onClick={()=>setFilterKey(c.key)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${filterKey===c.key? 'bg-white/15 border-white/30':'bg-white/5 border-white/10'}`}
                style={{ fontSize: '17px' }}
              >
                <span className="inline-flex items-center gap-3">
                  <span className="grid place-items-center rounded-lg bg-white/10"
                        style={{ width: 40, height: 40, fontSize: '20px' }}>{c.icon}</span>
                  {c.label}
                </span>
                <span className="opacity-80" style={{ fontSize: '14px' }}>{catCount(c.key)}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main column */}
        <div className="grid gap-8 items-start">
          {/* Add New Credential */}
          <section className="p-7 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
            <div className="mb-4" style={{ fontSize: '22px', fontWeight: 800 }}>Add New Credential</div>
            <form onSubmit={onAdd} className="grid gap-5">
              <div className="grid sm:grid-cols-4 gap-4">
                <select
                  value={cat}
                  onChange={(e)=>setCat(e.target.value)}
                  className="input"
                  style={{ height: '52px', fontSize: '18px' }}
                >
                  <option value="token">Token</option>
                  <option value="passkey">Passkey</option>
                  <option value="backup">Backup Codes</option>
                  <option value="app">App Password</option>
                  <option value="wifi">Wifi</option>
                </select>
                <div className="sm:col-span-3 opacity-80" style={{ fontSize: '15px' }}>
                  Choose a category to reveal personalized fields.
                </div>
              </div>

              {cat==='token' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <input value={tokenName} onChange={(e)=>setTokenName(e.target.value)} placeholder="Token Name" className="input" style={{ height:'52px', fontSize:'18px' }}/>
                  <input value={tokenPassword} onChange={(e)=>setTokenPassword(e.target.value)} placeholder="Token Password" className="input" style={{ height:'52px', fontSize:'18px' }}/>
                </div>
              )}

              {cat==='passkey' && (
                <div className="grid gap-4">
                  {passkeys.map((row,idx)=>(
                    <div key={idx} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-center">
                      <input value={row.app} onChange={(e)=>updatePasskey(idx,'app',e.target.value)} placeholder="Passkey App Name" className="input" style={{ height:'52px', fontSize:'18px' }}/>
                      <input value={row.password} onChange={(e)=>updatePasskey(idx,'password',e.target.value)} placeholder="Passkey Password" className="input" style={{ height:'52px', fontSize:'18px' }}/>
                      <div className="flex gap-3">
                        <button type="button" onClick={addPasskeyRow} className="btn text-white" style={{ background:'var(--accent)', padding:'12px 16px', fontSize:'16px' }}>Add</button>
                        <button type="button" onClick={()=>removePasskeyRow(idx)} className="btn bg-white/10 border border-white/20" style={{ padding:'12px 16px', fontSize:'16px' }}>Remove</button>
                      </div>
                    </div>
                  ))}
                  <p className="opacity-70" style={{ fontSize:'14px' }}>Add multiple passkeys if needed.</p>
                </div>
              )}

              {cat==='backup' && (
                <div className="grid gap-4">
                  <input value={backupApp} onChange={(e)=>setBackupApp(e.target.value)} placeholder="App Name" className="input" style={{ height:'52px', fontSize:'18px' }}/>
                  {backupCodes.map((code,idx)=>(
                    <div key={idx} className="grid sm:grid-cols-[1fr_auto] gap-3 items-center">
                      <input value={code} onChange={(e)=>updateBackupCode(idx,e.target.value)} placeholder={`Backup Code ${idx+1}`} className="input" style={{ height:'52px', fontSize:'18px' }}/>
                      <div className="flex gap-3">
                        <button type="button" onClick={addBackupCode} className="btn text-white" style={{ background:'var(--accent)', padding:'12px 16px', fontSize:'16px' }}>Add</button>
                        <button type="button" onClick={()=>removeBackupCode(idx)} className="btn bg-white/10 border border-white/20" style={{ padding:'12px 16px', fontSize:'16px' }}>Remove</button>
                      </div>
                    </div>
                  ))}
                  <p className="opacity-70" style={{ fontSize:'14px' }}>Add multiple backup codes if needed.</p>
                </div>
              )}

              {cat==='app' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <input value={appName} onChange={(e)=>setAppName(e.target.value)} placeholder="App Name" className="input" style={{ height:'52px', fontSize:'18px' }}/>
                  <input value={appPassword} onChange={(e)=>setAppPassword(e.target.value)} placeholder="App Password" className="input" style={{ height:'52px', fontSize:'18px' }}/>
                </div>
              )}

              {cat==='wifi' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <input value={wifiSsid} onChange={(e)=>setWifiSsid(e.target.value)} placeholder="SSID Name" className="input" style={{ height:'52px', fontSize:'18px' }}/>
                  <input value={wifiPassword} onChange={(e)=>setWifiPassword(e.target.value)} placeholder="Wifi Password" className="input" style={{ height:'52px', fontSize:'18px' }}/>
                </div>
              )}

              <div className="flex gap-4">
                <button className="btn text-white" style={{ background:'var(--accent)', padding:'14px 18px', fontSize:'18px' }}>Save</button>
                <button type="button" onClick={resetForm} className="btn bg-white/10 border border-white/20" style={{ padding:'14px 18px', fontSize:'18px' }}>Reset</button>
              </div>
            </form>
          </section>

          {/* Saved Credentials */}
          <section className="p-7 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
            <div className="mb-4" style={{ fontSize:'22px', fontWeight:800 }}>Saved Credentials</div>
            {filtered.length===0 ? (
              <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center opacity-80" style={{ fontSize:'18px' }}>
                No credentials yet — add one above.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map(c => (
                  <div key={c.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-extrabold truncate" style={{ fontSize:'20px' }}>{c.site}</div>
                        {c.category==='token' && (
                          <div className="opacity-90" style={{ fontSize:'16px' }}>
                            <b>Token:</b> {c.token.name} — {visible[c.id] ? c.token.password : mask(c.token.password)}
                          </div>
                        )}
                        {c.category==='passkey' && (
                          <div className="opacity-90" style={{ fontSize:'16px' }}>
                            <b>Passkeys:</b> {c.passkeys.length} — {c.passkeys.map(p=>p.app).join(', ')}
                            {visible[c.id] && (
                              <div className="mt-2 space-y-1">
                                {c.passkeys.map((p,i)=>(
                                  <div key={i} className="font-mono" style={{ fontSize:'14px' }}>
                                    #{i+1} {p.app}: {p.password}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        {c.category==='backup' && (
                          <div className="opacity-90" style={{ fontSize:'16px' }}>
                            <b>Backup Codes:</b> {c.codes.length} for {c.app}
                            {visible[c.id] && (
                              <div className="mt-2 space-y-1">
                                {c.codes.map((code,i)=>(
                                  <div key={i} className="font-mono" style={{ fontSize:'14px' }}>#{i+1}: {code}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        {c.category==='app' && (
                          <div className="opacity-90" style={{ fontSize:'16px' }}>
                            <b>App Password:</b> {visible[c.id] ? c.password : mask(c.password)}
                          </div>
                        )}
                        {c.category==='wifi' && (
                          <div className="opacity-90" style={{ fontSize:'16px' }}>
                            <b>Wi-Fi:</b> {c.ssid} — {visible[c.id] ? c.password : (c.password ? '••••••' : '')}
                          </div>
                        )}
                      </div>
                      <div className="relative flex flex-col sm:flex-row gap-3 shrink-0">
                        <button
                          onClick={()=>toggleView(c)}
                          className="btn bg-white/10 border border-white/20"
                          style={{ padding:'10px 14px', fontSize:'16px' }}
                        >
                          {visible[c.id] ? 'Hide' : 'View'}
                        </button>
                        <button
                          onClick={()=>askDelete(c.id)}
                          className="btn bg-white/10 border border-white/20"
                          style={{ padding:'10px 14px', fontSize:'16px' }}
                        >
                          Delete
                        </button>
                        {confirmDeleteId === c.id && (
                          <div className="absolute right-0 top-full mt-3 z-20 rounded-xl border border-white/20 bg-black/70 backdrop-blur px-4 py-3 shadow-lg" style={{ fontSize:'16px' }}>
                            <div className="mb-3">Delete this credential?</div>
                            <div className="flex gap-3">
                              <button onClick={()=>doDelete(c.id)} className="btn text-white" style={{ background:'var(--accent-2)', padding:'10px 14px' }}>Confirm</button>
                              <button onClick={cancelDelete} className="btn bg-white/10 border border-white/20" style={{ padding:'10px 14px' }}>Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="mt-2">
            <Link to="/subscriptions" className="btn text-white" style={{ background:'var(--accent)', padding:'14px 18px', fontSize:'18px' }}>
              Buy VaultGuard Subscription
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
