import type React from "react"
import { useEffect, useState } from "react"
import {Link, useNavigate, useParams} from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../Components/ui/card"
import { Button } from "../../../../../Components/ui/button"
import { Input } from "../../../../../Components/ui/input"
import { Label } from "../../../../../Components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../Components/ui/tabs"
import { ArrowLeft, Upload, FileText, Users, CheckCircle, AlertCircle } from "lucide-react"
import  {type AlumnoRegisterRequestDTO, type AlumnoRegisterResponse, type AlumnosDTO } from "../../../../../Service/Alumnos/types"
import { salonService } from "../../../../../Service/Salon/service"
import type { SalonResponse } from "../../../../../Service/Salon/types"
import { alumnosService } from "../../../../../Service/Alumnos/service"

export default function RegistrarAlumnosPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  
  const [alumnosRegistrados, setAlumnosRegistrados] = useState<AlumnosDTO[]>([])
  const navigate = useNavigate()
  const { id: salonId } = useParams<{ id: string }>()
  const ALLOWED_FILE_TYPES = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  const [salonInfo, setSalonInfo] = useState<SalonResponse | null>(null)
  const [alumnoRegister, setAlumnoRegister] = useState<AlumnoRegisterRequestDTO>({
    nombre: "",
    apellido: "",
    dni: ""
  })
  const [registrando, setRegistrando] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [alumnoRegistrado, setAlumnoRegistrado] = useState<AlumnoRegisterResponse | null>(null)
  const [csvData, setCsvData] = useState<String | null>(null)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("")
    const file = e.target.files?.[0]
    
    if (!file) {
      setSelectedFile(null)
      return
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrorMessage("Tipo de archivo no permitido. Solo se aceptan archivos CSV o Excel.")
      setSelectedFile(null)
      return
    }

    if (file.size > 40 * 1024 * 1024) {
      setErrorMessage("El archivo es demasiado grande. El tamaño máximo permitido es 40MB.")
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
    
  }

  const handleUpload = async () => {
    if (!selectedFile || !salonId) return;
  
    setUploadStatus("processing");
    setErrorMessage("");
  
    try {
      const formData = new FormData();

      formData.append("file", selectedFile); 
      console.log("Datos del formulario:", formData.get("file"));
      const response = await alumnosService.registrarAlumnosMasivos(
        formData,
        localStorage.getItem("token_matemix") || "",
        salonId
      );
      console.log("Respuesta del servidor:", response);
      setCsvData(response)
      setUploadStatus("success");
    } catch (error) {
      console.error("Error al registrar los alumnos:", error);
      setErrorMessage("Error al registrar los alumnos. Verifica el archivo e intenta nuevamente.");
      setUploadStatus("error");
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    fileInput?.click()
  }

  const handleGetAlumnos = async() => {
    try{
      if (!salonId) {
        alert("Ups! este salon no existe, Regresa al dashboard.")
        navigate("/profesor")
        return;
      }else{
        const response = await salonService.getAlumnosBySalonId(salonId, localStorage.getItem("token_matemix") || "")
        setAlumnosRegistrados(response)
        console.log("Alumnos registrados en el salón:", response)
      }
    }catch (error) {
      console.error("Error al obtener los alumnos del salón:", error)
      setErrorMessage("No se pudieron obtener los alumnos del salón. Intenta nuevamente más tarde.")
    }

  }
  const handleGetSalonInfo = async () => {
    try {
      if (!salonId) {
        alert("Ups! este salón no existe, Regresa al dashboard.")
        navigate("/profesor")
        return;
      } else {
        const response = await salonService.getSalonById(salonId, localStorage.getItem("token_matemix") || "")
        setSalonInfo(response)
        console.log("Información del salón:", response)
      }
    } catch (error) {
      alert("Ups! este salón no existe, Regresa al dashboard.")
      console.error("Error al obtener la información del salón:", error)
      setErrorMessage("No se pudo obtener la información del salón. Intenta nuevamente más tarde.")
    }
  }
  useEffect(() => {
    handleGetAlumnos()
    handleGetSalonInfo()
  }, [salonId])

  const handleRegisterAlumno = async () => {
    try {
      if (!salonId) {
        alert("Ups! este salón no existe, Regresa al dashboard.")
        navigate("/profesor")
        return;
      }
      if (!alumnoRegister.nombre || !alumnoRegister.apellido || !alumnoRegister.dni) {
        setErrorMessage("Por favor completa todos los campos del formulario.")
        return
      }
      setRegistrando(true)
      
      const response = await alumnosService.registrarAlumno(alumnoRegister, localStorage.getItem("token_matemix") || "", salonId)
      
      console.log("Alumno registrado:", response)
      setAlumnoRegistrado(response)
      setAlumnosRegistrados(prev => [...prev, {
        id: response.id,
        nombre: response.nombre,
        apellido: response.apellido,
        dni: response.dni,
        username: response.username
      }])
      setOpenModal(true)
    } catch (error) {
      console.error("Error al registrar el alumno:", error)
      setErrorMessage("No se pudo registrar el alumno. Intenta nuevamente más tarde.")
      alert("No se pudo registrar el alumno. Intenta nuevamente más tarde.")
    } finally {
      setRegistrando(false)
    }
  }

  const renderUploadStatus = () => {
    switch (uploadStatus) {
      case "processing":
        return (
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-lg">Procesando archivo...</p>
          </div>
        )
      case "success":
        return (
          <div className="text-center p-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-600 mb-2">¡Registro Exitoso!</h3>
            <p className="text-gray-600 mb-6">Se han registrado alumnos correctamente en el salón seleccionado.</p>
            <div className="flex flex-col items-center space-y-4">
              {csvData && (
                <Button
                  onClick={() => {
                    const blob = new Blob([csvData], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "credenciales_alumnos.csv";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  variant="outline"
                >
                  Descargar credenciales (.csv)
                </Button>
              )}
              <div className="flex space-x-4">
                <Link to="/profesor/alumnos">
                  <Button>Ver Todos los Alumnos</Button>
                </Link>
                <Link to="/profesor/salones">
                  <Button variant="outline">Ver Salones</Button>
                </Link>
              </div>
            </div>
          </div>
        );
      case "error":
        return (
          <div className="text-center p-6">
            <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-red-600 mb-2">Error en el Registro</h3>
            <p className="text-gray-600 mb-6">
              {errorMessage || "Ocurrió un problema al procesar el archivo. Por favor verifica el formato e intenta nuevamente."}
            </p>
            <Button onClick={() => {
              setUploadStatus("idle")
              setErrorMessage("")
            }}>Intentar Nuevamente</Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link to="/profesor" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Registrar Alumnos</h1>
          <p className="text-gray-600">Añade nuevos alumnos a tu salon {salonInfo?.nombre}</p>
        </div>

        {uploadStatus !== "idle" ? (
          <Card>{renderUploadStatus()}</Card>
        ) : (
          <Tabs defaultValue="archivo" className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <TabsList className="grid w-full grid-cols-2 border-b">
              <TabsTrigger
                value="archivo"
                className="data-[state=active]:bg-gray-500 data-[state=active]:text-white"
              >
                Cargar Archivo
              </TabsTrigger>
              <TabsTrigger
                value="manual"
                className="data-[state=active]:bg-gray-500 data-[state=active]:text-white"
              >
                Registro Manual
              </TabsTrigger>
            </TabsList>

            <TabsContent value="archivo">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Cargar Archivo de Alumnos
                  </CardTitle>
                  <CardDescription>
                    Sube un archivo CSV o Excel con la lista de alumnos para registrarlos automáticamente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={triggerFileInput}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">
                      Haz clic para seleccionar un archivo (CSV o Excel)
                    </p>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button variant="outline" className="cursor-pointer">
                      Seleccionar Archivo
                    </Button>
                    {selectedFile && (
                      <p className="mt-4 text-sm text-gray-600">
                        Archivo seleccionado: <span className="font-medium">{selectedFile.name}</span>
                        <span className="block text-xs text-green-600 mt-1">Tipo válido: {selectedFile.type}</span>
                      </p>
                    )}
                    {errorMessage && (
                      <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
                    )}
                  </div>

                         

                  <div className="flex justify-end">
                    <Button
                      onClick={handleUpload}
                      disabled={!selectedFile }
                      className="flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Registrar Alumnos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manual">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Registro Manual de Alumnos
                  </CardTitle>
                  <CardDescription>Ingresa la información de los alumnos manualmente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input 
                        id="nombre" 
                        placeholder="Ej: Ana García" 
                        value={alumnoRegister.nombre}
                        onChange={(e) => setAlumnoRegister(prev => ({ ...prev, nombre: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="apellido">Apellido</Label>
                        <Input 
                        id="apellido" 
                        type="text" 
                        placeholder="Ej: García" 
                        value={alumnoRegister.apellido}
                        onChange={(e) => setAlumnoRegister(prev => ({ ...prev, apellido: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dni">DNI</Label>
                        <Input 
                        id="dni" 
                        type="text" 
                        placeholder="Ej: 12345678" 
                        value={alumnoRegister.dni}
                        onChange={(e) => setAlumnoRegister(prev => ({ ...prev, dni: e.target.value }))}
                        />
                      </div>
                      </div>

                    <div>
                      {!registrando && (
                        <div className="flex justify-end ">
                          <Button
                            variant="outline"
                            className="flex items-center cursor-pointer"
                            onClick={handleRegisterAlumno}
                          >
                            Registrar Alumno
                          </Button>
                        </div>
                      )}
                      {registrando && (
                        <div className="flex justify-center items-center py-8">
                          <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></span>
                          <span className="text-blue-600 font-medium">Registrando Alumno...</span>
                        </div>
                      )}
                      {openModal && alumnoRegistrado && !registrando && (
                      <div className="flex justify-center">
                        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl mx-auto my-8">
                          <h2 className="text-2xl font-bold mb-4 text-center">Alumno registrado exitosamente</h2>
                          <div className="space-y-2">
                            <div><b>Nombre:</b> {alumnoRegistrado.nombre} {alumnoRegistrado.apellido}</div>
                            <div><b>DNI:</b> {alumnoRegistrado.dni}</div>
                            <div><b>Usuario:</b> {alumnoRegistrado.username}</div>
                            <div><b>Contraseña:</b> {alumnoRegistrado.contraseña}</div>
                          </div>
                          <button
                            className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            onClick={() => setOpenModal(false)}
                          >
                            Cerrar
                          </button>
                        </div>
                      </div>
                    )}
                    </div>

                    <div className="border-t pt-6 mt-6">
                      <h3 className="font-medium mb-4">Alumnos Registrados Recientemente {salonInfo?.cantidadAlumnos}</h3>
                      <div className="space-y-2">
                        {alumnosRegistrados.length === 0 ? (
                          <p className="text-gray-500">No hay alumnos registrados.</p>
                        ) : (
                          alumnosRegistrados.map(alumno => (
                            <div
                              key={alumno.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{alumno.nombre} {alumno.apellido}</p>
                                <p className="text-sm text-gray-600">
                                  Usuario: {alumno.username} &bull; DNI: {alumno.dni}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}