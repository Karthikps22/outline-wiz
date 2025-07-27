
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Settings, HelpCircle, FileText } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">SEO Outline Generator</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                asChild
                size="sm"
              >
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>

              <Button
                variant={isActive('/settings') ? 'default' : 'ghost'}
                asChild
                size="sm"
              >
                <Link to="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>

              <Button
                variant={isActive('/help') ? 'default' : 'ghost'}
                asChild
                size="sm"
              >
                <Link to="/help">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
