import { Card, CardContent } from "../../Components/ui/card"
import { Progress } from "../../Components/ui/progress"
import { Award, Book, CheckCircle } from "lucide-react"

export default function StudentDashboardPage() {
  return (
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Panel del Estudiante</h1>
          <p className="text-gray-600">Bienvenido de vuelta, Ana. Tienes 3 ejercicios pendientes para esta semana.</p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Mi Progreso General</h2>
            <p className="text-sm text-gray-600 mb-4">Resumen de tu desempeño académico actual</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-50">
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="rounded-full bg-green-100 p-3 mb-2">
                    <Award className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-bold">17</h3>
                  <p className="text-sm text-gray-600">Promedio General</p>
                </CardContent>
              </Card>

              <Card className="bg-red-50">
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="rounded-full bg-red-100 p-3 mb-2">
                    <Award className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-3xl font-bold">450</h3>
                  <p className="text-sm text-gray-600">Puntos Totales</p>
                </CardContent>
              </Card>

              <Card className="bg-amber-50">
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="rounded-full bg-amber-100 p-3 mb-2">
                    <Book className="h-8 w-8 text-amber-500" />
                  </div>
                  <h3 className="text-3xl font-bold">75%</h3>
                  <p className="text-sm text-gray-600">Temas dominados</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent>
                <h2 className="text-xl font-semibold mb-2">Actividad Reciente</h2>
                <p className="text-sm text-gray-600 mb-4">Tus últimas actividades en la plataforma</p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">Completaste "Geometría Básica"</p>
                      <p className="text-sm text-gray-600">Hace 3 días</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">Comenzaste "Trigonometría"</p>
                      <p className="text-sm text-gray-600">Hace 4 días</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h2 className="text-xl font-semibold mb-2">Ejercicios Pendientes</h2>
                <p className="text-sm text-gray-600 mb-4">Ejercicios que te faltan para completar</p>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Ecuaciones Cuadráticas</span>
                      <span className="text-sm font-medium">5/8</span>
                    </div>
                    <Progress value={62.5} />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Trigonometría</span>
                      <span className="text-sm font-medium">0/6</span>
                    </div>
                    <Progress value={0} />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Factorización</span>
                      <span className="text-sm font-medium">3/10</span>
                    </div>
                    <Progress value={30} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
