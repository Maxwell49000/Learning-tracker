import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

export default function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', mt: 10 }}>
            <Container sx={{ py: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4 }}>
                    <Box className="brand-mark" sx={{ bgcolor: 'background.paper', '&::before, &::after': { bgcolor: 'primary.main' } }}><span /></Box>
                    <Box><Typography fontWeight={800}>Learning Tracker</Typography><Typography variant="caption" sx={{ opacity: .68 }}>Avancer avec un cap clair.</Typography></Box>
                </Box>
                <Typography variant="caption" sx={{ opacity: .65 }}>Projet portfolio · {new Date().getFullYear()}</Typography>
            </Container>
        </Box>
    )
}
