import React from "react"
import { Outlet } from "react-router-dom"
import { ThemeProvider } from "./theme-provider"
import {  NavigationProfesor } from "./navigationProfesor"

export default function LayoutProfesor() {
  return (
    <div lang="es" style={{ minHeight: '100vh' }}>
      <ThemeProvider>
        <NavigationProfesor />
        <main style={{ paddingTop: '1rem' }}>
          <Outlet />
        </main>
      </ThemeProvider>
    </div>
  )
}