import React, { createContext, useContext, useMemo, useState } from 'react'
const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null)
  const login = (u) => setUser(u)
  const logout = () => setUser(null)
  const value = useMemo(()=>({user, login, logout}), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
