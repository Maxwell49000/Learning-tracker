import { alpha, createTheme } from '@mui/material/styles'

const ink = '#17211b'
const forest = '#25634a'
const sand = '#f5f3ee'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: forest, dark: '#184735', contrastText: '#ffffff' },
        secondary: { main: '#bb6b38' },
        background: { default: sand, paper: '#ffffff' },
        text: { primary: ink, secondary: '#657068' },
        divider: '#dde2dd',
        success: { main: '#2f7557' },
    },
    shape: { borderRadius: 14 },
    typography: {
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        h1: { fontSize: 'clamp(2.6rem, 6vw, 5.4rem)', lineHeight: 0.98, fontWeight: 650, letterSpacing: '-0.055em' },
        h2: { fontSize: 'clamp(2rem, 4vw, 3.4rem)', lineHeight: 1.05, fontWeight: 650, letterSpacing: '-0.04em' },
        h3: { fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 650, letterSpacing: '-0.03em' },
        h4: { fontWeight: 650, letterSpacing: '-0.025em' },
        h5: { fontWeight: 620, letterSpacing: '-0.02em' },
        h6: { fontWeight: 620, letterSpacing: '-0.01em' },
        button: { fontWeight: 650, letterSpacing: '-0.01em' },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: { backgroundImage: 'radial-gradient(circle at 85% 5%, rgba(37, 99, 74, .08), transparent 28%)' },
                '::selection': { background: alpha(forest, 0.2) },
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: { root: { textTransform: 'none', borderRadius: 10, minHeight: 42, paddingInline: 18 } },
        },
        MuiCard: {
            styleOverrides: { root: { border: '1px solid #e1e5e1', boxShadow: '0 12px 35px rgba(28, 42, 33, .06)' } },
        },
        MuiTextField: { defaultProps: { variant: 'outlined' } },
        MuiLinearProgress: {
            styleOverrides: { root: { borderRadius: 999, backgroundColor: '#e7ebe7' }, bar: { borderRadius: 999 } },
        },
    },
})

export default theme
