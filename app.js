// ─────────────────────────────────────────────
// SEM CONFIGURAÇÃO NECESSÁRIA AQUI
// As credenciais ficam nas variáveis de ambiente do Vercel
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// CANVAS BACKGROUND — Grade animada
// ─────────────────────────────────────────────
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, points = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildPoints();
  }

  function buildPoints() {
    points = [];
    const cols = Math.ceil(W / 80);
    const rows = Math.ceil(H / 80);
    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        points.push({
          x: i * 80, y: j * 80,
          ox: i * 80, oy: j * 80,
          vx: (Math.random() - .5) * .3,
          vy: (Math.random() - .5) * .3,
          r: Math.random() * 2 + 1,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    const time = t * 0.0005;

    points.forEach(p => {
      p.x = p.ox + Math.sin(time + p.phase) * 18;
      p.y = p.oy + Math.cos(time * .7 + p.phase) * 14;
    });

    // Linhas entre pontos próximos
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 120) {
          const alpha = (1 - d/120) * 0.35;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.strokeStyle = `rgba(58,181,160,${alpha})`;
          ctx.lineWidth   = .5;
          ctx.stroke();
        }
      }
    }

    // Pontos
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * .8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(58,181,160,0.5)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();

// ─────────────────────────────────────────────
// PARTÍCULAS FLUTUANTES
// ─────────────────────────────────────────────
(function initParticles() {
  const container = document.getElementById('particles');
  const colors = ['rgba(58,181,160,', 'rgba(201,168,76,', 'rgba(93,212,190,'];

  function createParticle() {
    const el = document.createElement('div');
    el.className = 'particle';
    const size = Math.random() * 3 + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const opacity = Math.random() * 0.4 + 0.1;
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * 15;
    const left = Math.random() * 100;

    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      background: ${color}${opacity});
      box-shadow: 0 0 ${size * 2}px ${color}0.3);
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    container.appendChild(el);

    setTimeout(() => el.remove(), (duration + delay) * 1000);
  }

  // Cria partículas iniciais
  for (let i = 0; i < 20; i++) createParticle();
  // Cria novas periodicamente
  setInterval(createParticle, 800);
})();

// ─────────────────────────────────────────────
// MENSAGENS ROTATIVAS
// ─────────────────────────────────────────────
const MSGS = [
  'Lendo a prestação de contas do condomínio.',
  'Identificando receitas e despesas do mês.',
  'Organizando os dados financeiros.',
  'Redigindo o comunicado para os moradores.',
  'Revisando tom e clareza do texto.',
  'Finalizando e preparando o documento Word.',
];

// ─────────────────────────────────────────────
// ELEMENTOS DOM
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function fmt(b) {
  return b < 1048576
    ? (b / 1024).toFixed(0) + ' KB'
    : (b / 1048576).toFixed(1) + ' MB';
}
function showErr(msg) { errMsg.textContent = msg; errMsg.classList.add('show'); }
function hideErr()    { errMsg.classList.remove('show'); }

function selectFile(f) {
  file = f;
  fpName.textContent = f.name;
  fpSize.textContent = fmt(f.size);
  filePill.classList.add('show');
  btnSend.classList.add('show');
  hideErr();
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
    }, 400);
  }, 3200);
}

// ─────────────────────────────────────────────
// CONVERTE PARA BASE64
// ─────────────────────────────────────────────
function toBase64(f) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result.split(',')[1]);
    r.onerror = () => rej(new Error('Falha ao ler arquivo'));
    r.readAsDataURL(f);
  });
}

// ─────────────────────────────────────────────
// EVENTOS DE UPLOAD
// ─────────────────────────────────────────────
fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) selectFile(fileInput.files[0]);
});

uploadZone.addEventListener('dragover', e => {
  e.preventDefault();
  uploadZone.classList.add('drag');
});
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag');
  if (e.dataTransfer.files[0]) selectFile(e.dataTransfer.files[0]);
});

fpRm.addEventListener('click', clearFile);

// ─────────────────────────────────────────────
// ENVIO
// ─────────────────────────────────────────────
btnSend.addEventListener('click', async () => {
  if (!file) return;
  hideErr();

  if (file.size > 20 * 1024 * 1024) {
    showErr('Arquivo muito grande. Máximo 20MB.');
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

    if (!res.ok) throw new Error('Erro no servidor');

    clearInterval(msgTimer);
    showState('suc');

  } catch (err) {
    clearInterval(msgTimer);
    console.error('Erro no envio:', err);
    showErr('Erro ao enviar. Tente novamente.');
    showState('upload');
  }
});

// ─────────────────────────────────────────────
// RESET
// ─────────────────────────────────────────────
btnNovo.addEventListener('click', () => {
  clearFile();
  showState('upload');
});
