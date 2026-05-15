import { createTheme, alpha } from "@mui/material/styles";

const andreRed = 'rgb(228, 5, 5)';

const theme = createTheme({
    palette: {
        primary: {
            main: andreRed,
        },
        background: {
            default: "#f5dbdb",
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", sans-serif',
    },
    shape: { borderRadius: 8 },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: { backgroundColor: '#ffe6e6' },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: alpha(andreRed, 0.20),
                    },
                },
            },
        },
    },
});

export default theme;