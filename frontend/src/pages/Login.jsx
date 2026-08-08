import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import LinkMui from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { selectAuthError, selectAuthStatus, selectAuthToken } from '../features/auth/authSelectors'
import { loginUser } from '../features/auth/authSlice'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useAppDispatch()
    const token = useAppSelector(selectAuthToken)
    const error = useAppSelector(selectAuthError)
    const status = useAppSelector(selectAuthStatus)
    const navigate = useNavigate()
    useEffect(() => { if (token) navigate('/home', { replace: true }) }, [token, navigate])
    const handleSubmit = (event) => { event.preventDefault(); dispatch(loginUser({ username, password })) }

    return (
        <Box className="editorial-grid">
            <Container>
                <Box sx={{ minHeight: 'calc(100vh - 77px)', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 470px' }, alignItems: 'center', gap: { xs: 7, md: 12 }, py: { xs: 7, md: 10 } }}>
                    <Box>
                        <Typography className="eyebrow">Bon retour</Typography>
                        <Typography variant="h2" component="h1" sx={{ mt: 2.5, mb: 3, maxWidth: 650 }}>Reprenez là où vous vous êtes arrêté.</Typography>
                        <Typography color="text.secondary" sx={{ maxWidth: 500 }}>Vos cours, vos ressources et votre progression. Rien de plus, rien de moins.</Typography>
                        <Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: 'repeat(3, 56px)', gap: 1, mt: 7 }}>
                            {[.35, .68, 1].map((opacity, index) => <Box key={opacity} sx={{ height: 8 + index * 9, bgcolor: 'secondary.main', opacity, alignSelf: 'end' }} />)}
                        </Box>
                    </Box>
                    <Box component="form" onSubmit={handleSubmit} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'primary.main', p: { xs: 3, sm: 5 }, boxShadow: { sm: '8px 8px 0 #14213D' } }}>
                        <Typography variant="caption" color="secondary.main" fontWeight={800} sx={{ letterSpacing: '.14em', textTransform: 'uppercase' }}>Accès membre</Typography>
                        <Typography variant="h4" component="h2" sx={{ mt: 1.5, mb: 1 }}>Connexion</Typography>
                        <Typography color="text.secondary" sx={{ mb: 4 }}>Entrez vos identifiants pour continuer.</Typography>
                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error.message || error}</Alert>}
                        <Box sx={{ display: 'grid', gap: 2.2 }}>
                            <TextField label="Nom d’utilisateur" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required fullWidth />
                            <TextField label="Mot de passe" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required fullWidth />
                            <Button type="submit" variant="contained" color="secondary" size="large" endIcon={<ArrowForwardIcon />} disabled={status === 'loading'}>{status === 'loading' ? 'Connexion…' : 'Se connecter'}</Button>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>Nouveau ici ? <LinkMui component={Link} to="/register" color="primary" fontWeight={750}>Créer un compte</LinkMui></Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}
