
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Signup(){
  const nav = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' })
  const onChange = e => setForm(f => ({...f, [e.target.name]: e.target.value}))
  const onSubmit = e => {
    e.preventDefault()
    if(!form.name || !form.email || !form.password || !form.confirm){ alert('Please fill all fields'); return }
    if(form.password !== form.confirm){ alert('Passwords do not match'); return }
    // In a real app you'd POST to your API here.
    nav('/login', { replace:true })
  }
  return (
    <div className="grid place-items-center mt-10">
      <div className="p-8 rounded-2xl shadow-xl max-w-md w-full bg-white/5 border border-white/10 backdrop-blur">
        <h2 className="text-center text-2xl font-bold">Save Details</h2>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input className="input" placeholder="Full Name" name="name" value={form.name} onChange={onChange} />
          <input className="input" placeholder="Email" type="email" name="email" value={form.email} onChange={onChange} />
          <input className="input" placeholder="Password" type="password" name="password" value={form.password} onChange={onChange} />
          <input className="input" placeholder="Confirm Password" type="password" name="confirm" value={form.confirm} onChange={onChange} />
          <button className="btn w-full text-white" style={{background:'var(--accent)'}}>Save Details</button>
        </form>
        <p className="text-xs opacity-70 mt-2 text-center">You will be redirected to the Login page after creating the account.</p>
      </div>
    </div>
  )
}
