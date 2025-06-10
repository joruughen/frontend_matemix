import {matchPath, useLocation} from "react-router-dom";
import {SidebarNavTeacher} from "../navbars/sidebar_teacher.tsx";
import React from "react";

interface LayoutProps {
    children: React.ReactNode;
}

const SIDEBAR_TEACHER_ROUTES = [
    "/teacherdashboard",
    "/Salones",
];

const shouldShowSidebar = (pathname: string): boolean => {
    return SIDEBAR_TEACHER_ROUTES.some((pattern) => {
        // matchPath devuelve un objeto si encaja, o null si no
        return matchPath({ path: pattern, end: true }, pathname) !== null;
    });
};

export default function Layout2({ children }: LayoutProps) {
    const { pathname } = useLocation();
    const showSidebar = shouldShowSidebar(pathname);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {showSidebar && <SidebarNavTeacher />}
            <main className={`flex-1 p-4 ${showSidebar ? "md:ml-[180px] pt-16 md:pt-4" : ""}`}>
                {children}
            </main>
        </div>
    );
}