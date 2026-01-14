import React, { useState, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { THEME } from '../../constants';

export const TitleBar: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div 
      className="h-[30px] flex items-center justify-between px-2 text-xs select-none"
      style={{ backgroundColor: THEME.titleBar }}
    >
      <div className="flex items-center space-x-2 ml-2">
        <img 
            src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" 
            alt="Logo" 
            className="w-4 h-4"
        />
        <div className="flex space-x-4 ml-2 text-[#cccccc]">
          <span className="cursor-default hover:bg-[#ffffff1a] px-1 rounded-sm">File</span>
          <span className="cursor-default hover:bg-[#ffffff1a] px-1 rounded-sm">Edit</span>
          <span className="cursor-default hover:bg-[#ffffff1a] px-1 rounded-sm">Selection</span>
          <span className="cursor-default hover:bg-[#ffffff1a] px-1 rounded-sm">View</span>
          <span className="cursor-default hover:bg-[#ffffff1a] px-1 rounded-sm">Go</span>
          <span className="cursor-default hover:bg-[#ffffff1a] px-1 rounded-sm">Run</span>
          <span className="cursor-default hover:bg-[#ffffff1a] px-1 rounded-sm">Terminal</span>
          <span className="cursor-default hover:bg-[#ffffff1a] px-1 rounded-sm">Help</span>
        </div>
      </div>
      
      <div className="text-[#999999] text-xs">
        Visual Studio Code
      </div>
      
      <div className="flex items-center mr-1">
        <div 
          className="flex items-center justify-center w-[46px] h-[30px] hover:bg-[#ffffff1a] cursor-pointer"
          onClick={toggleFullScreen}
          title={isFullscreen ? "Exit Full Screen" : "Toggle Full Screen"}
        >
          {isFullscreen ? (
            <Minimize size={14} className="text-[#cccccc]" strokeWidth={1.5} />
          ) : (
            <Maximize size={14} className="text-[#cccccc]" strokeWidth={1.5} />
          )}
        </div>
      </div>
    </div>
  );
};