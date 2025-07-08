"use client"

import { useEffect, useState } from "react"
import { Button } from "../../../Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../Components/ui/card"
import { Badge } from "../../../Components/ui/badge"
import { ArrowLeft, Calculator, CheckCircle, XCircle } from "lucide-react"
import { Input } from "../../../Components/ui/input"
import { Label } from "../../../Components/ui/label"
import { temasService } from "../../../Service/Temas/TemasService"
import type { responseTemaStudent } from "../../../Service/Temas/types"
import type { subtemaResponseStudent } from "../../../Service/Subtema/types"
import { subtemaService } from "../../../Service/Subtema/subtemaService"
import { type ejercicio, type Nivel } from "../../../Service/Ejercicios/types"
import { ejercicioService } from "../../../Service/Ejercicios/servie"

export default function EjerciciosPage() {
  const [view, setView] = useState<"temas" | "subtemas" | "ejercicio">("temas")
  const [selectedTema, setSelectedTema] = useState<responseTemaStudent | null>(null)
  const [selectedSubtema, setSelectedSubtema] = useState<subtemaResponseStudent | null>(null)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [temas, setTemas] = useState<responseTemaStudent[]>([])
  const [subtemas, setSubtemas] = useState<subtemaResponseStudent[]>([])
  const [ejercicios, setEjercicios] = useState<ejercicio[]>([])
  const temasOrdenados = [...temas].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
  const [totalCorrectos, setTotalCorrectos] = useState(0);
  const [totalIncorrectos, setTotalIncorrectos] = useState(0);
  const [showResumen, setShowResumen] = useState(false);

  const [pistaIndex, setPistaIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    setPistaIndex(0);
    setSelectedOption(null);
    setUserAnswer("");
    setShowResult(false);
  }, [currentExercise]);

  const handleTemaClick = async (tema: responseTemaStudent) => {
    setSelectedTema(tema)
    try {
      const response = await subtemaService.getAllSubtemasForStudent(
        tema._id,
        localStorage.getItem("token_matemix") || ""
      )
      setSubtemas(response || response)
      setView("subtemas")
    } catch (error) {
      console.log("Error al obtener subtemas:", error)
      setSubtemas([])
      setView("temas")
      setSelectedTema(null)
      setSelectedSubtema(null)
      setUserAnswer("")
      setShowResult(false)
      setIsCorrect(false)
      alert("Error al cargar los subtemas. Por favor, inténtalo de nuevo más tarde.")
    }
  }

  const handleNivelClick = async (subtema: subtemaResponseStudent, niv: Nivel) => {
    setSelectedSubtema(subtema)
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

  const handleSubmitAnswer = async () => {
    const currentExerciseData = ejercicios[currentExercise];
    if (currentExerciseData) {
      let correct = false;
      let respuestaUsuario = userAnswer.trim();

      if (currentExerciseData.es_multiple_choice && currentExerciseData.opciones && selectedOption !== null) {
        respuestaUsuario = currentExerciseData.opciones[selectedOption];
        correct =
          currentExerciseData.respuesta_correcta !== undefined &&
          respuestaUsuario === currentExerciseData.respuesta_correcta.trim();
      } else {
        correct =
          currentExerciseData.respuesta_correcta !== undefined &&
          respuestaUsuario === currentExerciseData.respuesta_correcta.trim();
      }

      setIsCorrect(correct);
      setShowResult(true);

      if (correct) {
        setTotalCorrectos((prev) => prev + 1);
      } else {
        setTotalIncorrectos((prev) => prev + 1);
      }
      try {
        await ejercicioService.createEjercicioResuelto(
          {
            alumno_id: localStorage.getItem("userId_matemix") || "",
            salon_id: localStorage.getItem("salonId_matemix") || "",
            ejercicio_id: currentExerciseData._id,
            respuesta_usuario: respuestaUsuario,
            subtema_id: selectedSubtema?._id || "",
          },
          selectedTema?._id || "",
          localStorage.getItem("token_matemix") || ""
        );
      } catch (error) {
        console.error("Error al guardar el ejercicio resuelto:", error);
      }
    }
  };


  const nextExercise = () => {
    if (currentExercise + 1 >= ejercicios.length) {
      setShowResumen(true);
    } else {
      setCurrentExercise((prev) => prev + 1);
      setUserAnswer("");
      setShowResult(false);
    }
  };

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
  }, [localStorage.getItem("token_matemix")])

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
    if (showResumen) {
      return (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="container mx-auto max-w-2xl">
            <Card>
              <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <CardTitle>¡Resumen de tu práctica!</CardTitle>
                <CardDescription>
                  <div className="mt-4 space-y-2">
                    <div>
                      <span className="font-semibold">Total ejercicios resueltos: </span>
                      {ejercicios.length}
                    </div>
                    <div>
                      <span className="font-semibold text-green-700">Correctos: </span>
                      {totalCorrectos}
                    </div>
                    <div>
                      <span className="font-semibold text-red-700">Incorrectos: </span>
                      {totalIncorrectos}
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => setView("subtemas")}>Volver a Subtemas</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
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

            {/* Mostrar pistas si existen */}
            {currentExerciseData.pistas && currentExerciseData.pistas.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="font-semibold mb-2 text-yellow-800">Pistas:</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {currentExerciseData.pistas.slice(0, pistaIndex).map((pista, i) =>
                      pista ? <li key={i} className="text-yellow-900">{pista}</li> : null
                    )}
                  </ul>
                  {pistaIndex < currentExerciseData.pistas.length && !showResult && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => setPistaIndex((prev) => prev + 1)}
                    >
                      Ver pista
                    </Button>
                  )}
                </div>
              )}

            {/* Mostrar opciones si es multiple choice */}
            {currentExerciseData.es_multiple_choice && currentExerciseData.opciones && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="font-semibold mb-2 text-purple-800">Opciones:</div>
                  <div className="flex flex-col gap-2">
                    {currentExerciseData.opciones.map((op, i) =>
                      op ? (
                        <Button
                          key={i}
                          variant={selectedOption === i ? "default" : "outline"}
                          className={`text-left ${selectedOption === i ? "bg-purple-600 text-white" : ""}`}
                          onClick={() => setSelectedOption(i)}
                          disabled={showResult}
                        >
                          {op}
                        </Button>
                      ) : null
                    )}
                  </div>
                </div>
              )}
            {!currentExerciseData.es_multiple_choice && (
                <div>
                  <Label htmlFor="answer">Tu respuesta:</Label>
                  <Input
                    id="answer"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Escribe tu respuesta aquí"
                    className="text-lg"
                    disabled={showResult}
                  />
                </div>
              )}
               {!showResult && (
                <Button
                  onClick={handleSubmitAnswer}
                  className="w-full"
                  disabled={
                    currentExerciseData.es_multiple_choice
                      ? selectedOption === null
                      : !userAnswer.trim()
                  }
                >
                  Verificar Respuesta
                </Button>
              )}
              {showResult && (
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
                    {/* Mostrar solución paso a paso si existe */}
                    {currentExerciseData.solucion && currentExerciseData.solucion.length > 0 && (
                      <div>
                        <div className="font-semibold mb-1">Solución:</div>
                        <ol className="list-decimal pl-5 space-y-1">
                          {currentExerciseData.solucion.map((paso, i) =>
                            paso ? <li key={i} className="text-gray-700">{paso}</li> : null
                          )}
                        </ol>
                      </div>
                    )}
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
  );
}

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Vista no encontrada</CardDescription>
          </CardHeader>
          <CardContent>
            <p>La vista solicitada no existe. Por favor, vuelve a la página principal.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
