import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

export function AdminPanelLayout({ formTitle, formSubtitle, form, listTitle, count, loading, children }) {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '380px minmax(0, 1fr)' }, gap: 3, alignItems: 'start' }}>
            <Card sx={{ bgcolor: 'background.paper', position: { lg: 'sticky' }, top: { lg: 100 } }}>
                <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                    <Typography variant="caption" color="secondary.main" fontWeight={800} sx={{ letterSpacing: '.12em', textTransform: 'uppercase' }}>{formSubtitle}</Typography>
                    <Typography variant="h5" sx={{ mt: 1, mb: 3 }}>{formTitle}</Typography>
                    {form}
                </CardContent>
            </Card>
            <Card sx={{ bgcolor: 'background.paper', minHeight: 460 }}>
                <Box sx={{ px: { xs: 3, md: 4 }, py: 2.5, borderBottom: '1px solid', borderColor: 'primary.main', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{listTitle}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>{loading && <CircularProgress size={16} />}<Typography variant="caption" color="text.secondary">{count} entrée{count > 1 ? 's' : ''}</Typography></Box>
                </Box>
                <Box sx={{ px: { xs: 3, md: 4 } }}>{children}</Box>
            </Card>
        </Box>
    )
}

export function AdminListItem({ title, description, meta, onEdit, onDelete }) {
    return (
        <Box sx={{ py: 2.5, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 2, alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={760}>{title}</Typography>
                {description && <Typography variant="body2" color="text.secondary" sx={{ mt: .3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{description}</Typography>}
                {meta && <Box sx={{ mt: 1 }}>{meta}</Box>}
            </Box>
            <Box sx={{ display: 'flex' }}>
                <IconButton size="small" aria-label={`Modifier ${title}`} onClick={onEdit}><EditOutlinedIcon fontSize="small" /></IconButton>
                <IconButton size="small" aria-label={`Supprimer ${title}`} color="error" onClick={onDelete}><DeleteOutlineIcon fontSize="small" /></IconButton>
            </Box>
        </Box>
    )
}
