// App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import HomePage from "./Pages/Home.tsx"
import LoginPage from "./Pages/Login.tsx"
import StudentDashboardPage from "./Pages/StudentDashboard.tsx"
import Layout from "./Components/UI/Layout.tsx"

import EjerciciosPage from "./Pages/Ejercicios.tsx"
import PreguntaResolverPage  from "./Pages/PreguntaResolver.tsx"
import ProgresoPage from "./Pages/Progreso.tsx"
import AnalisisPage from "./Pages/Analisis.tsx"
import ReportesPage from "./Pages/Reportes.tsx"
import Salones from "./Pages/Salones.tsx"
import EstudiantesPage from "./Pages/Estudiantes"
import TeacherDashboardPage from "./Pages/TeacherDashboard.tsx"



export type Section = "a" | "b" | "c"

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/studentdashboard" element={<StudentDashboardPage />} />
                    <Route path="/ejercicios" element={<EjerciciosPage />} />
                    <Route path="/ejercicios/:temaId/:nivel" element={<PreguntaResolverPage />} />
                    <Route path="/progreso" element={<ProgresoPage />} />
                    <Route path="/analisis" element={<AnalisisPage />} />
                    <Route path="/reportes" element={<ReportesPage />} />
                    <Route path="/Salones" element={<Salones />} />
                    <Route path="/estudiantes/:seccion" element={<EstudiantesPage />} />
                    <Route path="/teacherdashboard" element={<TeacherDashboardPage />} />
                </Routes>
            </Layout>
        </Router>


    )
}

export default App


