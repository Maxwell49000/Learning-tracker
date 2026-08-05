import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { setAuthHeader } from './services/authService'
import { hydrateAuth } from './features/auth/authSlice'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './app/theme'

// hydrate axios auth header from localStorage token if present
const existingToken = localStorage.getItem('token')
if (existingToken) setAuthHeader(existingToken)
// hydrate store auth state (isAdmin) from existing token
if (existingToken) {
  const username = localStorage.getItem('username')
  store.dispatch(hydrateAuth({ token: existingToken, username }))
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
