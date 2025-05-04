
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Menu } from 'lucide-react';
import { useState } from 'react';

const NavigationBar = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-semibold text-lg">
            IA Helper
          </Link>
          
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link to="/materials">
                <Button variant="ghost" size="sm">Materials</Button>
              </Link>
              <Link to="/chat">
                <Button variant="ghost" size="sm">Chat</Button>
              </Link>
            </nav>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Button variant="outline" size="sm">Profile</Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => signOut()}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-2 pb-4 border-t bg-background">
          {user ? (
            <>
              <nav className="flex flex-col space-y-2 mb-4">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">Dashboard</Button>
                </Link>
                <Link to="/materials" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">Materials</Button>
                </Link>
                <Link to="/chat" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">Chat</Button>
                </Link>
              </nav>
              <div className="flex flex-col space-y-2">
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Profile</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign out
                </Button>
              </div>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full">Sign In</Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default NavigationBar;
