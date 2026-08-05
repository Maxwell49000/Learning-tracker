// Importation de l'instance axios configurée avec les headers d'auth
import api from './authService'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

// ===== MARQUAGE DE PROGRESSION =====

// Marquer un contenu comme lu par l'utilisateur courant
export async function markContentAsRead(contentId) {
    const resp = await api.post(API_ENDPOINTS.PROGRESS.MARK_CONTENT_READ(contentId))
    return resp.data // Retourne la progression mise à jour
}

// ===== RÉCUPÉRATION DE PROGRESSION =====

// Récupérer la progression globale de l'utilisateur courant
export async function getUserProgress() {
    const resp = await api.get(API_ENDPOINTS.PROGRESS.GET_USER_PROGRESS)
    return resp.data // Retourne le pourcentage de progression globale
}

// Récupérer la progression de l'utilisateur courant pour un cours spécifique
export async function getCourseProgress(courseId) {
    const resp = await api.get(API_ENDPOINTS.PROGRESS.GET_COURSE_PROGRESS(courseId))
    return resp.data // Retourne le pourcentage de progression du cours
}

// Récupérer la progression de l'utilisateur courant pour un contenu spécifique
export async function getProgressForContent(contentId) {
    const resp = await api.get(API_ENDPOINTS.PROGRESS.GET_CONTENT_PROGRESS(contentId))
    return resp.data // Retourne { statut: 'READ' ou autre, progression: % }
}

// Export par défaut pour la documentation
export default { markContentAsRead, getUserProgress, getCourseProgress, getProgressForContent }
