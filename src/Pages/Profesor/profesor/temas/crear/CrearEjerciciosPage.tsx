import { useEffect, useState } from "react"
import { Button } from "../../../../../Components/ui/button"
import { Input } from "../../../../../Components/ui/input"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../../Components/ui/card"
import { ArrowLeft, Trash2, Pencil } from "lucide-react"
import {  type ejercicioCreate, type ejercicioNivel, type Nivel } from "../../../../../Service/Ejercicios/types"
import { ejercicioService } from "../../../../../Service/Ejercicios/servie"
import { useCallback } from "react"

export default function EjerciciosSubtemaPage() {
  const { id: subtemaId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [ejercicios, setEjercicios] = useState<ejercicioNivel>({
    facil: [],
    medio: [],
    dificil: [],
  });
 
  const [loading, setLoading] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editData, setEditData] = useState<ejercicioCreate | null>(null)
  const [nuevoEjercicio, setNuevoEjercicio] = useState<ejercicioCreate>({
    pregunta: "",
    respuesta_correcta: "",
    es_multiple_choice: false,
    opciones: ["", "", "", ""],
    solucion: null,
    pistas: null,
    concepto_principal: null,
    nivel: "facil",
  })

  const token = localStorage.getItem("token") || ""


  const fetchEjercicios = useCallback(async () => {
    if (!subtemaId || !token) return
    setLoading(true)
    try {
      const data = await ejercicioService.getEjerciciosBySubtemaId(subtemaId, token)
      setEjercicios(data.ejercicios)
    } catch (error) {
      console.error("Error al obtener ejercicios:", error)
      setEjercicios({ facil: [], medio: [], dificil: [] })
    } finally {
      setLoading(false)
    }
  }, [subtemaId, token])


  useEffect(() => {
    fetchEjercicios()
  }, [fetchEjercicios])


  const handleGenerateEjercicios = async () => {
    console.log("subtema id y token:", subtemaId, token)
    if (!subtemaId || !token) return
    setLoading(true)
    try {
      const data = await ejercicioService.generateEjerciciosBySubtemaId(subtemaId, token)
      console.log("Respuesta del backend al generar ejercicios:", data)
      if (!data) {
        setEjercicios({ facil: [], medio: [], dificil: [] })
      } else {
        setEjercicios(data.ejercicios)
      }
    } catch (error) {
      console.error("Error al generar ejercicios:", error)
      setEjercicios({ facil: [], medio: [], dificil: [] })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEjercicio = async () => {
    if (!subtemaId || !token) return
    try {
      await ejercicioService.createEjericioManual({ ...nuevoEjercicio }, token, subtemaId)
      setNuevoEjercicio({
        pregunta: "",
        respuesta_correcta: "",
        es_multiple_choice: false,
        opciones: ["", "", "", ""],
        solucion: null,
        pistas: null,
        concepto_principal: null,
        nivel: "facil",
      })
      await fetchEjercicios() 
     
    } catch (error) {
      console.error("Error al crear el ejercicio:", error)
    }
  }

    const handleDeleteEjercicio = async (ejercicioId: string) => {
    if (!token) return;
    try {
      await ejercicioService.deleteEjercicio(ejercicioId, token, subtemaId || "");
      let deletedNivel: Nivel | null = null;
      setEjercicios(prev => {
        const next = { ...prev };
        (Object.keys(next) as Nivel[]).forEach(nivel => {
          if (next[nivel].some(ej => ej._id === ejercicioId)) {
            deletedNivel = nivel;
          }
          next[nivel] = next[nivel].filter(ej => ej._id !== ejercicioId);
        });
        return next;
      });
      console.log("elimnado nivel", deletedNivel);
    } catch (error) {
      console.log("Error al eliminar el ejercicio:", error);
    }
  };

  const [editNivel, setEditNivel] = useState<Nivel | null>(null);
  
  const handleEditEjercicio = (nivel: Nivel, idx: number) => {
    setEditIndex(idx);
    setEditNivel(nivel);
    setEditData({ ...ejercicios[nivel][idx] });
  };
  const handleSaveEdit = async (ejercicioId: string) => {
    if (!editData || !token || editNivel === null || editIndex === null) return;
    try {
      await ejercicioService.updateEjercicio(ejercicioId, editData, token);
      setEjercicios(prev => {
        const updatedNivel = [...prev[editNivel]];
        // Solo actualiza los campos editados, mantiene los demás
        updatedNivel[editIndex] = { ...updatedNivel[editIndex], ...editData };
        return { ...prev, [editNivel]: updatedNivel };
      });
      setEditIndex(null);
      setEditNivel(null);
      setEditData(null);
    } catch (error) {
      console.error("Error al guardar la edición:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6">
          <Button
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-6">Ejercicios del Subtema</h1>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Ejercicios</CardTitle>
            <CardDescription>Edita, elimina o agrega ejercicios</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <div className="text-center text-gray-500">Cargando...</div>}
            {!loading && Object.values(ejercicios).flat().length === 0 && (
              <div className="flex flex-col items-center gap-4 my-8">
                <p className="text-gray-500">No hay ejercicios aún.</p>
              <Button
                onClick={() => {
                  console.log("Botón presionado");
                  handleGenerateEjercicios();
                }}>   
                 Generar ejercicios automáticamente
                </Button>
              </div>
            )}
            {["facil", "medio", "dificil"].map(nivel => (
            (ejercicios[nivel as Nivel] && ejercicios[nivel as Nivel].length > 0) && (
              <div key={nivel} className="mb-6">
                <h3 className="font-bold capitalize mb-2">{nivel}: 
                  <span className="text-black font-bold"> {" "}
                  {ejercicios[nivel as Nivel].length} ejercicios
                  </span>
                  </h3>
                <div className="space-y-4">
            
                  {ejercicios[nivel as Nivel].map((ej, idx) => (
                <div key={ej._id} className="border rounded p-4 bg-white flex flex-col gap-2">
                  {editIndex === idx ? (
                    <>
                      <label>
                        Pregunta
                      </label>
                      <Input
                        value={editData?.pregunta || ""}
                        onChange={e => setEditData(d => ({ ...d!, pregunta: e.target.value }))}
                        placeholder="Pregunta"
                        className="mb-2"
                      />
                      <label>
                        Respuesta correcta
                      </label>
                      <Input
                        value={editData?.respuesta_correcta || ""}
                        onChange={e => setEditData(d => ({ ...d!, respuesta_correcta: e.target.value }))}
                        placeholder="Respuesta correcta"
                        className="mb-2"
                      />
                      {editData?.es_multiple_choice && (
                        <>
                          <label>
                        Opciones
                      </label>
                        <div className="flex gap-2 mb-2">
                        
                          {(editData.opciones || []).map((op, i) => (

                            <Input
                              key={i}
                              value={op}
                              onChange={e => {
                                const nuevas = [...(editData.opciones || [])]
                                nuevas[i] = e.target.value
                                setEditData(d => ({ ...d!, opciones: nuevas }))
                              }}
                              placeholder={`Opción ${i + 1}`}
                            />
                          ))}
                        </div>
                        </>
                      )}
                      <label>
                        Pistas
                      </label>
                      {( editData?.pistas || []).map((op, i) => (
                        <>
                        <label>
                          Pista {i+1}
                        </label>

                            <Input
                              key={i}
                              value={op}
                              onChange={e => {
                                if (!editData) return;
                                const nuevas = [...(editData.pistas || [])]
                                nuevas[i] = e.target.value
                                setEditData(d => d ? { ...d, pistas: nuevas } : d)
                              }}
                              placeholder={`Pista ${i + 1}`}
                            />
                            </>
                          ))}
                          <label>
                            Solucion
                          </label>
                        {( editData?.solucion || []).map((op, i) => (
                        <>
                        <label>
                          Paso {i+1}
                        </label>

                            <Input
                              key={i}
                              value={op}
                              onChange={e => {
                                if (!editData) return;
                                const nuevas = [...(editData.solucion || [])]
                                nuevas[i] = e.target.value
                                setEditData(d => d ? { ...d, solucion: nuevas } : d)
                              }}
                              placeholder={`Paso ${i + 1}`}
                            />
                            </>
                          ))}
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSaveEdit(ej._id)}>Guardar</Button>
                        <Button size="sm" variant="outline" onClick={() => { setEditIndex(null); setEditData(null); }}>Cancelar</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-medium">{ej.pregunta}</div>
                      <div className="text-sm text-gray-600">Respuesta: {ej.respuesta_correcta}</div>
                      {ej.es_multiple_choice && ej.opciones && (
                        <ul className="list-disc pl-5 text-sm">
                          {ej.opciones.map((op, i) => (
                            <li key={i}>{op}</li>
                          ))}
                        </ul>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditEjercicio(ej.nivel, idx)}>
                          <Pencil className="h-4 w-4 mr-1" /> Editar
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteEjercicio(ej._id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              </div>
              </div>
  )
            ))}
            {/* Botón para generar ejercicios automáticamente */}
            {/* Agregar ejercicio manual */}
            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold mb-2">Agregar ejercicio manualmente</h4>
              <div className="flex flex-col gap-2 mb-2">
                <Input
                  placeholder="Pregunta"
                  value={nuevoEjercicio.pregunta}
                  onChange={e => setNuevoEjercicio({ ...nuevoEjercicio, pregunta: e.target.value })}
                  required
                />
                <Input
                  placeholder="Respuesta correcta"
                  value={nuevoEjercicio.respuesta_correcta}
                  onChange={e => setNuevoEjercicio({ ...nuevoEjercicio, respuesta_correcta: e.target.value })}
                  required
                />
                <select
                  value={nuevoEjercicio.nivel}
                  onChange={e => setNuevoEjercicio({ ...nuevoEjercicio, nivel: e.target.value as Nivel })}
                  className="border rounded px-2 py-1"
                >
                  <option value="facil">facil</option>
                  <option value="medio">medio</option>
                  <option value="dificil">dificil</option>
                </select>
                <Input
                  placeholder="Concepto principal (opcional)"
                  value={nuevoEjercicio.concepto_principal || ""}
                  onChange={e => setNuevoEjercicio({ ...nuevoEjercicio, concepto_principal: e.target.value })}
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={nuevoEjercicio.es_multiple_choice}
                    onChange={e => setNuevoEjercicio({ ...nuevoEjercicio, es_multiple_choice: e.target.checked })}
                  />
                  Es opción múltiple
                </label>
                {nuevoEjercicio.es_multiple_choice && (
                  <div className="flex flex-col gap-2">
                    {(nuevoEjercicio.opciones || []).map((op, i) => (
                      <Input
                        key={i}
                        placeholder={`Opción ${i + 1}`}
                        value={op}
                        onChange={e => {
                          const nuevas = [...(nuevoEjercicio.opciones || [])]
                          nuevas[i] = e.target.value
                          setNuevoEjercicio({ ...nuevoEjercicio, opciones: nuevas })
                        }}
                      />
                    ))}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setNuevoEjercicio(e => ({
                            ...e,
                            opciones: [...(e.opciones || []), ""]
                          }))
                        }
                      >
                        + Opción
                      </Button>
                      {nuevoEjercicio.opciones && nuevoEjercicio.opciones.length > 2 && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            setNuevoEjercicio(e => ({
                              ...e,
                              opciones: (e.opciones || []).slice(0, -1)
                            }))
                          }
                        >
                          - Opción
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                {/* Solución */}
                <div>
                  <label className="block text-sm font-medium mb-1">Solución (opcional)</label>
                  {(nuevoEjercicio.solucion || [""]).map((sol, i) => (
                    <div key={i} className="flex gap-2 mb-1">
                      <Input
                        placeholder={`Paso ${i + 1}`}
                        value={sol}
                        onChange={e => {
                          const nuevas = [...(nuevoEjercicio.solucion || [""])]
                          nuevas[i] = e.target.value
                          setNuevoEjercicio({ ...nuevoEjercicio, solucion: nuevas })
                        }}
                      />
                      {i === (nuevoEjercicio.solucion?.length || 1) - 1 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setNuevoEjercicio(e => ({
                              ...e,
                              solucion: [...(e.solucion || []), ""]
                            }))
                          }
                        >
                          +
                        </Button>
                      )}
                      {nuevoEjercicio.solucion && nuevoEjercicio.solucion.length > 1 && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            setNuevoEjercicio(e => ({
                              ...e,
                              solucion: (e.solucion || []).filter((_, idx) => idx !== i)
                            }))
                          }
                        >
                          -
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {/* Pistas */}
                <div>
                  <label className="block text-sm font-medium mb-1">Pistas (opcional)</label>
                  {(nuevoEjercicio.pistas || [""]).map((pista, i) => (
                    <div key={i} className="flex gap-2 mb-1">
                      <Input
                        placeholder={`Pista ${i + 1}`}
                        value={pista}
                        onChange={e => {
                          const nuevas = [...(nuevoEjercicio.pistas || [""])]
                          nuevas[i] = e.target.value
                          setNuevoEjercicio({ ...nuevoEjercicio, pistas: nuevas })
                        }}
                      />
                      {i === (nuevoEjercicio.pistas?.length || 1) - 1 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setNuevoEjercicio(e => ({
                              ...e,
                              pistas: [...(e.pistas || []), ""]
                            }))
                          }
                        >
                          +
                        </Button>
                      )}
                      {nuevoEjercicio.pistas && nuevoEjercicio.pistas.length > 1 && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            setNuevoEjercicio(e => ({
                              ...e,
                              pistas: (e.pistas || []).filter((_, idx) => idx !== i)
                            }))
                          }
                        >
                          -
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  className="mt-2"
                  onClick={handleCreateEjercicio}
                  disabled={!nuevoEjercicio.pregunta || !nuevoEjercicio.respuesta_correcta}
                >
                  Agregar ejercicio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}