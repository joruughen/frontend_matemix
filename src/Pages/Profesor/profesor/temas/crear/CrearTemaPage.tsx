"use client"

import { useState } from "react"
import {Link} from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../Components/ui/card"
import { Button } from "../../../../../Components/ui/button"
import { Input } from "../../../../../Components/ui/input"
import { Label } from "../../../../../Components/ui/label"
import { Textarea } from "../../../../../Components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../Components/ui/select"
import { ArrowLeft, Plus, Trash2, BookOpen } from "lucide-react"

export default function CrearTemaPage() {
  const [subtemas, setSubtemas] = useState([{ nombre: "", descripcion: "" }])

  const addSubtema = () => {
    setSubtemas([...subtemas, { nombre: "", descripcion: "" }])
  }

  const removeSubtema = (index: number) => {
    setSubtemas(subtemas.filter((_, i) => i !== index))
  }

  const updateSubtema = (index: number, field: string, value: string) => {
    const updated = subtemas.map((subtema, i) => (i === index ? { ...subtema, [field]: value } : subtema))
    setSubtemas(updated)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link to="/profesor/temas" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Temas
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Crear Nuevo Tema</h1>
          <p className="text-gray-600">Define un nuevo tema de matemáticas con sus subtemas</p>
        </div>

        <div className="space-y-6">
          {/* Información básica del tema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Información del Tema
              </CardTitle>
              <CardDescription>Datos básicos del tema que vas a crear</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nombre">Nombre del Tema</Label>
                  <Input id="nombre" placeholder="Ej: Fracciones Avanzadas" />
                </div>
                <div>
                  <Label htmlFor="nivel">Nivel de Dificultad</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basico">Básico</SelectItem>
                      <SelectItem value="intermedio">Intermedio</SelectItem>
                      <SelectItem value="avanzado">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe brevemente el contenido y objetivos del tema..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="grado">Grado Recomendado</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el grado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1° Grado</SelectItem>
                      <SelectItem value="2">2° Grado</SelectItem>
                      <SelectItem value="3">3° Grado</SelectItem>
                      <SelectItem value="4">4° Grado</SelectItem>
                      <SelectItem value="5">5° Grado</SelectItem>
                      <SelectItem value="6">6° Grado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duracion">Duración Estimada (horas)</Label>
                  <Input id="duracion" type="number" placeholder="Ej: 8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subtemas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Subtemas</CardTitle>
                <CardDescription>Define los subtemas que componen este tema principal</CardDescription>
              </div>
              <Button onClick={addSubtema} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Añadir Subtema
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subtemas.map((subtema, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Subtema {index + 1}</h3>
                      {subtemas.length > 1 && (
                        <Button
                          onClick={() => removeSubtema(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`subtema-nombre-${index}`}>Nombre del Subtema</Label>
                        <Input
                          id={`subtema-nombre-${index}`}
                          value={subtema.nombre}
                          onChange={(e) => updateSubtema(index, "nombre", e.target.value)}
                          placeholder="Ej: Suma de fracciones"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`subtema-descripcion-${index}`}>Descripción</Label>
                        <Input
                          id={`subtema-descripcion-${index}`}
                          value={subtema.descripcion}
                          onChange={(e) => updateSubtema(index, "descripcion", e.target.value)}
                          placeholder="Breve descripción del subtema"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configuración adicional */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración Adicional</CardTitle>
              <CardDescription>Opciones avanzadas para el tema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="prerequisitos">Temas Prerequisito</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona temas prerequisito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fracciones-basicas">Fracciones Básicas</SelectItem>
                      <SelectItem value="operaciones-basicas">Operaciones Básicas</SelectItem>
                      <SelectItem value="numeros-enteros">Números Enteros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aritmetica">Aritmética</SelectItem>
                      <SelectItem value="algebra">Álgebra</SelectItem>
                      <SelectItem value="geometria">Geometría</SelectItem>
                      <SelectItem value="estadistica">Estadística</SelectItem>
                      <SelectItem value="trigonometria">Trigonometría</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="activo" className="rounded" />
                <Label htmlFor="activo">Activar tema inmediatamente después de crear</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="publico" className="rounded" />
                <Label htmlFor="publico">Hacer tema disponible para todos los profesores</Label>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <Link to="/profesor/temas">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button>Crear Tema</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
