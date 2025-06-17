import { useEffect, useState } from "react"
import {Link} from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../Components/ui/card"
import { Button } from "../../../../Components/ui/button"
import { Input } from "../../../../Components/ui/input"
import { Badge } from "../../../../Components/ui/badge"
import { ArrowLeft, Search, Users, BookOpen, Plus, School } from "lucide-react"
import { salonService } from "../../../../Service/Salon/service"
import { type InfoOfSalonesByProfesor, type salonResponInfo } from "../../../../Service/Salon/types"

export default function SalonesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [salonData, setSalonData] = useState<salonResponInfo[]>([])
  const [ProfesorSalonInfo, setProfesorSalonInfo] = useState<InfoOfSalonesByProfesor>({
    totalSalones: 0,
    totalAlumnos: 0,
    totalTemas: 0,
    totalSubtemas: 0,
  })
  
  const handleGetSalones = async () => {
    try{
      const response = await salonService.obtenerSalones(localStorage.getItem("token_matemix") || "")
      if (response.length > 0) {
        setSalonData(response)
      } else {
        console.log("No se encontraron salones")
      }
    }catch (error){
      console.error("Error al obtener los salones:", error)

    }
  }

  const handleInfoOfProfesorSalones = async ( ) => {
    try{
      const response = await salonService.getInfoOfProfesorSalones(localStorage.getItem("token_matemix") || "")
      if (response) {
        setProfesorSalonInfo(response)
      }
    }catch (error) {
      console.error("Error al obtener la información de los salones del profesor:", error)
    }
  }

  useEffect(() =>{
    handleGetSalones()
    handleInfoOfProfesorSalones()
  }, [localStorage.getItem("token_matemix")])



  const filteredSalones = salonData.filter((salon) => salon.nombre.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <div className="mb-6">
          <Link to="/profesor" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Salones</h1>
            <p className="text-gray-600">Administra todos tus salones de clase</p>
          </div>
          <div className="flex gap-4">
            <Link to="/profesor/salones/crear">
              <Button className="flex items-center" variant="link">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Salón
              </Button>
            </Link>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Resumen de Salones</CardTitle>
            <CardDescription>Vista general de todos tus salones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <School className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{ProfesorSalonInfo.totalSalones}</div>
                <p className="text-sm text-blue-600">Total de Salones</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {ProfesorSalonInfo.totalAlumnos}
                </div>
                <p className="text-sm text-green-600">Total de Alumnos</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {ProfesorSalonInfo.totalTemas}
                </div>
                <p className="text-sm text-purple-600">Temas</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {ProfesorSalonInfo.totalSubtemas}
                </div>
                <p className="text-sm text-purple-600">Subtemas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 flex items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar salón..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6">
          {filteredSalones.map((salon) => (
            <Card key={salon.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <Link to={`/profesor/salones/${salon.id}`}>
                      <h2 className="text-xl font-bold text-blue-600 hover:underline">{salon.nombre}</h2>
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{salon.totalAlumnos} Alumnos</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>
                          {salon.totalTemas} Temas
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>
                          {salon.totalSubtemas} Subtemas
                        </span>
                      </div>
                      <Badge variant="outline">{salon.turno}</Badge>
                    </div>
                  </div>

                  
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  <Link to={`/profesor/salones/${salon.id}`}>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </Link>
                  <Link to={`/profesor/registro/${salon.id}/alumnos`}>
                    <Button variant="outline" size="sm">
                      Registrar Alumnos
                    </Button>
                  </Link>
                  <Link to={`/profesor/salones/temas/${salon.id}/`}>
                    <Button variant="outline" size="sm">
                      Gestionar Temas
                    </Button>
                  </Link>
             
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
