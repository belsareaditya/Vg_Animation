import React, { createContext, useContext, useMemo, useState } from 'react'
const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)
export const calcSubtotal = (items) => items.reduce((s,x)=> s + (x.price||0)*(x.qty||0), 0)
export const CartProvider = ({children}) => {
  const [items, setItems] = useState([])
  const add = (item) => setItems(prev => { const i = prev.findIndex(x=>x.id===item.id); if(i===-1) return [...prev,{...item, qty:1}]; const copy=[...prev]; copy[i]={...copy[i], qty:copy[i].qty+1}; return copy })
  const remove = (id) => setItems(prev => prev.filter(x=>x.id!==id))
  const clear = () => setItems([])
  const subtotal = useMemo(()=>calcSubtotal(items), [items])
  return <CartContext.Provider value={{items, add, remove, clear, subtotal}}>{children}</CartContext.Provider>
}
