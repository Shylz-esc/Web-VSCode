import { FileNode } from './types';

export const INITIAL_FILES: FileNode[] = [
  {
    id: 'root',
    name: 'project-v1',
    type: 'folder',
    isOpen: true,
    children: [
      {
        id: '1',
        name: 'App.js',
        type: 'file',
        language: 'javascript',
        content: `import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from './router';
import { StoreProvider } from './store';
import { ThemeContext } from './theme';

/**
 * Main Application Entry Point
 * Handles initialization of core services and renders the React root.
 */
function Application() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate async initialization of services
    const initServices = async () => {
      try {
        console.log('Starting system check...');
        await Logger.init();
        await Network.connect({ timeout: 5000 });
        await Database.sync();
        setIsReady(true);
      } catch (err) {
        console.error('Initialization failed', err);
        setError(err);
      }
    };

    initServices();
  }, []);

  if (error) {
    return <ErrorFallback error={error} />;
  }

  if (!isReady) {
    return <LoadingSpinner size="large" message="Booting up..." />;
  }

  return (
    <StoreProvider>
      <ThemeContext.Provider value="dark">
        <Router />
      </ThemeContext.Provider>
    </StoreProvider>
  );
}

// Mount the application
const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<Application />);
}

// Performance monitoring
const reportWebVitals = (metric) => {
  if (metric.label === 'web-vital') {
    console.log(metric); // Log to console
    // navigator.sendBeacon('/analytics', JSON.stringify(metric));
  }
};`
      },
      {
        id: '2',
        name: 'global.css',
        type: 'file',
        language: 'css',
        content: `:root {
  --primary-color: #007acc;
  --bg-color: #1e1e1e;
  --text-color: #cccccc;
  --sidebar-bg: #252526;
  --font-stack: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --spacing-unit: 8px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: var(--font-stack);
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

.layout-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  height: 100vh;
}

.sidebar {
  background-color: var(--sidebar-bg);
  padding: 1rem;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
}

.main-content {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

/* Typography */
h1, h2, h3 {
  font-weight: 500;
  color: #fff;
}

code {
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}`
      },
      {
        id: '3',
        name: 'config.json',
        type: 'file',
        language: 'json',
        content: `{
  "app": {
    "name": "Enterprise Dashboard",
    "version": "2.4.0-beta",
    "environment": "production",
    "debugMode": false
  },
  "features": {
    "darkMode": true,
    "cloudSync": true,
    "analytics": {
      "enabled": true,
      "sampleRate": 0.5
    },
    "experimental": {
      "newEditor": false,
      "gpuAcceleration": true
    }
  },
  "api": {
    "endpoint": "https://api.internal-system.com/v2",
    "timeout": 5000,
    "retries": 3,
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer ${Date.now().toString(36)}"
    }
  },
  "users": [
    { "id": 1, "role": "admin", "active": true },
    { "id": 2, "role": "editor", "active": true },
    { "id": 3, "role": "viewer", "active": false }
  ]
}`
      }
    ]
  }
];

export const THEME = {
  bg: '#1e1e1e', // Main background
  sidebar: '#252526',
  activityBar: '#333333',
  titleBar: '#323233',
  statusBar: '#007acc',
  editorBg: '#1e1e1e',
  textMain: '#cccccc',
  textMuted: '#858585',
  border: '#454545',
  accent: '#007acc',
  selection: '#37373d',
  hover: '#2a2d2e',
};