import { ThemeProvider } from '@mui/material/styles';
import theme from './utils/theme';
import Home from './pages/Home';
import useAbrasives from './hooks/useAbrasive';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  const {abrasives} = useAbrasives();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Home abrasives={abrasives} />
    </ThemeProvider>
  )
}

export default App
