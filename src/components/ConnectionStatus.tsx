import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
      isConnected ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
    }`}>
      {isConnected ? (
        <>
          <Wifi className="w-4 h-4" />
          <span className="text-sm">Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span className="text-sm">Disconnected</span>
        </>
      )}
    </div>
  );
};