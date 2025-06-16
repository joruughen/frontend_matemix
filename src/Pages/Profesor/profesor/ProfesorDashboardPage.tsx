"use client"
import {Link} from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../Components/ui/card"
import { Button } from "../../../Components/ui/button"
import { Badge } from "../../../Components/ui/badge"
import { Progress } from "../../../Components/ui/progress"
import { Users, BookOpen, School, TrendingUp, Clock, AlertCircle } from "lucide-react"

export default function ProfesorDashboardPage() {
  // Datos ficticios para el dashboard
  const resumenSalones = {
    totalSalones: 5,
    totalAlumnos: 127,
    promedioAvance: 68,
    salonesActivos: 5,
  }

  const salonesRecientes = [
    {
      id: "s1",
      nombre: "Matemáticas 3°A",
      alumnos: 28,
      avance: 75,
      ultimaActividad: "Hace 2 horas",
    },
    {
      id: "s2",
      nombre: "Matemáticas 3°B",
      alumnos: 26,
      avance: 62,
      ultimaActividad: "Hace 5 horas",
    },
    {
      id: "s3",
      nombre: "Matemáticas 2°A",
      alumnos: 30,
      avance: 58,
      ultimaActividad: "Ayer",
    },
  ]

  const temasPopulares = [
    { nombre: "Fracciones", alumnos: 85, avance: 72 },
    { nombre: "Álgebra Básica", alumnos: 64, avance: 58 },
    { nombre: "Geometría", alumnos: 45, avance: 43 },
  ]

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

        {/* Métricas principales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <School className="h-4 w-4 mr-2" />
                Total de Salones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{resumenSalones.totalSalones}</div>
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
              <div className="text-3xl font-bold text-green-600">{resumenSalones.totalAlumnos}</div>
              <p className="text-sm text-gray-500">En todos los salones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Avance Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{resumenSalones.promedioAvance}%</div>
              <p className="text-sm text-gray-500">En todos los temas</p>
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
              <div className="text-3xl font-bold text-orange-600">12</div>
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
              </CardContent>
            </Card>

            {/* Temas populares */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">Temas Populares</CardTitle>
                  <CardDescription>Temas con mayor actividad</CardDescription>
                </div>
                <Link to="/profesor/temas">
                  <Button variant="outline" size="sm">
                    Gestionar Temas
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {temasPopulares.map((tema, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{tema.nombre}</h3>
                        <Badge variant="outline">{tema.alumnos} alumnos</Badge>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Avance promedio</span>
                        <span>{tema.avance}%</span>
                      </div>
                      <Progress value={tema.avance} />
                    </div>
                  ))}
                </div>
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
              <CardContent className="space-y-4">
                <Link to="/profesor/registro/:id/alumnos">
                  <Button className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Registrar Alumnos
                  </Button>
                </Link>
                <Link to="/profesor/salones/:id/temas">
                  <Button variant="outline" className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Crear Nuevo Tema
                  </Button>
                </Link>
                <Link to="/profesor/salones/crear">
                  <Button variant="outline" className="w-full">
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

            {/* Calendario */}
            <Card>
              <CardHeader>
                <CardTitle>Calendario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-medium mb-2">Mayo 2024</p>
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
                    {Array.from({ length: 31 }, (_, i) => (
                      <div
                        key={i}
                        className={`text-sm p-1 rounded-full ${
                          i + 1 === 15 ? "bg-blue-600 text-white" : i + 1 === 10 || i + 1 === 20 ? "bg-blue-100" : ""
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <div className="flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                      <span>Hoy</span>
                    </div>
                    <div className="flex items-center justify-center mt-1">
                      <div className="w-3 h-3 bg-blue-100 rounded-full mr-2"></div>
                      <span>Eventos programados</span>
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
