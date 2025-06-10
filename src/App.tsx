// App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import HomePage from "./Pages/Home.tsx"
import LoginPage from "./Pages/Login.tsx"
import StudentDashboardPage from "./Pages/StudentDashboard.tsx"
import Layout from "./Components/UI/Layout.tsx"
import Layout2 from "./Components/UI/Layout2.tsx";
import EjerciciosPage from "./Pages/Ejercicios.tsx"
import PreguntaResolverPage  from "./Pages/PreguntaResolver.tsx"
import ProgresoPage from "./Pages/Progreso.tsx"
import AnalisisPage from "./Pages/Analisis.tsx"
import ReportesPage from "./Pages/Reportes.tsx"
import Salones from "./Pages/Salones.tsx"
import EstudiantesPage from "./Pages/Estudiantes"
import TeacherDashboardPage from "./Pages/TeacherDashboard.tsx"
import Component from "./Pages/Temas.tsx"

export type Section = "a" | "b" | "c"

function App() {
    return (
        <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/studentdashboard" element={<Layout><StudentDashboardPage /></Layout>} />
                    <Route path="/ejercicios" element={<Layout><EjerciciosPage /></Layout>} />
                    <Route path="/ejercicios/:temaId/:nivel" element={<Layout><PreguntaResolverPage /></Layout>} />
                    <Route path="/progreso" element={<Layout><ProgresoPage /></Layout>} />
                    <Route path="/analisis" element={<Layout><AnalisisPage /></Layout>} />
                    <Route path="/reportes" element={<Layout><ReportesPage /></Layout>} />
                    <Route path="/salones" element={<Layout2><Salones /></Layout2>} />
                    <Route path="/estudiantes/:seccion" element={<Layout2><EstudiantesPage /></Layout2>} />
                    <Route path="/teacherdashboard" element={<Layout2><TeacherDashboardPage /></Layout2>} />
                    <Route path="/temas" element={<Layout2><Component /></Layout2>} />
                </Routes>
        </Router>
    )
}

export default App


