"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../Components/ui/card"
import { Button } from "../../../Components/ui/button"
import { Badge } from "../../../Components/ui/badge"
import { Progress } from "../../../Components/ui/progress"
import { Users, BookOpen, School, TrendingUp, Clock, AlertCircle } from "lucide-react"
import type { responseTema, temaPage } from "../../../Service/Salon/types"
import { salonService } from "../../../Service/Salon/service"

interface Salon {
  id: string
  nombre: string
  grado: number
  seccion: string
  turno: string
  cantidadAlumnos: number
  descripcion: string
}

export default function ProfesorDashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [salones, setSalones] = useState<Salon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [temas, setTemas] = useState<temaPage[]>([])
  const [respuestaBackendTemas, setRespuestaBackendTemas] = useState<responseTema>({
    totalSalones: 0,
    totalTemas: 0,
    totalSubtemas: 0,
    temas: [],
  })
  const [loadingTemas, setLoadingTemas] = useState(true)

  const getAuthToken = () => {
    return localStorage.getItem("token_matemix")
  }

  const fetchSalones = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()

      if (!token) {
        throw new Error("No se encontró token de autenticación")
      }

      const response = await fetch("http://localhost:8090/salon/profesor/my-salons", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data: Salon[] = await response.json()
      setSalones(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching salones:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const fetchTemas = async () => {
    try {
      setLoadingTemas(true)
      const token = getAuthToken()

      if (!token) {
        throw new Error("No se encontró token de autenticación")
      }

      const response = await salonService.getAllInfoOfTemas(token)
      if (!response || !response.temas) {
        console.error("No se recibieron temas del backend")
        return
      }
      console.log("Temas obtenidos:", response)
      // Ordenar temas por número de alumnos (de mayor a menor)
      const temasOrdenados = response.temas.sort((a, b) => b.totalAlumnos - a.totalAlumnos)
      setTemas(temasOrdenados)
      setRespuestaBackendTemas(response)
    } catch (error) {
      console.error("Error al obtener temas:", error)
    } finally {
      setLoadingTemas(false)
    }
  }

  // Cargar salones al montar el componente
  useEffect(() => {
    fetchSalones()
    fetchTemas()
  }, [])

  // Actualizar la fecha cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000) // Actualiza cada minuto

    return () => clearInterval(timer)
  }, [])

  // Función para obtener el nombre del mes
  const getMonthName = (date: Date) => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]
    return months[date.getMonth()]
  }

  // Función para obtener los días del mes
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Agregar días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Agregar los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const today = currentDate.getDate()
  const currentMonth = getMonthName(currentDate)
  const currentYear = currentDate.getFullYear()
  const daysInCurrentMonth = getDaysInMonth(currentDate)

  // Calcular métricas dinámicas basadas en los datos del backend
  const totalSalones = salones.length
  const totalAlumnos = salones.reduce((total, salon) => total + salon.cantidadAlumnos, 0)
  const salonesActivos = salones.length // Asumiendo que todos los salones devueltos están activos

  const resumenSalones = {
    totalSalones,
    totalAlumnos,
    promedioAvance: 68, // Mantener estático por ahora
    salonesActivos,
  }

  // Convertir salones del backend a formato para mostrar (los 3 más recientes)
  const salonesRecientes = salones.slice(0, 3).map((salon) => ({
    id: salon.id,
    nombre: salon.nombre,
    alumnos: salon.cantidadAlumnos,
    avance: Math.floor(Math.random() * 40) + 60, // Avance aleatorio entre 60-100%
    ultimaActividad: "Hace " + Math.floor(Math.random() * 24) + " horas",
  }))

  const alumnosDestacados = [
    { nombre: "Ana García", salon: "3°A", avance: 95, tema: "Fracciones" },
    { nombre: "Carlos López", salon: "3°B", avance: 92, tema: "Álgebra" },
    { nombre: "María Rodríguez", salon: "2°A", avance: 90, tema: "Geometría" },
  ]

  const alertas = [
    {
      tipo: "Bajo rendimiento",
      descripcion: "5 alumnos en 3°B tienen dificultades con fracciones mixtas",
      fecha: "Hoy",
      prioridad: "alta",
    },
    {
      tipo: "Tema pendiente",
      descripcion: "El tema de Estadística aún no ha sido iniciado en 2°A",
      fecha: "Ayer",
      prioridad: "media",
    },
    {
      tipo: "Inactividad",
      descripcion: "8 alumnos no han ingresado en la última semana",
      fecha: "Hace 3 días",
      prioridad: "baja",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard del Profesor</h1>
          <p className="text-gray-600">Bienvenido de nuevo, Prof. Martínez</p>
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">Error al cargar los datos: {error}</p>
            <Button onClick={fetchSalones} variant="outline" size="sm" className="mt-2">
              Reintentar
            </Button>
          </div>
        )}

        {/* Métricas principales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <School className="h-4 w-4 mr-2" />
                Total de Salones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{loading ? "..." : resumenSalones.totalSalones}</div>
              <p className="text-sm text-gray-500">Todos activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Total de Alumnos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{loading ? "..." : resumenSalones.totalAlumnos}</div>
              <p className="text-sm text-gray-500">En todos los salones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Temas Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {loadingTemas ? "..." : respuestaBackendTemas.totalTemas}
              </div>
              <p className="text-sm text-gray-500">En desarrollo</p>
            </CardContent>
          </Card>
        </div>

        {/* Contenido principal */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-6">
            {/* Salones recientes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">Salones Recientes</CardTitle>
                  <CardDescription>Actividad en los últimos días</CardDescription>
                </div>
                <Link to="/profesor/salones">
                  <Button variant="outline" size="sm">
                    Ver Todos
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Cargando salones...</p>
                  </div>
                ) : salonesRecientes.length > 0 ? (
                  <div className="space-y-4">
                    {salonesRecientes.map((salon) => (
                      <div key={salon.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <Link to={`/profesor/salones/${salon.id}`}>
                            <h3 className="font-medium text-blue-600 hover:underline">{salon.nombre}</h3>
                          </Link>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Users className="h-3.5 w-3.5 mr-1" />
                            <span>{salon.alumnos} alumnos</span>
                            <span className="mx-2">•</span>
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>{salon.ultimaActividad}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium mb-1">{salon.avance}%</div>
                          <Progress value={salon.avance} className="w-24 h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No hay salones disponibles</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Temas populares */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">Temas Populares</CardTitle>
                  <CardDescription>Ordenados por número de alumnos</CardDescription>
                </div>
                <Link to="/profesor/temas">
                  <Button variant="outline" size="sm">
                    Gestionar Temas
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {loadingTemas ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Cargando temas...</p>
                  </div>
                ) : temas.length > 0 ? (
                  <div className="space-y-4">
                    {temas.slice(0, 3).map((tema) => (
                      <div key={tema._id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{tema.nombre}</h3>
                          <Badge variant="outline">{tema.totalAlumnos} alumnos</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{tema.descripcion}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No hay temas disponibles</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Alumnos destacados */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">Alumnos Destacados</CardTitle>
                  <CardDescription>Mejores rendimientos esta semana</CardDescription>
                </div>
                <Link to="/profesor/alumnos">
                  <Button variant="outline" size="sm">
                    Ver Todos
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alumnosDestacados.map((alumno, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">{alumno.nombre}</h3>
                        <div className="text-sm text-gray-600">
                          Salón: {alumno.salon} • Tema: {alumno.tema}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-bold">{alumno.avance}%</div>
                        <div className="text-xs text-gray-500">de avance</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {/* Acciones rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Link to="/profesor/registro/:id/alumnos">
                </Link>
                <Link to="/profesor/salones/:id/temas">
                  <Button variant="outline" className="mb-2 w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Crear Nuevo Tema
                  </Button>
                </Link>
                <Link to="/profesor/salones/crear">
                  <Button variant="outline" className="mb-2 w-full">
                    <School className="h-4 w-4 mr-2" />
                    Crear Nuevo Salón
                  </Button>
                </Link>
                <Link to="/profesor/reportes">
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Generar Reportes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Alertas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                  Alertas y Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertas.map((alerta, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        alerta.prioridad === "alta"
                          ? "bg-red-50"
                          : alerta.prioridad === "media"
                            ? "bg-yellow-50"
                            : "bg-blue-50"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h4
                          className={`font-medium ${
                            alerta.prioridad === "alta"
                              ? "text-red-800"
                              : alerta.prioridad === "media"
                                ? "text-yellow-800"
                                : "text-blue-800"
                          }`}
                        >
                          {alerta.tipo}
                        </h4>
                        <Badge
                          variant="outline"
                          className={
                            alerta.prioridad === "alta"
                              ? "border-red-500 text-red-500"
                              : alerta.prioridad === "media"
                                ? "border-yellow-500 text-yellow-500"
                                : "border-blue-500 text-blue-500"
                          }
                        >
                          {alerta.fecha}
                        </Badge>
                      </div>
                      <p
                        className={`text-sm ${
                          alerta.prioridad === "alta"
                            ? "text-red-600"
                            : alerta.prioridad === "media"
                              ? "text-yellow-600"
                              : "text-blue-600"
                        }`}
                      >
                        {alerta.descripcion}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Calendario actualizado */}
            <Card>
              <CardHeader>
                <CardTitle>Calendario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-medium mb-2">
                    {currentMonth} {currentYear}
                  </p>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    <div className="text-xs text-gray-500">D</div>
                    <div className="text-xs text-gray-500">L</div>
                    <div className="text-xs text-gray-500">M</div>
                    <div className="text-xs text-gray-500">M</div>
                    <div className="text-xs text-gray-500">J</div>
                    <div className="text-xs text-gray-500">V</div>
                    <div className="text-xs text-gray-500">S</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {daysInCurrentMonth.map((day, index) => (
                      <div
                        key={index}
                        className={`text-sm p-1 rounded-full ${
                          day === today ? "bg-blue-600 text-white font-bold" : day ? "hover:bg-gray-200" : ""
                        }`}
                      >
                        {day || ""}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <div className="flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                      <span>
                        Hoy ({today} de {currentMonth})
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
