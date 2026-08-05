// ===== SELECTORS POUR LE SLICE COURSES =====
// Selectors réutilisables pour accéder facilement à l'état courses

// Récupérer l'état des cours complet
export const selectCoursesState = (state) => state.courses

// Récupérer la liste de tous les cours
export const selectAllCourses = (state) => state.courses.items

// Récupérer le cours actuellement sélectionné
export const selectCurrentCourse = (state) => state.courses.current

// Récupérer le statut de chargement (loading, idle, etc.)
export const selectCoursesStatus = (state) => state.courses.status

// Récupérer le message d'erreur des cours
export const selectCoursesError = (state) => state.courses.error

// Récupérer un cours spécifique par son ID
export const selectCourseById = (state, courseId) =>
    state.courses.items.find((c) => c.idCours === courseId)

// Vérifier si les cours sont en cours de chargement
export const selectIsCoursesLoading = (state) => state.courses.status === 'loading'

// Vérifier si le chargement a échoué
export const selectCoursesLoadingFailed = (state) => state.courses.status === 'failed'

// Récupérer le nombre total de cours
export const selectCoursesCount = (state) => state.courses.items.length
