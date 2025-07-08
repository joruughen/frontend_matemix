"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../Components/ui/card"
import { Button } from "../../../../Components/ui/button"
import { Input } from "../../../../Components/ui/input"
import { Badge } from "../../../../Components/ui/badge"
import { Progress } from "../../../../Components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../Components/ui/select"
import { ArrowLeft, Search, Users, Plus } from "lucide-react"

export default function AlumnosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSalon, setSelectedSalon] = useState("all")
  const [selectedEstado, setSelectedEstado] = useState("all")

  const alumnos = [
    {
      id: "a1",
      nombre: "Ana García",
      email: "ana.garcia@escuela.edu",
      salon: "Matemáticas 3°A",
      salonId: "s1",
      avance: 95,
      ultimaActividad: "Hace 1 hora",
      temaActual: "Álgebra Básica",
      precision: 92,
      estado: "activo",
    },
    {
      id: "a2",
      nombre: "Carlos López",
      email: "carlos.lopez@escuela.edu",
      salon: "Matemáticas 3°B",
      salonId: "s2",
      avance: 88,
      ultimaActividad: "Hace 3 horas",
      temaActual: "Fracciones",
      precision: 85,
      estado: "activo",
    },
    {
      id: "a3",
      nombre: "María Rodríguez",
      email: "maria.rodriguez@escuela.edu",
      salon: "Matemáticas 2°A",
      salonId: "s3",
      avance: 82,
      ultimaActividad: "Ayer",
      temaActual: "Geometría",
      precision: 78,
      estado: "activo",
    },
    {
      id: "a4",
      nombre: "Juan Pérez",
      email: "juan.perez@escuela.edu",
      salon: "Matemáticas 3°A",
      salonId: "s1",
      avance: 75,
      ultimaActividad: "Hace 2 días",
      temaActual: "Fracciones",
      precision: 80,
      estado: "activo",
    },
    {
      id: "a5",
      nombre: "Laura Sánchez",
      email: "laura.sanchez@escuela.edu",
      salon: "Matemáticas 3°B",
      salonId: "s2",
      avance: 68,
      ultimaActividad: "Hoy",
      temaActual: "Álgebra Básica",
      precision: 75,
      estado: "activo",
    },
    {
      id: "a6",
      nombre: "Pedro Gómez",
      email: "pedro.gomez@escuela.edu",
      salon: "Matemáticas 2°B",
      salonId: "s4",
      avance: 45,
      ultimaActividad: "Hace 1 semana",
      temaActual: "Fracciones",
      precision: 65,
      estado: "inactivo",
    },
  ]

  const salones = [
    { id: "s1", nombre: "Matemáticas 3°A" },
    { id: "s2", nombre: "Matemáticas 3°B" },
    { id: "s3", nombre: "Matemáticas 2°A" },
    { id: "s4", nombre: "Matemáticas 2°B" },
    { id: "s5", nombre: "Matemáticas 1°A" },
  ]

  const filteredAlumnos = alumnos.filter((alumno) => {
    const matchesSearch = alumno.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSalon = selectedSalon === "all" || alumno.salonId === selectedSalon
    const matchesEstado = selectedEstado === "all" || alumno.estado === selectedEstado
    return matchesSearch && matchesSalon && matchesEstado
  })

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return <Badge className="bg-green-600">Activo</Badge>
      case "inactivo":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Inactivo
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconocido</Badge>
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
          <Link to="/profesor" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Alumnos</h1>
            <p className="text-gray-600">Administra todos tus alumnos y su progreso</p>
          </div>
        </div>

        {/* Resumen */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Resumen de Alumnos</CardTitle>
            <CardDescription>Vista general de todos tus alumnos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{alumnos.length}</div>
                <p className="text-sm text-blue-600">Total de Alumnos</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {alumnos.filter((a) => a.estado === "activo").length}
                </div>
                <p className="text-sm text-green-600">Alumnos Activos</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(alumnos.reduce((total, alumno) => total + alumno.avance, 0) / alumnos.length)}%
                </div>
                <p className="text-sm text-purple-600">Avance Promedio</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(alumnos.reduce((total, alumno) => total + alumno.precision, 0) / alumnos.length)}%
                </div>
                <p className="text-sm text-orange-600">Precisión Promedio</p>
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
                <Select value={selectedSalon} onValueChange={setSelectedSalon}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por salón" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los salones</SelectItem>
                    {salones.map((salon) => (
                      <SelectItem key={salon.id} value={salon.id}>
                        {salon.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:w-48">
                <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="activo">Activos</SelectItem>
                    <SelectItem value="inactivo">Inactivos</SelectItem>
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
                      {getEstadoBadge(alumno.estado)}
                    </div>
                    <p className="text-gray-600 mb-2">{alumno.email}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Link to={`/profesor/salones/${alumno.salonId}`}>
                        <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer">
                          {alumno.salon}
                        </Badge>
                      </Link>
                      <span className="text-sm text-gray-600">Tema actual: {alumno.temaActual}</span>
                      <span className="text-sm text-gray-600">Última actividad: {alumno.ultimaActividad}</span>
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
                  <Link to={`/profesor/alumnos/${alumno.id}/reportes`}>
                    <Button variant="outline" size="sm">
                      Generar Reporte
                    </Button>
                  </Link>
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
                  Registrar Primer Alumno
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
