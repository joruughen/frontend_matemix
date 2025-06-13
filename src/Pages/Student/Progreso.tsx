import { Card, CardContent } from "../../Components/ui/card"

interface ProgressItem {
  title: string
  date: string
  score: number
  total: number
  color: string
}

const progressItems: ProgressItem[] = [
  {
    title: "Álgebra",
    date: "15 jun 2023",
    score: 92,
    total: 100,
    color: "bg-green-500",
  },
  {
    title: "Álgebra",
    date: "10 jun 2023",
    score: 78,
    total: 100,
    color: "bg-orange-500",
  },
  {
    title: "Álgebra",
    date: "05 jun 2023",
    score: 44,
    total: 100,
    color: "bg-pink-500",
  },
  {
    title: "Álgebra",
    date: "01 jun 2023",
    score: 92,
    total: 100,
    color: "bg-green-500",
  },
]

export default function ProgresoPage() {
  return (
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Mi Progreso</h1>
          <p className="text-gray-600">Historial de calificaciones y evaluaciones</p>
        </div>

        <Card>
          <CardContent>
            <div className="space-y-6">
              {progressItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.date}</p>
                      </div>
                      <div className="text-sm font-medium">
                        {item.score} / {item.total}
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${(item.score / item.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div>
              <h2 className="text-xl font-semibold mb-2">Mis Fortalezas y Áreas de Mejora</h2>
                <p className="text-sm text-gray-600 mb-4">Análisis de tu desempeño por temas</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Fortalezas</h3>
                <div className="space-y-3">
                  <Card className="bg-green-50">
                    <CardContent className="p-4">
                      <p className="font-medium">Geometría Básica</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="p-4">
                      <p className="font-medium">Ecuaciones Lineales</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Necesito Mejorar</h3>
                <div className="space-y-3">
                  <Card className="bg-red-50">
                    <CardContent className="p-4">
                      <p className="font-medium">Trigonometría</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50">
                    <CardContent className="p-4">
                      <p className="font-medium">Factorización</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            </div>
          </CardContent>
        </Card>
      </div>

  )
}
