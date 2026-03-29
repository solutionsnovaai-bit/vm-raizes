# Raízes VM — Portal do Síndico
## Setup completo em 3 passos

---

## 1. CONFIGURAR EMAILJS (serviço de envio gratuito)

O portal usa EmailJS pra enviar o PDF como anexo pro vmraizes01@gmail.com
sem precisar de backend próprio. É gratuito até 200 emails/mês.

### Passo 1 — Criar conta
- Acesse: https://www.emailjs.com/
- Crie uma conta gratuita com o email: 1022.almeida@gmail.com

### Passo 2 — Adicionar serviço Gmail
- No painel EmailJS → "Email Services" → "Add New Service"
- Escolha "Gmail"
- Conecte com a conta: 1022.almeida@gmail.com
- Copie o **Service ID** gerado (ex: service_abc123)

### Passo 3 — Criar template de email
- "Email Templates" → "Create New Template"
- Configure assim:

  **To email:** {{to_email}}
  **From name:** Portal Raízes VM
  **Subject:** 📋 Prestação de Contas — {{timestamp}}
  **Body (HTML):**
  ```
  Nova prestação de contas recebida pelo portal.
  Arquivo: {{file_name}}
  Recebido em: {{timestamp}}
  ```
  **Attachment:** habilite e use {{file_data}} com nome {{file_name}}

- Salve e copie o **Template ID** (ex: template_xyz456)

### Passo 4 — Copiar Public Key
- "Account" → "API Keys" → copie a **Public Key**

### Passo 5 — Colar no app.js
Abra o arquivo `app.js` e substitua:
```js
const EMAILJS_PUBLIC_KEY  = 'SUA_PUBLIC_KEY_AQUI';   // ← sua Public Key
const EMAILJS_SERVICE_ID  = 'SUA_SERVICE_ID_AQUI';   // ← seu Service ID
const EMAILJS_TEMPLATE_ID = 'SUA_TEMPLATE_ID_AQUI';  // ← seu Template ID
```

---

## 2. DEPLOY NO VERCEL

1. Suba os 3 arquivos pra um repositório GitHub:
   - index.html
   - style.css
   - app.js

2. Acesse: https://vercel.com/
3. "New Project" → importe o repositório
4. Deploy automático — sem configuração extra

URL final exemplo: https://raizes-vm-portal.vercel.app

---

## 3. CONFIGURAR MÓDULO 1 DO MAKE (Gmail Watch)

Após o portal estar no ar e o EmailJS configurado:

- O módulo Gmail Watch deve estar conectado ao vmraizes01@gmail.com
- Filter type: Simple filter
- Folder: Inbox
- Criteria: Only unread messages
- **Sender filter:** 1022.almeida@gmail.com
  (garante que só emails do portal disparam o fluxo)

---

## Estrutura de arquivos

```
raizes-portal/
├── index.html   — estrutura HTML da página
├── style.css    — todo o visual (paleta Raízes VM)
├── app.js       — lógica de upload e envio
└── README.md    — este arquivo
```

---

## Suporte técnico
WhatsApp: (11) 95100-7967 — Nova IA Solutions
