import * as vscode from 'vscode';

// Store active Gemini CLI terminals
const geminiTerminals = new Map<string, vscode.Terminal>();

function createOrFocusTerminal(context: vscode.ExtensionContext, location: vscode.TerminalOptions['location']) {
    const key = (location as any)?.viewColumn === vscode.ViewColumn.Beside ? 'newPane' : 'activePane';
    
    // Check if terminal exists and is still active
    const existingTerminal = geminiTerminals.get(key);
    if (existingTerminal) {
        // Check if terminal is still alive
        const allTerminals = vscode.window.terminals;
        if (allTerminals.includes(existingTerminal)) {
            existingTerminal.show();
            return;
        } else {
            // Terminal was closed, remove from map
            geminiTerminals.delete(key);
        }
    }
    
    // Create new terminal
    const iconPath = vscode.Uri.joinPath(context.extensionUri, 'images', 'icon.png');
    const terminal = vscode.window.createTerminal({
        name: `Gemini CLI`,
        location: location,
        iconPath: iconPath
    });
    
    // Store the new terminal
    geminiTerminals.set(key, terminal);
    
    // Navigate to workspace folder if available
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (workspaceFolder) {
        const workspacePath = workspaceFolder.uri.fsPath;
        // Use quotes to handle paths with spaces
        terminal.sendText(`cd "${workspacePath}"`);
    }
    
    // Launch Gemini CLI
    terminal.sendText("gemini");
    terminal.show();
}

export function activate(context: vscode.ExtensionContext) {
    
    let startInNewPane = vscode.commands.registerCommand('gemini-cli-vscode.startInNewPane', () => {
        createOrFocusTerminal(context, { viewColumn: vscode.ViewColumn.Beside });
    });
    
    let startInActivePane = vscode.commands.registerCommand('gemini-cli-vscode.startInActivePane', () => {
        createOrFocusTerminal(context, { viewColumn: vscode.ViewColumn.Active });
    });
    
    // Clean up terminals map when terminals are closed
    vscode.window.onDidCloseTerminal((terminal) => {
        geminiTerminals.forEach((value, key) => {
            if (value === terminal) {
                geminiTerminals.delete(key);
            }
        });
    });
    
    context.subscriptions.push(startInNewPane, startInActivePane);
}

export function deactivate() {
    // Clear terminals map on deactivation
    geminiTerminals.clear();
}