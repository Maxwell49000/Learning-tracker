// Importation de l'instance axios configurée avec les headers d'auth
import api from './authService'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

// ===== LECTURE DES UTILISATEURS =====

// Récupérer la liste complète de tous les utilisateurs (admin uniquement)
export async function getUsers() {
    const resp = await api.get(API_ENDPOINTS.USERS.GET_ALL)
    return resp.data // Retourne un tableau de tous les utilisateurs
}

// ===== CRÉATION D'UTILISATEUR =====

// Créer un nouvel utilisateur (admin uniquement)
export async function createUser(payload) {
    const resp = await api.post(API_ENDPOINTS.USERS.CREATE, payload)
    return resp.data // Retourne l'utilisateur créé
}

// ===== MODIFICATION D'UTILISATEUR =====

// Mettre à jour un utilisateur existant (admin uniquement)
export async function updateUser(id, payload) {
    const resp = await api.put(API_ENDPOINTS.USERS.UPDATE(id), payload)
    return resp.data // Retourne l'utilisateur mis à jour
}

// ===== SUPPRESSION D'UTILISATEUR =====

// Supprimer un utilisateur (admin uniquement)
export async function deleteUser(id) {
    const resp = await api.delete(API_ENDPOINTS.USERS.DELETE(id))
    return resp.data
}

// Export par défaut pour la documentation
export default { getUsers, createUser, updateUser, deleteUser }