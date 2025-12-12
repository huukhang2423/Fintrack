import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  gradient?: boolean;
}

const Card = ({ children, className = '', title, gradient = false }: CardProps) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 ${className} ${gradient ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900' : ''}`}>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
