// ===== SELECTORS POUR LE SLICE AUTH =====
// Selectors réutilisables pour accéder facilement à l'état auth

// Récupérer l'état d'authentification complet
export const selectAuthState = (state) => state.auth

// Récupérer le token JWT
export const selectAuthToken = (state) => state.auth.token

// Récupérer le nom d'utilisateur connecté
export const selectAuthUsername = (state) => state.auth.username

// Récupérer le statut d'admin
export const selectIsAdmin = (state) => state.auth.isAdmin

// Récupérer le statut de chargement (loading, idle, etc.)
export const selectAuthStatus = (state) => state.auth.status

// Récupérer le message d'erreur d'authentification
export const selectAuthError = (state) => state.auth.error

// Vérifier si l'utilisateur est connecté
export const selectIsAuthenticated = (state) => !!state.auth.token

// Vérifier si une demande d'authentification est en cours
export const selectIsAuthLoading = (state) => state.auth.status === 'loading'
