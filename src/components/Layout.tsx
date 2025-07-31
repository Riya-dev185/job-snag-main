import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: 'jobs' | 'analytics';
  onPageChange?: (page: 'jobs' | 'analytics') => void;
  onSignOut?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentPage = 'jobs', 
  onPageChange,
  onSignOut 
}) => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-primary">JobTracker CRM</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              onClick={() => onPageChange?.('jobs')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                currentPage === 'jobs' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              Jobs
            </button>
            <button 
              onClick={() => onPageChange?.('analytics')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                currentPage === 'analytics' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Analytics
            </button>
            <button 
              onClick={onSignOut}
              className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    }
    </div>
  );
}
};

export default Layout;