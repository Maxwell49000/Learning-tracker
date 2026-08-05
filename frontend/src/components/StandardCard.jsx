import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckIcon from '@mui/icons-material/Check'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'

export default function StandardCard({ title, subtitle, description, to, onClick, onEdit, onDelete, compact = false, sx = {}, read = false, progress = null }) {
    const value = Math.min(100, Math.max(0, Number(progress) || 0))
    const content = (
        <Box sx={{ p: compact ? 2.5 : 3, minHeight: compact ? 120 : 245, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}>{subtitle || 'Cours'}</Typography>
                {read && <Box title="Terminé" sx={{ width: 26, height: 26, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'grid', placeItems: 'center' }}><CheckIcon sx={{ fontSize: 16 }} /></Box>}
            </Box>
            <Typography variant={compact ? 'h6' : 'h5'} sx={{ mt: 2, mb: 1.2 }}>{title}</Typography>
            {description && <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{description}</Typography>}
            <Box sx={{ mt: 'auto', pt: 3 }}>
                {progress !== null ? (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography variant="caption" color="text.secondary">Progression</Typography><Typography variant="caption" fontWeight={700}>{Math.round(value)}%</Typography></Box>
                        <LinearProgress variant="determinate" value={value} sx={{ height: 6 }} />
                    </>
                ) : to ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}><Typography variant="body2" fontWeight={700}>Ouvrir</Typography><ArrowForwardIcon sx={{ fontSize: 17 }} /></Box> : null}
            </Box>
        </Box>
    )

    return (
        <Card sx={{ height: '100%', position: 'relative', transition: 'transform 180ms ease, box-shadow 180ms ease', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 18px 45px rgba(28,42,33,.1)' }, ...sx }}>
            {to ? <CardActionArea component={Link} to={to} onClick={onClick} sx={{ height: '100%', alignItems: 'stretch' }}>{content}</CardActionArea> : content}
            {(onEdit || onDelete) && <Box sx={{ position: 'absolute', right: 12, bottom: 10 }}>{onEdit && <IconButton aria-label="Modifier" onClick={onEdit}><EditOutlinedIcon /></IconButton>}{onDelete && <IconButton aria-label="Supprimer" color="error" onClick={onDelete}><DeleteOutlineIcon /></IconButton>}</Box>}
        </Card>
    )
}
