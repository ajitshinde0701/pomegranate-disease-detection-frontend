import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1f7a3a",
      dark: "#0f3d1e",
      light: "#e8f5e9"
    },
    secondary: {
      main: "#b71c1c"
    },
    warning: {
      main: "#f57c00"
    },
    background: {
      default: "#f6faf4",
      paper: "#ffffff"
    },
    text: {
      primary: "#162116",
      secondary: "#667566"
    }
  },
  typography: {
    fontFamily: `"Segoe UI", "Roboto", "Arial", sans-serif`,
    h1: { fontWeight: 900 },
    h2: { fontWeight: 900 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 700 },
    button: {
      textTransform: "none",
      fontWeight: 700
    }
  },
  shape: {
    borderRadius: 18
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: "0 14px 35px rgba(22,33,22,0.12)",
          border: "1px solid rgba(31,122,58,0.08)"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: "0 14px 35px rgba(22,33,22,0.10)"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          padding: "10px 20px"
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        size: "medium"
      }
    }
  }
});

export default theme;