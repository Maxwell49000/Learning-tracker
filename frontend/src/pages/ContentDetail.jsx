import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckIcon from '@mui/icons-material/Check'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Skeleton from '@mui/material/Skeleton'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import { getContenu } from '../services/contenusService'
import { getProgressForContent, markContentAsRead } from '../services/progressionService'

export default function ContentDetail() {
    const { id } = useParams()
    const [contenu, setContenu] = useState(null)
    const [status, setStatus] = useState('loading')
    const [error, setError] = useState(null)
    const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' })
    const [progress, setProgress] = useState(null)
    const [checkingProgress, setCheckingProgress] = useState(false)

    useEffect(() => {
        if (!id) return
        getContenu(id).then((data) => {
            setContenu(data); setStatus('succeeded'); setCheckingProgress(true)
            getProgressForContent(id).then(setProgress).finally(() => setCheckingProgress(false))
        }).catch((e) => { setError(e.message || 'Erreur'); setStatus('failed') })
    }, [id])

    const handleMarkRead = async () => {
        try {
            await markContentAsRead(id)
            setSnack({ open: true, message: 'Contenu marqué comme terminé', severity: 'success' })
            setProgress({ statut: 'READ', progression: 100 })
        } catch (e) { setSnack({ open: true, message: e.response?.data?.message || e.message || 'Erreur', severity: 'error' }) }
    }

    if (status === 'loading') return <Container sx={{ py: 8 }}><Skeleton variant="rounded" height={360} sx={{ borderRadius: 1 }} /></Container>
    if (status === 'failed') return <Container sx={{ py: 8 }}><Alert severity="error">{error}</Alert></Container>
    if (!contenu) return <Container sx={{ py: 8 }}><Typography>Contenu introuvable.</Typography></Container>
    const isRead = progress?.statut === 'READ'

    return (
        <Container sx={{ py: { xs: 5, md: 8 } }}>
            <Button component={Link} to="/courses" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: 'text.secondary', px: 0 }}>Retour aux parcours</Button>
            <Box sx={{ border: '1px solid', borderColor: 'primary.main', bgcolor: 'background.paper', display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0,1fr) 320px' } }}>
                <Box sx={{ p: { xs: 3.5, md: 6 }, minHeight: { md: 420 } }}>
                    <Typography className="eyebrow">{contenu.type || 'Ressource'}</Typography>
                    <Typography variant="h2" component="h1" sx={{ mt: 2.5, mb: 3, maxWidth: 720 }}>{contenu.titre}</Typography>
                    <Typography color="text.secondary" sx={{ maxWidth: 650 }}>{contenu.description || 'Consultez cette ressource pour poursuivre votre parcours.'}</Typography>
                </Box>
                <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: { xs: 3.5, md: 4 }, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="caption" sx={{ opacity: .65, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 800 }}>Actions</Typography>
                    <Box sx={{ mt: 'auto', pt: 7, display: 'grid', gap: 1.5 }}>
                        {contenu.url && <Button variant="contained" color="secondary" href={contenu.url} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNewIcon />}>Ouvrir la ressource</Button>}
                        {checkingProgress ? <CircularProgress size={24} sx={{ color: 'white' }} /> : isRead ? <Button variant="outlined" disabled startIcon={<CheckIcon />} sx={{ color: 'white!important', borderColor: 'rgba(255,255,255,.35)!important' }}>Contenu terminé</Button> : <Button variant="outlined" onClick={handleMarkRead} sx={{ color: 'white', borderColor: 'rgba(255,255,255,.5)', '&:hover': { borderColor: 'white' } }}>Marquer comme terminé</Button>}
                    </Box>
                </Box>
            </Box>
            <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}><Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity}>{snack.message}</Alert></Snackbar>
        </Container>
    )
}
