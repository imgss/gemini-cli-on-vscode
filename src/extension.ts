import * as vscode from 'vscode';

function createAndShowTerminal(context: vscode.ExtensionContext, location: vscode.TerminalOptions['location']) {
    const iconPath = vscode.Uri.joinPath(context.extensionUri, 'images', 'icon.png');
    const terminal = vscode.window.createTerminal({
        name: `Gemini CLI`,
        location: location,
        iconPath: iconPath
    });
    terminal.sendText("gemini\n");
    terminal.show();
}

export function activate(context: vscode.ExtensionContext) {

    let startInNewPane = vscode.commands.registerCommand('gemini-cli-vscode.startInNewPane', () => {
        createAndShowTerminal(context, { viewColumn: vscode.ViewColumn.Beside });
    });

    let startInActivePane = vscode.commands.registerCommand('gemini-cli-vscode.startInActivePane', () => {
        createAndShowTerminal(context, { viewColumn: vscode.ViewColumn.Active });
    });

    context.subscriptions.push(startInNewPane, startInActivePane);
}

export function deactivate() {}
