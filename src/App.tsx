import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import HomePage from "./Pages/Home.tsx"
import LoginPage from "./Pages/Login.tsx"
import ProfesorDashboardPage from "./Pages/Profesor/profesor/ProfesorDashboardPage.tsx"
import SalonesPage from "./Pages/Profesor/profesor/salones/SalonesPage.tsx"
import AlumnosPage from "./Pages/Profesor/profesor/alumnos/AlumnosPage.tsx"
import TemasPage from "./Pages/Profesor/profesor/temas/TemasPage.tsx"
import ReportesProfesorPage from "./Pages/Profesor/profesor/reportes/ReportesProfesorPage.tsx"
import CrearSalonPage from "./Pages/Profesor/profesor/salones/crear/CrearSalonPage.tsx"
import CrearTemaPage from "./Pages/Profesor/profesor/salones/crear/CrearTemaPage.tsx"
import RegistrarAlumnosPage from "./Pages/Profesor/profesor/alumnos/registrar/RegistrarAlumnosPage.tsx"
import DetallesSalonPage from "./Pages/Profesor/profesor/salones/[id]/page.tsx"
import DetalleTemaPage from "./Pages/Profesor/profesor/temas/[id]/DetalleTemaPage.tsx"
import CrearSubtemaPage from "./Pages/Profesor/profesor/temas/crear/CrearSubtemaPage.tsx"
import SubtemasPorTemaPage from "./Pages/Profesor/profesor/temas/subtemas/SubtemasPorTemaPage.tsx"
import EjerciciosSubtemaPage from "./Pages/Profesor/profesor/temas/crear/CrearEjerciciosPage.tsx"
import LayoutProfesor from "./Components/layoutProfesor.tsx"
import LayoutAlumno from "./Components/layoutAlumno.tsx"
import EjerciciosPage from "./Pages/Student/ejercicios/ejerciciosPage.tsx"
import ProgresoPage from "./Pages/Student/progreso/progresoPage.tsx"
import ReportesPage from "./Pages/Student/reportes/reportesPage.tsx"
import DashboardPage from "./Pages/Student/dashboardPage.tsx"
import DetalleAlumnoPage  from "./Pages/Profesor/profesor/alumnos/[id]/DetalleAlumnoPage.tsx";
import { useAuth } from "./context/authContext.tsx"
import { ChatProvider } from "./context/chatContext.tsx"
import { ChatModal } from "./Pages/Chat/ChatModal.tsx"
import ConversationHistoryPage from "./Pages/Chat/ConversationHistoryPage.tsx"

function App() {
  return (
    <ChatProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ChatProvider>
  );
}

function AppRoutes() {
  const { role } = useAuth();
  
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profesor" element={<LayoutProfesor />}>
          <Route index element={<ProfesorDashboardPage />} />
          <Route path="salones" element={<SalonesPage />} />
          <Route path="alumnos" element={<AlumnosPage />} />
          <Route path="temas" element={<TemasPage />} />
          <Route path="reportes" element={<ReportesProfesorPage />} />
          <Route path="/profesor/alumnos/:id" element={<DetalleAlumnoPage />} />
          <Route path="/profesor/salones/crear" element = {<CrearSalonPage />} />
          <Route path="/profesor/registro/:id/alumnos" element={<RegistrarAlumnosPage />} />                
          <Route path="/profesor/salones/:id/temas" element={<CrearTemaPage />} />
          <Route path="/profesor/salones/:id" element= {<DetallesSalonPage />} />
          <Route path="/profesor/tema/:id" element={<DetalleTemaPage />} />
          <Route path="/profesor/temas/:id/subtemas/crear" element={<CrearSubtemaPage />} />
          <Route path="/profesor/tema/subtemas/:id" element={<SubtemasPorTemaPage />} />
          <Route path="/profesor/subtemas/:id/ejercicios" element={<EjerciciosSubtemaPage />} />
          <Route path="/profesor/salones/temas/:id" element={<DetalleTemaPage />} />
        </Route>
        <Route path="/alumno" element={<LayoutAlumno />}>
          <Route index element={<DashboardPage />} />
          <Route path="ejercicios" element={<EjerciciosPage />} />
          <Route path="progreso" element={<ProgresoPage />} />
          <Route path="reportes" element={<ReportesPage />} />
          <Route path="analisis" element={<ReportesPage />} />
          <Route path="chat" element={<ConversationHistoryPage />} />
        </Route>
      </Routes>
      {role === "STUDENT" && <ChatModal />}
    </>
  );
}

export default App;