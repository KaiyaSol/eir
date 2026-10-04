import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import AppLayout from '@/components/AppLayout';
import AuthCallbackListener from '@/components/AuthCallbackListener';
import Login from '@/pages/Login';
import ResetPassword from '@/pages/ResetPassword';
import Home from '@/pages/Home';
import Activities from '@/pages/Activities';
import Vent from '@/pages/Vent';
import EmergencyContacts from '@/pages/EmergencyContacts';
import Settings from '@/pages/Settings';
import Alternatives from '@/pages/Alternatives';
import Progress from '@/pages/Progress';
import JournalHistory from '@/pages/JournalHistory';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isAuthenticated } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/vent" element={<Vent />} />
        <Route path="/contacts" element={<EmergencyContacts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/alternatives" element={<Alternatives />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/journal" element={<JournalHistory />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <ThemeProvider>
          <Router>
            <AuthCallbackListener />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
