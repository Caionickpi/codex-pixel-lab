const vscode = require('vscode');
const { PixelLabPanel } = require('./webview-provider');
const { PixelLabSidebarProvider } = require('./sidebar-provider');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Pixel Lab extension activated');

  // Register Sidebar
  const sidebarProvider = new PixelLabSidebarProvider(context.extensionUri, context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('pixelLab.sidebar', sidebarProvider)
  );

  const openCommand = vscode.commands.registerCommand('pixelLab.open', () => {
    PixelLabPanel.createOrShow(context.extensionUri, context);
  });

  context.subscriptions.push(openCommand);

  // Se já existia um painel aberto, restaurá-lo
  if (vscode.window.registerWebviewPanelSerializer) {
    vscode.window.registerWebviewPanelSerializer(PixelLabPanel.viewType, {
      async deserializeWebviewPanel(panel) {
        PixelLabPanel.revive(panel, context.extensionUri, context);
      },
    });
  }
}

function deactivate() {
  console.log('Pixel Lab extension deactivated');
}

module.exports = { activate, deactivate };
