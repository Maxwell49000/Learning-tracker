// Importations Redux Toolkit pour créer un slice et des thunks asynchrones
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// Service pour accéder à l'API des cours
import * as coursesService from '../../services/coursesService'

// ===== THUNKS ASYNCHRONES =====
// Thunk pour récupérer tous les cours de l'API
export const fetchCourses = createAsyncThunk('courses/fetchAll', async (_, { rejectWithValue }) => {
    try {
        return await coursesService.getCourses()
    } catch (err) {
        return rejectWithValue(err.response?.data || { message: err.message })
    }
})

// Thunk pour récupérer un cours spécifique par son ID
export const fetchCourseById = createAsyncThunk('courses/fetchById', async (id, { rejectWithValue }) => {
    try {
        return await coursesService.getCourse(id)
    } catch (err) {
        return rejectWithValue(err.response?.data || { message: err.message })
    }
})

// ===== ÉTAT INITIAL =====
// Structure de l'état du slice courses
const initialState = {
    items: [], // Liste de tous les cours
    current: null, // Cours actuellement sélectionné/consulté
    status: 'idle', // État du chargement : idle, loading, succeeded, failed
    error: null, // Message d'erreur le cas échéant
}

// ===== CRÉATION DU SLICE =====
// Le slice coursesSlice gère l'état global des cours
const coursesSlice = createSlice({
    name: 'courses', // Nom du slice utilisé pour les actions
    initialState,
    // Reducers synchrones (actions simples)
    reducers: {
        // Action pour vider la liste des cours
        clearCourses(state) {
            state.items = []
        },
        // Action pour réinitialiser le cours courant
        clearCurrent(state) {
            state.current = null
        },
    },
    // Extra reducers pour gérer les actions asynchrones
    extraReducers: (builder) => {
        builder
            // Gestion du thunk fetchCourses (récupération tous les cours)
            .addCase(fetchCourses.pending, (state) => {
                // En cours de chargement
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                // Succès : remplir la liste des cours
                state.status = 'succeeded'
                state.items = action.payload
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                // Erreur : stocker le message d'erreur
                state.status = 'failed'
                state.error = action.payload?.message || 'Failed to load courses'
            })
            // Gestion du thunk fetchCourseById (récupération d'un cours spécifique)
            .addCase(fetchCourseById.pending, (state) => {
                // En cours de chargement
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                // Succès : stocker le cours actuel
                state.status = 'succeeded'
                state.current = action.payload
            })
            .addCase(fetchCourseById.rejected, (state, action) => {
                // Erreur : stocker le message d'erreur
                state.status = 'failed'
                state.error = action.payload?.message || 'Failed to load course'
            })
    },
})

// Export des actions (reducers)
export const { clearCourses, clearCurrent } = coursesSlice.actions
// Export du reducer pour l'intégration dans le store Redux
export default coursesSlice.reducer
