"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../../Components/ui/card"
import { Button } from "../../../../../../Components/ui/button"
import { Input } from "../../../../../../Components/ui/input"
import { Badge } from "../../../../../../Components/ui/badge"
import { Progress } from "../../../../../../Components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../Components/ui/select"
import { ArrowLeft, Search, Users, Plus, Download } from "lucide-react"

export default function AlumnosSalonPage({ params }: { params: { id: string } }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filtroRendimiento, setFiltroRendimiento] = useState("todos")

  // Datos ficticios del salón
  const salon = {
    id: params.id,
    nombre: "Matemáticas 3°A",
    alumnos: 28,
  }

  // Datos ficticios de alumnos del salón
  const alumnos = [
    {
      id: "a1",
      nombre: "Ana García",
      email: "ana.garcia@escuela.edu",
      avance: 95,
      ultimaActividad: "Hace 1 hora",
      temaActual: "Álgebra Básica",
      precision: 92,
      ejerciciosCompletados: 45,
      horasEstudio: 12,
      estado: "activo",
      rendimiento: "excelente",
    },
    {
      id: "a2",
      nombre: "Carlos López",
      email: "carlos.lopez@escuela.edu",
      avance: 88,
      ultimaActividad: "Hace 3 horas",
      temaActual: "Fracciones",
      precision: 85,
      ejerciciosCompletados: 38,
      horasEstudio: 10,
      estado: "activo",
      rendimiento: "bueno",
    },
    {
      id: "a3",
      nombre: "María Rodríguez",
      email: "maria.rodriguez@escuela.edu",
      avance: 82,
      ultimaActividad: "Ayer",
      temaActual: "Geometría",
      precision: 78,
      ejerciciosCompletados: 32,
      horasEstudio: 8,
      estado: "activo",
      rendimiento: "bueno",
    },
    {
      id: "a4",
      nombre: "Juan Pérez",
      email: "juan.perez@escuela.edu",
      avance: 75,
      ultimaActividad: "Hace 2 días",
      temaActual: "Fracciones",
      precision: 80,
      ejerciciosCompletados: 28,
      horasEstudio: 7,
      estado: "activo",
      rendimiento: "regular",
    },
    {
      id: "a5",
      nombre: "Laura Sánchez",
      email: "laura.sanchez@escuela.edu",
      avance: 68,
      ultimaActividad: "Hoy",
      temaActual: "Álgebra Básica",
      precision: 75,
      ejerciciosCompletados: 25,
      horasEstudio: 6,
      estado: "activo",
      rendimiento: "regular",
    },
    {
      id: "a6",
      nombre: "Pedro Gómez",
      email: "pedro.gomez@escuela.edu",
      avance: 45,
      ultimaActividad: "Hace 1 semana",
      temaActual: "Fracciones",
      precision: 65,
      ejerciciosCompletados: 15,
      horasEstudio: 4,
      estado: "inactivo",
      rendimiento: "necesita_atencion",
    },
  ]

  const filteredAlumnos = alumnos.filter((alumno) => {
    const matchesSearch = alumno.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRendimiento = filtroRendimiento === "todos" || alumno.rendimiento === filtroRendimiento
    return matchesSearch && matchesRendimiento
  })

  const getRendimientoBadge = (rendimiento: string) => {
    switch (rendimiento) {
      case "excelente":
        return <Badge className="bg-green-600">Excelente</Badge>
      case "bueno":
        return <Badge className="bg-blue-600">Bueno</Badge>
      case "regular":
        return <Badge className="bg-yellow-600">Regular</Badge>
      case "necesita_atencion":
        return <Badge className="bg-red-600">Necesita Atención</Badge>
      default:
        return <Badge variant="outline">Sin evaluar</Badge>
    }
  }

  const getAvanceColor = (avance: number) => {
    if (avance >= 80) return "text-green-600"
    if (avance >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <div className="mb-6">
          <Link
            to={`/profesor/salones/${salon.id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a {salon.nombre}
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Alumnos de {salon.nombre}</h1>
            <p className="text-gray-600">{salon.alumnos} alumnos registrados en este salón</p>
          </div>
          <div className="flex gap-4">
            <Link to="/profesor/alumnos/registrar">
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Alumno
              </Button>
            </Link>
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Exportar Lista
            </Button>
          </div>
        </div>

        {/* Resumen del salón */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Resumen del Salón</CardTitle>
            <CardDescription>Estadísticas generales de los alumnos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{alumnos.length}</div>
                <p className="text-sm text-blue-600">Total Alumnos</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(alumnos.reduce((total, alumno) => total + alumno.avance, 0) / alumnos.length)}%
                </div>
                <p className="text-sm text-green-600">Avance Promedio</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(alumnos.reduce((total, alumno) => total + alumno.precision, 0) / alumnos.length)}%
                </div>
                <p className="text-sm text-purple-600">Precisión Promedio</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {alumnos.filter((a) => a.estado === "activo").length}
                </div>
                <p className="text-sm text-orange-600">Alumnos Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar alumno por nombre..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="md:w-48">
                <Select value={filtroRendimiento} onValueChange={setFiltroRendimiento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por rendimiento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los rendimientos</SelectItem>
                    <SelectItem value="excelente">Excelente</SelectItem>
                    <SelectItem value="bueno">Bueno</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="necesita_atencion">Necesita Atención</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de alumnos */}
        <div className="grid gap-6">
          {filteredAlumnos.map((alumno) => (
            <Card key={alumno.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <Link to={`/profesor/alumnos/${alumno.id}`}>
                        <h2 className="text-xl font-bold text-blue-600 hover:underline">{alumno.nombre}</h2>
                      </Link>
                      {getRendimientoBadge(alumno.rendimiento)}
                    </div>
                    <p className="text-gray-600 mb-2">{alumno.email}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                      <span>Tema actual: {alumno.temaActual}</span>
                      <span>Última actividad: {alumno.ultimaActividad}</span>
                      <span>{alumno.ejerciciosCompletados} ejercicios completados</span>
                      <span>{alumno.horasEstudio}h de estudio</span>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getAvanceColor(alumno.avance)}`}>{alumno.avance}%</div>
                      <p className="text-sm text-gray-600">Avance</p>
                      <Progress value={alumno.avance} className="w-24 mt-1" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{alumno.precision}%</div>
                      <p className="text-sm text-gray-600">Precisión</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  <Link to={`/profesor/alumnos/${alumno.id}`}>
                    <Button variant="outline" size="sm">
                      Ver Perfil
                    </Button>
                  </Link>
                  <Link to={`/profesor/alumnos/${alumno.id}/progreso`}>
                    <Button variant="outline" size="sm">
                      Ver Progreso
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    Asignar Tarea
                  </Button>
                  <Button variant="outline" size="sm">
                    Enviar Mensaje
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAlumnos.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron alumnos</h3>
              <p className="text-gray-600 mb-6">No hay alumnos que coincidan con los filtros seleccionados.</p>
              <Link to="/profesor/alumnos/registrar">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primer Alumno
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
