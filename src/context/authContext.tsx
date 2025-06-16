"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { axiosInstanceBackendUsuarios } from "../Service/AxiosConfig" 

interface JWTPayload {
  userId: string
}

type AuthState = {
  token: string | null
  role: "STUDENT" | "TEACHER" | null
  username: string | null
  loginDate: string | null
  logoutDate: string | null
  setAuth: (data: { token: string; role: "STUDENT" | "TEACHER"; username: string }) => void
  logout: () => Promise<void>
  getSessionDurationMinutes: () => number | null
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token_matemix"))
  const [role, setRole] = useState<"STUDENT" | "TEACHER" | null>(
    localStorage.getItem("role_matemix") as "STUDENT" | "TEACHER" | null,
  )
  const [username, setUsername] = useState<string | null>(localStorage.getItem("username_matemix"))
  const [loginDate, setLoginDate] = useState<string | null>(localStorage.getItem("loginDate_matemix"))
  const [logoutDate, setLogoutDate] = useState<string | null>(localStorage.getItem("logoutDate_matemix"))

  const setAuth = ({ token, role, username }: { token: string; role: "STUDENT" | "TEACHER"; username: string }) => {
    const currentLoginDate = new Date().toISOString()

    let userId = username 
    try {
      const decodedToken = jwtDecode<JWTPayload>(token)
      userId = decodedToken.userId || username
    } catch (error) {
      console.error("Error decodificando JWT:", error)
    }

    setToken(token)
    setRole(role)
    setUsername(username)
    setLoginDate(currentLoginDate)
    setLogoutDate(null)

    localStorage.setItem("token_matemix", token)
    localStorage.setItem("username_matemix", username)
    localStorage.setItem("userId_matemix", userId) // Ahora usa el ID real del JWT
    localStorage.setItem("role_matemix", role)
    localStorage.setItem("loginDate_matemix", currentLoginDate)
    localStorage.removeItem("logoutDate_matemix")
  }

  const getSessionDurationMinutes = (): number | null => {
    if (!loginDate) return null

    const endDate = logoutDate ? new Date(logoutDate) : new Date()
    const startDate = new Date(loginDate)

    const durationMs = endDate.getTime() - startDate.getTime()
    const durationMinutes = Math.round(durationMs / (1000 * 60))

    return durationMinutes
  }

  const incrementarMinutosAlumno = async (alumnoId: string, minutos: number): Promise<void> => {
    try {
      const response = await axiosInstanceBackendUsuarios.put(`alumno/minutos/incrementar/${alumnoId}`, minutos, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Minutos incrementados correctamente:", response.data)
    } catch (error) {
      console.error("Error incrementando minutos:", error)
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    const currentLogoutDate = new Date().toISOString()
    const currentToken = token
    const currentRole = role
    const currentUsername = username

    const sessionMinutes = getSessionDurationMinutes()


    try {
      if (currentRole === "STUDENT" && sessionMinutes && sessionMinutes > 0) {
        const alumnoId = localStorage.getItem("userId_matemix")

        if (alumnoId && currentToken) {
          await incrementarMinutosAlumno(alumnoId, sessionMinutes)
        }
      }
    } catch (error) {
      console.error(error)
    }

    setToken(null)
    setRole(null)
    setUsername(null)
    setLoginDate(null)
    setLogoutDate(currentLogoutDate)

    localStorage.setItem("logoutDate_matemix", currentLogoutDate)

    localStorage.removeItem("token_matemix")
    localStorage.removeItem("username_matemix")
    localStorage.removeItem("userId_matemix")
    localStorage.removeItem("role_matemix")
    localStorage.removeItem("loginDate_matemix")
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        username,
        loginDate,
        logoutDate,
        setAuth,
        logout,
        getSessionDurationMinutes,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
