import { useNavigate } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Footer from '../components/Footer'
import { useAppSelector } from '../app/hooks'

const principles = [
    { number: '01', title: 'Centraliser', text: 'Cours, ressources et avancement réunis dans un espace lisible.' },
    { number: '02', title: 'Progresser', text: 'Une progression visible, sans mécanique inutile ni distraction.' },
    { number: '03', title: 'Continuer', text: 'Retrouvez immédiatement le bon contenu et reprenez votre parcours.' },
]

export default function Home() {
    const navigate = useNavigate()
    const username = useAppSelector((state) => state.auth.username)

    return (
        <>
            <Box className="editorial-grid" sx={{ borderBottom: '1px solid', borderColor: 'primary.main' }}>
                <Container>
                    <Box component="section" sx={{ minHeight: { md: 610 }, py: { xs: 8, md: 12 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 320px' }, gap: { xs: 7, md: 10 }, alignItems: 'end' }}>
                        <Box>
                            <Typography className="eyebrow">Espace de {username || 'formation'}</Typography>
                            <Typography variant="h1" component="h1" sx={{ mt: 3, maxWidth: 820 }}>
                                Votre savoir.<br /><Box component="span" sx={{ color: 'secondary.main' }}>Votre rythme.</Box><br />Un cap clair.
                            </Typography>
                        </Box>
                        <Box sx={{ pb: { md: 1 } }}>
                            <Box sx={{ width: 54, height: 7, bgcolor: 'secondary.main', mb: 3 }} />
                            <Typography color="text.secondary" sx={{ fontSize: '1.05rem', mb: 4 }}>
                                Un espace simple pour suivre vos cours, retrouver vos ressources et mesurer ce qui est accompli.
                            </Typography>
                            <Button variant="contained" color="secondary" size="large" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/courses')}>Reprendre mes cours</Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container component="section" sx={{ py: { xs: 8, md: 11 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 3, mb: 5 }}>
                    <Box><Typography className="eyebrow">La méthode</Typography><Typography variant="h3" component="h2" sx={{ mt: 1.5 }}>L’essentiel, bien ordonné.</Typography></Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>LEARNING TRACKER / 2026</Typography>
                </Box>
                <Box sx={{ borderTop: '1px solid', borderColor: 'primary.main' }}>
                    {principles.map((item) => (
                        <Box key={item.number} sx={{ display: 'grid', gridTemplateColumns: { xs: '52px 1fr', md: '100px .75fr 1fr' }, gap: { xs: 2, md: 4 }, alignItems: 'baseline', py: { xs: 3, md: 4 }, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="caption" color="secondary.main" fontWeight={800}>{item.number}</Typography>
                            <Typography variant="h5">{item.title}</Typography>
                            <Typography color="text.secondary" sx={{ gridColumn: { xs: '2', md: 'auto' }, maxWidth: 520 }}>{item.text}</Typography>
                        </Box>
                    ))}
                </Box>
            </Container>
            <Footer />
        </>
    )
}
