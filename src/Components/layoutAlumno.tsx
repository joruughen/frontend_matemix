import React from "react"
import { Outlet } from "react-router-dom"
import { ThemeProvider } from "./theme-provider"
import { NavigationAlumno } from "./navigationAlumno"

export default function LayoutAlumno() {
  return (
    <div lang="es" style={{ minHeight: '100vh' }}>
      <ThemeProvider>
        <NavigationAlumno />
        <main style={{ paddingTop: '1rem' }}>
          <Outlet />
        </main>
      </ThemeProvider>
    </div>
  )
}