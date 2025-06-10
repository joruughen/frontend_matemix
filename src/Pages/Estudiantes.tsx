"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { Section } from "../App"

interface Student {
    id: number
    name: string
    section: string
    average: number
    color: string
}

// Mock data for students
const studentsBySection: Record<Section, Student[]> = {
    a: [
        { id: 1, name: "Aguinaga Pizarro, Bianca Brunella", section: "2do 'A' Sec", average: 18, color: "emerald" },
        { id: 2, name: "Mendoza Torres, Carlos Eduardo", section: "2do 'A' Sec", average: 17, color: "blue" },
        { id: 3, name: "Vargas López, Ana María", section: "2do 'A' Sec", average: 19, color: "violet" },
        { id: 4, name: "Rodríguez Silva, Juan Pablo", section: "2do 'A' Sec", average: 16, color: "rose" },
    ],
    b: [
        { id: 5, name: "Fernández Díaz, Lucía Elena", section: "2do 'B' Sec", average: 18, color: "emerald" },
        { id: 6, name: "Gutiérrez Ramos, Miguel Ángel", section: "2do 'B' Sec", average: 16, color: "orange" },
        { id: 7, name: "Sánchez Ortiz, Valeria Isabel", section: "2do 'B' Sec", average: 19, color: "blue" },
        { id: 8, name: "Morales Castro, Daniel Alejandro", section: "2do 'B' Sec", average: 17, color: "violet" },
    ],
    c: [
        { id: 9, name: "Paredes Flores, Gabriela Sofía", section: "2do 'C' Sec", average: 18, color: "blue" },
        { id: 10, name: "Herrera Campos, Sebastián Andrés", section: "2do 'C' Sec", average: 17, color: "emerald" },
        { id: 11, name: "Chávez Ríos, Mariana Camila", section: "2do 'C' Sec", average: 19, color: "orange" },
        { id: 12, name: "Rojas Medina, Javier Ignacio", section: "2do 'C' Sec", average: 16, color: "rose" },
    ],
}

// Color mapping for student cards
const colorMap: Record<string, string> = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    violet: "bg-violet-500",
    rose: "bg-rose-500",
    orange: "bg-orange-500",
}

const EstudiantesPage = () => {
    const { seccion } = useParams<{ seccion: Section }>()
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")

    // Filter students based on search term
    const students = studentsBySection[seccion as Section] || []
    const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="min-h-screen bg-white">
            <main className="p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <button onClick={() => navigate("/studentdashboard")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m12 19-7-7 7-7" />
                                <path d="M19 12H5" />
                            </svg>
                            Volver
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold">Estudiantes - Sección {seccion?.toUpperCase()}</h1>
                    <p className="text-gray-500">Gestiona y monitorea el progreso de tus estudiantes</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Nombre del estudiante"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                        Filtro
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStudents.map((student) => (
                        <div
                            key={student.id}
                            className="bg-gray-50 rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                        >
                            <div className={`${colorMap[student.color]} rounded-full p-3 text-white`}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-sm">{student.name}</h3>
                                <p className="text-xs text-gray-500">{student.section}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Promedio</p>
                                <p className="font-medium">{student.average}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredStudents.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No se encontraron estudiantes</p>
                    </div>
                )}

                {/* Add student button */}
                <button className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-emerald-500 hover:bg-emerald-600 shadow-lg text-white flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>
                </button>
            </main>
        </div>
    )
}

export default EstudiantesPage