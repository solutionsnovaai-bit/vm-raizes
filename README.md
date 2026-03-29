# Raízes VM — Portal do Síndico
## Deploy completo: GitHub + Vercel (sem EmailJS!)

---

## PASSO 1 — EMAILJS (envio do PDF)

### 1.1 Criar conta
- Acesse: https://www.emailjs.com/
- Crie conta gratuita com: **1022.almeida@gmail.com**

### 1.2 Adicionar serviço Gmail
- Painel → "Email Services" → "Add New Service" → Gmail
- Conecte com: **1022.almeida@gmail.com**
- Copie o **Service ID** (ex: service_abc123)

### 1.3 Criar template
- "Email Templates" → "Create New Template"
- Configure:
  - **To:** {{to_email}}
  - **From name:** Portal Raízes VM
  - **Subject:** 📋 Prestação de Contas — {{timestamp}}
  - **Body:** Nova prestação recebida. Arquivo: {{file_name}}. Recebido em: {{timestamp}}
  - **Attachment:** habilite → use {{file_data}} com nome {{file_name}}
- Salve e copie o **Template ID**

### 1.4 Copiar Public Key
- "Account" → "API Keys" → copie a **Public Key**

### 1.5 Colar no app.js (linhas 4-7)
```js
const EMAILJS_PUBLIC_KEY  = 'sua_public_key';
const EMAILJS_SERVICE_ID  = 'seu_service_id';
const EMAILJS_TEMPLATE_ID = 'seu_template_id';
const DESTINO_EMAIL       = 'vmraizes01@gmail.com'; // ← já correto
```

---

## PASSO 2 — GITHUB

### 2.1 Criar repositório
- Acesse: https://github.com/new
- Nome: `raizes-vm-portal`
- Visibilidade: **Public** (necessário para Vercel gratuito)
- Clique em "Create repository"

### 2.2 Subir os arquivos (pelo site do GitHub)
Na página do repositório criado, clique em **"uploading an existing file"** e arraste os 3 arquivos:
- `index.html`
- `style.css`
- `app.js`

Clique em "Commit changes".

---

## PASSO 3 — VERCEL

### 3.1 Deploy
- Acesse: https://vercel.com/
- Login com GitHub
- "Add New Project" → selecione `raizes-vm-portal`
- Clique em **Deploy** (sem configuração extra)

### 3.2 URL gerada
Algo como: `https://raizes-vm-portal.vercel.app`

✅ Qualquer push no GitHub faz re-deploy automático.

---

## PASSO 4 — MAKE (Gmail Watch)

O módulo Gmail deve monitorar: **vmraizes01@gmail.com**
- Filter: Only unread messages
- Sender filter: `1022.almeida@gmail.com` (emails do portal)

Fluxo: Gmail Watch → Gmail List Attachments → PDF.co → Google Gemini AI → Google Docs

---

## Estrutura de arquivos

```
raizes-portal/
├── index.html   — estrutura HTML
├── style.css    — visual animado
├── app.js       — canvas + partículas + upload + EmailJS
└── README.md    — este arquivo
```

## Suporte
WhatsApp: (11) 95100-7967 — Nova IA Solutions
