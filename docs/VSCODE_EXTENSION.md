# Guia para Extensão do VS Code

## Visão Geral

Converter o Pixel Lab em uma extensão do VS Code significa incorporar o frontend como um **Webview Panel** dentro do VS Code, substituindo o servidor Express pelo **Extension Host** do VS Code, que se comunica diretamente com o webview.

## Arquitetura

```
┌──────────────────────────────────────────┐
│         Extensão do VS Code              │
│                                          │
│  ┌────────────┐    ┌──────────────────┐  │
│  │ Extension  │◄──►│ Webview Panel    │  │
│  │ Host       │    │ (UI do Pixel)    │  │
│  │ (Node.js)  │    │ (HTML/JS)        │  │
│  └────────────┘    └──────────────────┘  │
│        │                                 │
│  ┌──────────────────────────────┐        │
│  │ Descoberta de Sessão         │        │
│  │ (adapters de server/)        │        │
│  └──────────────────────────────┘        │
└──────────────────────────────────────────┘
```

## Roteiro Passo a Passo

### 1. Criar o esqueleto da extensão

```bash
npx -y yo generator-code
```

Escolha "New Extension (TypeScript)" ou JavaScript. Isso criará o `package.json` com `activationEvents`, `contributes`, etc.

### 2. Adicionar o comando para o Painel Webview

No `package.json`:

```json
{
  "contributes": {
    "commands": [
      {
        "command": "pixelLab.open",
        "title": "Abrir Pixel Lab"
      }
    ]
  }
}
```

### 3. Criar o Webview

```typescript
const panel = vscode.window.createWebviewPanel(
  "pixelLab",
  "Pixel Lab",
  vscode.ViewColumn.Two,
  {
    enableScripts: true,
    retainContextWhenHidden: true,
    localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, "public")],
  },
);

// Carregar o HTML existente
panel.webview.html = getWebviewContent(context, panel.webview);
```

### 4. Substituir WebSocket por passagem de mensagens

**Extensão → Webview:**

```typescript
panel.webview.postMessage({ type: "snapshot", data: payload });
```

**Webview → Extensão:**

```typescript
// No JS do webview (substitui o connectSocket)
const vscode = acquireVsCodeApi();
window.addEventListener("message", (event) => {
  if (event.data.type === "snapshot") {
    state.snapshot = event.data.data;
    renderDashboard();
  }
});
```

### 5. Reutilizar a camada de adapters

Os arquivos de adapter (`server/lib/adapters/`) funcionam em Node.js e podem ser importados diretamente no host da extensão. A lógica do bridge em `server/index.js` torna-se o loop principal de polling da extensão.

### 6. Caminhos de assets

Converta as URLs de assets para URIs do webview:

```typescript
const assetUri = panel.webview.asWebviewUri(
  vscode.Uri.joinPath(
    context.extensionUri,
    "public",
    "assets",
    "floors",
    "floor_1.png",
  ),
);
```

### 7. Publicação

```bash
npx -y @vscode/vsce package
npx -y @vscode/vsce publish
```

## Considerações Chave

| Área          | Web App            | Extensão VS Code         |
| ------------- | ------------------ | ------------------------ |
| Transporte    | WebSocket          | API `postMessage`        |
| Servidor      | Express + HTTP     | Extension Host (Node.js) |
| Assets        | Arquivos estáticos | `webview.asWebviewUri()` |
| Armazenamento | localStorage       | `context.globalState`    |
| Inicialização | `npm run dev`      | Ativação da extensão     |

## Esforço Estimado

- **Pequeno**: 2 a 3 dias se mantiver exatamente a mesma interface.
- **Médio**: 1 semana se adicionar integração nativa com a barra lateral do VS Code.
- **Grande**: 2+ semanas para barra lateral completa + barra de status + temas nativos do VS Code.
