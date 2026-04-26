import { User } from 'lucide-react';

interface AvatarProps {
  src: string | null | undefined;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 32,
  xl: 48,
};

export default function Avatar({ src, alt = 'User', size = 'md', className = '' }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-border ${className}`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-border ${className}`}>
      <User size={iconSizes[size]} className="text-primary" />
    </div>
  );
}
