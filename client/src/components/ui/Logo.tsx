interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = '', size = 'md' }: LogoProps) => {
  const sizes = {
    sm: 'h-14',
    md: 'h-16',
    lg: 'h-32',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/logo.png"
        alt="FinTrack Logo"
        className={`${sizes[size]} w-auto object-contain`}
      />
    </div>
  );
};

export default Logo;
