import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import CloseIcon from '@mui/icons-material/Close'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout } from '../features/auth/authSlice'

const linkSx = {
    color: 'text.secondary',
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
    '&.active': { color: 'text.primary' },
}

export default function Header() {
    const [open, setOpen] = useState(false)
    const auth = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const isAuthPage = ['/login', '/register', '/'].includes(location.pathname)

    const handleLogout = () => {
        dispatch(logout())
        setOpen(false)
        navigate('/login')
    }

    const links = [
        { label: 'Vue d’ensemble', to: '/home' },
        { label: 'Mes cours', to: '/courses' },
        ...(auth.isAdmin ? [{ label: 'Administration', to: '/admin' }] : []),
    ]

    return (
        <Box component="header" sx={{ bgcolor: 'rgba(245,243,238,.88)', borderBottom: '1px solid', borderColor: 'divider', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 20 }}>
            <Container maxWidth="lg">
                <Box sx={{ height: { xs: 64, sm: 72 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box onClick={() => navigate(auth.token ? '/home' : '/login')} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer' }}>
                        <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: 'primary.main', display: 'grid', placeItems: 'center', color: 'white' }}>
                            <SchoolOutlinedIcon sx={{ fontSize: 19 }} />
                        </Box>
                        <Typography sx={{ fontWeight: 750, letterSpacing: '-.025em' }}>Learning Tracker</Typography>
                    </Box>

                    {!isAuthPage && (
                        <Stack direction="row" spacing={3.5} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                            {links.map((link) => <Box component={NavLink} key={link.to} to={link.to} sx={linkSx}>{link.label}</Box>)}
                        </Stack>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {auth.token ? (
                            <>
                                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', mr: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 650, lineHeight: 1.2 }}>{auth.username}</Typography>
                                    <Typography variant="caption" color="text.secondary">{auth.isAdmin ? 'Administrateur' : 'Apprenant'}</Typography>
                                </Box>
                                <IconButton aria-label="Se déconnecter" onClick={handleLogout} sx={{ display: { xs: 'none', md: 'inline-flex' } }}><LogoutOutlinedIcon /></IconButton>
                                <IconButton aria-label="Ouvrir le menu" onClick={() => setOpen(true)} sx={{ display: { md: 'none' } }}><MenuIcon /></IconButton>
                            </>
                        ) : (
                            <Button onClick={() => navigate(isAuthPage && location.pathname === '/register' ? '/login' : '/register')} variant="outlined" size="small">
                                {location.pathname === '/register' ? 'Se connecter' : 'Créer un compte'}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Container>

            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: 'min(86vw, 340px)', p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                        <Typography variant="h6">Navigation</Typography>
                        <IconButton aria-label="Fermer le menu" onClick={() => setOpen(false)}><CloseIcon /></IconButton>
                    </Box>
                    <Stack spacing={1}>
                        {links.map((link) => (
                            <Button key={link.to} component={NavLink} to={link.to} onClick={() => setOpen(false)} sx={{ justifyContent: 'flex-start', color: 'text.primary', py: 1.2 }}>
                                {link.label}
                            </Button>
                        ))}
                    </Stack>
                    <Button startIcon={<LogoutOutlinedIcon />} onClick={handleLogout} sx={{ mt: 'auto', justifyContent: 'flex-start' }}>Se déconnecter</Button>
                </Box>
            </Drawer>
        </Box>
    )
}
