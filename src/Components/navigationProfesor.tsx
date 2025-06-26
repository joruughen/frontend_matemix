"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { BookOpen, Home, Menu, X, Users, School, FileText } from "lucide-react"
import { cn } from "../Lib/Util"
import { useAuth } from "../context/authContext"
import MatemixIcon from "../assets/Matemix_icon.svg"

const navigation = [
  { name: "Dashboard", href: "/profesor", icon: Home },
  { name: "Salones", href: "/profesor/salones", icon: School },
  //{ name: "Alumnos", href: "/profesor/alumnos", icon: Users },
  { name: "Temas", href: "/profesor/temas", icon: BookOpen },
  { name: "Reportes", href: "/profesor/reportes", icon: FileText },
]

export function NavigationProfesor() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { username, logout } = useAuth()

  const pathname = location.pathname

  const handleLogout = () => {
    logout()
    navigate("/login") // Redirige a la página de login después del logout
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
         
          <Link to="/profesor" className="flex items-center">
            <div className="h-8 w-8 mr-2">
              <img src={MatemixIcon || "/placeholder.svg"} alt="Icon" />
            </div>
            <span className="text-xl font-bold">Matemix</span>
          </Link>

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
            <span className="text-gray-600">¡Hola, {username || "Profesor"}!</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
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
                <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
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
