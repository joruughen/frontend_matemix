import { Card, CardContent, CardHeader, CardTitle } from "../Components/UI/Card"
import { Progress } from "../Components/UI/Progress"
import { Badge } from "../Components/UI/Badge"
import { Avatar, AvatarFallback } from "../Components/UI/Avatar"
import { Users, BarChart3, BookOpen, Star } from "lucide-react"

export default function TeacherDashboardPage() {
    const students = [
        {
            name: "Bianca Aguinaga",
            avatar: "BA",
            progress: 92,
            days: 7,
            status: "en línea",
            statusColor: "bg-green-500",
        },
        {
            name: "Jorge Melgarejo",
            avatar: "JM",
            progress: 75,
            days: 3,
            status: "advertencia",
            statusColor: "bg-orange-500",
        },
        {
            name: "Zamir Lizardo",
            avatar: "ZL",
            progress: 85,
            days: 6,
            status: "en línea",
            statusColor: "bg-green-500",
        },
        {
            name: "Matías Meneses",
            avatar: "MM",
            progress: 65,
            days: 0,
            status: "desconectado",
            statusColor: "bg-gray-500",
        },
    ]

    const subjects = [
        { name: "Aritmética", progress: 85, color: "bg-orange-400" },
        { name: "Geometría", progress: 70, color: "bg-blue-400" },
        { name: "Álgebra", progress: 60, color: "bg-gray-400" },
    ]

    const weeklyActivity = [
        { day: "L", value: 85, fullDay: "Lunes" },
        { day: "M", value: 92, fullDay: "Martes" },
        { day: "M", value: 78, fullDay: "Miércoles" },
        { day: "J", value: 95, fullDay: "Jueves" },
        { day: "V", value: 88, fullDay: "Viernes" },
        { day: "S", value: 45, fullDay: "Sábado" },
        { day: "D", value: 32, fullDay: "Domingo" },
    ]

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">Panel de la Clase</h1>
                    <p className="text-gray-600">Gestiona a tus estudiantes y realiza un seguimiento de su progreso</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-yellow-50 border-yellow-200">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <Users className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total de estudiantes</p>
                                    <p className="text-3xl font-bold text-gray-900">30</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <BarChart3 className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Promedio Total</p>
                                    <p className="text-3xl font-bold text-gray-900">15</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <BookOpen className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Temas Activos</p>
                                    <p className="text-3xl font-bold text-gray-900">4</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-pink-50 border-pink-200">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-pink-100 rounded-full">
                                    <Star className="h-6 w-6 text-pink-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Mejor Promedio</p>
                                    <p className="text-xl font-bold text-gray-900">Bianca A.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Student Progress */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Progreso de los estudiantes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 pb-2 border-b">
                                    <div>Estudiante</div>
                                    <div>Progreso</div>
                                    <div>Racha</div>
                                    <div>Estado</div>
                                </div>
                                {students.map((student, index) => (
                                    <div key={index} className="grid grid-cols-4 gap-4 items-center py-3">
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                                    {student.avatar}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-gray-900">{student.name}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <Progress value={student.progress} />
                                                <span className="text-sm font-medium text-gray-600">{student.progress}%</span>
                                            </div>
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-medium text-gray-900">{student.days}</span>
                                            <span className="text-gray-600"> días</span>
                                        </div>
                                        <div>
                                            <Badge
                                                variant="default"
                                                className={`${
                                                    student.status === "en línea"
                                                        ? "bg-green-100 text-green-800"
                                                        : student.status === "advertencia"
                                                            ? "bg-orange-100 text-orange-800"
                                                            : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {student.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Performance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Desempeño</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Best Topics */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Mejores Temas</h3>
                                <div className="space-y-4">
                                    {subjects.map((subject, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-gray-700">{subject.name}</span>
                                                <span className="text-gray-600">{subject.progress}%</span>
                                            </div>
                                            <Progress value={subject.progress}  />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Weekly Activity */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Actividad Semanal</h3>
                                <div className="relative">
                                    <div className="flex items-end justify-between space-x-1 h-32 bg-white rounded-lg p-3">
                                        {weeklyActivity.map((day, index) => (
                                            <div key={index} className="flex flex-col items-center space-y-2 flex-1 group">
                                                <div className="relative w-full flex flex-col justify-end h-24">
                                                    <div
                                                        className="w-full bg-gradient-to-t from-pink-500 to-pink-400 rounded-t-sm transition-all duration-300 group-hover:from-pink-600 group-hover:to-pink-500 group-hover:shadow-lg cursor-pointer relative"
                                                        style={{ height: `${(day.value / 100) * 100}%` }}
                                                    >
                                                        {/* Tooltip */}
                                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                                            {day.value}% actividad
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                          {day.day}
                        </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Activity Summary */}
                                    <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                    <span>
                      Promedio semanal:{" "}
                        {Math.round(weeklyActivity.reduce((acc, day) => acc + day.value, 0) / weeklyActivity.length)}%
                    </span>
                                        <span>Pico: {Math.max(...weeklyActivity.map((d) => d.value))}%</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}