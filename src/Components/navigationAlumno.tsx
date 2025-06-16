import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import {  BookOpen, TrendingUp, FileText, Brain, Home, Menu, X } from "lucide-react"
import { cn } from "../Lib/Util"
import MatemixIcon from "../assets/Matemix_icon.svg"

const navigation = [
  { name: "Dashboard", href: "/alumno", icon: Home },
  { name: "Ejercicios", href: "/alumno/ejercicios", icon: BookOpen },
  { name: "Mi Progreso", href: "/alumno/progreso", icon: TrendingUp },
  { name: "Reportes", href: "/alumno/reportes", icon: FileText },
  { name: "Análisis IA", href: "/alumno/analisis", icon: Brain },
]

export function NavigationAlumno() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const pathname = location.pathname

  return (
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/alumno" className="flex items-center">
              <div className="h-8 w-8 mr-2">
                <img src={MatemixIcon} alt="Icon" />
              </div>
              <span className="text-xl font-bold">Matemix</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                    <Link key={item.name} to={item.href}>
                      <Button
                          variant={isActive ? "default" : "ghost"}
                          className={cn("flex items-center space-x-2", isActive && "bg-blue-600 text-white")}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Button>
                    </Link>
                )
              })}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-gray-600">¡Hola, Juan!</span>
              <Button variant="outline" size="sm">
                Cerrar Sesión
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
              <div className="md:hidden py-4 border-t">
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link key={item.name} to={item.href}>
                          <Button
                              variant={isActive ? "default" : "ghost"}
                              className={cn(
                                  "w-full justify-start flex items-center space-x-2",
                                  isActive && "bg-blue-600 text-white",
                              )}
                              onClick={() => setIsOpen(false)}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Button>
                        </Link>
                    )
                  })}
                  <div className="pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      Cerrar Sesión
                    </Button>
                  </div>
                </div>
              </div>
          )}
        </div>
      </nav>
  )
}
