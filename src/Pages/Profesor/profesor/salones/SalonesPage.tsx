"use client"

import { useState } from "react"
import {Link} from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../Components/ui/card"
import { Button } from "../../../../Components/ui/button"
import { Input } from "../../../../Components/ui/input"
import { Badge } from "../../../../Components/ui/badge"
import { Progress } from "../../../../Components/ui/progress"
import { ArrowLeft, Search, Users, BookOpen, Plus, School } from "lucide-react"

export default function SalonesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Datos ficticios de salones
  const salones = [
    {
      id: "s1",
      nombre: "Matemáticas 3°A",
      alumnos: 28,
      avance: 75,
      temas: 8,
      temasActivos: 3,
      ultimaActividad: "Hace 2 horas",
    },
    {
      id: "s2",
      nombre: "Matemáticas 3°B",
      alumnos: 26,
      avance: 62,
      temas: 8,
      temasActivos: 4,
      ultimaActividad: "Hace 5 horas",
    },
    {
      id: "s3",
      nombre: "Matemáticas 2°A",
      alumnos: 30,
      avance: 58,
      temas: 6,
      temasActivos: 2,
      ultimaActividad: "Ayer",
    },
    {
      id: "s4",
      nombre: "Matemáticas 2°B",
      alumnos: 29,
      avance: 51,
      temas: 6,
      temasActivos: 3,
      ultimaActividad: "Hace 2 días",
    },
    {
      id: "s5",
      nombre: "Matemáticas 1°A",
      alumnos: 32,
      avance: 48,
      temas: 5,
      temasActivos: 2,
      ultimaActividad: "Hace 3 días",
    },
  ]

  const filteredSalones = salones.filter((salon) => salon.nombre.toLowerCase().includes(searchQuery.toLowerCase()))

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
            <h1 className="text-3xl font-bold mb-2">Gestión de Salones</h1>
            <p className="text-gray-600">Administra todos tus salones de clase</p>
          </div>
          <div className="flex gap-4">
            <Link to="/profesor/salones/crear">
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Salón
              </Button>
            </Link>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Resumen de Salones</CardTitle>
            <CardDescription>Vista general de todos tus salones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <School className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{salones.length}</div>
                <p className="text-sm text-blue-600">Total de Salones</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {salones.reduce((total, salon) => total + salon.alumnos, 0)}
                </div>
                <p className="text-sm text-green-600">Total de Alumnos</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {salones.reduce((total, salon) => total + salon.temasActivos, 0)}
                </div>
                <p className="text-sm text-purple-600">Temas Activos</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(salones.reduce((total, salon) => total + salon.avance, 0) / salones.length)}%
                </div>
                <p className="text-sm text-orange-600">Avance Promedio</p>
                <Progress
                  value={Math.round(salones.reduce((total, salon) => total + salon.avance, 0) / salones.length)}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 flex items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar salón..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6">
          {filteredSalones.map((salon) => (
            <Card key={salon.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <Link to={`/profesor/salones/${salon.id}`}>
                      <h2 className="text-xl font-bold text-blue-600 hover:underline">{salon.nombre}</h2>
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{salon.alumnos} alumnos</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>
                          {salon.temasActivos} / {salon.temas} temas
                        </span>
                      </div>
                      <Badge variant="outline">{salon.ultimaActividad}</Badge>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex items-center mb-2">
                      <span className="text-lg font-bold mr-2">{salon.avance}%</span>
                      <span className="text-sm text-gray-600">avance</span>
                    </div>
                    <Progress value={salon.avance} className="w-32" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  <Link to={`/profesor/salones/${salon.id}`}>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </Link>
                  <Link to={`/profesor/salones/${salon.id}/alumnos`}>
                    <Button variant="outline" size="sm">
                      Ver Alumnos
                    </Button>
                  </Link>
                  <Link to={`/profesor/salones/${salon.id}/temas`}>
                    <Button variant="outline" size="sm">
                      Gestionar Temas
                    </Button>
                  </Link>
                  <Link to={`/profesor/salones/${salon.id}/reportes`}>
                    <Button variant="outline" size="sm">
                      Generar Reporte
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
