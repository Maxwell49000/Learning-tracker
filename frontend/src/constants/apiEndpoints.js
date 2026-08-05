// ===== CONSTANTES DES ENDPOINTS API =====
// Centralisé ici pour éviter les chaînes de caractères "magiques" dans le code

export const API_ENDPOINTS = {
    // Authentification
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
    },

    // Cours
    COURSES: {
        GET_ALL: '/courses',
        GET_BY_ID: (id) => `/courses/${id}`,
        CREATE: '/courses',
        UPDATE: (id) => `/courses/${id}`,
        DELETE: (id) => `/courses/${id}`,
    },

    // Contenus
    CONTENT: {
        GET_ALL: '/content',
        GET_BY_ID: (id) => `/content/${id}`,
        GET_BY_COURSE: (courseId) => `/content/course/${courseId}`,
        CREATE: '/content',
        UPDATE: (id) => `/content/${id}`,
        DELETE: (id) => `/content/${id}`,
    },

    // Progression
    PROGRESS: {
        MARK_CONTENT_READ: (contentId) => `/progress/me/contents/${contentId}/mark-read`,
        GET_USER_PROGRESS: '/progress/me/calculate',
        GET_COURSE_PROGRESS: (courseId) => `/progress/me/courses/${courseId}/calculate`,
        GET_CONTENT_PROGRESS: (contentId) => `/progress/me/contents/${contentId}`,
    },

    // Utilisateurs
    USERS: {
        GET_ALL: '/users',
        CREATE: '/users/register',
        UPDATE: (id) => `/users/${id}`,
        DELETE: (id) => `/users/${id}`,
    },
}

// Export par défaut pour faciliter l'import
export default API_ENDPOINTS
