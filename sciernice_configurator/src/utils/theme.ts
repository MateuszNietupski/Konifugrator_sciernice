import { createTheme } from "@mui/material/styles";

export const DARMET_NAVY = '#0e2135';
export const DARMET_NAVY_LIGHT = '#1d3454';
export const DARMET_NAVY_DARK = '#081625';
export const ANDRE_RED = '#e40505';
export const ANDRE_RED_DARK = '#b30404';

export const BG_DEFAULT = '#F4F6F9';
export const BG_PAPER = '#FFFFFF';
export const TEXT_SECONDARY = '#5A6B82';
export const DIVIDER = '#D9DFE8';

export const ANDRE_RED_TINT_04 = 'rgba(228,5,5,0.04)';
export const ANDRE_RED_TINT_06 = 'rgba(228,5,5,0.06)';
export const DARMET_NAVY_SHADOW = 'rgba(14,33,53,0.05)';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: DARMET_NAVY, light: DARMET_NAVY_LIGHT, dark: DARMET_NAVY_DARK, contrastText: '#FFFFFF' },
    secondary: { main: ANDRE_RED, dark: ANDRE_RED_DARK, contrastText: '#FFFFFF' },
    error: { main: ANDRE_RED, dark: ANDRE_RED_DARK },
    background: { default: BG_DEFAULT, paper: BG_PAPER },
    text: { primary: DARMET_NAVY_DARK, secondary: TEXT_SECONDARY },
    divider: DIVIDER,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: BG_DEFAULT },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
        containedPrimary: {
          backgroundColor: DARMET_NAVY,
          '&:hover': { backgroundColor: DARMET_NAVY_LIGHT },
        },
        outlinedPrimary: {
          borderColor: DARMET_NAVY,
          '&:hover': {
            borderColor: ANDRE_RED,
            color: ANDRE_RED,
            backgroundColor: ANDRE_RED_TINT_04,
          },
        },
        textPrimary: {
          '&:hover': { color: ANDRE_RED, backgroundColor: ANDRE_RED_TINT_04 },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': { color: ANDRE_RED, backgroundColor: ANDRE_RED_TINT_06 },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: DARMET_NAVY,
          color: '#FFFFFF',
        },
        outlinedPrimary: {
          borderColor: DARMET_NAVY,
          color: DARMET_NAVY,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: ANDRE_RED,
            borderWidth: 2,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': { color: ANDRE_RED },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&.Mui-checked': { color: ANDRE_RED },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: ANDRE_RED,
          color: '#FFFFFF',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          '&:before': { display: 'none' },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          '&.Mui-expanded': {
            borderBottom: `2px solid ${ANDRE_RED}`,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          '&.Mui-selected': { color: ANDRE_RED },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: ANDRE_RED, height: 3 },
      },
    },
  },
});

export default theme;

