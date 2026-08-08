import { useCallback, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Snackbar from '@mui/material/Snackbar'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import CoursesAdminPanel from './AdminDashboard/CoursesAdminPanel'
import ContentsAdminPanel from './AdminDashboard/ContentsAdminPanel'
import UsersAdminPanel from './AdminDashboard/UsersAdminPanel'

const tabs = ['Cours', 'Contenus', 'Utilisateurs']

export default function AdminDashboard() {
    const [tab, setTab] = useState(0)
    const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' })
    const notify = useCallback((data) => setSnack({ open: true, ...data }), [])
    return (
        <Container sx={{ py: { xs: 6, md: 9 } }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr auto' }, gap: 4, alignItems: 'end', pb: 4, borderBottom: '1px solid', borderColor: 'primary.main' }}>
                <Box><Typography className="eyebrow">Pilotage</Typography><Typography variant="h2" component="h1" sx={{ mt: 1.5 }}>Administration</Typography></Box>
                <Typography color="text.secondary" sx={{ maxWidth: 350 }}>Gérez le catalogue, les contenus pédagogiques et les accès utilisateurs.</Typography>
            </Box>
            <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto" sx={{ mt: 3, mb: 4, minHeight: 50, borderBottom: '1px solid', borderColor: 'divider', '& .MuiTabs-indicator': { height: 3, bgcolor: 'secondary.main' }, '& .MuiTab-root': { minHeight: 50, px: { xs: 2, sm: 3 }, textTransform: 'none', fontWeight: 750, alignItems: 'flex-start' } }}>
                {tabs.map((label, index) => <Tab key={label} label={`${String(index + 1).padStart(2, '0')}  ${label}`} />)}
            </Tabs>
            {tab === 0 && <CoursesAdminPanel onSnack={notify} onContenusRefresh={() => {}} />}
            {tab === 1 && <ContentsAdminPanel onSnack={notify} />}
            {tab === 2 && <UsersAdminPanel onSnack={notify} />}
            <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((current) => ({ ...current, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert onClose={() => setSnack((current) => ({ ...current, open: false }))} severity={snack.severity}>{snack.message}</Alert></Snackbar>
        </Container>
    )
}
