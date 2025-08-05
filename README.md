# Gemini CLI on VSCode

Run the Gemini CLI seamlessly within your Visual Studio Code environment.

This extension provides a convenient way to launch the Gemini CLI directly in a VSCode terminal, either in the active pane or in a new pane to the side.

## Features

*   **Launch Gemini CLI with a single click:** An icon in the editor title bar allows you to instantly open a new terminal running the Gemini CLI.
*   **Flexible Layout:**
    *   Open in a new pane (`gemini-cli-vscode.startInNewPane`) to keep your current editor layout intact.
    *   Open in the active pane (`gemini-cli-vscode.startInActivePane`) for quick access in your current context.
*   **Command Palette Integration:** Access both launch commands directly from the VSCode Command Palette.

## Prerequisites

You must have the Gemini CLI (`gemini`) installed and configured on your system and available in your system's PATH.

## How to Use

1.  **Click the Sparkle Icon:** Click the `$(sparkle)` icon in the top-right of any editor pane to launch the Gemini CLI in a new pane.
2.  **Use the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`):
    *   Search for `Gemini CLI: Start in New Pane` to open it in a split view.
    *   Search for `Gemini CLI: Start in Active Pane` to open it as a new tab in the current pane.

## Development / Installation from Source

If you wish to contribute to this extension or install it directly from source, follow these steps:

### Development Prerequisites

*   Node.js (LTS version recommended)
*   npm (Node Package Manager)
*   Git

### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/d3j/gemini-cli-on-vscode.git
    ```
2.  **Navigate into the project directory:**
    ```bash
    cd gemini-cli-on-vscode
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Compile the TypeScript code:**
    ```bash
    npm run compile
    ```
5.  **Run in VSCode:**
    *   Open the project folder in Visual Studio Code.
    *   Press `F5` to start a debugging session. A new VSCode window (Extension Development Host) will open with the extension enabled.

## Author

Joji Jorge Senda (d3j)
