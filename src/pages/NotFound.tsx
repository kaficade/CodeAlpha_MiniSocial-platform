import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-text-secondary mb-8">Page not found</p>
        <Link to="/">
          <Button size="lg">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
