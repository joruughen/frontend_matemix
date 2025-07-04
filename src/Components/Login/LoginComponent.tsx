import { BookOpen, GraduationCap, School } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button.tsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card.tsx'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs'
import { Input } from '../ui/input.tsx'
import { Label } from '../ui/label.tsx'
import { Link } from 'react-router-dom'
import { authService } from '../../Service/Auth/AuthService.tsx' 
import LogoMatemix from '../../assets/MateMix_Logo.png'
import { useNavigate } from "react-router-dom"
import { useAuth } from '../../context/authContext.tsx'

const LoginComponent = () => {
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string>("");  
    const colorHex = ["#10B981", "#3B82F6", "#D8315B", "#FFA000"];
    const [colorIndex, setColorIndex] = useState(0);
    const {setAuth} = useAuth(); 
    useEffect(() => {
        const interval = setInterval(() => {
            setColorIndex((prev) => (prev + 1) % colorHex.length);
        }, 1000);
        return () => clearInterval(interval);
    }, [colorHex.length]);

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
    }

    const navigate = useNavigate()

   
    
    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        try {
            const response = await authService.login(loginData); 
            if (response.status === 200) {
                const token = response.data.accessToken;    
                const response_user_info = await authService.verifyToken(token);
                if (response_user_info.status === 200) {
                    const role = response_user_info.data.role;
                    const username = loginData.username
                    setAuth({ token, role, username });

                    if (role === "STUDENT") {
                        navigate("/alumno");
                    } else if (role === "TEACHER") {
                        console.log(token)
                        navigate("/profesor");
                    }
                } else {
                    setError("No se pudo verificar el usuario.");
                }
            } else {
                setError("Nombre de usuario o contraseña incorrectos."); 
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setError("Nombre de usuario o contraseña incorrectos."); 
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <header className="flex items-center px-6 py-4 border-b transition-transform duration-300 transform hover:scale-102 transform-origin-center">
                <Link to="/" className="flex items-center">
                    <img src={LogoMatemix} alt="Matemix Logo" className="h-8 w-auto" />
                </Link>
            </header>

            <main className="flex flex-1 items-center justify-center bg-gray-50">
                <div className="w-full max-w-md">
                    <Card className="w-full max-w-md mx-auto">
                        <CardHeader className="flex flex-col items-center gap-2">
                            <div className="bg-white p-3 rounded-full shadow-sm">
                                <School className="h-10 w-10" style={{ color: colorHex[colorIndex] }} />
                            </div>
                            <CardTitle className="mt-4">Iniciar Sesión</CardTitle>
                            <CardDescription>Selecciona tu tipo de usuario e ingresa tus credenciales</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center">
                            <Tabs defaultValue="estudiante" className="w-full">
                                <TabsList className="flex justify-center gap-4 mb-6">
                                    <TabsTrigger value="estudiante" className="group flex flex-col items-center w-36 px-4 py-3 border border-gray-300 rounded-xl shadow-sm transition-all duration-300 data-[state=active]:bg-blue-100 data-[state=active]:border-blue-500 data-[state=active]:shadow-md">
                                        <div className="bg-blue-200 group-data-[state=active]:bg-blue-500 text-blue-800 group-data-[state=active]:text-white p-2 rounded-full transition">
                                            <GraduationCap className="h-5 w-5" />
                                        </div>
                                        <span>Estudiante</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="profesor" className="group flex flex-col items-center w-36 px-4 py-3 border border-gray-300 rounded-xl shadow-sm transition-all duration-300 data-[state=active]:bg-green-100 data-[state=active]:border-green-500 data-[state=active]:shadow-md">
                                        <div className="bg-green-200 group-data-[state=active]:bg-green-500 text-green-800 group-data-[state=active]:text-white p-2 rounded-full transition">
                                            <BookOpen className="h-5 w-5" />
                                        </div>
                                        <span>Profesor</span>
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="estudiante">
                                    <form onSubmit={handleLoginSubmit}>
                                        <div className="grid gap-4">
                                            <div className="grid gap-2 relative">
                                                <Label htmlFor="username">Nombre de usuario</Label>
                                                <Input id="username" type="text" name="username" placeholder="nombre.apellido" onChange={handleLoginChange} className="rounded-[80px]" />
                                            </div>
                                            <div className="grid gap-2 relative">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="password">Contraseña</Label>
                                                    <Link to="#" className="text-sm text-blue-500 hover:underline">¿Olvidaste tu contraseña?</Link>
                                                </div>
                                                <Input id="password" type={showPassword ? "text" : "password"} name="password" onChange={handleLoginChange} className="rounded-[80px]" />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-2/3 right-3 w-16 -translate-y-1/2 flex items-center justify-center text-sm text-blue-500 hover:underline">
                                                    {showPassword ? "Ocultar" : "Mostrar"}
                                                </button>
                                            </div>
                                            {error && <p className="text-red-500 text-sm">{error}</p>} {/* Mostrar el mensaje de error */}
                                            <Button variant="outline" className="w-full bg-blue-500 text-white hover:bg-blue-500 rounded-[80px]">
                                                Iniciar sesión
                                            </Button>
                                        </div>
                                    </form>
                                </TabsContent>
                                <TabsContent value="profesor">
                                    <form onSubmit={handleLoginSubmit}>
                                        <div className="grid gap-4">
                                            <div className="grid gap-2 relative">
                                                <Label htmlFor="username">Nombre de usuario</Label>
                                                <Input id="username" type="text" name="username" placeholder="nombre.apellido" onChange={handleLoginChange} className="rounded-[80px]" />
                                            </div>
                                            <div className="grid gap-2 relative">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="password">Contraseña</Label>
                                                    <Link to="#" className="text-sm text-blue-500 hover:underline">¿Olvidaste tu contraseña?</Link>
                                                </div>
                                                <Input id="password" type={showPassword ? "text" : "password"} name="password" onChange={handleLoginChange} className="rounded-[80px]" />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-2/3 right-3 w-16 -translate-y-1/2 flex items-center justify-center text-sm text-blue-500 hover:underline">
                                                    {showPassword ? "Ocultar" : "Mostrar"}
                                                </button>
                                            </div>
                                            {error && <p className="text-red-500 text-sm">{error}</p>} {/* Mostrar el mensaje de error */}
                                            <Button variant="outline" className="w-full bg-blue-500 text-white hover:bg-blue-500 rounded-[80px]">
                                                Iniciar sesión
                                            </Button>
                                        </div>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <div className="text-center text-xs text-gray-500">
                                Al iniciar sesión, aceptas nuestros{" "}
                                <Link to="#" className="text-blue-500 hover:underline">Términos de servicio</Link> y{" "}
                                <Link to="#" className="text-blue-500 hover:underline">Política de privacidad</Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    );
}

export default LoginComponent;
