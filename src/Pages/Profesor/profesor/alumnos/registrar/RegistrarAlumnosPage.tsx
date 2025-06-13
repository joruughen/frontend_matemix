"use client"

import type React from "react"

import { useState } from "react"
import {Link} from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../Components/ui/card"
import { Button } from "../../../../../Components/ui/button"
import { Input } from "../../../../../Components/ui/input"
import { Label } from "../../../../../Components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../Components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../Components/ui/tabs"
import { ArrowLeft, Upload, FileText, Users, CheckCircle, AlertCircle } from "lucide-react"

export default function RegistrarAlumnosPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  type AlumnoPreview = {
    nombre: string
    email: string
    grado: string
  }
  const [previewData, setPreviewData] = useState<AlumnoPreview[]>([])
  const [selectedSalon, setSelectedSalon] = useState("")

  // Lista ficticia de salones
  const salones = [
    { id: "s1", nombre: "Matemáticas 3°A" },
    { id: "s2", nombre: "Matemáticas 3°B" },
    { id: "s3", nombre: "Matemáticas 2°A" },
    { id: "s4", nombre: "Matemáticas 2°B" },
    { id: "s5", nombre: "Matemáticas 1°A" },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Simulamos la lectura del archivo para mostrar una vista previa
      setTimeout(() => {
        const mockData = [
          { nombre: "Ana García", email: "ana.garcia@escuela.edu", grado: "3°" },
          { nombre: "Carlos López", email: "carlos.lopez@escuela.edu", grado: "3°" },
          { nombre: "María Rodríguez", email: "maria.rodriguez@escuela.edu", grado: "3°" },
          { nombre: "Juan Pérez", email: "juan.perez@escuela.edu", grado: "3°" },
          { nombre: "Laura Sánchez", email: "laura.sanchez@escuela.edu", grado: "3°" },
        ]
        setPreviewData(mockData)
      }, 500)
    }
  }

  const handleUpload = () => {
    if (!selectedFile || !selectedSalon) return

    setUploadStatus("processing")

    // Simulamos el proceso de carga
    setTimeout(() => {
      setUploadStatus("success")
    }, 2000)
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
            <p className="text-gray-600 mb-6">Se han registrado 5 alumnos correctamente en el salón seleccionado.</p>
            <div className="flex justify-center space-x-4">
              <Link to="/profesor/alumnos">
                <Button>Ver Todos los Alumnos</Button>
              </Link>
              <Link to="/profesor/salones">
                <Button variant="outline">Ver Salones</Button>
              </Link>
            </div>
          </div>
        )
      case "error":
        return (
          <div className="text-center p-6">
            <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-red-600 mb-2">Error en el Registro</h3>
            <p className="text-gray-600 mb-6">
              Ocurrió un problema al procesar el archivo. Por favor verifica el formato e intenta nuevamente.
            </p>
            <Button onClick={() => setUploadStatus("idle")}>Intentar Nuevamente</Button>
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
          <p className="text-gray-600">Añade nuevos alumnos a tus salones de clase</p>
        </div>

        {uploadStatus !== "idle" ? (
          <Card>{renderUploadStatus()}</Card>
        ) : (
          <Tabs defaultValue="archivo" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="archivo">Cargar Archivo</TabsTrigger>
              <TabsTrigger value="manual">Registro Manual</TabsTrigger>
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">
                      Arrastra y suelta tu archivo aquí, o haz clic para seleccionarlo
                    </p>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer" onClick={() => {}}>
                        Seleccionar Archivo
                      </Button>
                    </label>
                    {selectedFile && (
                      <p className="mt-4 text-sm text-gray-600">
                        Archivo seleccionado: <span className="font-medium">{selectedFile.name}</span>
                      </p>
                    )}
                  </div>

                  {previewData.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Vista previa:</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Grado
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {previewData.map((alumno, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {alumno.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alumno.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alumno.grado}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="salon">Seleccionar Salón</Label>
                    <Select value={selectedSalon} onValueChange={setSelectedSalon}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecciona un salón" />
                      </SelectTrigger>
                      <SelectContent>
                        {salones.map((salon) => (
                          <SelectItem key={salon.id} value={salon.id}>
                            {salon.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleUpload}
                      disabled={!selectedFile || !selectedSalon}
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
                        <Label htmlFor="nombre">Nombre Completo</Label>
                        <Input id="nombre" placeholder="Ej: Ana García" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Ej: ana.garcia@escuela.edu" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="salon-manual">Salón</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un salón" />
                          </SelectTrigger>
                          <SelectContent>
                            {salones.map((salon) => (
                              <SelectItem key={salon.id} value={salon.id}>
                                {salon.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="password">Contraseña Temporal</Label>
                        <Input id="password" type="password" placeholder="Contraseña inicial" />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>Registrar Alumno</Button>
                    </div>

                    <div className="border-t pt-6 mt-6">
                      <h3 className="font-medium mb-4">Alumnos Registrados Recientemente</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Laura Sánchez</p>
                            <p className="text-sm text-gray-600">laura.sanchez@escuela.edu • 3°A</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Pedro Gómez</p>
                            <p className="text-sm text-gray-600">pedro.gomez@escuela.edu • 3°B</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </div>
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
