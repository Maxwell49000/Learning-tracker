// Importation des hooks Redux
import { useDispatch, useSelector } from 'react-redux'

// ===== HOOKS REDUX TYPÉS =====
// Ces hooks sont des wrappers typés autour des hooks Redux natifs
// Ils simplifient l'accès à Redux et permettent une meilleure auto-complète

// Hook pour dispatcher les actions Redux
// Utilisé pour déclencher des actions et des thunks asynchrones
export const useAppDispatch = () => useDispatch()

// Hook pour accéder à l'état global Redux (state selector)
// Permet de récupérer n'importe quelle partie de l'état Redux
export const useAppSelector = useSelector
