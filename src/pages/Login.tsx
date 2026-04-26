import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';

export default function Login() {
  const { user, loading } = useAuth();

  if (!loading && user) return <Navigate to="/" replace />;

  return <LoginForm />;
}
