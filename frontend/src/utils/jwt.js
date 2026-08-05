export function parseJwt(token) {
    if (!token) return null
    try {
        const parts = token.split('.')
        if (parts.length < 2) return null
        const payload = parts[1]
        const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        return JSON.parse(decodeURIComponent(escape(json)))
    } catch {
        return null
    }
}

export function isAdminToken(token) {
    const payload = parseJwt(token)
    if (!payload) return false
    // roles may be in 'roles' or 'authorities' or 'auth' depending on backend
    const roles = payload.roles || payload.authorities || payload.auth || []
    if (typeof roles === 'string') {
        return roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')
    }
    if (Array.isArray(roles)) {
        // elements can be strings or objects like { authority: 'ROLE_ADMIN' }
        return roles.some((r) => {
            if (!r) return false
            if (typeof r === 'string') return r.includes('ROLE_ADMIN') || r.includes('ADMIN')
            if (typeof r === 'object') {
                const v = r.authority || r.role || r.name || JSON.stringify(r)
                return typeof v === 'string' && (v.includes('ROLE_ADMIN') || v.includes('ADMIN'))
            }
            return false
        })
    }
    return false
}
