const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { PixelLabBridge } = require('./bridge');

class PixelLabSidebarProvider {
  constructor(extensionUri, context) {
    this._extensionUri = extensionUri;
    this._context = context;
    this._view = undefined;
    this._bridge = undefined;
  }

  resolveWebviewView(webviewView, context, token) {
    this._view = webviewView;
    this._bridge = new PixelLabBridge(webviewView);

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, 'media')
      ]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(data => {
      switch (data.type) {
        case 'connect':
          this._bridge.connectToWorkspace(data.workspacePath || '');
          break;
        case 'setIde':
          this._bridge.switchIde(data.ide);
          break;
        case 'ready':
          this._bridge.broadcast();
          break;
        case 'open-terminal':
          const terminal = vscode.window.createTerminal('Gemini Agent');
          terminal.show();
          terminal.sendText('gemini');
          setTimeout(() => this._bridge.broadcast(), 500); 
          break;
        case 'open-sub-agent':
          const subTerminal = vscode.window.createTerminal('Gemini Sub-Agent');
          // Não chamar subTerminal.show() para que rode silenciosamente no fundo
          subTerminal.sendText('gemini "Atue como um sub-agente supervisor. Analise o projeto atual, monitore a tarefa que o agente principal (CLI) está trabalhando ou construindo, e ativamente procure e corrija quaisquer erros ou problemas. Trabalhe silenciosamente no background."');
          vscode.window.showInformationMessage("Sub-Agent Helper iniciado no background.");
          setTimeout(() => this._bridge.broadcast(), 500);
          break;
      }
    });

    webviewView.onDidDispose(() => {
      if (this._bridge) this._bridge.dispose();
    });

    this._bridge.boot();
  }

  _getHtmlForWebview(webview) {
    const mediaUri = vscode.Uri.joinPath(this._extensionUri, 'media');
    
    const stylesUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaUri, 'styles.css'));
    const appJsUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaUri, 'app.js'));
    const baseUri = webview.asWebviewUri(mediaUri);

    // Ler index.html
    let html = fs.readFileSync(path.join(this._extensionUri.fsPath, 'media', 'index.html'), 'utf8');

    // Nonce para segurança
    const nonce = getNonce();

    // CSP tag - Igual ao webview-provider mas adaptado
    const csp = [
      `default-src 'none'`,
      `img-src ${webview.cspSource} https: data:`,
      `style-src ${webview.cspSource} 'unsafe-inline' https://fonts.googleapis.com`,
      `font-src ${webview.cspSource} https://fonts.gstatic.com`,
      `script-src ${webview.cspSource} 'nonce-${nonce}'`,
      `connect-src ${webview.cspSource}`
    ].join('; ');

    // Substituições
    html = html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}">\n    <base href="${baseUri}/">`);
    html = html.replace('<link rel="stylesheet" href="/styles.css" />', `<link rel="stylesheet" href="${stylesUri}" />`);
    html = html.replace('<script type="module" src="/app.js"></script>', `<script type="module" src="${appJsUri}"></script>`);

    const bridgeScript = `
    <script nonce="${nonce}">
      (function() {
        const vscodeApi = acquireVsCodeApi();
        window.__PIXEL_LAB_VSCODE__ = true;
        window.__PIXEL_LAB_POST = function(msg) { vscodeApi.postMessage(msg); };
        window.addEventListener('message', function(event) {
          const message = event.data;
          if (message.type === 'snapshot' && window.__PIXEL_LAB_ON_SNAPSHOT__) {
            window.__PIXEL_LAB_ON_SNAPSHOT__(message.data);
          }
        });
        vscodeApi.postMessage({ type: 'ready' });
      })();
    </script>`;

    html = html.replace('</head>', `${bridgeScript}\n  </head>`);

    // Sidebar costuma ser mais estreita, então podemos injetar um CSS extra para mobile-first ou scale
    const sidebarFixCss = `<style nonce="${nonce}">
      body { padding: 0 !important; }
      .hud { padding: 8px !important; flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
      .brand { margin-bottom: 4px !important; }
      .hud-chips { flex-wrap: wrap !important; }
      .playground { padding: 4px !important; }
      .info-rail { display: flex !important; flex-direction: column !important; }
      canvas { max-width: 100% !important; }
    </style>`;

    html = html.replace('</head>', `${sidebarFixCss}\n  </head>`);

    return html;
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

module.exports = { PixelLabSidebarProvider };
