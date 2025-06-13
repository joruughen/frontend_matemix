"use client"

import {Link} from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../Components/ui/card"
import { Button } from "../../../../../Components/ui/button"
import { Badge } from "../../../../../Components/ui/badge"
import { Progress } from "../../../../../Components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../Components/ui/tabs"
import { ArrowLeft, BookOpen, Users, School, TrendingUp, Settings, Plus } from "lucide-react"

export default function DetalleTemaPage({ params }: { params: { id: string } }) {
  // Datos ficticios del tema
  const tema = {
    id: params.id,
    nombre: "Fracciones",
    descripcion: "Operaciones con fracciones y números mixtos",
    categoria: "Aritmética",
    nivel: "Intermedio",
    grado: "3° Grado",
    duracion: "8 horas",
    fechaCreacion: "10 de enero, 2024",
    estado: "activo",
    salones: 5,
    alumnos: 127,
    avancePromedio: 82,
  }

  // Subtemas
  const subtemas = [
    { id: "st1", nombre: "Fracciones propias e impropias", avance: 95, alumnos: 120, ejercicios: 15 },
    { id: "st2", nombre: "Suma de fracciones", avance: 88, alumnos: 115, ejercicios: 12 },
    { id: "st3", nombre: "Resta de fracciones", avance: 85, alumnos: 110, ejercicios: 12 },
    { id: "st4", nombre: "Multiplicación de fracciones", avance: 78, alumnos: 105, ejercicios: 10 },
    { id: "st5", nombre: "División de fracciones", avance: 72, alumnos: 98, ejercicios: 10 },
    { id: "st6", nombre: "Fracciones mixtas", avance: 65, alumnos: 85, ejercicios: 8 },
    { id: "st7", nombre: "Comparación de fracciones", avance: 60, alumnos: 80, ejercicios: 8 },
    { id: "st8", nombre: "Problemas con fracciones", avance: 45, alumnos: 70, ejercicios: 15 },
  ]

  // Salones que usan este tema
  const salonesAsignados = [
    { id: "s1", nombre: "Matemáticas 3°A", alumnos: 28, avance: 85 },
    { id: "s2", nombre: "Matemáticas 3°B", alumnos: 26, avance: 78 },
    { id: "s3", nombre: "Matemáticas 2°A", alumnos: 30, avance: 82 },
    { id: "s4", nombre: "Matemáticas 2°B", alumnos: 29, avance: 80 },
    { id: "s5", nombre: "Matemáticas 1°A", alumnos: 14, avance: 88 },
  ]

  // Estadísticas de rendimiento
  const estadisticas = {
    ejerciciosTotales: 90,
    ejerciciosCompletados: 6840,
    tiempoPromedio: "12 minutos",
    precisionPromedio: 84,
    alumnosCompletaron: 95,
    alumnosEnProgreso: 32,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <div className="mb-6">
          <Link to="/profesor/temas" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Temas
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{tema.nombre}</h1>
            <p className="text-gray-600">
              {tema.alumnos} alumnos • {tema.avancePromedio}% avance promedio
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={`/profesor/temas/${tema.id}/editar`}>
              <Button variant="outline" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Editar Tema
              </Button>
            </Link>
            <Link to={`/profesor/temas/${tema.id}/asignar`}>
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Asignar a Salón
              </Button>
            </Link>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Total de Alumnos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{tema.alumnos}</div>
              <p className="text-sm text-gray-500">Estudiando este tema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <School className="h-4 w-4 mr-2" />
                Salones Asignados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{tema.salones}</div>
              <p className="text-sm text-gray-500">Salones activos</p>
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
              <div className="text-3xl font-bold text-purple-600">{tema.avancePromedio}%</div>
              <Progress value={tema.avancePromedio} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Subtemas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{subtemas.length}</div>
              <p className="text-sm text-gray-500">Subtemas disponibles</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="subtemas" className="space-y-6">
          <TabsList>
            <TabsTrigger value="subtemas">Subtemas</TabsTrigger>
            <TabsTrigger value="salones">Salones</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
            <TabsTrigger value="informacion">Información</TabsTrigger>
          </TabsList>

          <TabsContent value="subtemas">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Subtemas del Tema</CardTitle>
                  <CardDescription>Progreso detallado de cada subtema</CardDescription>
                </div>
                <Link to={`/profesor/temas/${tema.id}/subtemas/crear`}>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Subtema
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subtemas.map((subtema, index) => (
                    <div key={subtema.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h3 className="font-medium text-lg">{subtema.nombre}</h3>
                          <p className="text-sm text-gray-600">
                            {subtema.alumnos} alumnos • {subtema.ejercicios} ejercicios
                          </p>
                        </div>
                        <Badge variant={subtema.avance >= 80 ? "default" : "outline"}>
                          {subtema.avance}% completado
                        </Badge>
                      </div>
                      <Progress value={subtema.avance} className="mb-2" />
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="salones">
            <Card>
              <CardHeader>
                <CardTitle>Salones Asignados</CardTitle>
                <CardDescription>Salones que están estudiando este tema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salonesAsignados.map((salon) => (
                    <div key={salon.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Link to={`/profesor/salones/${salon.id}`}>
                          <h3 className="font-medium text-blue-600 hover:underline">{salon.nombre}</h3>
                        </Link>
                        <p className="text-sm text-gray-600">{salon.alumnos} alumnos</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{salon.avance}%</div>
                        <Progress value={salon.avance} className="w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="estadisticas">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas Generales</CardTitle>
                  <CardDescription>Métricas de rendimiento del tema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ejercicios totales:</span>
                    <span className="font-medium">{estadisticas.ejerciciosTotales}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ejercicios completados:</span>
                    <span className="font-medium">{estadisticas.ejerciciosCompletados.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiempo promedio:</span>
                    <span className="font-medium">{estadisticas.tiempoPromedio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precisión promedio:</span>
                    <span className="font-medium">{estadisticas.precisionPromedio}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado de los Alumnos</CardTitle>
                  <CardDescription>Distribución del progreso</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800 font-medium">Completaron el tema</span>
                    <span className="text-green-600 font-bold">{estadisticas.alumnosCompletaron}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-800 font-medium">En progreso</span>
                    <span className="text-blue-600 font-bold">{estadisticas.alumnosEnProgreso}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-800 font-medium">No iniciado</span>
                    <span className="text-gray-600 font-bold">
                      {tema.alumnos - estadisticas.alumnosCompletaron - estadisticas.alumnosEnProgreso}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="informacion">
            <Card>
              <CardHeader>
                <CardTitle>Información del Tema</CardTitle>
                <CardDescription>Detalles y configuración del tema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nombre</label>
                      <p className="text-lg">{tema.nombre}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Descripción</label>
                      <p className="text-lg">{tema.descripcion}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Categoría</label>
                      <p className="text-lg">{tema.categoria}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nivel</label>
                      <Badge variant="outline">{tema.nivel}</Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Grado Recomendado</label>
                      <p className="text-lg">{tema.grado}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Duración Estimada</label>
                      <p className="text-lg">{tema.duracion}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Fecha de Creación</label>
                      <p className="text-lg">{tema.fechaCreacion}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Estado</label>
                      <Badge className="bg-green-600">Activo</Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-medium mb-4">Acciones del Tema</h3>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/profesor/temas/${tema.id}/editar`}>
                      <Button variant="outline">Editar Información</Button>
                    </Link>
                    <Link to={`/profesor/temas/${tema.id}/subtemas`}>
                      <Button variant="outline">Gestionar Subtemas</Button>
                    </Link>
                    <Link to={`/profesor/temas/${tema.id}/ejercicios`}>
                      <Button variant="outline">Gestionar Ejercicios</Button>
                    </Link>
                    <Button variant="outline">Duplicar Tema</Button>
                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                      Desactivar Tema
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
