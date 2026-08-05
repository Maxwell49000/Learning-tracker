// Importations React et React Router pour la navigation
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'

// Importations des pages
import Home from '../pages/Home'
import Courses from '../pages/Courses'
import CourseDetail from '../pages/CourseDetail'
import ContentDetail from '../pages/ContentDetail'
import AdminDashboard from '../pages/AdminDashboard'
import Register from '../pages/Register'
import Login from '../pages/Login'

// Importations des composants
import RequireAdmin from '../components/RequireAdmin'
import RequireAuth from '../components/RequireAuth'
import Header from '../components/Header'

// Composant principal de routage de l'application
// Définit toutes les routes et leurs pages correspondantes
export default function AppRoutes() {
    return (
        <Router>
            {/* En-tête visible sur toutes les pages */}
            <Header />
            <main className="app-main">
                {/* Définition de toutes les routes de l'application */}
                <Routes>
                    {/* Route racine - Redirection vers Login */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* Routes d'authentification */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Routes publiques (après authentification) */}
                    <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
                    <Route path="/courses" element={<RequireAuth><Courses /></RequireAuth>} />
                    <Route path="/courses/:id" element={<RequireAuth><CourseDetail /></RequireAuth>} />
                    <Route path="/content/:id" element={<RequireAuth><ContentDetail /></RequireAuth>} />

                    {/* Route protégée (admin uniquement) */}
                    {/* RequireAdmin vérifie que l'utilisateur est admin avant d'afficher le tableau de bord */}
                    <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </Router>
    )
}
