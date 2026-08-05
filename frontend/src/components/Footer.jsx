import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

export default function Footer() {
    return (
        <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', py: 3.5, mt: 8 }}>
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">Learning Tracker</Typography>
                <Typography variant="body2" color="text.secondary">Projet de démonstration · {new Date().getFullYear()}</Typography>
            </Container>
        </Box>
    )
}
