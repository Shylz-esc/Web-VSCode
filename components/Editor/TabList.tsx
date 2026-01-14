import React from 'react';
import { X } from 'lucide-react';
import { THEME } from '../../constants';
import { FileNode } from '../../types';
import { FileCode, FileJson, FileText, File } from 'lucide-react';

const FileIcon = ({ name }: { name: string }) => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'ts':
        return <FileCode size={14} className="text-[#f1fa8c]" />;
      case 'css':
        return <FileCode size={14} className="text-[#8be9fd]" />;
      case 'json':
        return <FileJson size={14} className="text-[#ffb86c]" />;
      default:
        return <FileText size={14} className="text-[#bd93f9]" />;
    }
  };

interface TabListProps {
  activeFile: FileNode | null;
}

export const TabList: React.FC<TabListProps> = ({ activeFile }) => {
  if (!activeFile) return <div className="h-[35px] bg-[#252526]" />;

  return (
    <div className="flex h-[35px] bg-[#252526] overflow-x-auto">
      <div 
        className="flex items-center min-w-[120px] max-w-[200px] px-3 border-t-2 bg-[#1e1e1e] cursor-pointer"
        style={{ borderColor: THEME.accent }}
      >
        <span className="mr-2">
           <FileIcon name={activeFile.name} />
        </span>
        <span className="text-sm text-[#cccccc] mr-2 truncate">{activeFile.name}</span>
        <span className="ml-auto hover:bg-[#444] rounded p-0.5">
          <X size={14} className="text-[#cccccc]" />
        </span>
      </div>
      {/* Fake inactive tabs for visual flair */}
      <div className="flex items-center min-w-[120px] max-w-[200px] px-3 border-r border-[#2b2b2b] bg-[#2d2d2d] opacity-60 cursor-pointer">
        <span className="mr-2"><File size={14} className="text-gray-400"/></span>
        <span className="text-sm text-[#888] mr-2 italic">notes.txt</span>
      </div>
    </div>
  );
};