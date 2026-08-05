// Importation d'axios pour les requêtes HTTP
import axios from 'axios'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

// Récupération de l'URL de base de l'API depuis les variables d'environnement
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

// Création d'une instance axios avec la base URL configurée
const api = axios.create({
    baseURL,
})

// ===== GESTION DU TOKEN D'AUTHENTIFICATION =====

// Fonction pour configurer le header d'autorisation avec le token JWT
export function setAuthHeader(token) {
    if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`
}

// Fonction pour supprimer le header d'autorisation lors de la déconnexion
export function clearAuthHeader() {
    delete api.defaults.headers.common.Authorization
}

// ===== INTERCEPTOR POUR AJOUTER LE TOKEN À CHAQUE REQUÊTE =====

// Interceptor pour ajouter le token à chaque requête si disponible
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// ===== OPÉRATIONS D'AUTHENTIFICATION =====

// Fonction pour se connecter avec username et password
export async function login(username, password) {
    // AuthController expects POST /api/auth/login with request params
    const resp = await api.post(API_ENDPOINTS.AUTH.LOGIN, null, { params: { username, password } })
    return resp.data // Retourne { token, username }
}

// Fonction pour s'inscrire avec username, password et rôle
export async function register(username, password, role = 'USER') {
    // AuthController expects POST /api/auth/register with request params
    const resp = await api.post(API_ENDPOINTS.AUTH.REGISTER, null, { params: { username, password, role } })
    return resp.data // Retourne la confirmation d'inscription
}

// Export de l'instance axios pour utilisation dans les autres services
export default api
