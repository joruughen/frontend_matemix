"use client"

import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../Components/ui/card"
import { Button } from "../../../../../Components/ui/button"
import { Input } from "../../../../../Components/ui/input"
import { Label } from "../../../../../Components/ui/label"
import { ArrowLeft, Check, Play } from "lucide-react"
import type { subtemaResponse, videoResponse } from "../../../../../Service/Subtema/types"
import { getYoutubeId, VideoPlayer } from "../../salones/crear/videos"
import { subtemaService } from "../../../../../Service/Subtema/subtemaService"

export default function CrearSubtemaPage() {
  const [subtema, setSubtema] = useState({ nombre: "", descripcion: "" })
  const { id: temaId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [videosSugeridos, setVideosSugeridos] = useState<videoResponse[]>([])
  const [videosSeleccionados, setVideosSeleccionados] = useState<string[]>([])
  const [videoActivo, setVideoActivo] = useState<string | null>(null)
  const [videosManuales, setVideosManuales] = useState<{ titulo: string, url: string }[]>([])
  const [nuevoVideo, setNuevoVideo] = useState({ titulo: "", url: "" })
  const [loadingSubtema, setLoadingSubtema] = useState(false)
  const [novideosSugeridos, setNoVideosSugeridos] = useState(false)
  const [subtemaActual, setSubtemaActual] = useState<subtemaResponse | null>(null)
  const [paso, setPaso] = useState<"form" | "videos" | "confirmado">("form")
  // Crear subtema y obtener videos sugeridos
  const handleCrearSubtema = async () => {
    if (!subtema.nombre || !subtema.descripcion) {
      alert("Completa todos los campos.");
      return;
    }
    if (!temaId) {
      alert("El ID del tema no está definido.");
      return;
    }
    setLoadingSubtema(true)
    try {
      const createSubtema = {
        titulo: subtema.nombre,
        descripcion: subtema.descripcion,
        tema_id: temaId,
        orden: 0,
      }
      const response = await subtemaService.createSubtema(createSubtema, localStorage.getItem("token_matemix") || "")
      if (!response || !response._id) {
        alert("Error al crear el subtema. Inténtalo de nuevo.")
        return
      }
      console.log("Subtema creado:", response)
      setSubtemaActual(response)
    
      // Obtener videos sugeridos
      try {
        const sugeridos = await subtemaService.generateVideosBySubTemaId(response._id, localStorage.getItem("token_matemix") || "")
        const vi = Array.isArray(sugeridos)
          ? sugeridos
          : (typeof sugeridos === "object" && sugeridos !== null && "videos" in sugeridos && Array.isArray((sugeridos as { videos: unknown }).videos)
              ? (sugeridos as { videos: videoResponse[] }).videos
              : []);
        console.log("videos ", vi)
                        
        if (!vi || vi.length === 0) {          
          setNoVideosSugeridos(true)
          setVideosSugeridos([])
        } else {
          setVideosSugeridos(vi)
          setNoVideosSugeridos(false)
        }
        setPaso("videos")
      } catch (error) {
        console.error("Error al obtener videos sugeridos:", error)
        setNoVideosSugeridos(true)
        setVideosSugeridos([])
        setPaso("videos")
        alert("Error al obtener videos sugeridos. Inténtalo de nuevo.")
      }
    } catch (error) {
      console.error("Error al guardar el subtema:", error)
      alert("Error al guardar el subtema. Inténtalo de nuevo.")
    } finally {
      setLoadingSubtema(false)
    }
  }

  // Seleccionar/deseleccionar videos sugeridos
  const handleToggleVideo = (videoId: string) => {
    setVideosSeleccionados(prev => {
      if (prev.includes(videoId)) return prev.filter(id => id !== videoId)
      return [...prev, videoId]
    })
  }

  // Agregar video manual
  const handleAgregarVideoManual = () => {
    if (!nuevoVideo.titulo || !nuevoVideo.url) return;
    setVideosManuales(prev => [...prev, { ...nuevoVideo }])
    setNuevoVideo({ titulo: "", url: "" })
  }


  // Confirmar videos y guardar en backend
  const handleConfirmarVideos = async () => {
    if (
      videosSeleccionados.length === 0 &&
      videosManuales.length === 0
    ) {
      alert("Debes seleccionar o agregar al menos un video para este subtema.");
      return;
    }
    if (!subtemaActual?._id) {
      alert("No se pudo obtener el ID del subtema.");
      return;
    }
    const videosParaGuardar = [
      ...videosSugeridos.filter(v => videosSeleccionados.includes(v.id)).map(v => ({
        id: v.id,
        title: v.title,
        url: v.url,
        thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
      })),
      ...videosManuales.map((v, i) => ({
        id: getYoutubeId(v.url) || `manual-${Date.now()}-${i}`,
        title: v.titulo,
        url: v.url,
        thumbnail: `https://img.youtube.com/vi/${getYoutubeId(v.url)}/hqdefault.jpg`,
      }))
    ];
    setLoadingSubtema(true)
    try {
      const response = await subtemaService.guardarVideos(
        subtemaActual._id,
        videosParaGuardar,
        localStorage.getItem("token_matemix") || ""
      );
      if (response.error) {
        alert("Error al guardar los videos. Inténtalo de nuevo.");
        return;
      }
      setPaso("confirmado")
    } catch (error) {
      console.log("Error al guardar videos:", error);
      alert("Error al guardar los videos. Inténtalo de nuevo.");
    } finally {
      setLoadingSubtema(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {videoActivo && (
        <VideoPlayer
          url={videosSugeridos.find(v => v.id === videoActivo)?.url || ""} 
          onClose={() => setVideoActivo(null)} 
        />
      )}
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button onClick={() => navigate(-1)} className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver 
          </Button>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Crear Nuevo Subtema</h1>
          <p className="text-gray-600">Define un nuevo subtema de matemáticas</p>
        </div>
        <div className="space-y-6">
          {/* Paso 1: Formulario */}
          {paso === "form" && (
            <Card>
              <CardHeader>
                <CardTitle>Datos del Subtema</CardTitle>
                <CardDescription>Define el nombre y la descripción</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={subtema.nombre}
                      onChange={e => setSubtema({ ...subtema, nombre: e.target.value })}
                      placeholder="Ej: Suma de fracciones"
                    />
                  </div>
                  <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <textarea
                      id="descripcion"
                      className="w-full min-h-[80px] border rounded px-3 py-2 mt-1 resize-y"
                      value={subtema.descripcion}
                      onChange={e => setSubtema({ ...subtema, descripcion: e.target.value })}
                      placeholder="Describe el subtema con más detalle"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <Button onClick={() => navigate(-1)}  className="bg-gray-200 hover:bg-gray-300 text-gray-800" variant="outline">
                      Cancelar
                    </Button>
                    <Button
                      className="bg-gray-600 hover:bg-gray-700 text-white"
                      disabled={loadingSubtema}
                      onClick={handleCrearSubtema}
                    >
                      {loadingSubtema ? "Creando..." : "Crear Subtema"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Paso 2: Videos sugeridos y manuales */}
          {paso === "videos" && (
            <>
              {loadingSubtema && (
                <div className="flex justify-center items-center py-8">
                  <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></span>
                  <span className="text-blue-600 font-medium">Cargando videos sugeridos...</span>
                </div>
              )}
              {novideosSugeridos && (
                <div className="flex flex-col items-center gap-2 py-4">
                  <span className="text-red-600 font-medium">No se encontraron videos sugeridos para este subtema.</span>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      setLoadingSubtema(true);
                      setNoVideosSugeridos(false);
                      try {
                        if (subtemaActual && subtemaActual._id) {
                          const sugeridos = await subtemaService.generateVideosBySubTemaId(subtemaActual._id, localStorage.getItem("token_matemix") || "")
                          console.log("videos sugeridos se obtuvieron ", sugeridos)
                          const videos = Array.isArray(sugeridos)
                            ? sugeridos
                            : (typeof sugeridos === "object" && sugeridos !== null && "videos" in sugeridos && Array.isArray((sugeridos as { videos: unknown }).videos)
                                ? (sugeridos as { videos: videoResponse[] }).videos
                                : []);
                          console.log("videos ", videos)
                          if (!videos || videos.length === 0) {
                           setVideosSugeridos([])
                            setNoVideosSugeridos(true)  
                          } else {
                             setVideosSugeridos(videos)
                            console.log("aca")
                            setNoVideosSugeridos(false)
                          }
                          setPaso("videos")
                        } else {
                          setNoVideosSugeridos(true);
                          alert("No se pudo obtener el ID del subtema.");
                        }
                      } catch (error) {
                        setNoVideosSugeridos(true);
                        console.log("Error al volver a generar videos sugeridos:", error);
                        alert("Error al volver a generar videos. Inténtalo de nuevo.");
                      } finally {
                        setLoadingSubtema(false);
                      }
                    }}
                  >
                    Volver a generar videos sugeridos
                  </Button>
                </div>
              )}
              {Array.isArray(videosSugeridos) && videosSugeridos.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                    {videosSugeridos.map((video: videoResponse) => (
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
              )          }
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
                <ul className="list-disc pl-5">
                  {videosManuales.map((v, i) => (
                    <li key={i}>{v.titulo} - {v.url}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  className="flex-1" 
                  variant='outline'
                  onClick={handleConfirmarVideos}
                  disabled={loadingSubtema || (videosSeleccionados.length === 0 && videosManuales.length === 0)}
                >
                  Confirmar videos
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setVideosManuales([])
                    setNuevoVideo({ titulo: "", url: "" })
                    setVideosSeleccionados([])
                  }}
                >
                  Limpiar selección
                </Button>
              </div>
            </>
          )}
          {/* Paso 3: Confirmado */}
          {paso === "confirmado" && (
            <div className="text-center p-8">
              <Check className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-600 mb-2">¡Subtema y videos guardados!</h3>
              <p className="text-gray-600 mb-6">Ahora puedes crear ejercicios para este subtema.</p>
              <Button
                className="mt-4"
                onClick={() => navigate(`/profesor/subtemas/${subtemaActual?._id}/ejercicios`)}
              >
                Ir a ejercicios
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}