// Importations React et React Router
import React from 'react'
import { useAppSelector } from '../app/hooks'
import { Navigate } from 'react-router-dom'

// Composant de protection pour routes admin
// Vérifie que l'utilisateur est connecté ET administrateur
// Sinon le redirige vers la connexion ou l'accueil
export default function RequireAdmin({ children }) {
    // Récupérer le token et le statut admin depuis Redux
    const { token, isAdmin } = useAppSelector((s) => s.auth)

    // Si pas de token (pas connecté) : rediriger vers login
    if (!token) return <Navigate to="/login" replace />

    // Si connecté mais pas admin : rediriger vers home
    if (!isAdmin) return <Navigate to="/home" replace />

    // Si connecté ET admin : afficher le contenu (children)
    return children
}
