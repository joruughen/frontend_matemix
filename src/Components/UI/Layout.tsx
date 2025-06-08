import type React from "react"
import { useLocation } from "react-router-dom"
import { SidebarNavStudent } from "../navbars/sidebar_student.tsx"

interface LayoutProps {
    children: React.ReactNode
}

// Define las rutas donde el sidebar debe aparecer
const SIDEBAR_STUDENT_ROUTES = [
    "/studentdashboard",
    "/progreso",
    "/ejercicios"
]


// Función para verificar si la ruta actual debe mostrar el sidebar
const shouldShowSidebar = (pathname: string): boolean => {
    // Verificar rutas exactas
    if (SIDEBAR_STUDENT_ROUTES.includes(pathname)) {
        return true
    }

    // // Verificar rutas dinámicas (como /ejercicios/:id)
    // if (pathname.startsWith("/ejercicios/") && pathname.split("/").length === 3) {
    //     return true
    // }

    return false
}

export default function Layout({ children }: LayoutProps) {
    const location = useLocation()
    const showSidebar = shouldShowSidebar(location.pathname)

    return (
        <div className="flex min-h-screen bg-gray-50">
            {showSidebar && <SidebarNavStudent />}
            <main className={`flex-1 p-4 ${showSidebar ? "md:ml-[180px] pt-16 md:pt-4" : ""}`}>{children}</main>
        </div>
    )
}
