// Importations Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// Service pour les opérations d'authentification
import * as authService from '../../services/authService'
// Utilitaire pour décoder et vérifier le JWT
import { isAdminToken } from '../../utils/jwt'

// ===== RÉCUPÉRATION DU STOCKAGE LOCAL =====
// Restaurer le token et le nom d'utilisateur depuis le localStorage (persistance)
const tokenFromStorage = localStorage.getItem('token') || null
const usernameFromStorage = localStorage.getItem('username') || null

// ===== THUNKS ASYNCHRONES =====
// Thunk pour se connecter : appelle l'API avec username et password
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            // Appel du service de connexion
            const data = await authService.login(username, password)
            return data // Retourne le token et le nom d'utilisateur
        } catch (err) {
            // Gestion des erreurs
            return rejectWithValue(err.response?.data || { message: err.message })
        }
    }
)

// ===== CRÉATION DU SLICE =====
// Le slice authSlice gère l'état global d'authentification
const authSlice = createSlice({
    name: 'auth',
    // État initial d'authentification
    initialState: {
        token: tokenFromStorage, // JWT token pour les requêtes authentifiées
        username: usernameFromStorage, // Nom d'utilisateur connecté
        isAdmin: tokenFromStorage ? isAdminToken(tokenFromStorage) : false, // Vérifier si admin
        status: 'idle', // État du chargement : idle, loading, succeeded, failed
        error: null, // Message d'erreur le cas échéant
    },
    // Reducers synchrones (actions manuelles)
    reducers: {
        // Action pour se déconnecter
        logout(state) {
            // Réinitialiser l'état d'auth
            state.token = null
            state.username = null
            state.isAdmin = false
            // Nettoyer le header d'autorisation du service
            authService.clearAuthHeader()
            // Supprimer le token du localStorage
            localStorage.removeItem('token')
            localStorage.removeItem('username')
        },
        // Action pour restaurer l'état d'auth (utilisée au montage de l'app)
        hydrateAuth(state, action) {
            const { token, username } = action.payload || {}
            state.token = token || null
            state.username = username || null
            state.isAdmin = token ? isAdminToken(token) : false
        },
    },
    // Extra reducers pour gérer les actions asynchrones (loginUser)
    extraReducers: (builder) => {
        builder
            // Gestion du thunk loginUser
            .addCase(loginUser.pending, (state) => {
                // En cours de connexion
                state.status = 'loading'
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                // Succès : stocker le token et les infos utilisateur
                state.status = 'succeeded'
                state.token = action.payload.token
                state.username = action.payload.username
                state.isAdmin = isAdminToken(action.payload.token)
                // Configurer le header d'autorisation pour les futures requêtes
                authService.setAuthHeader(action.payload.token)
                // Persister le token et username dans le localStorage
                localStorage.setItem('token', action.payload.token)
                localStorage.setItem('username', action.payload.username)
            })
            .addCase(loginUser.rejected, (state, action) => {
                // Erreur : stocker le message d'erreur
                state.status = 'failed'
                state.error = action.payload?.message || 'Login failed'
            })
    },
})

// Export des actions (reducers synchrones)
export const { logout, hydrateAuth } = authSlice.actions
// Export du reducer pour l'intégration dans le store Redux
export default authSlice.reducer
