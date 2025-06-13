"use client"

import { useState } from "react"
import {Link} from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../Components/ui/card"
import { Button } from "../../../../Components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../Components/ui/select"
import { Badge } from "../../../../Components/ui/badge"
import { Progress } from "../../../../Components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../Components/ui/tabs"
import { ArrowLeft, FileText, Download, TrendingUp, Users, School } from "lucide-react"

export default function ReportesProfesorPage() {
  const [selectedSalon, setSelectedSalon] = useState("todos")
  const [selectedPeriodo, setSelectedPeriodo] = useState("")

  // Datos ficticios para reportes
  const resumenGeneral = {
    totalAlumnos: 127,
    salonesActivos: 5,
    temasEnsenados: 8,
    promedioAvance: 68,
    precisionPromedio: 82,
    horasTotales: 450,
  }

  const reportesPrevios = [
    {
      id: "r1",
      titulo: "Reporte Mensual - Enero 2024",
      tipo: "Mensual",
      fecha: "31 de Enero, 2024",
      salones: ["3°A", "3°B", "2°A"],
      estado: "Completado",
    },
    {
      id: "r2",
      titulo: "Análisis de Rendimiento - Fracciones",
      tipo: "Por Tema",
      fecha: "25 de Enero, 2024",
      salones: ["Todos"],
      estado: "Completado",
    },
    {
      id: "r3",
      titulo: "Reporte Semanal - Semana 3",
      tipo: "Semanal",
      fecha: "21 de Enero, 2024",
      salones: ["3°A", "3°B"],
      estado: "Completado",
    },
  ]

  const salonesDisponibles = [
    { id: "s1", nombre: "Matemáticas 3°A" },
    { id: "s2", nombre: "Matemáticas 3°B" },
    { id: "s3", nombre: "Matemáticas 2°A" },
    { id: "s4", nombre: "Matemáticas 2°B" },
    { id: "s5", nombre: "Matemáticas 1°A" },
  ]

  const estadisticasPorSalon = [
    { salon: "Matemáticas 3°A", alumnos: 28, avance: 75, precision: 85, horasEstudio: 95 },
    { salon: "Matemáticas 3°B", alumnos: 26, avance: 62, precision: 80, horasEstudio: 78 },
    { salon: "Matemáticas 2°A", alumnos: 30, avance: 58, precision: 78, horasEstudio: 85 },
    { salon: "Matemáticas 2°B", alumnos: 29, avance: 51, precision: 75, horasEstudio: 72 },
    { salon: "Matemáticas 1°A", alumnos: 14, avance: 88, precision: 90, horasEstudio: 120 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <div className="mb-6">
          <Link to="/profesor" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Reportes y Análisis</h1>
          <p className="text-gray-600">Genera y consulta reportes detallados de tus salones y alumnos</p>
        </div>

        <Tabs defaultValue="generar" className="space-y-6">
          <TabsList>
            <TabsTrigger value="generar">Generar Reporte</TabsTrigger>
            <TabsTrigger value="resumen">Resumen General</TabsTrigger>
            <TabsTrigger value="historico">Reportes Anteriores</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="generar">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Generar Nuevo Reporte
                </CardTitle>
                <CardDescription>Crea un reporte personalizado seleccionando los parámetros</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tipo de Reporte</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Reporte General</SelectItem>
                        <SelectItem value="salon">Por Salón Específico</SelectItem>
                        <SelectItem value="tema">Por Tema</SelectItem>
                        <SelectItem value="alumno">Por Alumno</SelectItem>
                        <SelectItem value="comparativo">Comparativo entre Salones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Período</label>
                    <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semana">Última semana</SelectItem>
                        <SelectItem value="mes">Último mes</SelectItem>
                        <SelectItem value="trimestre">Último trimestre</SelectItem>
                        <SelectItem value="personalizado">Período personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Salón (Opcional)</label>
                    <Select value={selectedSalon} onValueChange={setSelectedSalon}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los salones" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los salones</SelectItem>
                        {salonesDisponibles.map((salon) => (
                          <SelectItem key={salon.id} value={salon.id}>
                            {salon.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Formato</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="web">Visualización Web</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Incluir en el reporte:</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="progreso" className="rounded" defaultChecked />
                        <label htmlFor="progreso" className="text-sm">
                          Progreso por temas
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="precision" className="rounded" defaultChecked />
                        <label htmlFor="precision" className="text-sm">
                          Precisión en ejercicios
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="tiempo" className="rounded" />
                        <label htmlFor="tiempo" className="text-sm">
                          Tiempo de estudio
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="actividad" className="rounded" />
                        <label htmlFor="actividad" className="text-sm">
                          Actividad reciente
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="comparacion" className="rounded" />
                        <label htmlFor="comparacion" className="text-sm">
                          Comparación con períodos anteriores
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="recomendaciones" className="rounded" defaultChecked />
                        <label htmlFor="recomendaciones" className="text-sm">
                          Recomendaciones
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Vista Previa</Button>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Generar Reporte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resumen">
            <div className="space-y-6">
              {/* Métricas generales */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumen General</CardTitle>
                  <CardDescription>Vista general de todos tus salones y alumnos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
                    <div className="text-center">
                      <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{resumenGeneral.totalAlumnos}</div>
                      <p className="text-sm text-gray-600">Total Alumnos</p>
                    </div>
                    <div className="text-center">
                      <School className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">{resumenGeneral.salonesActivos}</div>
                      <p className="text-sm text-gray-600">Salones Activos</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{resumenGeneral.temasEnsenados}</div>
                      <p className="text-sm text-gray-600">Temas Enseñados</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{resumenGeneral.promedioAvance}%</div>
                      <p className="text-sm text-gray-600">Avance Promedio</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{resumenGeneral.precisionPromedio}%</div>
                      <p className="text-sm text-gray-600">Precisión Promedio</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{resumenGeneral.horasTotales}h</div>
                      <p className="text-sm text-gray-600">Horas Totales</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rendimiento por salón */}
              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento por Salón</CardTitle>
                  <CardDescription>Comparación del desempeño entre salones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {estadisticasPorSalon.map((salon, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium">{salon.salon}</h3>
                          <Badge variant="outline">{salon.alumnos} alumnos</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Avance</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={salon.avance} className="flex-1" />
                              <span className="text-sm font-medium">{salon.avance}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Precisión</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={salon.precision} className="flex-1" />
                              <span className="text-sm font-medium">{salon.precision}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Horas de Estudio</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={salon.horasEstudio} className="flex-1" />
                              <span className="text-sm font-medium">{salon.horasEstudio}h</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="historico">
            <Card>
              <CardHeader>
                <CardTitle>Reportes Anteriores</CardTitle>
                <CardDescription>Historial de reportes generados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportesPrevios.map((reporte) => (
                    <div key={reporte.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{reporte.titulo}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{reporte.fecha}</span>
                            <span>•</span>
                            <Badge variant="outline">{reporte.tipo}</Badge>
                            <span>•</span>
                            <span>Salones: {reporte.salones.join(", ")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-green-600">{reporte.estado}</Badge>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Descargar
                        </Button>
                        <Button size="sm" variant="outline">
                          Ver
                        </Button>
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
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Tendencias Mensuales
                  </CardTitle>
                  <CardDescription>Evolución del rendimiento en los últimos meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-800">Enero 2024</span>
                      <div className="text-right">
                        <div className="text-blue-600 font-bold">68% avance promedio</div>
                        <div className="text-blue-500 text-sm">↗ +5% vs diciembre</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-green-800">Diciembre 2023</span>
                      <div className="text-right">
                        <div className="text-green-600 font-bold">63% avance promedio</div>
                        <div className="text-green-500 text-sm">↗ +3% vs noviembre</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-800">Noviembre 2023</span>
                      <div className="text-right">
                        <div className="text-purple-600 font-bold">60% avance promedio</div>
                        <div className="text-purple-500 text-sm">↗ +2% vs octubre</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Análisis Comparativo</CardTitle>
                  <CardDescription>Comparación con períodos anteriores</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Mejores Rendimientos</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-green-800 text-sm">Matemáticas 1°A</span>
                        <span className="text-green-600 font-medium">88% avance</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-green-800 text-sm">Matemáticas 3°A</span>
                        <span className="text-green-600 font-medium">75% avance</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Necesitan Atención</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                        <span className="text-yellow-800 text-sm">Matemáticas 2°B</span>
                        <span className="text-yellow-600 font-medium">51% avance</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                        <span className="text-yellow-800 text-sm">Matemáticas 2°A</span>
                        <span className="text-yellow-600 font-medium">58% avance</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
