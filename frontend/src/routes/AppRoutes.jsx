import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import Header from '../components/Header'
import RequireAdmin from '../components/RequireAdmin'
import RequireAuth from '../components/RequireAuth'
import AdminDashboard from '../pages/AdminDashboard'
import ContentDetail from '../pages/ContentDetail'
import CourseDetail from '../pages/CourseDetail'
import Courses from '../pages/Courses'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'

export default function AppRoutes() {
    return (
        <Router>
            <Header />
            <main className="app-main">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
                    <Route path="/courses" element={<RequireAuth><Courses /></RequireAuth>} />
                    <Route path="/courses/:id" element={<RequireAuth><CourseDetail /></RequireAuth>} />
                    <Route path="/content/:id" element={<RequireAuth><ContentDetail /></RequireAuth>} />
                    <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </Router>
    )
}
