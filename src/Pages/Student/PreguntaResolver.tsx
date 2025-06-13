// src/Pages/PreguntaResolver.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../Components/ui/button";
import { Card, CardContent } from "../../Components/ui/card";
import { Progress } from "../../Components/ui/progress";
import { ArrowLeft, BookOpen } from "lucide-react";
import { preguntasService } from "../../Service/Preguntas/PreguntasService";
import { respuestasService } from "../../Service/Respuestas/RespuestasService";
import { temasService } from "../../Service/Temas/TemasService";
import type { PreguntaResponse, RespuestaCorrecta } from "../../Service/types";
import { AxiosError } from "axios";

export default function PreguntaResolverPage() {
    const { temaId, nivel } = useParams<{ temaId: string; nivel: string }>();

    const [pregData, setPregData] = useState<PreguntaResponse[]>([]);
    const [resData, setResData] = useState<RespuestaCorrecta[]>([]);
    const [loading, setLoading] = useState(true);
    const [pregIncorrectas, setPregIncorrectas] = useState<PreguntaResponse[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [totalPreguntas, setTotalPreguntas] = useState(0);
    const [temaNombre, setTemaNombre] = useState<string>("");
    const [currentPreguntaIndex, setCurrentPreguntaIndex] = useState(0); // Controlador del índice de la pregunta actual

    // Carga inicial de preguntas, respuestas correctas y guardamos el tema_nombre
    useEffect(() => {
        if (!temaId || !nivel) return;

        setLoading(true);
        Promise.all([
            preguntasService.obtenerPreguntasNivel(temaId, nivel),
            respuestasService
                .obtenerRespuestasCorrectas(temaId, nivel)
                .catch((error: unknown) => {
                    if (error instanceof AxiosError) {
                        if (error.response?.status === 404) {
                            console.warn("No hay respuestas previas (404) — asumiendo 0");
                            return []; // Devuelve un array vacío si no hay respuestas correctas
                        }
                        throw error;
                    } else if (error instanceof Error) {
                        throw error;
                    } else {
                        throw new Error("Error desconocido al obtener respuestas correctas.");
                    }
                }),
        ])
            .then(([pregRes, respRes]) => {
                setPregData(pregRes.preguntas);
                setTotalPreguntas(pregRes.total_preguntas);
                setTemaNombre(pregRes.tema_nombre); // Guardamos el nombre del tema
                setResData(respRes); // Guardamos las respuestas correctas
            })
            .catch((err) => {
                console.error("Error cargando datos:", err);
                alert("No se pudieron cargar las preguntas o respuestas.");
            })
            .finally(() => setLoading(false));
    }, [temaId, nivel]);

    // Filtramos solo las preguntas que aún no han sido respondidas correctamente
    useEffect(() => {
        const pendientes = pregData.filter((p) => {
            return !resData.find((r) => r.pregunta_id === p.id && r.respuesta_correcta);
        });
        setPregIncorrectas(pendientes);
    }, [pregData, resData]);

    const handleChange = (pregId: string, value: string) => {
        setSelectedAnswers((prev) => ({ ...prev, [pregId]: value }));
    };

    // Comprobar respuesta y pasar a la siguiente pregunta
    const handleCheck = async (preg: PreguntaResponse) => {
        const answer = selectedAnswers[preg.id];
        if (!answer) {
            return alert("Por favor selecciona o escribe una respuesta.");
        }

        // Validación local de la respuesta
        if (answer !== preg.respuesta_correcta) {
            alert("¡Respuesta incorrecta! Avanzando a la siguiente pregunta.");
            // Avanzar a la siguiente pregunta
            setCurrentPreguntaIndex((prevIndex) => (prevIndex + 1) % pregIncorrectas.length);
            return;
        }

        // Guardamos la respuesta correcta en el backend
        try {
            const alumno_id = localStorage.getItem("userId_matemix")!;
            const token = localStorage.getItem("token_matemix")!;
            const resp = await respuestasService.guardarRespuesta(
                alumno_id,
                temaId!,
                preg.id,
                answer,
                token
            );

            // Actualizamos las respuestas correctas
            setResData((prev) => [...prev, resp]);
            // Avanzamos a la siguiente pregunta
            setCurrentPreguntaIndex((prevIndex) => (prevIndex + 1) % pregIncorrectas.length);
        } catch (err) {
            console.error("Error al guardar la respuesta:", err);
            alert("Ocurrió un error guardando tu respuesta.");
        }
    };

    // Si ya completó todas las preguntas, avanzamos al siguiente nivel
    useEffect(() => {
        if (totalPreguntas > 0 && resData.length === totalPreguntas) {
            const usuario_id = localStorage.getItem("userId_matemix")!;
            const token = localStorage.getItem("token_matemix")!;

            let siguiente: string | null = null;
            if (nivel === "facil") siguiente = "medio";
            else if (nivel === "medio") siguiente = "dificil";

            if (siguiente) {
                temasService
                    .actualizarTemaDeUsuario(
                        usuario_id,
                        temaId!,
                        {
                            nombre: temaNombre, // Guardamos el nombre del tema
                            nivel: siguiente,
                        },
                        token
                    )
                    .then(() =>
                        console.log(`¡Nivel actualizado de ${nivel} a ${siguiente}!`)
                    )
                    .catch((err) => console.error("Error avanzando de nivel:", err));
            }
        }
    }, [resData, totalPreguntas, nivel, temaId, temaNombre]);

    if (loading) return <div>Cargando...</div>;

    // Colores por nivel
    const colorMap: Record<string, string> = {
        facil: "#10B981",
        medio: "#3B82F6",
        dificil: "#D8315B",
    };
    const nivelColor = colorMap[nivel!] ?? "#D1D5DB";
    const progressPct = totalPreguntas
        ? (resData.length / totalPreguntas) * 100
        : 0;

    const currentPregunta = pregIncorrectas[currentPreguntaIndex];

    return (
        <div className="container mx-auto space-y-6">
            {/* Volver al dashboard */}
            <div className="flex items-center gap-4 mb-6">
                <Link to="/ejercicios">
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver al dashboard
                    </Button>
                </Link>
            </div>

            {/* Título */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold capitalize">
                    Nivel {nivel} — {temaNombre}
                </h1>
                <p className="text-gray-600">
                    Completa estos ejercicios para dominar el nivel {nivel}.
                </p>
            </div>

            {/* Barra de progreso */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-5 w-5" style={{ color: nivelColor }} />
                    <span className="text-sm font-medium">
                        {resData.length} de {totalPreguntas} completados
                    </span>
                </div>
                <Progress value={progressPct} style={{ backgroundColor: nivelColor }} />
            </div>

            {/* Pregunta actual */}
            {currentPregunta && (
                <Card key={currentPregunta.id}>
                    <CardContent>
                        <h3 className="text-xl font-semibold mb-4">
                            {currentPregunta.pregunta}
                        </h3>

                        {currentPregunta.es_multiple_choice ? (
                            <div className="space-y-2">
                                {currentPregunta.opciones.map((op, idx) => (
                                    <label key={idx} className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name={currentPregunta.id}
                                            value={op}
                                            checked={selectedAnswers[currentPregunta.id] === op}
                                            onChange={() => handleChange(currentPregunta.id, op)}
                                        />
                                        <span>{op}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <input
                                type="text"
                                className="input w-full mb-4"
                                placeholder="Escribe tu respuesta"
                                value={selectedAnswers[currentPregunta.id] || ""}
                                onChange={(e) =>
                                    handleChange(currentPregunta.id, e.target.value)
                                }
                            />
                        )}

                        <div className="mt-6 flex justify-end">
                            <Button onClick={() => handleCheck(currentPregunta)}>
                                Comprobar respuesta
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
