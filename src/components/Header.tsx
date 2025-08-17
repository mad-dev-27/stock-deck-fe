import React from 'react';
import { Settings } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <div className="bg-gray-800 shadow-sm border-b border-gray-700">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-white">Trading Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <Settings className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};