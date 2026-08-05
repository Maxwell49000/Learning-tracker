// ===== TABLEAU DE BORD D'ADMINISTRATION =====
// Composant principal pour l'administration - gère les onglets et la notification centralisée
// Les fonctionnalités spécifiques sont déléguées à des composants enfants (CoursesAdminPanel, ContentsAdminPanel, UsersAdminPanel)
import React, { useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Fade from '@mui/material/Fade'
import Box from '@mui/material/Box'
import BookIcon from '@mui/icons-material/School'
import LayersIcon from '@mui/icons-material/Layers'
import PeopleIcon from '@mui/icons-material/People'
import CoursesAdminPanel from './AdminDashboard/CoursesAdminPanel'
import ContentsAdminPanel from './AdminDashboard/ContentsAdminPanel'
import UsersAdminPanel from './AdminDashboard/UsersAdminPanel'

// Composant principal du tableau de bord administrateur
// Structure simplifiée : composant parent qui gère les onglets et la notification centralisée
// Délègue les détails de gestion (CRUD) à des sous-composants
export default function AdminDashboard() {
    // État pour gérer l'onglet actif (0: Cours, 1: Contenus, 2: Utilisateurs)
    const [tab, setTab] = useState(0)
    // État pour les notifications (snackbar) - notification centralisée pour tous les sous-composants
    const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' })

    // Fonction pour afficher une notification
    // Utilisée par les sous-composants via le callback onSnack
    function showSnack(message, severity = 'info') {
        setSnack({ open: true, message, severity })
    }

    // Fermer la notification
    function handleCloseSnack() {
        setSnack((s) => ({ ...s, open: false }))
    }

    // Rendu du composant - Interface d'administration simplifié
    return (
        <Container maxWidth={false} disableGutters sx={{ py: 5, minHeight: 'calc(100vh - 96px)' }}>
            {/* En-tête et onglets de navigation */}
            <Box sx={{ px: 6 }}>
                <Typography variant="h4" gutterBottom>Administration</Typography>
                {/* Onglets pour naviguer entre Cours, Contenus et Utilisateurs */}
                <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3, color: 'text.primary' }} textColor="inherit">
                    <Tab sx={{ color: 'inherit', minWidth: 160, textTransform: 'none' }} icon={<BookIcon />} iconPosition="start" label="Cours" />
                    <Tab sx={{ color: 'inherit', minWidth: 160, textTransform: 'none' }} icon={<LayersIcon />} iconPosition="start" label="Contenus" />
                    <Tab sx={{ color: 'inherit', minWidth: 160, textTransform: 'none' }} icon={<PeopleIcon />} iconPosition="start" label="Utilisateurs" />
                </Tabs>
            </Box>

            {/* Conteneur pour les panneaux avec padding */}
            <Box sx={{ px: 6 }}>
                {/* Onglet 0 : Panel de gestion des Cours */}
                {tab === 0 && (
                    <CoursesAdminPanel
                        onSnack={(data) => showSnack(data.message, data.severity)}
                        onContenusRefresh={() => { }}
                    />
                )}

                {/* Onglet 1 : Panel de gestion des Contenus */}
                {tab === 1 && (
                    <ContentsAdminPanel
                        onSnack={(data) => showSnack(data.message, data.severity)}
                    />
                )}

                {/* Onglet 2 : Panel de gestion des Utilisateurs */}
                {tab === 2 && (
                    <UsersAdminPanel
                        onSnack={(data) => showSnack(data.message, data.severity)}
                    />
                )}
            </Box>

            {/* Composant de notification (snackbar) pour afficher les messages de succès/erreur */}
            {/* Position fixe en bas à droite, fermeture après 4 secondes */}
            <Snackbar
                open={snack.open}
                autoHideDuration={4000}
                onClose={handleCloseSnack}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                TransitionComponent={Fade}
            >
                <Alert onClose={handleCloseSnack} severity={snack.severity} sx={{ width: '100%' }}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </Container>
    )
}

