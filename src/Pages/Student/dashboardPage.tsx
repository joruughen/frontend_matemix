"use client"

import { useState, useEffect } from "react"
import { Button } from "../../Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../Components/ui/card"
import { BookOpen /*, Calculator, TrendingUp, Users */} from "lucide-react"
import { axiosInstanceBackendUsuarios } from "../../Service/AxiosConfig"

export default function DashboardPage() {
  const [rachaActual, setRachaActual] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchRacha = async (alumnoId: string) => {
    try {
      const token = localStorage.getItem("token_matemix")
      const response = await axiosInstanceBackendUsuarios.get(`alumno/racha/${alumnoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setRachaActual(response.data.racha || 0)
    } catch (error) {
      console.error("Error fetching racha:", error)
      setRachaActual(0)
    }
  }

  useEffect(() => {
    const alumnoId = localStorage.getItem("userId_matemix")

    if (alumnoId) {
      const loadData = async () => {
        setLoading(true)
        await fetchRacha(alumnoId)
        setLoading(false)
      }

      loadData()
    } else {
      console.error("No se encontró el ID del alumno en localStorage")
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Ejercicios Completados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">127</div>
              <p className="text-xs text-gray-500">+0 esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Precisión Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">85%</div>
              <p className="text-xs text-gray-500">0% vs mes anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Temas Dominados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">3</div>
              <p className="text-xs text-gray-500">de 1 temas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Racha Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{rachaActual}</div>
              <p className="text-xs text-gray-500">días consecutivos</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Continúa tu aprendizaje donde lo dejaste</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button className="h-20 flex-col">
                    <BookOpen className="h-6 w-6 mb-2" />
                    Practicar Fracciones
                  </Button>
                 
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Fracciones - Nivel Intermedio</p>
                      <p className="text-sm text-gray-600">6 ejercicios para resolver</p>
                    </div>
                    <div className="text-green-600 font-bold">0%</div>
                  </div>

                
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Progreso por Tema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Fracciones</span>
                    <span>0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "0%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Practica más fracciones</p>
                  <p className="text-xs text-blue-600">Tu rendimiento mejorara en este tema</p>
                </div>

            
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
