import React, { createContext, useContext, useState } from "react"

type AuthState = {
  token: string | null
  role: "STUDENT" | "TEACHER" | null
  username: string | null
  setAuth: (data: { token: string, role: "STUDENT" | "TEACHER", username: string }) => void
  logout: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token_matemix"))
  const [role, setRole] = useState<"STUDENT" | "TEACHER" | null>(null)
  const [username, setUsername] = useState<string | null>(localStorage.getItem("username_matemix"))

  const setAuth = ({ token, role, username }: { token: string, role: "STUDENT" | "TEACHER", username: string }) => {
    setToken(token)
    setRole(role)
    setUsername(username)
    localStorage.setItem("token_matemix", token)
    localStorage.setItem("username_matemix", username)
    localStorage.setItem("userId_matemix", username)
    localStorage.setItem("role_matemix", role)
  }

  const logout = () => {
    setToken(null)
    setRole(null)
    setUsername(null)
    localStorage.removeItem("token_matemix")
    localStorage.removeItem("username_matemix")
    localStorage.removeItem("userId_matemix")
  }

  return (
    <AuthContext.Provider value={{ token, role, username, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}