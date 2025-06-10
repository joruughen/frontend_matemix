"use client"

import { useNavigate } from "react-router-dom"
import type { Section } from "../App"

const Salones = () => {
    const navigate = useNavigate()

    const handleSectionSelect = (section: Section) => {
        navigate(`/estudiantes/${section}`)
    }

    return (
        <div className="min-h-screen bg-white">
            <main className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Hola, Cordelia!</h1>
                <p className="text-xl mb-10">¿Qué sección deseas visualizar?</p>

                <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
                    <button
                        onClick={() => handleSectionSelect("a")}
                        className="w-full sm:w-64 h-40 rounded-3xl bg-emerald-500 hover:bg-emerald-600 flex flex-col items-center justify-center gap-3 p-6 text-white transition-colors"
                    >
                        <div className="bg-white rounded-full p-4 w-16 h-16 flex items-center justify-center">
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
                                className="text-black"
                            >
                                <path d="M2 16s9-15 20-4C11 23 2 8 2 8" />
                            </svg>
                        </div>
                        <span className="text-xl font-medium">Sección A</span>
                    </button>

                    <button
                        onClick={() => handleSectionSelect("b")}
                        className="w-full sm:w-64 h-40 rounded-3xl bg-amber-500 hover:bg-amber-600 flex flex-col items-center justify-center gap-3 p-6 text-white transition-colors"
                    >
                        <div className="bg-white rounded-full p-4 w-16 h-16 flex items-center justify-center">
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
                                className="text-black"
                            >
                                <path d="M2 16s9-15 20-4C11 23 2 8 2 8" />
                            </svg>
                        </div>
                        <span className="text-xl font-medium">Sección B</span>
                    </button>

                    <button
                        onClick={() => handleSectionSelect("c")}
                        className="w-full sm:w-64 h-40 rounded-3xl bg-blue-500 hover:bg-blue-600 flex flex-col items-center justify-center gap-3 p-6 text-white transition-colors"
                    >
                        <div className="bg-white rounded-full p-4 w-16 h-16 flex items-center justify-center">
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
                                className="text-black"
                            >
                                <path d="M2 16s9-15 20-4C11 23 2 8 2 8" />
                            </svg>
                        </div>
                        <span className="text-xl font-medium">Sección C</span>
                    </button>
                </div>
            </main>
        </div>
    )
}

export default Salones
