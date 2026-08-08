import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { getUserProgress } from '../services/progressionService'

export default function ProgressionOverview() {
    const [progress, setProgress] = useState(null)
    useEffect(() => {
        let active = true
        getUserProgress().then((value) => active && setProgress(Number(value) || 0)).catch(() => active && setProgress(0))
        return () => { active = false }
    }, [])

    if (progress === null) return <Skeleton variant="rounded" height={164} sx={{ borderRadius: 1, mb: 5 }} />

    return (
        <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', border: '1px solid', borderColor: 'primary.main', p: { xs: 3, md: 4 }, mb: 6, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '220px 1fr' }, gap: { xs: 3, sm: 5 }, alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', width: 70, height: 70, bgcolor: 'secondary.main', right: -20, top: -20, transform: 'rotate(12deg)' }} />
            <Box>
                <Typography variant="caption" sx={{ opacity: .66, letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 800 }}>Progression globale</Typography>
                <Typography sx={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: .95, fontWeight: 780, letterSpacing: '-.06em', mt: 1 }}>{Math.round(progress)}<Box component="span" sx={{ fontSize: '.38em', ml: .5 }}>%</Box></Typography>
            </Box>
            <Box sx={{ pr: { sm: 5 } }}>
                <Typography sx={{ mb: 2.5, maxWidth: 480, opacity: .82 }}>Votre avancée sur l’ensemble des contenus disponibles.</Typography>
                <LinearProgress variant="determinate" value={Math.min(100, Math.max(0, progress))} sx={{ height: 7, bgcolor: 'rgba(255,255,255,.18)', '& .MuiLinearProgress-bar': { bgcolor: 'secondary.main' } }} />
            </Box>
        </Box>
    )
}
