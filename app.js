/* ══════════════════════════════════════════════
   LOADING SCREEN — dispara após assets carregarem
═══════════════════════════════════════════════ */
window.addEventListener('load', () => {
  const screen = document.getElementById('loading-screen');
  const page   = document.getElementById('main-page');

  // Aguarda a barra de progresso (~2.7s) antes de sumir
  setTimeout(() => {
    screen.classList.add('fade-out');
    page.classList.add('visible');
  }, 2800);
});

/* ══════════════════════════════════════════════
   MENSAGENS ROTATIVAS DO PROCESSAMENTO
═══════════════════════════════════════════════ */
const MSGS = [
  'Lendo a prestação de contas do condomínio.',
  'Identificando receitas e despesas do mês.',
  'Organizando os dados financeiros.',
  'Redigindo o comunicado para os moradores.',
  'Revisando tom e clareza do texto.',
  'Finalizando e preparando o documento Word.',
];

/* ══════════════════════════════════════════════
   REFERÊNCIAS DOM
═══════════════════════════════════════════════ */
const fileInput  = document.getElementById('file-input');
const uploadZone = document.getElementById('upload-zone');
const filePill   = document.getElementById('file-pill');
const fpName     = document.getElementById('fp-name');
const fpSize     = document.getElementById('fp-size');
const fpRm       = document.getElementById('fp-rm');
const btnSend    = document.getElementById('btn-send');
const errMsg     = document.getElementById('err-msg');
const stUpload   = document.getElementById('state-upload');
const stProc     = document.getElementById('state-processing');
const stSuc      = document.getElementById('state-success');
const procMsg    = document.getElementById('proc-msg');
const btnNovo    = document.getElementById('btn-novo');

let file     = null;
let msgTimer = null;

/* ══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function fmt(b) {
  return b < 1048576
    ? (b / 1024).toFixed(0) + ' KB'
    : (b / 1048576).toFixed(1) + ' MB';
}

function showErr(msg) {
  errMsg.textContent = msg;
  errMsg.classList.add('show');
}

function hideErr() {
  errMsg.classList.remove('show');
}

function selectFile(f) {
  file = f;
  fpName.textContent = f.name;
  fpSize.textContent = fmt(f.size);
  filePill.classList.add('show');
  btnSend.classList.add('show');
  hideErr();
  setTimeout(() => {
    btnSend.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

function clearFile() {
  file = null;
  fileInput.value = '';
  filePill.classList.remove('show');
  btnSend.classList.remove('show');
  hideErr();
}

function showState(s) {
  stUpload.style.display = s === 'upload' ? ''     : 'none';
  stProc.style.display   = s === 'proc'   ? 'flex' : 'none';
  stProc.className       = s === 'proc'   ? 'show' : '';
  stSuc.style.display    = s === 'suc'    ? 'flex' : 'none';
  stSuc.className        = s === 'suc'    ? 'show' : '';
}

function startMsgs() {
  let i = 0;
  procMsg.textContent = MSGS[0];
  msgTimer = setInterval(() => {
    i = (i + 1) % MSGS.length;
    procMsg.style.opacity = '0';
    setTimeout(() => {
      procMsg.textContent   = MSGS[i];
      procMsg.style.opacity = '1';
    }, 300);
  }, 3200);
}

function toBase64(f) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result.split(',')[1]);
    r.onerror = () => rej(new Error('Falha ao ler o arquivo'));
    r.readAsDataURL(f);
  });
}

/* ══════════════════════════════════════════════
   EVENTOS DE UPLOAD
   iOS Safari fix: input fora do zone, ativado via click
═══════════════════════════════════════════════ */
uploadZone.addEventListener('click', (e) => {
  if (e.target === fileInput) return;
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  if (fileInput.files && fileInput.files[0]) selectFile(fileInput.files[0]);
});

uploadZone.addEventListener('dragover', e => {
  e.preventDefault();
  uploadZone.classList.add('drag');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('drag');
});

uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag');
  if (e.dataTransfer.files[0]) selectFile(e.dataTransfer.files[0]);
});

fpRm.addEventListener('click', (e) => {
  e.stopPropagation();
  clearFile();
});

/* ══════════════════════════════════════════════
   ENVIO
═══════════════════════════════════════════════ */
btnSend.addEventListener('click', async () => {
  if (!file) return;
  hideErr();

  if (file.size > 20 * 1024 * 1024) {
    showErr('Arquivo muito grande. O limite é 20 MB.');
    return;
  }

  showState('proc');
  startMsgs();

  try {
    const base64 = await toBase64(file);

    const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName : file.name,
        fileData : base64,
        fileType : file.type || 'application/pdf',
        timestamp: new Date().toLocaleString('pt-BR'),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Erro no servidor');
    }

    clearInterval(msgTimer);
    showState('suc');

  } catch (err) {
    clearInterval(msgTimer);
    console.error('Erro ao enviar:', err);
    showErr('Não foi possível enviar. Tente novamente.');
    showState('upload');
  }
});

/* ══════════════════════════════════════════════
   NOVO ENVIO
═══════════════════════════════════════════════ */
btnNovo.addEventListener('click', () => {
  clearFile();
  showState('upload');
});
