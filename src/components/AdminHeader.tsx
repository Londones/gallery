
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  onSignOut: () => void;
}

const AdminHeader = ({ onSignOut }: AdminHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Gallery
              </Button>
            </Link>
            <h1 className="text-2xl font-light text-gray-900">
              Admin Panel
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                <Eye className="w-4 h-4 mr-2" />
                View Gallery
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onSignOut}
              className="text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
