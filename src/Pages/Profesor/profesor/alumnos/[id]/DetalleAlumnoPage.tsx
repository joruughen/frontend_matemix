"use client"

import { Link, useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../Components/ui/card"
import { Button } from "../../../../../Components/ui/button"
import { Badge } from "../../../../../Components/ui/badge"
import { Progress } from "../../../../../Components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../Components/ui/tabs"
import { ArrowLeft, User, TrendingUp, BookOpen, Clock, Mail, MessageSquare, FileText } from "lucide-react"

export default function DetalleAlumnoPage() {
  const { id } = useParams<{ id: string }>();
  // Datos ficticios del alumno
  const alumno = {
    id,
    nombre: "Ana García",
    email: "ana.garcia@escuela.edu",
    salon: "Matemáticas 3°A",
    salonId: "s1",
    fechaRegistro: "15 de enero, 2024",
    ultimaActividad: "Hace 1 hora",
    avanceGeneral: 95,
    precision: 92,
    horasEstudio: 45,
    ejerciciosCompletados: 127,
    estado: "activo",
  }

  // Progreso por temas
  const progresoTemas = [
    { tema: "Fracciones", avance: 100, precision: 95, ejercicios: 45, tiempo: "12h" },
    { tema: "Álgebra Básica", avance: 85, precision: 88, ejercicios: 32, tiempo: "15h" },
    { tema: "Geometría", avance: 70, precision: 82, ejercicios: 28, tiempo: "10h" },
    { tema: "Estadística", avance: 45, precision: 78, ejercicios: 15, tiempo: "5h" },
    { tema: "Trigonometría", avance: 20, precision: 85, ejercicios: 7, tiempo: "3h" },
  ]

  // Actividad reciente
  const actividadReciente = [
    {
      fecha: "Hoy, 10:30 AM",
      descripcion: "Completó 5 ejercicios de Álgebra Básica con 90% de precisión",
      tipo: "ejercicio",
    },
    {
      fecha: "Hoy, 9:15 AM",
      descripcion: "Inició el subtema de Ecuaciones Lineales",
      tipo: "inicio",
    },
    {
      fecha: "Ayer, 3:45 PM",
      descripcion: "Completó el tema de Fracciones con 95% de precisión",
      tipo: "completado",
    },
    {
      fecha: "Hace 2 días",
      descripcion: "Obtuvo el logro 'Maestro de Fracciones'",
      tipo: "logro",
    },
  ]

  // Estadísticas semanales
  const estadisticasSemanales = [
    { dia: "Lun", ejercicios: 8, tiempo: 45, precision: 88 },
    { dia: "Mar", ejercicios: 12, tiempo: 60, precision: 92 },
    { dia: "Mié", ejercicios: 6, tiempo: 30, precision: 85 },
    { dia: "Jue", ejercicios: 15, tiempo: 75, precision: 95 },
    { dia: "Vie", ejercicios: 10, tiempo: 50, precision: 90 },
    { dia: "Sáb", ejercicios: 5, tiempo: 25, precision: 88 },
    { dia: "Dom", ejercicios: 8, tiempo: 40, precision: 93 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <div className="mb-6">
          <Link to="/profesor/alumnos" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Alumnos
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{alumno.nombre}</h1>
            <p className="text-gray-600">
              {alumno.salon} • {alumno.avanceGeneral}% avance general
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Enviar Email
            </Button>
            <Button variant="outline" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Enviar Mensaje
            </Button>
            <Button className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Generar Reporte
            </Button>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Avance General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{alumno.avanceGeneral}%</div>
              <Progress value={alumno.avanceGeneral} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Precisión Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{alumno.precision}%</div>
              <p className="text-sm text-gray-500">En todos los ejercicios</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Ejercicios Completados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{alumno.ejerciciosCompletados}</div>
              <p className="text-sm text-gray-500">Total acumulado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Horas de Estudio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{alumno.horasEstudio}h</div>
              <p className="text-sm text-gray-500">Tiempo invertido</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="progreso" className="space-y-6">
          <TabsList>
            <TabsTrigger value="progreso">Progreso por Temas</TabsTrigger>
            <TabsTrigger value="actividad">Actividad Reciente</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
            <TabsTrigger value="perfil">Información Personal</TabsTrigger>
          </TabsList>

          <TabsContent value="progreso">
            <Card>
              <CardHeader>
                <CardTitle>Progreso por Temas</CardTitle>
                <CardDescription>Avance detallado en cada tema de matemáticas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {progresoTemas.map((tema, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-lg">{tema.tema}</h3>
                        <Badge variant={tema.avance === 100 ? "default" : "outline"}>
                          {tema.avance === 100 ? "Completado" : "En progreso"}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Avance</p>
                          <p className="text-xl font-bold text-blue-600">{tema.avance}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Precisión</p>
                          <p className="text-xl font-bold text-green-600">{tema.precision}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Ejercicios</p>
                          <p className="text-xl font-bold text-purple-600">{tema.ejercicios}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tiempo</p>
                          <p className="text-xl font-bold text-orange-600">{tema.tiempo}</p>
                        </div>
                      </div>

                      <Progress value={tema.avance} />
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
                <CardDescription>Últimas acciones del alumno en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {actividadReciente.map((actividad, index) => (
                    <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <div
                        className={`flex-shrink-0 w-3 h-3 mt-1.5 rounded-full mr-3 ${
                          actividad.tipo === "completado"
                            ? "bg-green-500"
                            : actividad.tipo === "ejercicio"
                              ? "bg-blue-500"
                              : actividad.tipo === "inicio"
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
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Semanal</CardTitle>
                  <CardDescription>Rendimiento de los últimos 7 días</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {estadisticasSemanales.map((dia, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium">{dia.dia}</div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-blue-600">{dia.ejercicios} ejercicios</span>
                          <span className="text-green-600">{dia.tiempo} min</span>
                          <span className="text-purple-600">{dia.precision}% precisión</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Análisis de Rendimiento</CardTitle>
                  <CardDescription>Insights sobre el aprendizaje</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Fortalezas</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-green-800 font-medium">Excelente en Fracciones</p>
                        <p className="text-green-600 text-sm">100% completado con 95% precisión</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-green-800 font-medium">Constancia en el estudio</p>
                        <p className="text-green-600 text-sm">Actividad diaria consistente</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Áreas de mejora</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-yellow-800 font-medium">Trigonometría</p>
                        <p className="text-yellow-600 text-sm">Necesita más práctica en este tema</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-yellow-800 font-medium">Velocidad de resolución</p>
                        <p className="text-yellow-600 text-sm">Puede mejorar el tiempo por ejercicio</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="perfil">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Información Personal
                </CardTitle>
                <CardDescription>Datos del alumno y configuración de cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                      <p className="text-lg">{alumno.nombre}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-lg">{alumno.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Salón Asignado</label>
                      <Link to={`/profesor/salones/${alumno.salonId}`}>
                        <p className="text-lg text-blue-600 hover:underline">{alumno.salon}</p>
                      </Link>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Fecha de Registro</label>
                      <p className="text-lg">{alumno.fechaRegistro}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Estado</label>
                      <div className="mt-1">
                        <Badge className="bg-green-600">Activo</Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Última Actividad</label>
                      <p className="text-lg">{alumno.ultimaActividad}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-medium mb-4">Acciones de Cuenta</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline">Cambiar Salón</Button>
                    <Button variant="outline">Restablecer Contraseña</Button>
                    <Button variant="outline">Enviar Credenciales</Button>
                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                      Desactivar Cuenta
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
