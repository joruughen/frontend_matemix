
import {Link, useNavigate} from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../Components/ui/card"
import { Button } from "../../../../../Components/ui/button"
import { Input } from "../../../../../Components/ui/input"
import { Label } from "../../../../../Components/ui/label"
import { Textarea } from "../../../../../Components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../Components/ui/select"
import { ArrowLeft, School } from "lucide-react"
import type { SalonRequestDTO } from "../../../../../Service/Salon/types"
import { useState } from "react"
import { salonService } from "../../../../../Service/Salon/service"


export default function CrearSalonPage() {
  const [data, setData] = useState<SalonRequestDTO>({
    seccion: "",
    grado: 0,
    turno: "",
    descripcion: "",
    nombre: ""
  })
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setData((prev: SalonRequestDTO) => ({
      ...prev,
      [id]: value,
        }))
      }
    const handleCrearSalon = async () => {
          console.log("Crear salón con los siguientes datos:", data)
          try{
            const response = await salonService.crearSalon(data, localStorage.getItem("token_matemix") || "")
            if (response.id!== "") {
              setData({
                seccion: "",
                grado: 0,
                turno: "mañana",
                descripcion: "",
                nombre: ""
              })
            }
            
            console.log("Respuesta del servidor:", response)
            console.log("ID del salón creado:", response.id)
            navigate("/profesor/salones/" + response.id +"/temas")

            console.log("Salón creado exitosamente")
          } catch (error) {
            console.error("Error al crear el salón:", error)
          }
        }
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link to="/profesor/salones" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Salones
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Crear Nuevo Salón</h1>
          <p className="text-gray-600">Configura un nuevo salón de clases para tus alumnos</p>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <School className="h-5 w-5 mr-2" />
                Información del Salón
              </CardTitle>
              <CardDescription>Datos básicos del salón que vas a crear</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nombre">Nombre del Salón</Label>
                  <Input id="nombre" placeholder="Ej: Matemáticas 3°A" 
                  value={data.nombre}
                    onChange={handleInputChange}
                     />
                </div>
                <div>
                  <Label htmlFor="grado">Grado</Label>
                    <Select
                      value={data.grado ? String(data.grado) : ""}
                      onChange={e => setData(prev => ({ ...prev, grado: parseInt(e.target.value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el grado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1° Grado</SelectItem>
                      <SelectItem value="2">2° Grado</SelectItem>
                      <SelectItem value="3">3° Grado</SelectItem>
                      <SelectItem value="4">4° Grado</SelectItem>
                      <SelectItem value="5">5° Grado</SelectItem>
                      <SelectItem value="6">6° Grado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe brevemente el salón y sus objetivos..."
                  className="min-h-[100px]"
                  onChange={handleInputChange}
                  value={data.descripcion}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="seccion">Sección</Label>
                  <Input id="seccion" type="text" placeholder="Ej: A" 
                    value={data.seccion}
                    onChange={handleInputChange}
                    
                  />
                </div>
                <div>
                  <Label htmlFor="turno">Turno</Label>
                  <Select value={data.turno}
                  onChange={e => setData(prev => ({ ...prev, turno: e.target.value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mañana">Mañana</SelectItem>
                      <SelectItem value="Tarde">Tarde</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end space-x-4">
            <Link to="/profesor/salones">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button onClick={handleCrearSalon}>Crear Salón</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
