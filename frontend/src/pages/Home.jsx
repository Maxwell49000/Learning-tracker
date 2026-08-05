import { useNavigate } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Footer from '../components/Footer'
import { useAppSelector } from '../app/hooks'

const features = [
    { number: '01', icon: <AutoStoriesOutlinedIcon />, title: 'Tout au même endroit', text: 'Retrouvez vos cours et leurs ressources dans un espace clair et structuré.' },
    { number: '02', icon: <CheckCircleOutlineIcon />, title: 'Avancez à votre rythme', text: 'Marquez les contenus terminés et reprenez exactement là où vous vous êtes arrêté.' },
    { number: '03', icon: <InsightsOutlinedIcon />, title: 'Gardez le cap', text: 'Visualisez votre progression globale et le détail pour chaque parcours.' },
]

export default function Home() {
    const navigate = useNavigate()
    const username = useAppSelector((state) => state.auth.username)

    return (
        <>
            <Container maxWidth="lg">
                <Box component="section" sx={{ py: { xs: 8, md: 14 }, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography className="eyebrow">Votre espace d’apprentissage</Typography>
                    <Typography variant="h1" component="h1" sx={{ mt: 2.5, maxWidth: 900 }}>
                        Apprendre avec<br />un cap clair.
                    </Typography>
                    <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr .8fr' }, gap: 4, alignItems: 'end' }}>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 640, fontWeight: 400, lineHeight: 1.6 }}>
                            Bonjour {username || 'à vous'}. Organisez vos cours, consultez vos ressources et mesurez vos progrès sans distraction.
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: { md: 'flex-end' } }}>
                            <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/courses')}>Continuer mes cours</Button>
                        </Box>
                    </Box>
                </Box>

                <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
                    <Typography variant="h3" component="h2" sx={{ mb: 5 }}>L’essentiel, simplement.</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 0, borderTop: '1px solid', borderColor: 'divider' }}>
                        {features.map((feature, index) => (
                            <Box key={feature.number} sx={{ py: 4, px: { xs: 0, md: 4 }, pl: { md: index === 0 ? 0 : 4 }, borderBottom: { xs: '1px solid', md: 0 }, borderLeft: { md: index === 0 ? 0 : '1px solid' }, borderColor: 'divider' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'primary.main', mb: 5 }}>
                                    {feature.icon}<Typography variant="caption" sx={{ fontWeight: 700 }}>{feature.number}</Typography>
                                </Box>
                                <Typography variant="h5" sx={{ mb: 1.5 }}>{feature.title}</Typography>
                                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>{feature.text}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Container>
            <Footer />
        </>
    )
}
