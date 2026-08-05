// Importation de Redux Toolkit pour créer le store
import { configureStore } from '@reduxjs/toolkit'

// Importation des reducers (slices)
import coursesReducer from '../features/courses/coursesSlice'
import authReducer from '../features/auth/authSlice'

// ===== CRÉATION DU STORE REDUX =====
// Le store est le conteneur central de l'état global de l'application
// Il combine tous les slices (reducers) en un seul état centralisé
export const store = configureStore({
    reducer: {
        // courses: gère l'état des cours (liste, détails, etc.)
        courses: coursesReducer,
        // auth: gère l'état de l'authentification (token, username, isAdmin)
        auth: authReducer,
    },
})

// Export du store pour l'utiliser dans main.jsx (provider Redux)
export default store
