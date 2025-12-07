import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Layout from './components/Layout';
import DiagnosticsTable from './pages/DiagnosticsTable';
import DiagnosticsCharts from './pages/DiagnosticsCharts';
import authService from './services/authService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1651FF',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute = ({ children }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/diagnostics" replace />} />
            <Route path="diagnostics" element={<DiagnosticsTable />} />
            <Route path="charts" element={<DiagnosticsCharts />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

