import React from 'react';
import { GitBranch, Radio, Bell } from 'lucide-react';
import { THEME } from '../../constants';
import { FileNode } from '../../types';

interface StatusBarProps {
  activeFile: FileNode | null;
  cursorIndex: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ activeFile, cursorIndex }) => {
  return (
    <div 
      className="h-[22px] flex items-center justify-between px-3 text-xs text-white select-none"
      style={{ backgroundColor: THEME.statusBar }}
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 cursor-pointer hover:bg-[#ffffff1a] px-1 h-full">
          <GitBranch size={12} />
          <span>main*</span>
        </div>
        <div className="flex items-center space-x-1 cursor-pointer hover:bg-[#ffffff1a] px-1 h-full">
           <Radio size={12} />
           <span>0 Errors</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {activeFile && (
            <div className="cursor-pointer hover:bg-[#ffffff1a] px-1">
                Ln {Math.floor(cursorIndex / 50) + 1}, Col {cursorIndex % 50 + 1}
            </div>
        )}
        <div className="cursor-pointer hover:bg-[#ffffff1a] px-1">UTF-8</div>
        <div className="cursor-pointer hover:bg-[#ffffff1a] px-1">
            {activeFile?.language?.toUpperCase() || 'TXT'}
        </div>
        <div className="cursor-pointer hover:bg-[#ffffff1a] px-1">
          <Bell size={12} />
        </div>
      </div>
    </div>
  );
};