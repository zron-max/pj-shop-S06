import { ShoppingCart, Cloud, CloudOff, Settings, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  syncStatus: 'synced' | 'syncing' | 'offline';
  onResetList?: () => void;
}

export function Header({ syncStatus, onResetList }: HeaderProps) {
  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'synced':
        return <Cloud className="w-4 h-4" />;
      case 'syncing':
        return <Cloud className="w-4 h-4 animate-pulse" />;
      case 'offline':
        return <CloudOff className="w-4 h-4" />;
    }
  };

  const getSyncText = () => {
    switch (syncStatus) {
      case 'synced':
        return 'Synced';
      case 'syncing':
        return 'Syncing...';
      case 'offline':
        return 'Offline';
    }
  };

  const getSyncColor = () => {
    switch (syncStatus) {
      case 'synced':
        return 'text-app-accent';
      case 'syncing':
        return 'text-app-secondary';
      case 'offline':
        return 'text-app-neutral';
    }
  };

  return (
    <header className="app-card border-b border-pink-500/20 sticky top-0 z-50 mb-0 rounded-none">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center animated-sparkle" 
                 style={{
                   background: 'linear-gradient(135deg, hsl(320, 100%, 60%) 0%, hsl(0, 100%, 50%) 100%)',
                   boxShadow: '0 0 20px rgba(255, 20, 147, 0.6)'
                 }}>
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-app-text glow-text">ShopSmart</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-1 ${getSyncColor()}`}>
              {getSyncIcon()}
              <span className="text-xs font-medium">{getSyncText()}</span>
            </div>
            {onResetList && (
              <Button 
                onClick={onResetList}
                className="reset-button glow-red p-2 h-auto"
                aria-label="Reset Shopping List"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              className="p-2 rounded-full hover:bg-pink-500/20 transition-colors text-app-neutral hover:text-app-secondary"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
