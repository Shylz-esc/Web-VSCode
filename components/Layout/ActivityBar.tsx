import React from 'react';
import { Files, Search, GitBranch, Bug, Blocks, Settings, UserCircle } from 'lucide-react';
import { THEME } from '../../constants';

const ActivityIcon = ({ icon: Icon, active = false }: { icon: React.ElementType, active?: boolean }) => (
  <div 
    className={`p-3 cursor-pointer relative ${active ? 'text-white' : 'text-[#858585] hover:text-white'}`}
  >
    {active && (
      <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ backgroundColor: THEME.accent }} />
    )}
    <Icon size={24} strokeWidth={1.5} />
  </div>
);

export const ActivityBar: React.FC = () => {
  return (
    <div 
      className="w-[48px] flex flex-col justify-between items-center py-2"
      style={{ backgroundColor: THEME.activityBar }}
    >
      <div className="flex flex-col items-center">
        <ActivityIcon icon={Files} active />
        <ActivityIcon icon={Search} />
        <ActivityIcon icon={GitBranch} />
        <ActivityIcon icon={Bug} />
        <ActivityIcon icon={Blocks} />
      </div>
      <div className="flex flex-col items-center">
        <ActivityIcon icon={UserCircle} />
        <ActivityIcon icon={Settings} />
      </div>
    </div>
  );
};