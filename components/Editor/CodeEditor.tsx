import React, { useEffect, useRef } from 'react';
import { THEME } from '../../constants';

interface CodeEditorProps {
  content: string;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  language: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  content, 
  isFocused, 
  onFocus, 
  onBlur,
  language
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [content]);

  // Handle Syntax Highlighting (Primitive simulation)
  // Since we are typing character by character, doing full AST parsing would be heavy and potentially jittery.
  // We will use a simple regex-based coloring for common keywords if possible, or just render styled text.
  // For the "Hacker Typer" feel, raw text with a distinct color is often enough, but let's add some flair.
  
  const renderContent = () => {
    if (!content) return null;
    
    // Very basic syntax highlighting for display purposes
    // This is not a full parser, just to make it look "code-like"
    return (
        <span className="whitespace-pre-wrap break-all">
            {content}
        </span>
    );
  };

  return (
    <div 
      className={`flex-1 overflow-y-auto p-4 font-mono text-sm leading-6 relative outline-none cursor-text ${isFocused ? '' : 'opacity-90'}`}
      style={{ backgroundColor: THEME.editorBg, color: THEME.textMain }}
      onClick={onFocus}
      tabIndex={0}
      onBlur={(e) => {
        // Only blur if relatedTarget is not inside the app (e.g. clicking sidebar shouldn't "fully" blur the hacking feel visually)
        // But for strict focus management:
        // onBlur(); 
        // Actually, we want to keep typing active as much as possible, 
        // so we might ignore blur or re-focus automatically if desired.
        // For this app, let's allow blur but show visual cue.
      }}
    >
      {!isFocused && (
        <div className="absolute top-2 right-4 text-xs bg-yellow-600 text-white px-2 py-1 rounded shadow opacity-80 z-10">
          Click to Focus
        </div>
      )}
      
      <div className="min-h-full">
         {/* Line Numbers Simulation - tough to sync perfectly with wrap, keeping it simple without line numbers for wrapping text or just simpler block */}
         {/* Actually, VS Code has line numbers. Let's try to add a simple gutter if we can. */}
         
         <div className="flex">
            {/* Gutter */}
            <div className="flex flex-col text-right pr-4 text-[#858585] select-none border-r border-[#444] mr-4 w-10">
                {content.split('\n').map((_, i) => (
                    <div key={i}>{i + 1}</div>
                ))}
                {/* Always show at least line 1 */}
                {content.length === 0 && <div>1</div>}
            </div>
            
            {/* Code */}
            <div className="flex-1 whitespace-pre font-mono">
                {content}
                {isFocused && <span className="inline-block w-[2px] h-[1.2em] bg-white align-text-bottom ml-[1px] cursor-blink"></span>}
            </div>
         </div>
         <div ref={bottomRef} />
      </div>
    </div>
  );
};