import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import SignupForm from '@/components/auth/SignupForm';

export default function Signup() {
  const { user, loading } = useAuth();

  if (!loading && user) return <Navigate to="/" replace />;

  return <SignupForm />;
}
