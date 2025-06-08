import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../Components/UI/Button"
import { Card, CardContent } from "../Components/UI/Card"
import { Progress } from "../Components/UI/Progress"
import { Badge } from "../Components/UI/Badge"
import { temasService } from '../Service/Temas/TemasService.tsx'
import { respuestasService } from '../Service/Respuestas/RespuestasService.tsx'
import { AxiosError } from 'axios';

interface TemaItem {
    id: string
    nombre: string
    description: string
    completion: number
    nivel: "facil" | "medio" | "dificil"
    points: number
    daysLeft?: number
    isCompleted: boolean
    respuestasCorrectasPorNivel: Record<string, number>
    totalRespuestasCorrectas: number
    totalPreguntas: number
}

export default function EjerciciosPage() {
    const [temas, setTemas] = useState<TemaItem[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const userId = localStorage.getItem("userId_matemix")
        const token = localStorage.getItem("token_matemix")

        if (userId && token) {
            temasService.obtenerUsuarioPorId(userId, token)
                .then(async (response) => {
                    const userTemas = response.usuario.temas || []

                    const temasConDetalles = []

                    for (const tema of userTemas) {
                        try {
                            const temaDetails = await temasService.obtenerTemaPorId(tema.id, token)

                            const mappedTema: TemaItem = {
                                id: tema.id,
                                nombre: temaDetails.nombre,
                                description: temaDetails.descripcion ?? "Descripción no disponible",
                                completion: 0,
                                nivel: temaDetails.niveles[0]?.nivel || "facil",
                                points: temaDetails.puntos ?? 0,
                                isCompleted: false,
                                respuestasCorrectasPorNivel: {
                                    facil: 0,
                                    medio: 0,
                                    dificil: 0
                                },
                                totalRespuestasCorrectas: 0,
                                totalPreguntas: temaDetails.cantidad_problemas ?? 0
                            }

                            const niveles = ["facil", "medio", "dificil"]
                            let totalRespuestasCorrectas = 0
                            for (const nivel of niveles) {
                                try {
                                    const respuestasCorrectas = await respuestasService.obtenerRespuestasCorrectas(tema.id, nivel)

                                    respuestasCorrectas.forEach((respuesta) => {
                                        if (respuesta.respuesta_correcta) {
                                            mappedTema.respuestasCorrectasPorNivel[nivel]++
                                            totalRespuestasCorrectas++
                                        }
                                    })
                                } catch (error: unknown) {
                                    if (error instanceof AxiosError) {
                                        if (error.response?.status === 404) {
                                            mappedTema.respuestasCorrectasPorNivel[nivel] = 0
                                        } else {
                                            throw error
                                        }
                                    } else if (error instanceof Error) {
                                        throw error
                                    } else {
                                        throw error
                                    }
                                }
                            }

                            mappedTema.totalRespuestasCorrectas = totalRespuestasCorrectas
                            mappedTema.completion = (totalRespuestasCorrectas / mappedTema.totalPreguntas) * 100

                            temasConDetalles.push(mappedTema)
                        } catch (error) {
                            console.error("Error al obtener detalles del tema", error)
                        }
                    }

                    setTemas(temasConDetalles)
                    setLoading(false)
                })
                .catch((error) => {
                    console.error("Error al obtener los temas del usuario:", error)
                    setLoading(false)
                })
        } else {
            console.error("No se encontró userId_matemix o token_matemix en el localStorage")
            setLoading(false)
        }
    }, [])

    const getProgressColor = (nivel: string, completion: number) => {
        if (completion > 100) {
            return '#FFA000' // Si completion es mayor a 100, color naranja
        }

        switch (nivel) {
            case 'facil':
                return '#10B981' // Verde para fácil
            case 'medio':
                return '#3B82F6' // Azul para medio
            case 'dificil':
                return '#D8315B' // Rojo para difícil
            default:
                return '#D1D5DB' // Gris si no se encuentra nivel
        }
    }

    if (loading) {
        return <div>Cargando...</div>
    }

    return (
        <div className="container mx-auto space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Mis ejercicios</h1>
                <p className="text-gray-600">Ejercicios asignados y su progreso actual</p>
            </div>

            <div className="space-y-6">
                {temas.map((tema) => (
                    <Card key={tema.id}>
                        <CardContent>
                            <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                <div>
                                    <h2 className="text-xl font-semibold">{tema.nombre}</h2>
                                    <p className="text-sm text-gray-600">{tema.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge
                                        variant={
                                            tema.nivel === "facil"
                                                ? "success"
                                                : tema.nivel === "medio"
                                                    ? "warning"
                                                    : "destructive"
                                        }
                                    >
                                        {tema.nivel}
                                    </Badge>
                                    <Badge variant="outline">{tema.points} pts</Badge>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">{tema.completion}% completado</span>
                                    {tema.daysLeft && <span className="text-sm text-gray-600">En {tema.daysLeft} días</span>}
                                    {tema.isCompleted && <span className="text-sm text-green-600">Completado</span>}
                                </div>
                                <Progress
                                    value={tema.completion}
                                    style={{ backgroundColor: getProgressColor(tema.nivel, tema.completion) }}
                                />
                            </div>

                            <div className="flex justify-end">
                                {tema.isCompleted ? (
                                    <Button variant="outline" disabled>
                                        Completado
                                    </Button>
                                ) : (
                                    <Link to={`/ejercicios/${tema.id}`}>
                                        <Button>Continuar</Button>
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
