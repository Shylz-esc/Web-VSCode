import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, FileCode, FileJson, FileText, File, Folder, MoreHorizontal, Upload, FolderPlus } from 'lucide-react';
import { FileNode } from '../../types';
import { THEME } from '../../constants';

interface SidebarProps {
  files: FileNode[];
  activeFileId: string;
  onFileSelect: (id: string) => void;
  onImportFile: (file: File) => void;
  onImportFolder: (files: FileList) => void;
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
  // Local state for folder expansion
  const [isOpen, setIsOpen] = useState(node.isOpen ?? true);
  const isFolder = node.type === 'folder';
  const isActive = node.id === activeId;
  
  // Sync internal state if node.isOpen changes externally (optional, but good for "Import Folder" auto-expand)
  useEffect(() => {
    if (node.isOpen !== undefined) {
        setIsOpen(node.isOpen);
    }
  }, [node.isOpen]);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onSelect(node.id);
    }
  };
  
  return (
    <div>
      <div 
        className={`flex items-center py-[2px] cursor-pointer hover:bg-[#2a2d2e] ${isActive ? 'bg-[#37373d]' : ''}`}
        style={{ paddingLeft: `${depth * 12 + 10}px` }}
        onClick={handleClick}
      >
        <span className="mr-1 opacity-80">
           {isFolder ? (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <span className="w-[14px] inline-block"/>}
        </span>
        <span className="mr-2">
          {isFolder ? <Folder size={16} className="text-[#858585]" /> : <FileIcon name={node.name} />}
        </span>
        <span className={`text-sm truncate ${isActive ? 'text-white' : 'text-[#cccccc]'}`}>
          {node.name}
        </span>
      </div>
      
      {isFolder && isOpen && node.children?.map(child => (
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

export const Sidebar: React.FC<SidebarProps> = ({ files, activeFileId, onFileSelect, onImportFile, onImportFolder }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (folderInputRef.current) {
        // Manually set attributes to ensure directory selection works across browsers
        folderInputRef.current.setAttribute("webkitdirectory", "");
        folderInputRef.current.setAttribute("directory", "");
        folderInputRef.current.setAttribute("multiple", "");
    }
  }, []);

  const handleImportFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFolderClick = () => {
    folderInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportFile(file);
    }
    if (e.target) e.target.value = '';
  };

  const onFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImportFolder(e.target.files);
    }
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

      <div className="p-4 border-t border-[#2b2b2b] flex flex-col gap-2">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileChange} 
          className="hidden" 
          accept=".txt,.js,.css,.json,.md,.ts,.tsx,.html,.py,.java,.c,.cpp,.h"
        />
        <input 
          type="file" 
          ref={folderInputRef} 
          onChange={onFolderChange} 
          className="hidden" 
        />
        
        <div className="flex gap-2">
            <button 
            onClick={handleImportFileClick}
            className="flex-1 flex items-center justify-center gap-2 bg-[#3c3c3c] hover:bg-[#4c4c4c] text-white py-1.5 px-2 text-xs rounded transition-colors"
            title="Import single file"
            >
            <Upload size={14} />
            <span>File</span>
            </button>

            <button 
            onClick={handleImportFolderClick}
            className="flex-1 flex items-center justify-center gap-2 bg-[#007acc] hover:bg-[#0062a3] text-white py-1.5 px-2 text-xs rounded transition-colors"
            title="Import entire folder"
            >
            <FolderPlus size={14} />
            <span>Folder</span>
            </button>
        </div>

        <p className="text-[10px] text-[#858585] mt-1 text-center">
          Import a file or folder, then click the editor and start typing!
        </p>
      </div>
    </div>
  );
};