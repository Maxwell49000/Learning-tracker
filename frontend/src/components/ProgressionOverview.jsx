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

    if (progress === null) return <Skeleton variant="rounded" height={156} sx={{ borderRadius: 3, mb: 5 }} />

    return (
        <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 3, p: { xs: 3, md: 4 }, mb: 6, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr' }, gap: { xs: 3, sm: 5 }, alignItems: 'center' }}>
            <Box>
                <Typography variant="caption" sx={{ opacity: .72, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700 }}>Progression globale</Typography>
                <Typography sx={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1, fontWeight: 650, letterSpacing: '-.05em', mt: 1 }}>{Math.round(progress)}%</Typography>
            </Box>
            <Box>
                <Typography sx={{ mb: 2, maxWidth: 440 }}>Chaque contenu terminé vous rapproche de votre objectif.</Typography>
                <LinearProgress variant="determinate" value={Math.min(100, Math.max(0, progress))} sx={{ height: 8, bgcolor: 'rgba(255,255,255,.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }} />
            </Box>
        </Box>
    )
}
