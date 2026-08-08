import { alpha, createTheme } from '@mui/material/styles'

const ink = '#14213D'
const coral = '#E85D3F'
const paper = '#FFFDF7'
const canvas = '#F3F0E8'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: ink, dark: '#0A1329', contrastText: paper },
        secondary: { main: coral, dark: '#C8452C', contrastText: '#FFFFFF' },
        background: { default: canvas, paper },
        text: { primary: ink, secondary: '#667085' },
        divider: '#D9D5CB',
        success: { main: '#267A5B' },
        error: { main: '#BC3F35' },
    },
    shape: { borderRadius: 8 },
    typography: {
        fontFamily: '"Aptos", "Segoe UI", Helvetica, Arial, sans-serif',
        h1: { fontSize: 'clamp(3rem, 7vw, 6.5rem)', lineHeight: .92, fontWeight: 780, letterSpacing: '-0.065em' },
        h2: { fontSize: 'clamp(2.35rem, 5vw, 4.4rem)', lineHeight: .98, fontWeight: 760, letterSpacing: '-0.055em' },
        h3: { fontSize: 'clamp(1.8rem, 3vw, 2.7rem)', lineHeight: 1.05, fontWeight: 740, letterSpacing: '-0.04em' },
        h4: { fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 730, letterSpacing: '-0.035em' },
        h5: { fontWeight: 720, letterSpacing: '-0.025em' },
        h6: { fontWeight: 700, letterSpacing: '-0.015em' },
        body1: { lineHeight: 1.65 },
        body2: { lineHeight: 1.6 },
        button: { fontWeight: 720, letterSpacing: '-0.01em' },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: { backgroundColor: canvas },
                '::selection': { background: alpha(coral, .25) },
            },
        },
        MuiContainer: { defaultProps: { maxWidth: 'lg' } },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: { textTransform: 'none', borderRadius: 6, minHeight: 44, paddingInline: 20 },
                containedSecondary: { color: '#fff' },
            },
        },
        MuiCard: {
            styleOverrides: { root: { backgroundImage: 'none', border: `1px solid ${ink}`, boxShadow: 'none', borderRadius: 8 } },
        },
        MuiTextField: { defaultProps: { variant: 'outlined' } },
        MuiOutlinedInput: {
            styleOverrides: { root: { backgroundColor: '#FFFFFF', borderRadius: 6 } },
        },
        MuiLinearProgress: {
            styleOverrides: { root: { borderRadius: 0, backgroundColor: '#D9D5CB' }, bar: { borderRadius: 0, backgroundColor: coral } },
        },
        MuiChip: { styleOverrides: { root: { borderRadius: 4, fontWeight: 700 } } },
        MuiDialog: { styleOverrides: { paper: { border: `1px solid ${ink}`, boxShadow: '8px 8px 0 rgba(20,33,61,.18)' } } },
    },
})

export default theme
