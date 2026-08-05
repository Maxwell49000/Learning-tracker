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

    const handleSubmit = async (event) => {
        event.preventDefault()
        await dispatch(loginUser({ username, password }))
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ minHeight: 'calc(100vh - 73px)', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, alignItems: 'center', gap: { xs: 7, md: 12 }, py: 7 }}>
                <Box>
                    <Typography className="eyebrow">Bon retour</Typography>
                    <Typography variant="h2" component="h1" sx={{ mt: 2, mb: 3 }}>Reprenez là où<br />vous en étiez.</Typography>
                    <Typography color="text.secondary" sx={{ maxWidth: 480, lineHeight: 1.7 }}>
                        Vos cours, vos contenus et votre progression sont réunis dans un espace pensé pour rester concentré.
                    </Typography>
                </Box>
                <Box component="form" onSubmit={handleSubmit} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, p: { xs: 3, sm: 5 }, boxShadow: '0 24px 70px rgba(28,42,33,.08)' }}>
                    <Typography variant="h4" component="h2" sx={{ mb: 1 }}>Connexion</Typography>
                    <Typography color="text.secondary" sx={{ mb: 4 }}>Accédez à votre espace personnel.</Typography>
                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error.message || error}</Alert>}
                    <Box sx={{ display: 'grid', gap: 2.5 }}>
                        <TextField label="Nom d’utilisateur" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required fullWidth />
                        <TextField label="Mot de passe" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required fullWidth />
                        <Button type="submit" variant="contained" size="large" endIcon={<ArrowForwardIcon />} disabled={status === 'loading'}>
                            {status === 'loading' ? 'Connexion…' : 'Se connecter'}
                        </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
                        Nouveau ici ? <LinkMui component={Link} to="/register" color="primary" fontWeight={650}>Créer un compte</LinkMui>
                    </Typography>
                </Box>
            </Box>
        </Container>
    )
}
