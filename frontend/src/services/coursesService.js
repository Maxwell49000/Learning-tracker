// Importation de l'instance axios configurée avec les headers d'auth
import api from './authService'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

// ===== LECTURE DES COURS =====

// Récupérer la liste complète de tous les cours
export async function getCourses() {
    const resp = await api.get(API_ENDPOINTS.COURSES.GET_ALL)
    return resp.data // Retourne un tableau de tous les cours
}

// Récupérer un cours spécifique par son ID
export async function getCourse(id) {
    const resp = await api.get(API_ENDPOINTS.COURSES.GET_BY_ID(id))
    return resp.data // Retourne les détails du cours
}

// ===== CRÉATION DE COURS =====

// Créer un nouveau cours (admin uniquement)
export async function createCourse(payload) {
    const resp = await api.post(API_ENDPOINTS.COURSES.CREATE, payload)
    return resp.data // Retourne le cours créé
}

// ===== MODIFICATION DE COURS =====

// Mettre à jour un cours existant (admin uniquement)
export async function updateCourse(id, payload) {
    const resp = await api.put(API_ENDPOINTS.COURSES.UPDATE(id), payload)
    return resp.data // Retourne le cours mis à jour
}

// ===== SUPPRESSION DE COURS =====

// Supprimer un cours (admin uniquement)
export async function deleteCourse(id) {
    const resp = await api.delete(API_ENDPOINTS.COURSES.DELETE(id))
    return resp
}

// Export par défaut pour la documentation
export default { getCourses, getCourse, createCourse, updateCourse, deleteCourse }
