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

function sendOpenFilesToGemini() {
    // Find existing Gemini CLI terminal
    const terminal = geminiTerminals.get('newPane') || geminiTerminals.get('activePane');
    
    if (!terminal) {
        vscode.window.showWarningMessage('Gemini CLI is not running. Please start it first.');
        return;
    }
    
    // Check if terminal is still alive
    const allTerminals = vscode.window.terminals;
    if (!allTerminals.includes(terminal)) {
        vscode.window.showWarningMessage('Gemini CLI terminal was closed. Please start it again.');
        return;
    }
    
    // Get all open files
    const openFiles = vscode.window.tabGroups.all
        .flatMap(group => group.tabs)
        .filter(tab => tab.input instanceof vscode.TabInputText)
        .map(tab => {
            const uri = (tab.input as vscode.TabInputText).uri;
            return vscode.workspace.asRelativePath(uri);
        });
    
    if (openFiles.length === 0) {
        vscode.window.showInformationMessage('No files are currently open.');
        return;
    }
    
    // Send to terminal: Add files without executing
    // Show terminal first and wait a bit for focus
    terminal.show();
    
    // Small delay to ensure terminal is focused and ready
    setTimeout(() => {
        terminal.sendText(` @${openFiles.join(' @')} `, false);
    }, 100);
    
    vscode.window.showInformationMessage(`Sent ${openFiles.length} file(s) to Gemini CLI`);
}

export function activate(context: vscode.ExtensionContext) {
    
    let startInNewPane = vscode.commands.registerCommand('gemini-cli-vscode.startInNewPane', () => {
        createOrFocusTerminal(context, { viewColumn: vscode.ViewColumn.Beside });
    });
    
    let startInActivePane = vscode.commands.registerCommand('gemini-cli-vscode.startInActivePane', () => {
        createOrFocusTerminal(context, { viewColumn: vscode.ViewColumn.Active });
    });
    
    let sendOpenFiles = vscode.commands.registerCommand('gemini-cli-vscode.sendOpenFiles', () => {
        sendOpenFilesToGemini();
    });
    
    // Clean up terminals map when terminals are closed
    vscode.window.onDidCloseTerminal((terminal) => {
        geminiTerminals.forEach((value, key) => {
            if (value === terminal) {
                geminiTerminals.delete(key);
            }
        });
    });
    
    context.subscriptions.push(startInNewPane, startInActivePane, sendOpenFiles);
}

export function deactivate() {
    // Clear terminals map on deactivation
    geminiTerminals.clear();
}