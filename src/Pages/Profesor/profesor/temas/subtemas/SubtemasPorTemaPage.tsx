import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../Components/ui/card"
import { Button } from "../../../../../Components/ui/button"
import { subtemaService } from "../../../../../Service/Subtema/subtemaService"
import type { subtemaResponse, videoResponse } from "../../../../../Service/Subtema/types"
import { getYoutubeId, VideoPlayer } from "../../salones/crear/videos"
import { Check, Play } from "lucide-react"
import { Input } from "../../../../../Components/ui/input"

export default function SubtemasPorTemaPage() {
  const { id: temaId } = useParams<{ id: string }>()
  const [subtemas, setSubtemas] = useState<subtemaResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [videoActivo, setVideoActivo] = useState<string | null>(null)
  const navigate = useNavigate()
  const [mostrarVideos, setMostrarVideos] = useState<{ [key: string]: boolean }>({})
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
  const [videosSugeridos, setVideosSugeridos] = useState<videoResponse[]>([])
  const [noVideos, setNoVideos] = useState(false)
  const [loadingSugerencias, setLoadingSugerencias] = useState(false)
  const [mostrarBoton, setMostrarBoton] = useState(true)
  const [nuevoVideo, setNuevoVideo] = useState({ titulo: "", url: "" })
  const [videosSeleccionados, setVideosSeleccionados] = useState<string[]>([])
  const [ordenes, setOrdenes] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    async function fetchSubtemas() {
      setLoading(true)
      try {
        const res = await subtemaService.getSubtemasByTemaId(temaId || "", localStorage.getItem("token_matemix") || "")
       if (res && Array.isArray(res.subtemas)) {
           const ordenados = [...res.subtemas].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
           setSubtemas(ordenados)
           const nuevosOrdenes: { [key: string]: number } = {}
           ordenados.forEach(s => {
               nuevosOrdenes[s._id] = s.orden ?? 0
           })
           setOrdenes(nuevosOrdenes)
       } else {
           setSubtemas([])
       }
   } catch (e) {
        console.error("Error al obtener los subtemas:", e)
        setSubtemas([])
      } finally {
        setLoading(false)
      }
    }
    if (temaId) fetchSubtemas()
  }, [temaId])

  const handleMostrarVideos = (subtemaId: string) => {
    setMostrarVideos(prev => ({
      ...prev,
      [subtemaId]: !prev[subtemaId]
    }))
  }
    const handleAgregarVideoManual = () => {
      if (!nuevoVideo.titulo || !nuevoVideo.url) return;
      const videoManual = {
        id: getYoutubeId(nuevoVideo.url) || `manual-${Date.now()}`,
        titulo: nuevoVideo.titulo,
        title: nuevoVideo.titulo,
        url: nuevoVideo.url,
        thumbnail: `https://img.youtube.com/vi/${getYoutubeId(nuevoVideo.url)}/0.jpg`, 
        duracion: "",
        similarity: 10,
      };
      setVideosSugeridos(prev => [...prev, videoManual]);
      setNuevoVideo({ titulo: "", url: "" });
    };


  const handleDeleteSubtema = async (subtemaId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este subtema?")) {
        try {
            await subtemaService.deleteSubtemaById(subtemaId, localStorage.getItem("token_matemix") || "")
            setSubtemas(prev => prev.filter(subtema => subtema._id !== subtemaId))
        } catch (error) {
            console.error("Error al eliminar subtema:", error)
        }
    }
  }

  const handleMostrarSugerencias = async (subtemaId:string) => {
    setLoadingSugerencias(true)
    try {
        const res = await subtemaService.generateVideosBySubTemaId(subtemaId || "", localStorage.getItem("token_matemix") || "")
        if (res && Array.isArray(res)) {
            setVideosSugeridos(res)
            setMostrarSugerencias(true)
            setNoVideos(false)
            setMostrarBoton(false)
        } else {
            setNoVideos(true)
        }
    } catch (error) {
        console.error("Error al obtener sugerencias de videos:", error)
    } finally {
        setLoadingSugerencias(false)
    }
  }

    const handleGuardarVideos = async (subtemaId: string) => {
      const videosAguardar = videosSugeridos.filter(v => videosSeleccionados.includes(v.id))
      if (videosAguardar.length === 0) {
        alert("No hay videos seleccionados para guardar.")
        return
        }
      try {
        const response = await subtemaService.guardarVideos(subtemaId, videosSugeridos, localStorage.getItem("token_matemix") || "")
        console.log("Respuesta al guardar videos:", response)
        setMostrarSugerencias(false)
        setVideosSugeridos([])
        alert("Videos guardados exitosamente.")
    
        setSubtemas(prev =>
          prev.map(subtema =>
            subtema._id === subtemaId
              ? { ...subtema, video_url: videosSugeridos }
              : subtema
          )
        )
      } catch (error) {
        console.error("Error al guardar los videos:", error)
        alert("Error al guardar los videos.")
      }
    }
    const handleToggleVideo = (videoId: string) => {
      setVideosSeleccionados(prev => {
        if (prev.includes(videoId)) return prev.filter(id => id !== videoId)
        if (prev.length < 3) return [...prev, videoId]
        return prev
      })
    }

    const handleGuardarTodosLosOrdenes = async () => {
        try {
            await Promise.all(
            subtemas.map(subtema =>
                subtemaService.updateSubtemaOrden(
                subtema._id,
                ordenes[subtema._id],
                localStorage.getItem("token_matemix") || ""
                )
            )
            )
            setSubtemas(prev =>
            prev.map(s => ({
                ...s,
                orden: ordenes[s._id]
            }))
            )
            alert("Órdenes actualizados correctamente")
        } catch (error) {
            console.log("Error al actualizar los órdenes:", error)
            alert("Error al actualizar los órdenes")
        }
    }
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {videoActivo && (
        <VideoPlayer
            url={
              subtemas
                .flatMap(subtema => subtema.video_url || [])
                .find(v => v.id === videoActivo)?.url || ""
            }
            onClose={() => setVideoActivo(null)} 
        />
      )}
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Subtemas del Tema</h1>
          <Button
            onClick={() => navigate(`/profesor/temas/${temaId}/subtemas/crear`)}
            variant="default"
          >
            Agregar subtema
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Listado de Subtemas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-gray-500">Cargando...</div>
            ) : subtemas.length === 0 ? (
              <div className="text-center text-gray-500">No hay subtemas para este tema.</div>
            ) : (
              <ul className="space-y-6">
                {subtemas.map(subtema => (
                  <li key={subtema._id} className="border rounded p-4 bg-white shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-bold text-lg mb-1">{subtema.titulo}</div>
                        <div className="text-gray-600 mb-2">{subtema.descripcion}</div>
                        {Array.isArray(subtema.video_url) && subtema.video_url.length > 0 ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="mb-2"
                              onClick={() => handleMostrarVideos(subtema._id)}
                            >
                              {mostrarVideos[subtema._id] ? "Ocultar videos" : "Mostrar videos"}
                            </Button>
                            {mostrarVideos[subtema._id] && (
                              <div className="grid md:grid-cols-2 gap-4 mt-2">
                                {subtema.video_url.map((video: videoResponse) => (
                                  <div className="bg-gray-100 p-2 rounded relative group cursor-pointer" key={video.id}>
                                    <div
                                        className="relative cursor-pointer group"
                                        onClick={() => {
                                        console.log("Video seleccionado:", video)
                                        setVideoActivo(video.id)
                                    }}
                                    >
                                    <img
                                      src={video.thumbnail || "https://via.placeholder.com/150"}
                                      className="w-full h-32 object-cover rounded"
                                     
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                                        {video.duracion}
                                    </div>
                                  </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                           { mostrarBoton && (<Button
                              size="sm"
                              variant="outline"
                              className="mb-2"
                              onClick={() => handleMostrarSugerencias(subtema._id)}
                            >
                              Agregar videos
                            </Button> )}

                            {loadingSugerencias && (
                              <div className="flex justify-center items-center py-8">
                                  <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></span>
                                  <span className="text-blue-600 font-medium">Generando videos...</span>
                                </div>
                            )}
                            {noVideos && (
                                <div className="flex flex-col items-center gap-2 py-4">
                                <span className="text-red-600 font-medium">No se encontraron videos sugeridos para este subtema.</span>
                                <Button
                                  variant="outline"
                                  onClick={async () => {
                                    setLoading(true);
                                    setNoVideos(false);
                                    setMostrarBoton(false)
                                    try {
                                      if (subtema && subtema._id) {
                                        const sugeridos = await subtemaService.generateVideosBySubTemaId(subtema._id, localStorage.getItem("token_matemix") || "");
                                        console.log("Videos sugeridos:", sugeridos);
                                        const videos = Array.isArray(sugeridos) ? sugeridos : (sugeridos?.videos || []);
                                        if (!videos || videos.length === 0) {
                                          setNoVideos(true);
                                          setVideosSugeridos([]);
                                          
                                        } else {
                                          setVideosSugeridos(videos);
                                          setNoVideos(false);
                                          setVideosSugeridos(videos);
                                            setMostrarSugerencias(true);
                                        }
                                      } else {
                                        setNoVideos(true);
                                        alert("No se pudo obtener el ID del subtema.");
                                      }
                                    } catch (error) {
                                      console.log("Error al volver a generar videos:", error);
                                      setNoVideos(true);
                                      alert("Error al volver a generar videos. Inténtalo de nuevo.");
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                >
                                  Volver a generar videos sugeridos
                                </Button>
                              </div>
                            )}
                            {mostrarSugerencias && (
                                  <>
                                <div className="grid md:grid-cols-2 gap-4">
                                  {(Array.isArray(videosSugeridos) ? videosSugeridos : []).map(video => (
                                      <div
                                      key={video.id}
                                      className={`border rounded-lg overflow-hidden transition-all ${
                                        videosSeleccionados.includes(video.id)
                                          ? "border-blue-500 ring-2 ring-blue-200"
                                          : "border-gray-200 hover:border-blue-300"
                                      }`}
                                    >
                                      <div 
                                        className="relative cursor-pointer group"
                                        onClick={() => setVideoActivo(video.id)}
                                      >
                                        <img 
                                          src={video.thumbnail} 
                                          alt={video.title}
                                          className="w-full h-32 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Play className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                                          {video.duracion}
                                        </div>
                                      </div>
                                      <div className="p-3">
                                        <div className="font-medium text-sm line-clamp-2 mb-2">{video.title}</div>
                                        <Button
                                          variant={videosSeleccionados.includes(video.id) ? "default" : "outline"}
                                          size="sm"
                                          className="w-full"
                                          onClick={() => handleToggleVideo(video.id)}
                                        >
                                          {videosSeleccionados.includes(video.id) ? (
                                            <span className="flex items-center gap-1">
                                              <Check className="h-4 w-4" /> Seleccionado
                                            </span>
                                          ) : "Seleccionar"}
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {/* Agregar video manual */}
                                <div className="mt-4">
                                  <div className="font-semibold mb-2">Agregar video manual</div>
                                  <div className="flex gap-2 mb-2">
                                    <Input
                                      placeholder="Título del video"
                                      value={nuevoVideo.titulo}
                                      onChange={e => setNuevoVideo(v => ({ ...v, titulo: e.target.value }))}
                                    />
                                    <Input
                                      placeholder="URL del video"
                                      value={nuevoVideo.url}
                                      onChange={e => setNuevoVideo(v => ({ ...v, url: e.target.value }))}
                                    />
                                    <Button size="sm" onClick={handleAgregarVideoManual}>Agregar</Button>
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                  <Button 
                                    className="flex-1" 
                                    variant='outline'
                                    onClick={() => handleGuardarVideos(subtema._id)}
                                    disabled={videosSeleccionados.length === 0}
                                  >
                                    Confirmar videos
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => {
                                      setMostrarSugerencias(false)
                                        setVideosSugeridos([])
                                        setVideosSeleccionados([])

                                      setNuevoVideo({ titulo: "", url: "" })
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </>
                            )}

                          </>
                        )
                        }
                      </div>
                      <div className="flex flex-col gap-2 min-w-[160px]">
                        <Link to={`/profesor/subtemas/${subtema._id}/ejercicios`}>
                          <Button size="sm" variant="outline" className="w-full">Ejercicios</Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full bg-red-400 text-white hover:bg-red-600"
                          onClick={() => handleDeleteSubtema(subtema._id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-10 mb-4 p-4 bg-white rounded shadow">
                <h2 className="text-lg font-semibold mb-3 text-blue-900">Editar orden de los subtemas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subtemas
                    .slice()
                    .sort((a, b) => (ordenes[a._id] ?? 0) - (ordenes[b._id] ?? 0))
                    .map(subtema => (
                        <div key={subtema._id} className="flex items-center gap-2 bg-white p-2 rounded shadow-sm">
                        <span className="flex-1 truncate">{subtema.titulo}</span>
                        <input
                            type="number"
                            min={1}
                            className="border rounded px-2 py-1 w-20"
                            value={ordenes[subtema._id] ?? subtema.orden ?? 0}
                            onChange={e =>
                            setOrdenes(prev => ({
                                ...prev,
                                [subtema._id]: Number(e.target.value)
                            }))
                            }
                        />
                        <span className="text-xs text-gray-500">Orden</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-4">
                    <Button onClick={handleGuardarTodosLosOrdenes} variant="default">
                    Guardar orden de subtemas
                    </Button>
                </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
              >
                Volver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}