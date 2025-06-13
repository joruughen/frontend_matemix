import React from "react"
import { Outlet } from "react-router-dom"
import { ThemeProvider } from "./theme-provider"
import { Navigation } from "./navigation"

export default function Layout() {
  return (
    <div lang="es" style={{ minHeight: '100vh' }}>
      <ThemeProvider>
        <Navigation />
        <main style={{ paddingTop: '1rem' }}>
          <Outlet />
        </main>
      </ThemeProvider>
    </div>
  )
}