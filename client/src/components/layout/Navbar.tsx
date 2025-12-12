import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import Logo from '../ui/Logo';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-white shadow-sm border-b border-gray-200 dark:border-gray-200 transition-colors">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link to="/">
              <Logo size="md" />
            </Link>
            <div className="hidden md:flex space-x-1">
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/transactions"
                className="px-4 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Transactions
              </Link>
              <Link
                to="/budgets"
                className="px-4 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Budgets
              </Link>
              <Link
                to="/goals"
                className="px-4 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Goals
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <span className="text-sm text-gray-900">{user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
