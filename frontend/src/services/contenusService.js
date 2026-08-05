// Importation de l'instance axios configurée avec les headers d'auth
import api from './authService'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

// ===== LECTURE DES CONTENUS =====

// Récupérer tous les contenus associés à un cours spécifique
export async function getContenuByCours(idCours) {
    const resp = await api.get(API_ENDPOINTS.CONTENT.GET_BY_COURSE(idCours))
    return resp.data // Retourne un tableau de contenus
}

// Récupérer un contenu spécifique par son ID
export async function getContenu(id) {
    const resp = await api.get(API_ENDPOINTS.CONTENT.GET_BY_ID(id))
    return resp.data // Retourne les détails du contenu
}

// Récupérer la liste complète de tous les contenus
export async function getAllContenu() {
    const resp = await api.get(API_ENDPOINTS.CONTENT.GET_ALL)
    return resp.data // Retourne un tableau de tous les contenus
}

// ===== CRÉATION DE CONTENU =====

// Créer un nouveau contenu (admin uniquement)
export async function createContenu(payload) {
    const resp = await api.post(API_ENDPOINTS.CONTENT.CREATE, payload)
    return resp.data // Retourne le contenu créé
}

// ===== MODIFICATION DE CONTENU =====

// Mettre à jour un contenu existant (admin uniquement)
export async function updateContenu(id, payload) {
    const resp = await api.put(API_ENDPOINTS.CONTENT.UPDATE(id), payload)
    return resp.data // Retourne le contenu mis à jour
}

// ===== SUPPRESSION DE CONTENU =====

// Supprimer un contenu (admin uniquement)
export async function deleteContenu(id) {
    const resp = await api.delete(API_ENDPOINTS.CONTENT.DELETE(id))
    return resp
}

// Export par défaut pour la documentation
export default { getContenuByCours, getContenu, getAllContenu, createContenu, updateContenu, deleteContenu }
