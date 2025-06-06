// App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import HomePage from "./Pages/Home.tsx"
import LoginPage from "./Pages/Login.tsx"
import DashboardPage from "./Pages/Dashboard.tsx"
import RootLayout from "./Components/UI/layout.tsx"
import EjerciciosPage from "./Pages/Ejercicios.tsx"
import ProgresoPage from "./Pages/Progreso.tsx"
import AnalisisPage from "./Pages/Analisis.tsx"
import ReportesPage from "./Pages/Reportes.tsx"

function App() {
    return (
        <Router>
            <RootLayout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/ejercicios" element={<EjerciciosPage />} />
                    <Route path="/progreso" element={<ProgresoPage />} />
                    <Route path="/analisis" element={<AnalisisPage />} />
                    <Route path="/reportes" element={<ReportesPage />} />
                </Routes>
            </RootLayout>
        </Router>
    )
}

export default App



// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
//
// function App() {
//   const [count, setCount] = useState(0)
//
//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }
//
// export default App
