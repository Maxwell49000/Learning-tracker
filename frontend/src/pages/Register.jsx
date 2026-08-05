import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import LinkMui from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { register } from '../services/authService'

export default function Register() {
    const [form, setForm] = useState({ username: '', password: '', confirmation: '' })
    const [status, setStatus] = useState('idle')
    const [message, setMessage] = useState(null)
    const navigate = useNavigate()
    const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (form.password.length < 8) return setMessage('Le mot de passe doit contenir au moins 8 caractères.')
        if (form.password !== form.confirmation) return setMessage('Les mots de passe ne correspondent pas.')
        setStatus('loading')
        setMessage(null)
        try {
            await register(form.username, form.password)
            navigate('/login', { replace: true })
        } catch (error) {
            setMessage(error.response?.data?.message || 'Impossible de créer ce compte.')
            setStatus('failed')
        }
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ minHeight: 'calc(100vh - 73px)', display: 'flex', alignItems: 'center', py: 7 }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, p: { xs: 3, sm: 5 }, boxShadow: '0 24px 70px rgba(28,42,33,.08)' }}>
                    <Typography className="eyebrow">Premiers pas</Typography>
                    <Typography variant="h3" component="h1" sx={{ mt: 1.5, mb: 1 }}>Créez votre espace</Typography>
                    <Typography color="text.secondary" sx={{ mb: 4 }}>Quelques secondes suffisent pour commencer.</Typography>
                    {message && <Alert severity="error" sx={{ mb: 3 }}>{message}</Alert>}
                    <Box sx={{ display: 'grid', gap: 2.5 }}>
                        <TextField label="Nom d’utilisateur" value={form.username} onChange={update('username')} autoComplete="username" required />
                        <TextField label="Mot de passe" type="password" value={form.password} onChange={update('password')} autoComplete="new-password" helperText="8 caractères minimum" required />
                        <TextField label="Confirmer le mot de passe" type="password" value={form.confirmation} onChange={update('confirmation')} autoComplete="new-password" required />
                        <Button type="submit" variant="contained" size="large" disabled={status === 'loading'}>{status === 'loading' ? 'Création…' : 'Créer mon compte'}</Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
                        Déjà inscrit ? <LinkMui component={Link} to="/login" color="primary" fontWeight={650}>Se connecter</LinkMui>
                    </Typography>
                </Box>
            </Box>
        </Container>
    )
}
