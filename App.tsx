import React, { useState, useEffect, useCallback, useRef } from 'react';
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
      // Reset typing progress when switching files
      setDisplayedContent('');
      setCursorIndex(0);
    }
  }, [activeFile, activeFileId]);

  // The Hacker Typer Logic
  const handleTyping = useCallback((e: KeyboardEvent) => {
    if (!isEditorFocused) return;
    
    // Ignore special keys to allow normal browser shortcuts (F5, etc) unless it's a typing key
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    
    // Allow Backspace to undo typing
    if (e.key === 'Backspace') {
      setCursorIndex(prev => Math.max(0, prev - 1));
      setDisplayedContent(prev => prev.slice(0, -1));
      return;
    }

    // Only type if we have content left
    if (cursorIndex < sourceContent.length) {
      // Type 1-3 characters at a time for a more fluid feel, or strictly 1 as requested.
      // Requirement says "keydown... content increases by one character".
      // We will stick to 1 char per keydown for strict adherence, 
      // but if the user holds the key, it will fire multiple keydowns.
      
      const char = sourceContent[cursorIndex];
      setDisplayedContent(prev => prev + char);
      setCursorIndex(prev => prev + 1);
    }
  }, [isEditorFocused, cursorIndex, sourceContent]);

  useEffect(() => {
    window.addEventListener('keydown', handleTyping);
    return () => window.removeEventListener('keydown', handleTyping);
  }, [handleTyping]);

  // File Upload Handler
  const handleFileUpload = (uploadedFile: File) => {
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
        const newFiles = [...prev];
        // Add to root folder's children
        if (newFiles[0] && newFiles[0].children) {
            newFiles[0].children.push(newFile);
        }
        return newFiles;
      });
      
      setActiveFileId(newFileId);
    };
    reader.readAsText(uploadedFile);
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
          onImport={handleFileUpload}
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