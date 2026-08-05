// Importations React, React Router et Material-UI
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

// Importations des services
import { getContenu } from '../services/contenusService'
import { markContentAsRead, getProgressForContent } from '../services/progressionService'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// Composant pour afficher les détails d'un contenu pédagogique
export default function ContentDetail() {
    // Récupération de l'ID du contenu depuis l'URL
    const { id } = useParams()
    // États du composant
    const [contenu, setContenu] = useState(null)
    const [status, setStatus] = useState('loading')
    const [error, setError] = useState(null)
    const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' })
    const [progress, setProgress] = useState(null) // Progression de l'utilisateur
    const [checkingProgress, setCheckingProgress] = useState(false)

    // Charger les détails du contenu au montage du composant
    useEffect(() => {
        if (!id) return
        getContenu(id)
            .then((data) => {
                setContenu(data)
                setStatus('succeeded')
                // Récupérer la progression de l'utilisateur pour ce contenu
                setCheckingProgress(true)
                getProgressForContent(id).then((p) => { setProgress(p); setCheckingProgress(false) }).catch(() => setCheckingProgress(false))
            })
            .catch((e) => {
                setError(e.message || 'Erreur')
                setStatus('failed')
            })
    }, [id])

    // Affichage des états de chargement et d'erreur
    if (status === 'loading') return <Container maxWidth={false} sx={{ px: 2 }}><Typography>Chargement…</Typography></Container>
    if (status === 'failed') return <Container maxWidth={false} sx={{ px: 2 }}><Typography color="error">{error}</Typography></Container>
    if (!contenu) return <Container maxWidth={false} sx={{ px: 2 }}><Typography>Contenu introuvable.</Typography></Container>

    // Fonction pour marquer le contenu comme lu
    const handleMarkRead = async () => {
        try {
            await markContentAsRead(id)
            setSnack({ open: true, message: 'Marqué comme lu', severity: 'success' })
            setProgress({ statut: 'READ', progression: 100 })
        } catch (e) {
            setSnack({ open: true, message: e.response?.data?.message || e.message || 'Erreur', severity: 'error' })
        }
    }

    // Rendu du composant
    return (
        <Container maxWidth={false} sx={{ px: 2 }}>
            {/* Affichage des détails du contenu */}
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>{contenu.titre}</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>Type: {contenu.type}</Typography>
                    {/* Lien pour ouvrir le contenu externe */}
                    {contenu.url && (
                        <Button variant="contained" color="primary" href={contenu.url} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNewIcon />} sx={{ mr: 2 }}>
                            Ouvrir le contenu
                        </Button>
                    )}

                    {/* Bouton pour marquer le contenu comme lu */}
                    {checkingProgress ? <CircularProgress size={20} /> : (
                        progress && progress.statut === 'READ' ? (
                            <Button variant="outlined" disabled>Lu</Button>
                        ) : (
                            <Button variant="contained" color="success" onClick={handleMarkRead}>Marquer comme lu</Button>
                        )
                    )}
                </CardContent>
            </Card>
            {/* Notification pour les messages de succès/erreur */}
            <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: '100%' }}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </Container>
    )
}
