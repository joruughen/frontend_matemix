"use client"

import { Button } from "../Components/UI/Button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "../Components/UI/Card.tsx"
import { BookOpen, TrendingUp, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import logotipo from "../assets/Matemix_icon.svg"

export default function HomePage() {
  const navigate = useNavigate()

  const handleNavigateToLogin = () => {
    navigate("/login")
  }



  return (
      <div className="min-h-screen bg-white overflow-hidden relative">
        {/* Colorful background elements */}
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-purple-500 opacity-80 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-red-500 opacity-80 translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute top-40 left-40 w-48 h-48 rounded-full bg-blue-500 opacity-70"></div>
        <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-yellow-500 opacity-80"></div>
        <div className="absolute bottom-40 left-1/2 w-72 h-72 rounded-full bg-green-500 opacity-70"></div>
        <div className="absolute top-1/2 right-10 w-80 h-80 rounded-2xl bg-orange-500 opacity-80 rotate-12"></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 rounded-2xl bg-purple-500 opacity-70 -rotate-12"></div>
        <div className="absolute bottom-40 left-20 w-48 h-48 rounded-2xl bg-blue-400 opacity-80 rotate-45"></div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <img src={logotipo || "/placeholder.svg"} alt="MathLearn Logo" className="h-12 w-12 mr-3" />
              <h1 className="text-5xl font-bold text-black">Matemix</h1>
            </div>
            <p className="text-2xl text-gray-700 max-w-2xl mx-auto mt-4">
              Plataforma inteligente para aprender y reforzar matemáticas de forma personalizada
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="text-center pb-2">
                <BookOpen className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-bold">Ejercicios Personalizados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">Ejercicios adaptados a tu nivel y dificultades específicas</p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="text-center pb-2">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-bold">Seguimiento de Progreso</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">Monitorea tu avance y identifica áreas de mejora</p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="text-center pb-2">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-bold">Análisis Inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">IA que analiza patrones y sugiere mejoras</p>
              </CardContent>
            </Card>
          </div>

          {/* Auth Buttons */}
          <div className="max-w-md mx-auto flex flex-col gap-4 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-4">Comienza tu aprendizaje</h2>
            <Button
                className="w-full py-6 text-lg bg-matemix-blue hover:bg-blue-600 text-white rounded-2xl"
                onClick={handleNavigateToLogin}
            >
              Iniciar Sesión
            </Button>

          </div>

          {/*/!* Footer *!/*/}
          {/*<div className="text-center mt-20 text-gray-600 bg-white/70 backdrop-blur-sm py-4 rounded-lg">*/}
          {/*  <p>&copy; 2024 MathLearn. Todos los derechos reservados.</p>*/}
          {/*</div>*/}
        </div>
      </div>
  )
}
