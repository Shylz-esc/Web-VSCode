import React, { useRef } from 'react';
import { ChevronRight, ChevronDown, FileCode, FileJson, FileText, File, Folder, MoreHorizontal, Upload } from 'lucide-react';
import { FileNode } from '../../types';
import { THEME } from '../../constants';

interface SidebarProps {
  files: FileNode[];
  activeFileId: string;
  onFileSelect: (id: string) => void;
  onImport: (file: File) => void;
}

const FileIcon = ({ name }: { name: string }) => {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'ts':
    case 'tsx':
    case 'jsx':
      return <FileCode size={16} className="text-[#f1fa8c]" />;
    case 'css':
    case 'scss':
      return <FileCode size={16} className="text-[#8be9fd]" />;
    case 'json':
      return <FileJson size={16} className="text-[#ffb86c]" />;
    case 'md':
    case 'txt':
      return <FileText size={16} className="text-[#bd93f9]" />;
    default:
      return <File size={16} className="text-[#6272a4]" />;
  }
};

const FileTreeItem: React.FC<{ 
  node: FileNode, 
  depth: number, 
  activeId: string, 
  onSelect: (id: string) => void 
}> = ({ node, depth, activeId, onSelect }) => {
  const isFolder = node.type === 'folder';
  const isActive = node.id === activeId;
  
  return (
    <div>
      <div 
        className={`flex items-center py-[2px] cursor-pointer hover:bg-[#2a2d2e] ${isActive ? 'bg-[#37373d]' : ''}`}
        style={{ paddingLeft: `${depth * 12 + 10}px` }}
        onClick={() => !isFolder && onSelect(node.id)}
      >
        <span className="mr-1 opacity-80">
           {isFolder ? (node.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <span className="w-[14px] inline-block"/>}
        </span>
        <span className="mr-2">
          {isFolder ? <Folder size={16} className="text-[#858585]" /> : <FileIcon name={node.name} />}
        </span>
        <span className={`text-sm truncate ${isActive ? 'text-white' : 'text-[#cccccc]'}`}>
          {node.name}
        </span>
      </div>
      
      {isFolder && node.isOpen && node.children?.map(child => (
        <FileTreeItem 
          key={child.id} 
          node={child} 
          depth={depth + 1} 
          activeId={activeId} 
          onSelect={onSelect} 
        />
      ))}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ files, activeFileId, onFileSelect, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
    }
    // Reset input so same file can be selected again if needed
    if (e.target) e.target.value = '';
  };

  return (
    <div className="w-[250px] flex flex-col border-r border-[#2b2b2b]" style={{ backgroundColor: THEME.sidebar }}>
      <div className="h-[35px] px-4 flex items-center justify-between text-xs font-semibold text-[#bbbbbb]">
        <span>EXPLORER</span>
        <MoreHorizontal size={16} />
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {files.map(file => (
          <FileTreeItem 
            key={file.id} 
            node={file} 
            depth={0} 
            activeId={activeFileId} 
            onSelect={onFileSelect} 
          />
        ))}
      </div>

      <div className="p-4 border-t border-[#2b2b2b]">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileChange} 
          className="hidden" 
          accept=".txt,.js,.css,.json,.md,.ts,.tsx,.html,.py,.java"
        />
        <button 
          onClick={handleImportClick}
          className="w-full flex items-center justify-center gap-2 bg-[#007acc] hover:bg-[#0062a3] text-white py-1 px-3 text-xs rounded transition-colors"
        >
          <Upload size={14} />
          <span>Import File</span>
        </button>
        <p className="text-[10px] text-[#858585] mt-2 text-center">
          Import a file, then click the editor and start typing any key!
        </p>
      </div>
    </div>
  );
};