'use client'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        primary: {
            main: '#3b82f6',
            light: '#60a5fa',
            dark: '#1d4ed8',
        },
        secondary: {
            main: '#f59e0b',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
    },
    shape: {
        borderRadius: 8,
    },
})

export default theme