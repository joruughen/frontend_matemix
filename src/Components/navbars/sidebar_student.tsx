"use client"

import type React from "react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { BookOpen, LayoutDashboard, LineChart, Menu, X } from "lucide-react"
import MatemixIcon from "../../assets/Matemix_icon.svg"


interface NavItem {
    title: string
    href: string
    icon: React.ReactNode
}

const navItems: NavItem[] = [
    {
        title: "Panel",
        href: "/studentdashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
        title: "Progreso",
        href: "/progreso",
        icon: <LineChart className="h-5 w-5" />,
    },
    {
        title: "Ejercicios",
        href: "/ejercicios",
        icon: <BookOpen className="h-5 w-5" />,
    },
]

export function SidebarNavStudent() {
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleMobileMenu}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50"
            >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Mobile Navigation Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-black opacity-40 z-40" onClick={toggleMobileMenu} />
            )}

            {/* Mobile Navigation */}
            <div
                className={`md:hidden fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ${
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200">
                        <Link to="/" className="flex items-center" onClick={toggleMobileMenu}>
                            <div className="h-8 w-8 mr-2">
                                <img src={MatemixIcon} alt="Icon" />
                            </div>
                            <span className="text-xl font-bold">Matemix</span>
                        </Link>
                    </div>
                    <div className="p-4">
                        <p className="text-sm font-medium mb-4 text-gray-600">Menu</p>
                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={toggleMobileMenu}
                                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100 ${
                                        location.pathname.includes(item.href) ? "bg-gray-100 text-gray-900" : "text-gray-600"
                                    }`}
                                >
                                    {item.icon}
                                    {item.title}

                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-col border-r border-gray-200 h-screen w-[180px] fixed left-0 top-0 bg-white">
                <div className="p-4 border-b border-gray-200">
                    <Link to="/" className="flex items-center">
                        <div className="h-8 w-8 mr-2">
                            <img src={MatemixIcon} alt="Logo" />
                        </div>
                        <span className="text-xl font-bold">Matemix</span>
                    </Link>
                </div>
                <div className="p-4">
                    <p className="text-sm font-medium mb-4 text-gray-600">Menu</p>
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100 ${
                                    location.pathname.includes(item.href) ? "bg-gray-100 text-gray-900" : "text-gray-600"
                                }`}
                            >
                                {item.icon}
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    )
}
