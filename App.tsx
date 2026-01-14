import React, { useState, useEffect, useCallback } from 'react';
import { TitleBar } from './components/Layout/TitleBar';
import { ActivityBar } from './components/Layout/ActivityBar';
import { Sidebar } from './components/Layout/Sidebar';
import { StatusBar } from './components/Layout/StatusBar';
import { CodeEditor } from './components/Editor/CodeEditor';
import { TabList } from './components/Editor/TabList';
import { FileNode } from './types';
import { INITIAL_FILES } from './constants';

export default function App() {
  const [files, setFiles] = useState<FileNode[]>(INITIAL_FILES);
  const [activeFileId, setActiveFileId] = useState<string>('1');
  const [displayedContent, setDisplayedContent] = useState<string>('');
  const [sourceContent, setSourceContent] = useState<string>('');
  const [cursorIndex, setCursorIndex] = useState<number>(0);
  const [isEditorFocused, setIsEditorFocused] = useState<boolean>(true);

  // Find the active file object recursively
  const findFile = useCallback((nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFile(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const activeFile = findFile(files, activeFileId);

  // Initialize source content when active file changes
  useEffect(() => {
    if (activeFile && activeFile.type === 'file') {
      setSourceContent(activeFile.content || '');
      setDisplayedContent(''); // Reset on file switch
      setCursorIndex(0);
    }
  }, [activeFile, activeFileId]);

  // The Hacker Typer Logic
  const handleTyping = useCallback((e: KeyboardEvent) => {
    if (!isEditorFocused) return;
    
    // Ignore special keys
    if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'Shift' || e.key === 'CapsLock') return;
    
    // Allow Backspace
    if (e.key === 'Backspace') {
      setCursorIndex(prev => Math.max(0, prev - 1));
      setDisplayedContent(prev => prev.slice(0, -1));
      return;
    }

    if (cursorIndex < sourceContent.length) {
      let nextChar = sourceContent[cursorIndex];
      let nextIndex = cursorIndex + 1;

      // Auto-indentation feature: if we just typed a newline, 
      // check if the source has indentation (spaces/tabs) immediately following.
      // If so, type them all out instantly.
      if (nextChar === '\n') {
          let lookaheadIndex = nextIndex;
          let extraChars = '';
          while (lookaheadIndex < sourceContent.length) {
              const char = sourceContent[lookaheadIndex];
              if (char === ' ' || char === '\t') {
                  extraChars += char;
                  lookaheadIndex++;
              } else {
                  break;
              }
          }
          if (extraChars.length > 0) {
              nextChar += extraChars;
              nextIndex = lookaheadIndex;
          }
      }

      setDisplayedContent(prev => prev + nextChar);
      setCursorIndex(nextIndex);
    }
  }, [isEditorFocused, cursorIndex, sourceContent]);

  useEffect(() => {
    window.addEventListener('keydown', handleTyping);
    return () => window.removeEventListener('keydown', handleTyping);
  }, [handleTyping]);

  // --- File Import Logic ---

  const handleFileImport = (uploadedFile: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const newFileId = `custom-${Date.now()}`;
      
      const newFile: FileNode = {
        id: newFileId,
        name: uploadedFile.name,
        type: 'file',
        content: content,
        language: uploadedFile.name.split('.').pop() || 'txt'
      };

      setFiles(prev => {
        // Add to the first folder if it exists, else add to root
        const newFiles = [...prev];
        if (newFiles.length > 0 && newFiles[0].type === 'folder' && newFiles[0].children) {
           newFiles[0].children.push(newFile);
        } else {
           newFiles.push(newFile);
        }
        return newFiles;
      });
      
      setActiveFileId(newFileId);
    };
    reader.readAsText(uploadedFile);
  };

  const handleFolderImport = async (fileList: FileList) => {
    const newFileStructure: FileNode[] = [];
    const filesArray = Array.from(fileList);
    
    // Filter junk folders early
    const relevantFiles = filesArray.filter(file => {
        const path = file.webkitRelativePath || '';
        return !path.includes('/node_modules/') && 
               !path.includes('/.git/') && 
               !path.includes('/dist/') && 
               !path.includes('/build/');
    });

    // Helper to find or create folder in a list of nodes
    // Needs to be defined here to be used in the loop
    const getOrCreateFolder = (nodes: FileNode[], name: string): FileNode => {
      let folder = nodes.find(n => n.name === name && n.type === 'folder');
      if (!folder) {
        folder = {
          id: `folder-${name}-${Math.random().toString(36).substr(2, 9)}`,
          name: name,
          type: 'folder',
          children: [],
          isOpen: false // Keep subfolders closed by default
        };
        nodes.push(folder);
      }
      return folder;
    };

    const validExtensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.html', '.json', '.md', '.txt', '.py', '.java', '.c', '.cpp', '.h', '.xml', '.yml', '.yaml', '.sql', '.rs', '.go', '.php'];
    
    const readFile = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string || '');
            reader.onerror = () => resolve('');
            reader.readAsText(file);
        });
    };

    const processFile = async (file: File) => {
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        
        // Skip binaries and large unknown files
        if (!validExtensions.includes(extension) && file.size > 200 * 1024) return;
        if (file.type.startsWith('image/') || file.type.startsWith('audio/') || file.type.startsWith('video/')) return;

        try {
            const content = await readFile(file);
            
            // Build Structure
            const pathParts = file.webkitRelativePath.split('/');
            let currentLevel = newFileStructure;
            
            for (let j = 0; j < pathParts.length - 1; j++) {
                const folderName = pathParts[j];
                const folderNode = getOrCreateFolder(currentLevel, folderName);
                if (folderNode.children) {
                    currentLevel = folderNode.children;
                }
            }

            const fileName = pathParts[pathParts.length - 1];
            currentLevel.push({
                id: `file-${fileName}-${Math.random().toString(36).substr(2, 9)}`,
                name: fileName,
                type: 'file',
                language: fileName.split('.').pop() || 'txt',
                content: content
            });
        } catch (e) {
            console.error("Skipping file", file.name, e);
        }
    };

    // Parallel processing
    await Promise.all(relevantFiles.map(processFile));

    if (newFileStructure.length > 0) {
      // Auto expand the root folder if it's a single project folder
      if (newFileStructure.length === 1 && newFileStructure[0].type === 'folder') {
          newFileStructure[0].isOpen = true;
      }

      setFiles(prev => [...prev, ...newFileStructure]);
      
      // Try to open the first file
      const findFirstFile = (nodes: FileNode[]): string | null => {
        for (const node of nodes) {
          if (node.type === 'file') return node.id;
          if (node.children) {
            const found = findFirstFile(node.children);
            if (found) return found;
          }
        }
        return null;
      };
      
      const firstId = findFirstFile(newFileStructure);
      if (firstId) setActiveFileId(firstId);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#1e1e1e] text-[#cccccc] select-none">
      <TitleBar />
      
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar />
        
        <Sidebar 
          files={files} 
          activeFileId={activeFileId} 
          onFileSelect={setActiveFileId}
          onImportFile={handleFileImport}
          onImportFolder={handleFolderImport}
        />
        
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
          <TabList activeFile={activeFile} />
          
          <CodeEditor 
            content={displayedContent}
            isFocused={isEditorFocused}
            onFocus={() => setIsEditorFocused(true)}
            onBlur={() => setIsEditorFocused(false)}
            language={activeFile?.language || 'txt'}
          />
        </div>
      </div>
      
      <StatusBar 
        activeFile={activeFile} 
        cursorIndex={cursorIndex} 
      />
    </div>
  );
}