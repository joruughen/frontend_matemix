"use client"
import { Link, useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../Components/ui/card"
import { Button } from "../../../../../Components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../Components/ui/tabs"
import { Badge } from "../../../../../Components/ui/badge"
import { Progress } from "../../../../../Components/ui/progress"
import { ArrowLeft, Users, BookOpen, TrendingUp, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import type { infoSalon } from "../../../../../Service/Salon/types"
import { salonService } from "../../../../../Service/Salon/service"

export default function DetallesSalonPage() {
  const { id: salonId } = useParams<{ id: string }>()
  const [salon, setSalon] = useState<infoSalon>({
    id: salonId || "",
    nombre:"",
    grado: 0,
    seccion: "",
    turno: "",
    descripcion: "",
    totalAlumnos: 0,
    totalTemas: 0,
    totalSubtemas: 0,
    temas: [],
    alumnos:[]
  })

  const handleGetSalonInfo = async () => {
    try{
      const response = await salonService.getInfoSalon(salonId || "", localStorage.getItem("token_matemix") || "")
      if (response) {
        setSalon(response)
      }
    } catch (error) {
      console.error("Error al obtener la información del salón:", error)
    }
  }

  useEffect(() => {
    handleGetSalonInfo()
  }, [salonId, localStorage.getItem("token_matemix")])


  const actividades = [
    {
      fecha: "Hoy, 10:30 AM",
      descripcion: "Ana García completó el tema de Fracciones con 95% de precisión",
      tipo: "completado",
    },
    {
      fecha: "Hoy, 9:15 AM",
      descripcion: "Carlos López inició el tema de Álgebra Básica",
      tipo: "inicio",
    },
    {
      fecha: "Ayer, 3:45 PM",
      descripcion: "5 alumnos completaron ejercicios de Geometría",
      tipo: "progreso",
    },
    {
      fecha: "Hace 2 días",
      descripcion: "Se añadió el tema de Trigonometría al salón",
      tipo: "admin",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <div className="mb-6">
          <Link to="/profesor/salones" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Salones
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{salon.nombre}</h1>
            <p className="text-gray-600">
              {salon.totalAlumnos} alumnos  • 80% avance promedio
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={`/profesor/salones/${salon.id}/editar`}>
              <Button variant="outline" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </Link>
            <Link to={`/profesor/salones/${salon.id}/reportes`}>
              <Button className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Generar Reporte
              </Button>
            </Link>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Total de Alumnos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{salon.totalAlumnos}</div>
              <p className="text-sm text-gray-500">Activos en el salón</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Temas Asignados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{salon.totalTemas}</div>
              <p className="text-sm text-gray-500">En desarrollo</p>
            </CardContent>
          </Card>

           <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Subtemas Asignados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{salon.totalSubtemas}</div>
              <p className="text-sm text-gray-500">En desarrollo</p>
            </CardContent>
          </Card>
        
        </div>

        <Tabs defaultValue="temas" className="space-y-6">
          <TabsList>
            <TabsTrigger value="temas">Temas</TabsTrigger>
            <TabsTrigger value="alumnos">Alumnos</TabsTrigger>
            <TabsTrigger value="actividad">Actividad Reciente</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="temas">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Temas del Salón</CardTitle>
                  <CardDescription>Temas asignados y su progreso</CardDescription>
                </div>
                <Link to={`/profesor/salones/gestion/temas/${salon.id}`}>
                  <Button variant="outline" size="sm">
                    Gestionar Temas
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salon.temas.map((tema) => (
                    <div key={tema._id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <Link to={`/profesor/tema/subtemas/${tema._id}`}>
                          <h3 className="font-medium text-blue-600 hover:underline">{tema.nombre}</h3>
                        </Link>
                        <Badge variant="outline">
                          {tema.subtema_id?.length} subtemas
                        </Badge>
                      </div>
                       <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Avance promedio</span>
                        <span>80%</span>
                      </div>
                      <Progress value={80} />

                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alumnos">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Alumnos del Salón {salon.nombre}</CardTitle>
                  <CardDescription>Lista de alumnos y su progreso</CardDescription>
                </div>
                <Link to={`/profesor/salones/${salon.id}/alumnos`}>
                  <Button variant="outline" size="sm">
                    Ver Todos
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salon.alumnos.map((alumno) => (
                    <div key={alumno.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Link to={`/profesor/alumnos/${alumno.id}`}>
                          <h3 className="font-medium text-blue-600 hover:underline">{alumno.nombre} {alumno.apellido}</h3>
                        </Link>
                        <div className="text-sm text-gray-600">
                          Tema actual: Algebra • Hoy
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">80%</div>
                        <Progress value={80} className="w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actividad">
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas acciones en el salón</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {actividades.map((actividad, index) => (
                    <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <div
                        className={`flex-shrink-0 w-3 h-3 mt-1.5 rounded-full mr-3 ${
                          actividad.tipo === "completado"
                            ? "bg-green-500"
                            : actividad.tipo === "inicio"
                              ? "bg-blue-500"
                              : actividad.tipo === "progreso"
                                ? "bg-yellow-500"
                                : "bg-purple-500"
                        }`}
                      ></div>
                      <div className="flex-grow">
                        <p className="text-gray-800">{actividad.descripcion}</p>
                        <p className="text-xs text-gray-500 mt-1">{actividad.fecha}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="estadisticas">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas del Salón</CardTitle>
                <CardDescription>Análisis detallado del rendimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Distribución de Avance</h3>
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      <div className="bg-red-100 h-24 rounded-lg relative">
                        <div
                          className="bg-red-500 absolute bottom-0 w-full rounded-b-lg"
                          style={{ height: "10%" }}
                        ></div>
                        <div className="absolute bottom-0 w-full text-center pb-1 text-xs font-medium">0-20%</div>
                        <div className="absolute top-0 w-full text-center pt-1 text-xs font-medium">10%</div>
                      </div>
                      <div className="bg-orange-100 h-24 rounded-lg relative">
                        <div
                          className="bg-orange-500 absolute bottom-0 w-full rounded-b-lg"
                          style={{ height: "15%" }}
                        ></div>
                        <div className="absolute bottom-0 w-full text-center pb-1 text-xs font-medium">21-40%</div>
                        <div className="absolute top-0 w-full text-center pt-1 text-xs font-medium">15%</div>
                      </div>
                      <div className="bg-yellow-100 h-24 rounded-lg relative">
                        <div
                          className="bg-yellow-500 absolute bottom-0 w-full rounded-b-lg"
                          style={{ height: "20%" }}
                        ></div>
                        <div className="absolute bottom-0 w-full text-center pb-1 text-xs font-medium">41-60%</div>
                        <div className="absolute top-0 w-full text-center pt-1 text-xs font-medium">20%</div>
                      </div>
                      <div className="bg-green-100 h-24 rounded-lg relative">
                        <div
                          className="bg-green-500 absolute bottom-0 w-full rounded-b-lg"
                          style={{ height: "30%" }}
                        ></div>
                        <div className="absolute bottom-0 w-full text-center pb-1 text-xs font-medium">61-80%</div>
                        <div className="absolute top-0 w-full text-center pt-1 text-xs font-medium">30%</div>
                      </div>
                      <div className="bg-blue-100 h-24 rounded-lg relative">
                        <div
                          className="bg-blue-500 absolute bottom-0 w-full rounded-b-lg"
                          style={{ height: "25%" }}
                        ></div>
                        <div className="absolute bottom-0 w-full text-center pb-1 text-xs font-medium">81-100%</div>
                        <div className="absolute top-0 w-full text-center pt-1 text-xs font-medium">25%</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      La mayoría de los alumnos (55%) tienen un avance superior al 60%
                    </p>
                  </div>
                   <div>
                    <h3 className="font-medium mb-3">Rendimiento por Tema</h3>
                    <div className="space-y-3">
                      {salon.temas.map((tema) => (
                        <div key={tema._id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{tema.nombre}</span>
                            <span>70%</span>
                          </div>
                          <Progress value={70} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-3">Tiempo de Estudio</h3>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-1">45 horas</div>
                        <p className="text-sm text-gray-600">Tiempo total de estudio del salón</p>
                        <div className="mt-3 text-sm">
                          <div className="flex justify-between mb-1">
                            <span>Promedio por alumno:</span>
                            <span className="font-medium">1.6 horas</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tiempo semanal:</span>
                            <span className="font-medium">12.5 horas</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Precisión Promedio</h3>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-1">82%</div>
                        <p className="text-sm text-gray-600">Precisión en respuestas</p>
                        <div className="mt-3 text-sm">
                          <div className="flex justify-between mb-1">
                            <span>Mejor tema:</span>
                            <span className="font-medium">Fracciones (88%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tema a mejorar:</span>
                            <span className="font-medium">Trigonometría (65%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
