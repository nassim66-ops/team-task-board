import { AuthProvider } from './context/AuthContext';
import SignIn from './components/SignIn';
import {  Toaster } from 'sonner';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ResetPasswordForm } from './components/ResetPasswordForm';
import { UpdatePasswordForm } from './components/UpdatePasswordForm';
import MainRoute from './components/MainRoute';

function AppContent() {

  return (
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignIn />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/update-password" element={<UpdatePasswordForm />} />
          
          {/* Protected routes */}
          <Route
            path="/"
            element={<MainRoute/>}
          />
          
        </Routes>
  );
}
export default function App() {
  return (
    <Router>
      <AuthProvider>
      <Toaster position="top-right" />
      <AppContent />
      </AuthProvider>
    </Router>
  );
}