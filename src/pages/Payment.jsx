import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext.jsx'

function luhnCheck(num){ const s=num.replace(/\D/g,''); let sum=0,dbl=false; for(let i=s.length-1;i>=0;i--){ let d=parseInt(s[i],10); if(dbl){ d*=2; if(d>9)d-=9 } sum+=d; dbl=!dbl } return s.length>=12 && sum%10===0 }
const useCardFormat = ()=>{ const [value,setValue]=useState(''); const set=(v)=>{ const digits=v.replace(/\D/g,'').slice(0,19); const groups=digits.match(/.{1,4}/g)||[]; setValue(groups.join(' ')) }; return {value,setValue:set} }

export default function Payment(){
  const { items, subtotal, clear } = useCart()
  const navigate = useNavigate()
  const card = useCardFormat()
  const [name,setName] = useState('')
  const [expiry,setExpiry] = useState('')
  const [cvv,setCvv] = useState('')
  const [agree,setAgree] = useState(false)
  const [errors,setErrors] = useState({})

  const submit = (e)=>{
    e.preventDefault()
    const errs={}
    if(!name.trim()) errs.name='Name required'
    if(!luhnCheck(card.value)) errs.card='Invalid card number'
    if(!/^\d{2}\/\d{2}$/.test(expiry)) errs.exp='Use MM/YY'
    if(!/^\d{3,4}$/.test(cvv)) errs.cvv='3–4 digit CVV'
    if(!agree) errs.agree='Accept terms'
    setErrors(errs)
    if(Object.keys(errs).length) return
    clear()
    navigate('/vault',{replace:true})
    alert('Payment successful — demo only')
  }

  return (
    <div className="mt-6 lg:flex lg:items-start lg:gap-6">
      <div className="w-full lg:max-w-xl p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
        <h2 className="text-xl font-extrabold">Payment</h2>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <label className="block"><span className="mb-1 block text-sm">Full name</span>
            <input value={name} onChange={(e)=>setName(e.target.value)} className="input" placeholder="Bonnie Green" />
            {errors.name && <p className="text-xs text-red-300 mt-1">{errors.name}</p>}
          </label>
          <label className="block"><span className="mb-1 block text-sm">Card number</span>
            <input value={card.value} onChange={(e)=>card.setValue(e.target.value)} inputMode="numeric" className="input" placeholder="1234 5678 9012 3456" />
            {errors.card && <p className="text-xs text-red-300 mt-1">{errors.card}</p>}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="mb-1 block text-sm">Expiry (MM/YY)</span>
              <input value={expiry} onChange={(e)=>setExpiry(e.target.value.replace(/[^\d/]/g,'').slice(0,5))} className="input" placeholder="12/27" />
              {errors.exp && <p className="text-xs text-red-300 mt-1">{errors.exp}</p>}
            </label>
            <label className="block"><span className="mb-1 block text-sm">CVV</span>
              <input value={cvv} onChange={(e)=>setCvv(e.target.value.replace(/\D/g,'').slice(0,4))} inputMode="numeric" className="input" placeholder="•••" />
              {errors.cvv && <p className="text-xs text-red-300 mt-1">{errors.cvv}</p>}
            </label>
          </div>
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} className="size-4 rounded border-white/20 bg-white/10" />I agree to the Terms & Privacy.</label>
          {errors.agree && <p className="text-xs text-red-300 -mt-2">{errors.agree}</p>}
          <button type="submit" disabled={items.length===0 && subtotal===0} className="btn w-full text-white enabled:hover:opacity-90 disabled:opacity-50" style={{background:'var(--accent-2)'}}>Pay now</button>
        </form>
      </div>
      <div className="mt-6 lg:mt-0 grow">
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          <h3 className="text-lg font-extrabold">Order Summary</h3>
          <div className="mt-4 space-y-2">
            {items.length===0 ? (<p className="text-sm opacity-80">Your cart is empty.</p>) : (
              items.map(x => (
                <div key={x.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <div><div className="font-semibold">{x.title}</div><div className="text-xs opacity-80">Qty {x.qty} · ₹{x.price.toLocaleString('en-IN')} {x.period}</div></div>
                  <div className="font-bold">₹{(x.price*x.qty).toLocaleString('en-IN')}</div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 border-t border-white/10 pt-3 flex items-center justify-between"><div className="text-sm opacity-80">Total</div><div className="text-xl font-black">₹{subtotal.toLocaleString('en-IN')}</div></div>
          <p className="mt-3 text-[11px] opacity-80">Payment processed in demo mode. No card data stored.</p>
        </div>
      </div>
    </div>
  )
}
