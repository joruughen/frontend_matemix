"use client"

import { useState } from "react"
import {Link} from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../Components/ui/card"
import { Button } from "../../../../Components/ui/button"
import { Input } from "../../../../Components/ui/input"
import { Badge } from "../../../../Components/ui/badge"
import { Progress } from "../../../../Components/ui/progress"
import { ArrowLeft, Search, BookOpen, Plus, School } from "lucide-react"

export default function TemasPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Datos ficticios de temas
  const temas = [
    {
      id: "t1",
      nombre: "Fracciones",
      descripcion: "Operaciones con fracciones y números mixtos",
      subtemas: 8,
      salones: 5,
      alumnos: 127,
      avance: 82,
    },
    {
      id: "t2",
      nombre: "Álgebra Básica",
      descripcion: "Ecuaciones lineales y sistemas de ecuaciones",
      subtemas: 10,
      salones: 4,
      alumnos: 98,
      avance: 75,
    },
    {
      id: "t3",
      nombre: "Geometría",
      descripcion: "Figuras planas y cálculo de áreas y perímetros",
      subtemas: 7,
      salones: 5,
      alumnos: 127,
      avance: 68,
    },
    {
      id: "t4",
      nombre: "Estadística",
      descripcion: "Medidas de tendencia central y gráficos",
      subtemas: 6,
      salones: 3,
      alumnos: 85,
      avance: 62,
    },
    {
      id: "t5",
      nombre: "Trigonometría",
      descripcion: "Razones trigonométricas y resolución de triángulos",
      subtemas: 9,
      salones: 2,
      alumnos: 58,
      avance: 45,
    },
  ]

  const filteredTemas = temas.filter((tema) => tema.nombre.toLowerCase().includes(searchQuery.toLowerCase()))

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
            <h1 className="text-3xl font-bold mb-2">Gestión de Temas</h1>
            <p className="text-gray-600">Administra los temas y subtemas de matemáticas</p>
          </div>
          <div className="flex gap-4">
            <Link to="/profesor/temas/crear">
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Crear Tema
              </Button>
            </Link>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Resumen de Temas</CardTitle>
            <CardDescription>Vista general de todos los temas disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{temas.length}</div>
                <p className="text-sm text-blue-600">Total de Temas</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {temas.reduce((total, tema) => total + tema.subtemas, 0)}
                </div>
                <p className="text-sm text-green-600">Total de Subtemas</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <School className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {Math.max(...temas.map((tema) => tema.salones))}
                </div>
                <p className="text-sm text-purple-600">Salones Activos</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(temas.reduce((total, tema) => total + tema.avance, 0) / temas.length)}%
                </div>
                <p className="text-sm text-orange-600">Avance Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 flex items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar tema..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6">
          {filteredTemas.map((tema) => (
            <Card key={tema.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-grow">
                    <Link to={`/profesor/temas/${tema.id}`}>
                      <h2 className="text-xl font-bold text-blue-600 hover:underline">{tema.nombre}</h2>
                    </Link>
                    <p className="text-gray-600 mt-1">{tema.descripcion}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                      <Badge variant="outline">{tema.subtemas} subtemas</Badge>
                      <Badge variant="outline">{tema.salones} salones</Badge>
                      <Badge variant="outline">{tema.alumnos} alumnos</Badge>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex items-center mb-2">
                      <span className="text-lg font-bold mr-2">{tema.avance}%</span>
                      <span className="text-sm text-gray-600">avance</span>
                    </div>
                    <Progress value={tema.avance} className="w-32" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  <Link to={`/profesor/temas/${tema.id}`}>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </Link>
                  <Link to={`/profesor/temas/${tema.id}/subtemas`}>
                    <Button variant="outline" size="sm">
                      Gestionar Subtemas
                    </Button>
                  </Link>
                  <Link to={`/profesor/temas/${tema.id}/asignar`}>
                    <Button variant="outline" size="sm">
                      Asignar a Salón
                    </Button>
                  </Link>
                  <Link to={`/profesor/temas/${tema.id}/editar`}>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
