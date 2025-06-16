"use client"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../Components/ui/card"
import { Button } from "../../../../../Components/ui/button"
import { Input } from "../../../../../Components/ui/input"
import { temasService } from "../../../../../Service/Temas/TemasService"
import type { Tema, ResponseTema } from "../../../../../Service/Temas/types"

export default function DetallesTemaPage() {
  const {id:salonId} = useParams<{id:string}>()
  const [temas, setTemas] = useState<ResponseTema[]>([])
  const [loading, setLoading] = useState(true)
  const [nuevoTema, setNuevoTema] = useState({ nombre: "", descripcion: "" })
  const [ordenes, setOrdenes] = useState<{ [key: string]: number }>({})
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchTemas() {
      setLoading(true)
      try {
        const res = await temasService.obtenerTemas(
          salonId,
          localStorage.getItem("token_matemix") || ""
        )
        // Si la respuesta es un array
        if (Array.isArray(res)) {
          const ordenados = [...res].sort((a, b) => (ordenes[a._id] ?? 0) - (ordenes[b._id] ?? 0))
          setTemas(ordenados)
          const nuevosOrdenes: { [key: string]: number } = {}
          ordenados.forEach(t => {
            nuevosOrdenes[t._id] = t.orden ?? 0
          })
          setOrdenes(nuevosOrdenes)
        } else {
          setTemas([])
        }
      } catch (e) {
        console.error("Error al obtener los temas:", e)
        setTemas([])
      } finally {
        setLoading(false)
      }
    }
    fetchTemas()
  }, [salonId])

  const handleCrearTema = async () => {
    if (!nuevoTema.nombre || !nuevoTema.descripcion) {
      alert("Completa todos los campos.")
      return
    }
    try {
      if(!salonId) {
        alert("El ID del salón no está definido.")
        return
      }
      const temaData: Tema = {
        nombre: nuevoTema.nombre,
        descripcion: nuevoTema.descripcion,
        classroom_id: salonId,
        orden: temas.length +1,
      }
      const res = await temasService.crearTema(temaData, localStorage.getItem("token_matemix") || "")
      setTemas(prev => [...prev, res])
      setNuevoTema({ nombre: "", descripcion: "" })
      navigate(`/profesor/temas/${res._id}/subtemas/crear`)
    } catch (error) {
      console.error("Error al crear tema:", error)
      alert("Error al crear el tema.")
    }
  }

  const handleGuardarTodosLosOrdenes = async () => {
    try {
      await Promise.all(
        temas.map(tema =>
          temasService.updateTemaOrden(
            tema._id,
            ordenes[tema._id],
            localStorage.getItem("token_matemix") || ""
          )
        )
      )
      setTemas(prev =>
        prev.map(t => ({
          ...t,
          orden: ordenes[t._id]
        }))
      )
      alert("Órdenes actualizados correctamente")
    } catch (error) {
      console.log("Error al actualizar los órdenes:", error)
      alert("Error al actualizar los órdenes")
    }
  }

  const handleDeleteTema = async (temaId: string) => {
    const confirmado = window.confirm("¿Estás seguro de que quieres eliminar este tema? Esta acción no se puede deshacer.");
    if (!confirmado) return;
    try {
      await temasService.eliminarTema(temaId, localStorage.getItem("token_matemix") || "")
      setTemas(prev => prev.filter(t => t._id !== temaId))
      alert("Tema eliminado correctamente")
    } catch (error) {
      console.error("Error al eliminar tema:", error)
      alert("Error al eliminar tema")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Temas</h1>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
          >
            Volver
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Listado de Temas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-gray-500">Cargando...</div>
            ) : temas.length === 0 ? (
              <div className="text-center text-gray-500">No hay temas.</div>
            ) : (
              <ul className="space-y-6">
                {temas
                  .slice()
                  .sort((a, b) => (ordenes[a._id] ?? 0) - (ordenes[b._id] ?? 0))
                  .map(tema => (
                  <li key={tema._id} className="border rounded p-4 bg-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">{tema.nombre}</div>
                      <div className="text-gray-600 mb-2">{tema.descripcion}</div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate(`/profesor/tema/subtemas/${tema._id}`)}
                      >
                        Ver subtemas
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-red-400 text-white hover:bg-red-600"
                        onClick={() => handleDeleteTema(tema._id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-10 mb-4 p-4 bg-white rounded shadow">
              <h2 className="text-lg font-semibold mb-3 text-blue-900">Editar orden de los temas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {temas
                  .slice()
                  .sort((a, b) => (ordenes[a._id] ?? 0) - (ordenes[b._id] ?? 0))
                  .map(tema => (
                  <div key={tema._id} className="flex items-center gap-2 bg-white p-2 rounded shadow-sm">
                    <span className="flex-1 truncate">{tema.nombre}</span>
                    <input
                      type="number"
                      min={1}
                      className="border rounded px-2 py-1 w-20"
                      value={ordenes[tema._id] ?? tema.orden ?? 0}
                      onChange={e =>
                        setOrdenes(prev => ({
                          ...prev,
                          [tema._id]: Number(e.target.value)
                        }))
                      }
                    />
                    <span className="text-xs text-gray-500">Orden</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleGuardarTodosLosOrdenes} variant="default">
                  Guardar orden de temas
                </Button>
              </div>
            </div>
            <div className="mt-10 mb-4 p-4 bg-white rounded shadow">
              <h2 className="text-lg font-semibold mb-3 text-blue-900">Crear nuevo tema</h2>
              <div className="flex flex-col gap-2 mb-2">
                <Input
                  placeholder="Nombre del tema"
                  value={nuevoTema.nombre}
                  onChange={e => setNuevoTema({ ...nuevoTema, nombre: e.target.value })}
                  required
                />
                <Input
                  placeholder="Descripción del tema"
                  value={nuevoTema.descripcion}
                  onChange={e => setNuevoTema({ ...nuevoTema, descripcion: e.target.value })}
                  required
                />
                <Button onClick={handleCrearTema} variant="default">
                  Crear tema
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}