import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
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

export default function StandardCard({ title, subtitle, description, to, onClick, onEdit, onDelete, compact = false, sx = {}, read = false, progress = null, index }) {
    const value = Math.min(100, Math.max(0, Number(progress) || 0))
    const content = (
        <Box sx={{ p: compact ? 2.5 : 3, minHeight: compact ? 140 : 276, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                <Typography variant="caption" sx={{ color: 'secondary.main', textTransform: 'uppercase', letterSpacing: '.13em', fontWeight: 800 }}>{subtitle || 'Parcours'}</Typography>
                {read ? <Box title="Terminé" sx={{ width: 28, height: 28, bgcolor: 'success.main', color: 'white', display: 'grid', placeItems: 'center' }}><CheckIcon sx={{ fontSize: 17 }} /></Box> : index !== undefined && <Typography variant="caption" color="text.secondary">{String(index + 1).padStart(2, '0')}</Typography>}
            </Box>
            <Typography variant={compact ? 'h6' : 'h5'} sx={{ mt: 3, mb: 1.3, maxWidth: 310 }}>{title}</Typography>
            {description && <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{description}</Typography>}
            <Box sx={{ mt: 'auto', pt: 3 }}>
                {progress !== null ? (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.1 }}><Typography variant="caption" color="text.secondary">Progression</Typography><Typography variant="caption" fontWeight={800}>{Math.round(value)}%</Typography></Box>
                        <LinearProgress variant="determinate" value={value} sx={{ height: 5 }} />
                    </>
                ) : to ? <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'primary.main', borderTop: '1px solid', borderColor: 'divider', pt: 2 }}><Typography variant="body2" fontWeight={800}>Ouvrir</Typography><ArrowOutwardIcon sx={{ fontSize: 19 }} /></Box> : null}
            </Box>
        </Box>
    )

    return (
        <Card sx={{ height: '100%', position: 'relative', bgcolor: 'background.paper', transition: 'transform 160ms ease, box-shadow 160ms ease', '&:hover': { transform: 'translate(-3px, -3px)', boxShadow: '6px 6px 0 #14213D' }, ...sx }}>
            {to ? <CardActionArea component={Link} to={to} onClick={onClick} sx={{ height: '100%', alignItems: 'stretch' }}>{content}</CardActionArea> : content}
            {(onEdit || onDelete) && <Box sx={{ position: 'absolute', right: 12, bottom: 10 }}>{onEdit && <IconButton aria-label="Modifier" onClick={onEdit}><EditOutlinedIcon /></IconButton>}{onDelete && <IconButton aria-label="Supprimer" color="error" onClick={onDelete}><DeleteOutlineIcon /></IconButton>}</Box>}
        </Card>
    )
}
