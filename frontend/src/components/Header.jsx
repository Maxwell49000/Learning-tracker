import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import MenuIcon from '@mui/icons-material/Menu'
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
    position: 'relative',
    color: 'text.secondary',
    fontSize: 14,
    fontWeight: 700,
    textDecoration: 'none',
    py: 3.1,
    '&::after': { content: '""', position: 'absolute', left: 0, right: 0, bottom: -1, height: 3, bgcolor: 'transparent' },
    '&.active': { color: 'text.primary', '&::after': { bgcolor: 'secondary.main' } },
}

export default function Header() {
    const [open, setOpen] = useState(false)
    const auth = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const isAuthPage = ['/login', '/register', '/'].includes(location.pathname)
    const links = [
        { label: 'Vue d’ensemble', to: '/home' },
        { label: 'Mes cours', to: '/courses' },
        ...(auth.isAdmin ? [{ label: 'Administration', to: '/admin' }] : []),
    ]

    const handleLogout = () => {
        dispatch(logout())
        setOpen(false)
        navigate('/login')
    }

    return (
        <Box component="header" sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'primary.main', position: 'sticky', top: 0, zIndex: 20 }}>
            <Container>
                <Box sx={{ height: { xs: 64, sm: 76 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box onClick={() => navigate(auth.token ? '/home' : '/login')} sx={{ display: 'flex', alignItems: 'center', gap: 1.35, cursor: 'pointer' }}>
                        <Box className="brand-mark" aria-hidden="true"><span /></Box>
                        <Box>
                            <Typography sx={{ fontWeight: 820, letterSpacing: '-.035em', lineHeight: 1.05 }}>Learning Tracker</Typography>
                            <Typography sx={{ display: { xs: 'none', sm: 'block' }, fontSize: 10, color: 'text.secondary', letterSpacing: '.12em', textTransform: 'uppercase', mt: .4 }}>Votre cap d’apprentissage</Typography>
                        </Box>
                    </Box>

                    {!isAuthPage && (
                        <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', alignSelf: 'stretch' }}>
                            {links.map((link) => <Box component={NavLink} key={link.to} to={link.to} sx={linkSx}>{link.label}</Box>)}
                        </Stack>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {auth.token ? (
                            <>
                                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', mr: .5 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 750, lineHeight: 1.2 }}>{auth.username}</Typography>
                                    <Typography variant="caption" color="text.secondary">{auth.isAdmin ? 'Administrateur' : 'Apprenant'}</Typography>
                                </Box>
                                <IconButton aria-label="Se déconnecter" onClick={handleLogout} sx={{ display: { xs: 'none', md: 'inline-flex' }, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}><LogoutOutlinedIcon fontSize="small" /></IconButton>
                                <IconButton aria-label="Ouvrir le menu" onClick={() => setOpen(true)} sx={{ display: { md: 'none' } }}><MenuIcon /></IconButton>
                            </>
                        ) : (
                            <Button onClick={() => navigate(location.pathname === '/register' ? '/login' : '/register')} variant="outlined" size="small">
                                {location.pathname === '/register' ? 'Se connecter' : 'Créer un compte'}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Container>

            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: 'min(88vw, 360px)', p: 3, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}><Box className="brand-mark"><span /></Box><Typography variant="h6">Menu</Typography></Box>
                        <IconButton aria-label="Fermer le menu" onClick={() => setOpen(false)}><CloseIcon /></IconButton>
                    </Box>
                    <Stack spacing={.5} sx={{ mt: 4 }}>
                        {links.map((link, index) => (
                            <Button key={link.to} component={NavLink} to={link.to} onClick={() => setOpen(false)} sx={{ justifyContent: 'space-between', color: 'text.primary', py: 1.5, borderBottom: '1px solid', borderColor: 'divider', borderRadius: 0 }}>
                                {link.label}<Typography variant="caption">0{index + 1}</Typography>
                            </Button>
                        ))}
                    </Stack>
                    <Button startIcon={<LogoutOutlinedIcon />} onClick={handleLogout} color="secondary" sx={{ mt: 'auto', justifyContent: 'flex-start' }}>Se déconnecter</Button>
                </Box>
            </Drawer>
        </Box>
    )
}
