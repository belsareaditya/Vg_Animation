import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext.jsx'
import { motion, AnimatePresence } from 'framer-motion'

const PLANS = [
  { id:'starter', title:'Starter', price:0, period:'forever', bullets:['Store up to 50 creds','Basic vault encryption','Local backup & restore'], icon:'🔰' },
  { id:'plus', title:'Plus', price:79, period:'/ month', bullets:['Up to 200 credentials','Stronger encryption','Email support'], icon:'➕' },
  { id:'pro', title:'Pro', price:199, period:'/ month', bullets:['Unlimited credentials','Advanced encryption','Multi-device sync'], icon:'👑' },
  { id:'family', title:'Family', price:299, period:'/ month', bullets:['Upto 5 family members','Shared vaults recovery','Activity reports'], icon:'👨‍👩‍👧‍👦' },
  { id:'lifetime', title:'Lifetime', price:3999, period:'/ one-time', bullets:['All Pro features forever','Offline access pack','Early access to features'], icon:'💎' },
  { id:'lifetime', title:'Life-Plus', price:5000, period:'/ one-time', bullets:['Lifetime Pass','Cloud Storage','Access to Beta features'], icon:'👑' },
]

export default function Subscriptions(){
  const { add, items, remove, subtotal } = useCart()
  const navigate = useNavigate()

  return (
    <div style={{ fontSize: '18px' }} className="mt-8 flex gap-8">
      {/* LEFT: Plans */}
      <div className="flex-1">
        <h2 className="text-3xl font-extrabold mb-5">VaultGuard Subscriptions</h2>

        {/* Fixed 3 columns on xl, 2 on md, 1 on mobile */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {PLANS.map(p => (
            <motion.div key={p.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
              <div
                className="
                  p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur
                  h-full flex flex-col
                "
              >
                <div className="flex items-center gap-4">
                  <div className="grid place-items-center w-12 h-12 rounded-xl bg-white/10 border border-white/10 text-xl">
                    {p.icon}
                  </div>
                  <div>
                    <div className="text-xl font-extrabold">{p.title}</div>
                    <div className="font-black text-2xl">
                      ₹{p.price.toLocaleString('en-IN')}
                      <span className="text-xs font-semibold ml-1">{p.period}</span>
                    </div>
                  </div>
                </div>

                <ul className="mt-4 space-y-1 text-base opacity-90 list-disc list-inside">
                  {p.bullets.map((b,i)=>(
                    <li key={i} className="whitespace-nowrap">{b}</li>
                  ))}
                </ul>

                <div className="mt-5 flex-1" />

                <button
                  onClick={()=>add({id:p.id,title:p.title,price:p.price,period:p.period})}
                  className="btn w-full text-white py-3 text-base"
                  style={{background:'var(--accent)'}}
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* RIGHT: Cart */}
      <div className="w-full xl:w-96 self-start">
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold">Your Cart</h3>
            <span className="text-sm opacity-80">{items.length} items</span>
          </div>

          <div className="mt-5 space-y-3">
            <AnimatePresence initial={false}>
              {items.length===0 ? (
                <p className="text-base opacity-80">No subscriptions selected yet.</p>
              ) : (
                items.map(it => (
                  <motion.div
                    key={it.id}
                    initial={{opacity:0,y:8}}
                    animate={{opacity:1,y:0}}
                    exit={{opacity:0,y:-8}}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <div>
                      <div className="font-semibold">
                        {it.title}{it.qty>1 && <span className="text-xs opacity-80"> ×{it.qty}</span>}
                      </div>
                      <div className="text-sm opacity-80">₹{it.price.toLocaleString('en-IN')} {it.period}</div>
                    </div>
                    <button
                      onClick={()=>remove(it.id)}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/10"
                    >
                      Remove
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="mt-5 border-t border-white/10 pt-4 flex items-center justify-between">
            <div className="text-base opacity-80">Total</div>
            <div className="text-2xl font-black">₹{subtotal.toLocaleString('en-IN')}</div>
          </div>

          <button
            onClick={()=>navigate('/pay')}
            disabled={items.length===0}
            className="btn w-full text-white py-3 text-base enabled:hover:opacity-90 disabled:opacity-50 mt-3"
            style={{background:'var(--accent-2)'}}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}
