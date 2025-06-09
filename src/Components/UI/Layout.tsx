// Layout.tsx
import React from "react";
import { useLocation, matchPath } from "react-router-dom";
import { SidebarNavStudent } from "../navbars/sidebar_student.tsx";

interface LayoutProps {
    children: React.ReactNode;
}

// Lista de patrones (pueden ser dinámicos)
const SIDEBAR_STUDENT_ROUTES = [
    "/studentdashboard",
    "/progreso",
    "/ejercicios",
    "/ejercicios/:temaId/:nivel",
];

const shouldShowSidebar = (pathname: string): boolean => {
    return SIDEBAR_STUDENT_ROUTES.some((pattern) => {
        // matchPath devuelve un objeto si encaja, o null si no
        return matchPath({ path: pattern, end: true }, pathname) !== null;
    });
};

export default function Layout({ children }: LayoutProps) {
    const { pathname } = useLocation();
    const showSidebar = shouldShowSidebar(pathname);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {showSidebar && <SidebarNavStudent />}
            <main className={`flex-1 p-4 ${showSidebar ? "md:ml-[180px] pt-16 md:pt-4" : ""}`}>
                {children}
            </main>
        </div>
    );
}
