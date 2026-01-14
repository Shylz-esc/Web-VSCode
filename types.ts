export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string; // Only for files
  children?: FileNode[]; // Only for folders
  isOpen?: boolean;
  language?: string;
}

export interface EditorTab {
  id: string;
  fileId: string;
  name: string;
}

export interface ThemeColors {
  bg: string;
  sidebar: string;
  activityBar: string;
  titleBar: string;
  statusBar: string;
  editorBg: string;
  textMain: string;
  textMuted: string;
  border: string;
  accent: string;
}