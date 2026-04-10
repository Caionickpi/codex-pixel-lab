const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { PixelLabBridge } = require('./bridge');

class PixelLabPanel {
  static viewType = 'pixelLab.panel';
  static currentPanel = undefined;

  /**
   * @param {vscode.Uri} extensionUri
   * @param {vscode.ExtensionContext} context
   */
  static createOrShow(extensionUri, context) {
    const column = vscode.ViewColumn.Beside;

    if (PixelLabPanel.currentPanel) {
      PixelLabPanel.currentPanel.panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      PixelLabPanel.viewType,
      'Pixel Lab',
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, 'media'),
        ],
      },
    );

    PixelLabPanel.currentPanel = new PixelLabPanel(panel, extensionUri, context);
  }

  static revive(panel, extensionUri, context) {
    PixelLabPanel.currentPanel = new PixelLabPanel(panel, extensionUri, context);
  }

  constructor(panel, extensionUri, context) {
    this.panel = panel;
    this.extensionUri = extensionUri;
    this.bridge = new PixelLabBridge(panel);

    // Definir o ícone
    this.panel.iconPath = {
      light: vscode.Uri.joinPath(extensionUri, 'media', 'assets', 'characters', 'char_0.png'),
      dark: vscode.Uri.joinPath(extensionUri, 'media', 'assets', 'characters', 'char_0.png'),
    };

    // Gerar o HTML do webview
    this.panel.webview.html = this.getWebviewContent();

    // Ouvir mensagens do webview
    this.panel.webview.onDidReceiveMessage(
      (message) => this.handleMessage(message),
      null,
      context.subscriptions,
    );

    // Quando o painel é fechado
    this.panel.onDidDispose(() => this.dispose(), null, context.subscriptions);

    // Iniciar o bridge
    this.bridge.boot();
  }

  handleMessage(message) {
    switch (message.type) {
      case 'connect':
        this.bridge.connectToWorkspace(message.workspacePath || '');
        break;
      case 'setIde':
        this.bridge.switchIde(message.ide);
        break;
      case 'ready':
        this.bridge.broadcast();
        break;
      case 'open-terminal':
        const terminal = vscode.window.createTerminal('Gemini Agent');
        terminal.show();
        terminal.sendText('gemini'); 
        setTimeout(() => this.bridge.broadcast(), 500);
        break;
      case 'open-sub-agent':
        const subTerminal = vscode.window.createTerminal('Gemini Sub-Agent');
        // Roda silenciosamente no background
        subTerminal.sendText('gemini "Atue como um sub-agente supervisor. Analise o projeto atual, monitore a tarefa que o agente principal (CLI) está trabalhando ou construindo, e ativamente procure e corrija quaisquer erros ou problemas. Trabalhe silenciosamente no background sem me pedir permissão."');
        vscode.window.showInformationMessage("Sub-Agent Helper iniciado no background.");
        setTimeout(() => this.bridge.broadcast(), 500);
        break;
    }
  }

  getWebviewContent() {
    const webview = this.panel.webview;
    const mediaUri = vscode.Uri.joinPath(this.extensionUri, 'media');

    // URIs para assets
    const stylesUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaUri, 'styles.css'));
    const appJsUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaUri, 'app.js'));
    const rpgJsUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaUri, 'rpg.js'));
    const upgradeArtJsUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaUri, 'upgrade-art.js'));
    const fontUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaUri, 'fonts', 'FSPixelSansUnicode-Regular.ttf'));

    // Ler o index.html original e adaptá-lo
    const originalHtml = fs.readFileSync(
      path.join(this.extensionUri.fsPath, 'media', 'index.html'), 'utf8'
    );

    // Nonce para segurança CSP
    const nonce = getNonce();

    // Base URI para assets relativos
    const baseUri = webview.asWebviewUri(mediaUri);

    // Substituir paths no HTML
    let html = originalHtml;

    // CSS e fontes
    html = html.replace(
      '<link rel="stylesheet" href="/styles.css" />',
      `<link rel="stylesheet" href="${stylesUri}" />`
    );
    html = html.replace(
      /href="https:\/\/fonts\.googleapis\.com[^"]*"/g,
      (match) => match // manter Google Fonts
    );

    // O webview VS Code lida mal com type="module" se CORS/MIME falhar,
    // mas com <base href> e asWebviewUri costuma funcionar. 
    html = html.replace(
      '<script type="module" src="/app.js"></script>',
      `<script type="module" src="${appJsUri}"></script>`
    );

    // CSP tag
    const csp = [
      `default-src 'none'`,
      `img-src ${webview.cspSource} https: data:`,
      `style-src ${webview.cspSource} 'unsafe-inline' https://fonts.googleapis.com`,
      `font-src ${webview.cspSource} https://fonts.gstatic.com`,
      `script-src ${webview.cspSource} 'nonce-${nonce}'`,
      `connect-src ${webview.cspSource}`
    ].join('; ');

    // Injetar base tag para resolver assets relativos (imagens, etc)
    html = html.replace(
      '<head>',
      `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}">\n    <base href="${baseUri}/">`
    );

    // Injetar bridge script para comunicação VS Code ↔ Webview
    const bridgeScript = `
    <script nonce="${nonce}">
      (function() {
        const vscodeApi = acquireVsCodeApi();

        // Substituir WebSocket por postMessage
        window.__PIXEL_LAB_VSCODE__ = true;
        window.__PIXEL_LAB_POST = function(msg) {
          vscodeApi.postMessage(msg);
        };

        // Receber snapshots do Extension Host
        window.addEventListener('message', function(event) {
          const message = event.data;
          if (message.type === 'snapshot' && window.__PIXEL_LAB_ON_SNAPSHOT__) {
            window.__PIXEL_LAB_ON_SNAPSHOT__(message.data);
          }
        });

        // Notificar que o webview está pronto
        vscodeApi.postMessage({ type: 'ready' });
      })();
    </script>`;

    html = html.replace('</head>', `${bridgeScript}\n  </head>`);

    return html;
  }

  dispose() {
    PixelLabPanel.currentPanel = undefined;
    this.bridge.dispose();
    this.panel.dispose();
  }
}

function getNonce() {
  let text = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}

module.exports = { PixelLabPanel };
