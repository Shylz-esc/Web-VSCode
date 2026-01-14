# Visual Studio Code Simulator

This project is a highly realistic web-based simulator of the **Visual Studio Code** interface. It functions as a "Hacker Typer" application, allowing users to simulate the experience of writing complex code at high speed simply by pressing random keys.

## 🚀 Features

- **Realistic UI**: Meticulously recreated "Dark+" theme, including the Activity Bar, Sidebar, Status Bar, and Tab system.
- **Hacker Typer Logic**: Type any key on your keyboard, and the editor will output valid, pre-written code character by character.
- **File System**: Includes a simulated file structure with realistic demo files (React/JavaScript, CSS, JSON).
- **Custom Imports**: Upload your own text files (`.txt`, `.js`, `.py`, etc.) to "write" your own code content.
- **Immersive Mode**: Includes a full-screen toggle to hide browser UI for a convincing desktop application look.

## 📖 How to Use

### 1. Start Coding
Click anywhere in the main black editor area to focus it. Start typing on your physical keyboard (any keys will do). The simulator will automatically generate code from the currently selected file.

### 2. Navigate Files
Use the **Explorer** in the left sidebar to switch between different files (e.g., `App.js`, `global.css`). Switching files resets the typing progress for that file.

### 3. Import Your Own Code
1. Click the blue **Import File** button at the bottom of the Sidebar.
2. Select a text-based file from your computer.
3. The file will appear in the Explorer. Click it to open, then start typing to reveal its contents.

### 4. Full Screen
Click the square **Maximize** icon in the top-right corner of the window title bar to enter browser full-screen mode. This hides the URL bar and tabs for a more authentic experience.

## 🛠 Tech Stack

- **React 19**: Component-based UI architecture.
- **Tailwind CSS**: Utility-first styling for layout and theming.
- **Lucide React**: Crisp, pixel-perfect icons.
- **TypeScript**: Type-safe development.
