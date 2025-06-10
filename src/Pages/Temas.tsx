"use client"
import { Card, CardContent } from "../Components/UI/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/UI/Tabs"
import { Progress } from "../Components/UI/Progress"
import { useState } from "react"
import { Button } from "../Components/UI/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../Components/UI/Dialog"
import { Input } from "../Components/UI/Input"
import { Label } from "../Components/UI/Label"
import { Textarea } from "../Components/UI/Textarea"
import { Plus, X } from "lucide-react"

interface Topic {
    id: string
    name: string
    dueDate: string
    progress: number
    isCompleted: boolean
}

const activeTopics: Topic[] = [
    {
        id: "1",
        name: "Aritmética",
        dueDate: "Vencimiento Apr 25",
        progress: 76,
        isCompleted: false,
    },
    {
        id: "2",
        name: "Aritmética",
        dueDate: "Vencimiento Apr 25",
        progress: 76,
        isCompleted: false,
    },
    {
        id: "3",
        name: "Aritmética",
        dueDate: "Vencimiento Apr 25",
        progress: 76,
        isCompleted: false,
    },
]

const completedTopics: Topic[] = []

function TopicCard({ topic }: { topic: Topic }) {
    return (
        <Card className="mb-4">
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{topic.name}</h3>
                    <span className="text-sm text-muted-foreground">{topic.progress}% Completo</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{topic.dueDate}</p>
                <Progress value={topic.progress}  />
            </CardContent>
        </Card>
    )
}

export default function Component() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [exercises, setExercises] = useState([{ id: 1, title: "", description: "" }])

    const addExercise = () => {
        setExercises([...exercises, { id: Date.now(), title: "", description: "" }])
    }

    const removeExercise = (id: number) => {
        setExercises(exercises.filter((ex) => ex.id !== id))
    }

    return (
        <div className=" mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Temas</h1>
                <p className="text-muted-foreground">Maneja los temas de la clase y gestiona su progreso</p>
            </div>

            <Tabs defaultValue="activos" className="w-full">
                <TabsList className="grid w-100 h-10 grid-cols-2 gap-1 mb-6 bg-muted rounded-md p-1">
                    <TabsTrigger
                        value="activos"
                        className="w-full h-8 data-[state=active]:bg-white data-[state=active]:text-black rounded-md text-sm font-medium"
                    >
                        Temas activos
                    </TabsTrigger>
                    <TabsTrigger
                        value="completado"
                        className="w-full h-8 data-[state=active]:bg-white data-[state=active]:text-black rounded-md text-sm font-medium"
                    >
                        Completado
                    </TabsTrigger>

                </TabsList>

                <TabsContent value="activos" className="space-y-4">
                    {activeTopics.map((topic) => (
                        <TopicCard key={topic.id} topic={topic} />
                    ))}
                </TabsContent>

                <TabsContent value="completado" className="space-y-4">
                    {completedTopics.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No hay temas completados aún</div>
                    ) : (
                        completedTopics.map((topic) => <TopicCard key={topic.id} topic={topic} />)
                    )}
                </TabsContent>
            </Tabs>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50"
            >
                <Plus size={24} />
            </button>

            {/* Create Theme Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className=" bg-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Crear Nuevo Tema Semanal</DialogTitle>
                    </DialogHeader>

                    <form className="space-y-6">
                        <div>
                            <Label htmlFor="title">Título del Tema</Label>
                            <Input id="title" placeholder="e.g.," className="mt-1" />
                        </div>

                        <div>
                            <Label htmlFor="description">Descripción del Tema</Label>
                            <Textarea id="description" placeholder="e.g.," className="mt-1 min-h-[80px]" />
                        </div>

                        <div>
                            <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
                            <Input id="dueDate" type="date" className="mt-1" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <Label>Ejercicios</Label>
                                <Button
                                    type="button"
                                    variant="outline"

                                    onClick={addExercise}
                                    className="flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Add Exercise
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {exercises.map((exercise, index) => (
                                    <div key={exercise.id} className="border rounded-lg p-4 relative">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium">Ejercicio {index + 1}</h4>
                                            {exercises.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"

                                                    onClick={() => removeExercise(exercise.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X size={16} />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <Label>Título del Ejercicio</Label>
                                                <Input placeholder="e.g.," className="mt-1" />
                                            </div>

                                            <div>
                                                <Label>Descripción</Label>
                                                <Textarea placeholder="e.g.," className="mt-1 min-h-[60px]" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center pt-4">
                            <Button
                                type="button"
                                className="bg-black hover:bg-gray-800 text-white px-8 py-2 rounded-full"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Crear
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
