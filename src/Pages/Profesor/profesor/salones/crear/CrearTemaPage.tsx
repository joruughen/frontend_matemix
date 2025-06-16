import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../Components/ui/card"
import { Button } from "../../../../../Components/ui/button"
import { Input } from "../../../../../Components/ui/input"
import { Textarea } from "../../../../../Components/ui/textarea"
import { ArrowLeft, Check, Play} from "lucide-react"
import { useParams } from "react-router-dom"
import {  getYoutubeId, VideoPlayer } from "./videos"
import type { Tema } from "../../../../../Service/Temas/types"
import { temasService } from "../../../../../Service/Temas/TemasService"
import  { type subtemaResponse, type SubtemaConVideos, type subtemaIdeas, type videoResponse } from "../../../../../Service/Subtema/types"
import { subtemaService } from "../../../../../Service/Subtema/subtemaService"
  
export default function CrearTemaPage() {
    const { id: salonId } = useParams<{ id: string }>()
    const [temaSeleccionado, setTemaSeleccionado] = useState<string | null>(null)
    const [temasDisponibles, setTemasDisponibles] = useState([
      { id: "t1", nombre: "Fracciones", descripcion: "Operaciones con fracciones y sus propiedades" },
      { id: "t2", nombre: "Álgebra Básica", descripcion: "Introducción al álgebra y ecuaciones simples" },
      { id: "t3", nombre: "Geometría", descripcion: "Figuras geométricas y sus propiedades" },
      { id: "t4", nombre: "Estadística", descripcion: "Conceptos básicos de estadística" },
      { id: "t5", nombre: "Trigonometría", descripcion: "Funciones trigonométricas y aplicaciones" }
    ])
    let orden  = 1;
    const navigate = useNavigate()
    const [mostrarPersonalizado, setMostrarPersonalizado] = useState(false)
    const [temaPersonalizado, setTemaPersonalizado] = useState({ titulo: "", descripcion: "" })
    const [subtemas, setSubtemas] = useState<SubtemaConVideos[]>([])
    const [videosSugeridos, setVideosSugeridos] = useState<videoResponse[]>([])
    const [videosSeleccionados, setVideosSeleccionados] = useState<string[]>([])
    const [editandoSubtema, setEditandoSubtema] = useState<null | number>(null) 
    const [videoActivo, setVideoActivo] = useState<string | null>(null)
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
    const [subtemasSugeridos, setSubtemasSugeridos] = useState<subtemaIdeas[]>([])
    const [terminoEditar, setTerminoEditar] = useState(false)
    const [subtemasConfirmados, setSubtemasConfirmados] = useState<number[]>([])
    const [nuevoSubtema, setNuevoSubtema] = useState({ titulo: "", descripcion: "" }) 
    const [videosManuales, setVideosManuales] = useState<{ titulo: string, url: string }[]>([])
    const [nuevoVideo, setNuevoVideo] = useState({ titulo: "", url: "" })
    const [edicionSubtema, setEdicionSubtema] = useState<subtemaIdeas | null>(null)
    const [temaId, setTemaId] = useState<string>("")
    const temaActual = temaSeleccionado === "personalizado"
      ? temaPersonalizado
      : temasDisponibles.find(t => t.id === temaSeleccionado) || { nombre: "", descripcion: "" }
    const [loadingSubtema, setLoadingSubtema] = useState(false)
    const [novideosSugeridos, setNoVideosSugeridos] = useState(false)
    const [subtemaActual, setSubtemaActual] = useState<subtemaResponse | null>(null)
    const [loadingTema, setLoadingTema] = useState(false)
    const setTemaActual = (tema: { titulo: string, descripcion: string }) => {
      if (temaSeleccionado === "personalizado") {
        setTemaPersonalizado(tema)
      } else {
        setTemasDisponibles(prev =>
          prev.map(t => t.id === temaSeleccionado ? { ...t, nombre: tema.titulo, descripcion: tema.descripcion } : t)
        ) 
      }
    }
    const handelGuardarTema = async() => {
      if (!temaSeleccionado) {
        alert("Debes seleccionar un tema antes de continuar.")
        return
      }
      if (temaSeleccionado === "personalizado" && (temaPersonalizado.titulo.trim() === "" || temaPersonalizado.descripcion.trim() === "")) {
        alert("Debes completar el título y la descripción del tema personalizado.")
        return
      }
      await guardarTema({
        nombre: temaActual.nombre,
        descripcion: temaActual.descripcion,
        classroom_id: salonId
      })
      setTerminoEditar(true)

      setMostrarPersonalizado(false)
    }  
    const handleCrearTemaPersonalizado = async() => {
      if (temaPersonalizado.titulo.trim() === "") return
      const nuevoTema = {
        nombre: temaPersonalizado.titulo,
        descripcion: temaPersonalizado.descripcion,
        classroom_id: salonId 
      }
      await guardarTema(nuevoTema)
      setTemasDisponibles(prev => [
        ...prev,
        { id: "personalizado", nombre: temaPersonalizado.titulo, descripcion: temaPersonalizado.descripcion }
      ])
      setTemaSeleccionado("personalizado")
      setMostrarPersonalizado(false)
      setTerminoEditar(true)
    }
    
    const guardarTema = async (tema:Tema) => {
      console.log("Guardando tema:", tema)
      try{
        const response = await temasService.crearTema(tema, localStorage.getItem("token_matemix") || "")
        console.log("Tema guardado:", response)
        setTemaId(response._id)
        console.log("ID del tema guardado:", response._id)
        alert("Tema guardado exitosamente.")
      } catch (error) {
        alert("Error al guardar el tema. Inténtalo de nuevo.")
        console.error("Error al guardar el tema:", error)
    }
  }

    const handleMostrarSugerencias = async () => {
      setMostrarPersonalizado(false )
      setLoadingTema(true)
      try{
        const response = await subtemaService.generateSubtemasByTemaId(temaId, localStorage.getItem("token_matemix") || "")
        if (response.length === 0) {
          alert("No se encontraron subtemas sugeridos para este tema. Vuelve a intertarlo")
          setMostrarSugerencias(false)
          setLoadingTema(false)
          return
        }
        console.log("Subtemas sugeridos:", response)
        setSubtemasSugeridos(response)
        setMostrarSugerencias(true)
        
      }
      catch (error) {
        console.error("Error al obtener subtemas sugeridos:", error)
        alert("Error al obtener subtemas sugeridos. Inténtalo de nuevo.")

      }finally{
        setLoadingTema(false)
      }
    }

    const handleConfirmarSubtema = async () => {
      if (
        videosSeleccionados.length === 0 &&
        videosManuales.length === 0
      ) {
        alert("Debes seleccionar o agregar al menos un video para este subtema.");
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
    
      try {
        if (!subtemaActual?._id) {
          alert("No se pudo obtener el ID del subtema.");
          return;
        }
    
        const response = await subtemaService.guardarVideos(
          subtemaActual._id,
          videosParaGuardar,
          localStorage.getItem("token_matemix") || ""
        );
    
        if (response.error) {
          alert("Error al guardar los videos. Inténtalo de nuevo.");
          return;
        }
    
        setSubtemas(prev => [
          ...prev,
          {
            titulo: edicionSubtema ? edicionSubtema.titulo : nuevoSubtema.titulo,
            descripcion: edicionSubtema ? edicionSubtema.descripcion : nuevoSubtema.descripcion,
            videos: videosParaGuardar.map(v => ({
              id: v.id,
              title: v.title,
              url: v.url,
              thumbnail: v.thumbnail,
              similarity: 10
            }))
          }
        ]);
        if (editandoSubtema !== null) setSubtemasConfirmados(prev => [...prev, editandoSubtema]);
        setSubtemasConfirmados(prev => [...prev, subtemas.length]);
        setEditandoSubtema(null);
        setEdicionSubtema(null);
        setNuevoSubtema({ titulo: "", descripcion: "" });
        setVideosSugeridos([]);
        setVideosSeleccionados([]);
        setVideosManuales([]);
        setNuevoVideo({ titulo: "", url: "" });
    
      } catch (error) {
        console.error("Error al guardar los videos:", error);
        alert("Error al guardar los videos. Inténtalo de nuevo.");
      }
    };

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

    
      
    const handleToggleVideo = (videoId: string) => {
      setVideosSeleccionados(prev => {
        if (prev.includes(videoId)) return prev.filter(id => id !== videoId)
        if (prev.length < 3) return [...prev, videoId]
        return prev
      })
    }

    
    const handleFinalizar = () => {
      if (subtemas.length === 0 || subtemas.some(s => !s.videos || s.videos.length === 0)) {
        alert("Debes agregar al menos un subtema y cada subtema debe tener al menos un video.")
        return
      }
      alert("¡Temas, subtemas y videos confirmados! ")
      navigate("/profesor/registro/" + salonId + "/alumnos")
    }
    
    const handleRetroceder = () => {
      setTemaSeleccionado(null)
      setMostrarPersonalizado(false)

    }

    const handleSaveSubtema = async (edicionSubtema: subtemaIdeas, idx: number) => {
        setEdicionSubtema(ed => ed ? { ...ed, confirmado: true } : ed);
        setLoadingSubtema(true) 
        setNoVideosSugeridos(false)
        try{
          const createSubtema = {
            titulo: edicionSubtema.titulo,
            descripcion: edicionSubtema.descripcion,
            tema_id: temaId,
            orden: orden,
          }
          const response = await subtemaService.createSubtema(createSubtema, localStorage.getItem("token_matemix") || "")
          orden += 1;
          setSubtemaActual(response);
          setSubtemasSugeridos(prev => prev.map((s, i) =>
            i === idx ? { ...s, _id: response._id } : s
          ));
          try{
             const sugeridos = await subtemaService.generateVideosBySubTemaId(response._id, localStorage.getItem("token_matemix") || "");
             console.log("Videos sugeridos:", sugeridos);
            if (!sugeridos || !Array.isArray(sugeridos) || sugeridos.length === 0)  {
              setNoVideosSugeridos(true)
              setVideosSugeridos([]) 
            } else {
              setVideosSugeridos(sugeridos);
              setVideosSeleccionados([]);
              setVideosManuales([]);
              setNoVideosSugeridos(false);
            }
           
          }catch (error) {
            setNoVideosSugeridos(true)
            console.error("Error al obtener videos sugeridos:", error)
            alert("Error al obtener videos sugeridos. Inténtalo de nuevo.")
          }
         
        }catch (error) {
          console.error("Error al guardar subtema:", error)
          alert("Error al guardar el subtema. Inténtalo de nuevo.")
        }finally{
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
            <Link to={`/profesor/salones/${salonId}`} className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al salón
            </Link>
          </div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Agregar contenido al salón</h1>
            <p className="text-gray-600">Organiza los temas y videos educativos para tus estudiantes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Columna izquierda - Temas */}
            <div className="md:col-span-1">
              {!temaSeleccionado && !mostrarPersonalizado && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Temas disponibles</CardTitle>
                    <CardDescription>Selecciona o crea un tema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {temasDisponibles.map((tema) => (
                        <div
                          key={tema.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            temaSeleccionado === tema.id
                              ? "bg-blue-100 border border-blue-300"
                              : "bg-white border border-gray-200 hover:border-blue-200"
                          }`}
                          onClick={() => {
                            setTemaSeleccionado(tema.id)
                            setMostrarPersonalizado(false)
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{tema.nombre}</span>
                          </div>
                          <div className="text-xs text-gray-500">{tema.descripcion}</div>
                        </div>
                      ))}
                      <div
                        className="p-3 rounded-lg cursor-pointer border-2 border-dashed border-blue-300 text-blue-600 flex items-center justify-center gap-2 hover:bg-blue-50"
                        onClick={() => {
                          setMostrarPersonalizado(true)
                          setTemaSeleccionado(null) 
                        }}
                      >
                        <span>+</span> Crear tema personalizado
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* Subtemas agregados */}
              {subtemas.length > 0 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Subtemas agregados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {subtemas.map((sub, idx) => (
                        <div key={sub.titulo + idx} className="p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="font-semibold text-blue-700">{sub.titulo}</div>
                          <div className="text-sm text-gray-600 mt-1">{sub.descripcion}</div>
                          <div className="mt-2">
                            <div className="text-xs font-medium text-gray-500 mb-1">VIDEOS:</div>
                            <div className="space-y-2">
                              {sub.videos.map(v => (
                                <div 
                                  key={v.id}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Play className="h-3 w-3 text-blue-600" />
                                  </div>
                                  <span className="truncate">{v.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            {/* Columna derecha - Contenido */}
            <div className="md:col-span-2 space-y-4">
              {/* Crear tema personalizado */}
              {mostrarPersonalizado && (
                <Card>
                  <CardHeader>
                    <CardTitle>Crear tema personalizado</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      placeholder="Título del tema"
                      value={temaPersonalizado.titulo}
                      onChange={e => setTemaPersonalizado(prev => ({ ...prev, titulo: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Descripción del tema"
                      value={temaPersonalizado.descripcion}
                      onChange={e => setTemaPersonalizado(prev => ({ ...prev, descripcion: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <Button size="sm"
                      variant="outline"
                       onClick={handleCrearTemaPersonalizado}>
                        Agregar tema
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setMostrarPersonalizado(false)
                          setMostrarSugerencias(false)
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* Mostrar info del tema seleccionado y botón de sugerencias */}
              {(temaSeleccionado || mostrarPersonalizado) && !mostrarSugerencias && (
                <div>

                <Card>
                  <CardHeader>
                    <CardTitle>{temaActual.nombre || temaPersonalizado.titulo }</CardTitle>
                    <CardDescription>{temaActual.descripcion || temaPersonalizado.descripcion}</CardDescription>
                  </CardHeader>
                 {!mostrarPersonalizado && !terminoEditar && (
                  <div>
                    <CardHeader>
                    <CardTitle>Editar Tema</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      placeholder={temaActual.nombre}
                      value={temaActual.nombre}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTemaActual({
                          titulo: e.target.value,
                          descripcion: temaActual.descripcion,
                        })
                      }
                    />
                    <Textarea
                      placeholder={temaActual.descripcion || "Descripción del tema"}
                      value={temaActual.descripcion}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setTemaActual({
                          titulo: temaActual.nombre,
                          descripcion: e.target.value,
                        })
                      }
                    />
                      <div className="flex justify-center gap-8 pt-4">
                         <Button
                          className=""
                          size="sm"
                          variant="outline"
                          onClick={handleRetroceder}
                        >
                          Retroceder
                        </Button>
                        <Button 
                          className=""
                          size="sm"
                          variant="outline"
                          onClick={handelGuardarTema}
                        >
                          Confirmar
                        </Button>
                       
                      </div>
                  </CardContent>  
                  </div>
                  )}
                  </Card>
                  
             {terminoEditar &&
               ( <div>
                  <Button
                      className="flex mx-auto w-49 mt-4 bg-white pt-4 pb-4 pl-8 pr-8"
                      size="lg"
                      variant="outline"
                      onClick={handleMostrarSugerencias}
                    >
                      Ver sugerencias de subtemas
                    </Button>º
                </div>  )}
                 {loadingTema && (
                              <div className="flex justify-center items-center py-8">
                                <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></span>
                                <span className="text-blue-600 font-medium">Generando subtemas...</span>
                              </div>
                            )}
                    
                </div>
              )}
              {/* Mostrar subtemas sugeridos en scroll horizontal */}
              
              {mostrarSugerencias && (
                <div>
                  <h2 className="text-xl font-bold mb-2">Subtemas sugeridos para el tema {temaActual.nombre || temaPersonalizado.titulo}</h2>
                  <div className="flex flex-col gap-4 pb-4">
                    {/* Subtemas sugeridos */}
                    {subtemasSugeridos.map((subtema, idx) => {
                      if (subtemasConfirmados.includes(idx)) return null;
                      const editando = editandoSubtema === idx && edicionSubtema;
                      const confirmado = editando && !!edicionSubtema?.confirmado;
                    
                      return (
                        <Card key={idx} className="min-w-[300px] flex-shrink-0">
                          <CardHeader>
                            <CardTitle>
                              {editando && !confirmado ? (
                                <Input
                                  className="font-bold"
                                  value={edicionSubtema.titulo}
                                  onChange={e => setEdicionSubtema(ed => ed ? { ...ed, titulo: e.target.value } : ed)}
                                />
                              ) : (
                                edicionSubtema && editando ? edicionSubtema.titulo : subtema.titulo
                              )}
                            </CardTitle>
                            <CardDescription>
                              {editando && !confirmado ? (
                                <Textarea
                                  value={edicionSubtema.descripcion}
                                  onChange={e => setEdicionSubtema(ed => ed ? { ...ed, descripcion: e.target.value } : ed)}
                                />
                              ) : (
                                edicionSubtema && editando ? edicionSubtema.descripcion : subtema.descripcion
                              )}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {/* Paso 1: solo inputs y botón confirmar */}
                            {editando && !confirmado && (
                              <div className="flex gap-2">
                                <Button
                                  className="flex-1"
                                  onClick={() => handleSaveSubtema(edicionSubtema, idx)}
                                >
                                  Confirmar
                                </Button>
                                <Button
                                  className="flex-1"
                                  variant="outline"
                                  onClick={() => {
                                    setEditandoSubtema(null);
                                    setEdicionSubtema(null);
                                  }}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            )}
                            {loadingSubtema && (
                              <div className="flex justify-center items-center py-8">
                                <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></span>
                                <span className="text-blue-600 font-medium">Generando videos...</span>
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
                                        const sugeridos = await subtemaService.generateVideosBySubTemaId(subtemaActual._id, localStorage.getItem("token_matemix") || "");
                                        console.log("Videos sugeridos:", sugeridos);
                                        const videos = Array.isArray(sugeridos) ? sugeridos : (sugeridos?.videos || []);
                                        if (!videos || videos.length === 0) {
                                          setNoVideosSugeridos(true);
                                          setVideosSugeridos([]);
                                        } else {
                                          setVideosSugeridos(videos);
                                          setNoVideosSugeridos(false);
                                        }
                                      } else {
                                        setNoVideosSugeridos(true);
                                        alert("No se pudo obtener el ID del subtema.");
                                      }
                                    } catch (error) {
                                      console.log("Error al volver a generar videos:", error);
                                      setNoVideosSugeridos(true);
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
                    
                            {/* Paso 2: mostrar videos solo si ya confirmó */}
                            {editando && confirmado && !loadingSubtema && (
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
                                    onClick={handleConfirmarSubtema}
                                    disabled={videosSeleccionados.length === 0 && videosManuales.length === 0}
                                  >
                                    Confirmar subtema
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => {
                                      setEditandoSubtema(null)
                                      setEdicionSubtema(null)
                                      setVideosManuales([])
                                      setNuevoVideo({ titulo: "", url: "" })
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </>
                            )}
                    
                            {/* Botón para editar */}
                            {!editando && (
                              <Button
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                  setEditandoSubtema(idx);
                                  setEdicionSubtema({ ...subtema });
                                }}
                              >
                                Editar
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                    {/* Subtema personalizado */}
           
                      <Card className="min-w-[300px] flex-shrink-0">
                      <CardHeader>
                        <CardTitle>
                          <Input
                            className="font-bold"
                            placeholder="Título del subtema"
                            value={nuevoSubtema.titulo}
                            onChange={e => setNuevoSubtema(s => ({ ...s, titulo: e.target.value }))}
                          />
                        </CardTitle>
                        <CardDescription>
                          <Textarea
                            placeholder="Descripción del subtema"
                            value={nuevoSubtema.descripcion}
                            onChange={e => setNuevoSubtema(s => ({ ...s, descripcion: e.target.value }))}
                          />
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 mt-4">
                          <Button
                            className="flex-1"
                            onClick={() => {
                              if (!nuevoSubtema.titulo || !nuevoSubtema.descripcion) {
                                alert("Completa el título y la descripción.");
                                return;
                              }
                              setSubtemasSugeridos(prev => [
                                                              ...prev,
                                                              { 
                                                                titulo: nuevoSubtema.titulo, 
                                                                descripcion: nuevoSubtema.descripcion,
                                                                tema: temaActual.nombre || temaPersonalizado.titulo || "" 
                                                              }
                                                            ]);
                              setNuevoSubtema({ titulo: "", descripcion: "" });
                            }}
                          >
                            Agregar subtema
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              {/* Botón finalizar */}
              {subtemas.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleFinalizar}
                    >
                      Guardar contenido del salón
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }