"use client"

import { useEffect, useState } from "react"
import { Button } from "../../../Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../Components/ui/card"
import { Badge } from "../../../Components/ui/badge"
import { ArrowLeft, Calculator, CheckCircle, XCircle } from "lucide-react"
import { Input } from "../../../Components/ui/input"
import { Label } from "../../../Components/ui/label"
import { temasService } from "../../../Service/Temas/TemasService"
import type { responseTemaStudent, temasForStudent } from "../../../Service/Temas/types"
import type { subtemaResponseStudent } from "../../../Service/Subtema/types"
import { subtemaService } from "../../../Service/Subtema/subtemaService"
import { type ejercicio, type ejerciciosAlumno, type Nivel } from "../../../Service/Ejercicios/types"
import { ejercicioService } from "../../../Service/Ejercicios/servie"

export default function EjerciciosPage() {
  const [view, setView] = useState<"temas" | "subtemas" | "ejercicio">("temas")
  const [selectedTema, setSelectedTema] = useState<responseTemaStudent | null>(null)
  const [selectedSubtema, setSelectedSubtema] = useState<subtemaResponseStudent | null>(null)
  const [selectedNivel, setSelectedNivel] = useState<Nivel | "">("")
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [temas, setTemas] = useState<responseTemaStudent[]>([])
  const [temasForStudent, setTemasForStudent] = useState<temasForStudent | null>(null)
  const [subtemas, setSubtemas] = useState<subtemaResponseStudent[]>([])
  const [ejercicios, setEjercicios] = useState<ejercicio[]>([])
  const [loading, setLoading] = useState(true)
  const [errorEjercicios, setErrorEjercicios] = useState(false)
  const [reponseEjercicios, setResponseEjercicios] = useState<ejerciciosAlumno | null>(null)  
  // Ordenar temas por orden numérico
  const temasOrdenados = [...temas].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))

  // --- Handlers ---
  const handleTemaClick = async (tema: responseTemaStudent) => {
    setSelectedTema(tema)
    try {
      const response = await subtemaService.getAllSubtemasForStudent(
        tema._id,
        localStorage.getItem("token_matemix") || ""
      )
      setSubtemas(response || response) // por compatibilidad
      setView("subtemas")
    } catch (error) {
      console.log("Error al obtener subtemas:", error)
      setSubtemas([])
      setView("temas")
      setSelectedTema(null)
      setSelectedSubtema(null)
      setSelectedNivel("")
      setUserAnswer("")
      setShowResult(false)
      setIsCorrect(false)
      alert("Error al cargar los subtemas. Por favor, inténtalo de nuevo más tarde.")
    }
  }

  const handleNivelClick = async (subtema: subtemaResponseStudent, niv: Nivel) => {
    setSelectedSubtema(subtema)
    setSelectedNivel(niv)
    try {
      const response = await ejercicioService.getEjerciciosForStudent(
        {
          subtema_id: subtema._id,
          nivel: niv,
          alumno_id: localStorage.getItem("userId_matemix") || "",
        },
        localStorage.getItem("token_matemix") || ""
      )
      setEjercicios(response.ejercicios || [])
      setCurrentExercise(0)
      setShowResult(false)
      setIsCorrect(false)
      setUserAnswer("")
      setView("ejercicio")
    } catch (error) {
      console.log("Error al obtener ejercicios:", error)
      setEjercicios([])
      setView("ejercicio")
    }
  }

  const handleSubmitAnswer = () => {
    const currentExerciseData = ejercicios[currentExercise]
    if (currentExerciseData) {
      const correct =
        currentExerciseData.respuesta_correcta !== undefined &&
        userAnswer.trim() === currentExerciseData.respuesta_correcta.trim()
      setIsCorrect(correct)
      setShowResult(true)
    }
  }

  const nextExercise = () => {
    setCurrentExercise((prev) => prev + 1)
    setUserAnswer("")
    setShowResult(false)
  }

  const fetchTemas = async () => {
    try {
      const response = await temasService.getAllTemasForStudent(localStorage.getItem("token_matemix") || "")
      setTemas([...response.temas].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)))
    } catch (error) {
      setTemas([])
      console.error("Error al obtener los temas:", error)
      // Manejo de error
    }
  }

  useEffect(() => {
    fetchTemas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("token_matemix")])

  // --- Vistas ---
  if (view === "temas") {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Ejercicios de Matemáticas</h1>
            <p className="text-gray-600">Selecciona un tema para comenzar a practicar</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Temas Disponibles */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Temas Disponibles</h2>
              <div className="grid gap-4">
                {temasOrdenados.map((tema) => (
                  <Card key={tema._id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{tema.nombre}</h3>
                        <Badge variant="secondary">
                          {tema.cantidadSubtemas}
                        </Badge>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progreso</span>
                          <span>{Math.round((tema.cantidadSubtemas /0) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(tema.cantidadSubtemas / 0) * 100}%` }}
                          ></div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTemaClick(tema)}
                          className="mt-4"
                        >
                          Resolver
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total ejercicios:</span>
                    <span className="font-medium">160</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completados:</span>
                    <span className="font-medium">79</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Precisión promedio:</span>
                    <span className="font-medium">85%</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recomendaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium">Continúa con Fracciones</p>
                      <p className="text-xs text-gray-600">Vas muy bien, ¡sigue así!</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-medium">Practica Geometría</p>
                      <p className="text-xs text-gray-600">Necesitas más práctica aquí</p>
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

  if (view === "subtemas" && selectedTema) {
    // Ordenar subtemas por orden numérico
    const subtemasOrdenados = [...subtemas].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto max-w-2xl">
          <Button variant="ghost" onClick={() => setView("temas")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Temas
          </Button>
          <h1 className="text-2xl font-bold mb-6">{selectedTema.nombre}</h1>
          <div className="grid gap-4">
            {subtemasOrdenados.map((subtema) => (
              <Card key={subtema._id} className="hover:shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">{subtema.titulo}</h2>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleNivelClick(subtema, "facil")}>
                      Fácil
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleNivelClick(subtema, "medio")}>
                      Intermedio
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleNivelClick(subtema, "dificil")}>
                      Difícil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (view === "ejercicio") {
    if (ejercicios.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="container mx-auto max-w-2xl">
            <Button variant="ghost" onClick={() => setView("subtemas")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Subtemas
            </Button>
            <Card>
              <CardHeader>
                <CardTitle>No hay ejercicios disponibles</CardTitle>
                <CardDescription>Pronto agregaremos más ejercicios para este subtema y nivel.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setView("subtemas")}>Volver a Subtemas</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
    const currentExerciseData = ejercicios[currentExercise]
    if (!currentExerciseData) {
      return (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="container mx-auto max-w-2xl">
            <Card>
              <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <CardTitle>¡Felicitaciones!</CardTitle>
                <CardDescription>Has completado todos los ejercicios de este nivel</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => setView("subtemas")}>Volver a Subtemas</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto max-w-2xl">
          <Button variant="ghost" onClick={() => setView("subtemas")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Subtemas
          </Button>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Ejercicio {currentExercise + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg font-medium p-4 bg-blue-50 rounded-lg">{currentExerciseData.pregunta}</div>
              {!showResult ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="answer">Tu respuesta:</Label>
                    <Input
                      id="answer"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Escribe tu respuesta aquí"
                      className="text-lg"
                    />
                  </div>
                  <Button onClick={handleSubmitAnswer} disabled={!userAnswer.trim()} className="w-full">
                    Verificar Respuesta
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg flex items-center ${
                      isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                    }`}
                  >
                    {isCorrect ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
                    <span className="font-medium">{isCorrect ? "¡Correcto!" : "Incorrecto"}</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-2">Respuesta correcta: {currentExerciseData.respuesta_correcta}</p>
                    <p className="text-sm text-gray-600">{currentExerciseData.solucion}</p>
                  </div>
                  <Button onClick={nextExercise} className="w-full">
                    Siguiente Ejercicio
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}