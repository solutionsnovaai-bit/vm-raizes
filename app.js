/* ═══════════════════════════════════════════════════
   RAÍZES VILA MATILDE — Portal do Síndico
   app.js · Nova IA Solutions
═══════════════════════════════════════════════════ */

/* ─────────────────────────────
   1. CANVAS DE PARTÍCULAS — LOADING SCREEN
───────────────────────────── */
(function initLoadingCanvas() {
  const canvas = document.getElementById('ls-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // partículas douradas flutuantes
  const PARTICLE_COUNT = 55;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x:    Math.random() * canvas.width,
    y:    Math.random() * canvas.height,
    r:    Math.random() * 1.4 + 0.3,
    vx:   (Math.random() - 0.5) * 0.25,
    vy:   (Math.random() - 0.5) * 0.25,
    a:    Math.random(),
    da:   (Math.random() - 0.5) * 0.004,
  }));

  let raf;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x  += p.vx; p.y += p.vy;
      p.a  += p.da;
      if (p.a < 0) { p.a = 0; p.da *= -1; }
      if (p.a > 1) { p.a = 1; p.da *= -1; }
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(181,160,122,${p.a * 0.6})`;
      ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  }
  draw();

  // para o canvas quando o loading sumir para não gastar CPU
  document.getElementById('loading-screen')
    .addEventListener('transitionend', () => {
      cancelAnimationFrame(raf);
      canvas.remove();
    }, { once: true });
})();

/* ─────────────────────────────
   2. CANVAS ANIMADO — BACKGROUND DA PÁGINA
───────────────────────────── */
(function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // orbes que se movem suavemente
  const orbs = [
    { x: 0.82, y: 0.08, r: 0.38, color: '61,74,82',    a: 0.055, vx: 0.00018, vy: 0.00010 },
    { x: 0.08, y: 0.88, r: 0.30, color: '181,160,122', a: 0.065, vx:-0.00012, vy:-0.00015 },
    { x: 0.50, y: 0.45, r: 0.22, color: '61,74,82',    a: 0.025, vx: 0.00008, vy: 0.00020 },
  ];

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;

    orbs.forEach(o => {
      o.x += o.vx; o.y += o.vy;
      // bounce suave nas bordas
      if (o.x < 0.1 || o.x > 0.9) o.vx *= -1;
      if (o.y < 0.1 || o.y > 0.9) o.vy *= -1;

      const cx = o.x * W, cy = o.y * H;
      const radius = o.r * Math.min(W, H);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0,   `rgba(${o.color},${o.a})`);
      grad.addColorStop(0.6, `rgba(${o.color},${o.a * 0.4})`);
      grad.addColorStop(1,   `rgba(${o.color},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────
   3. LOADING → PÁGINA (timing)
───────────────────────────── */
window.addEventListener('load', () => {
  const ls   = document.getElementById('loading-screen');
  const page = document.getElementById('main-page');

  // a barra CSS leva ~3.5s (1.2s delay + 2.2s animation)
  setTimeout(() => {
    ls.classList.add('fade-out');
    page.classList.add('visible');
  }, 3500);
});

/* ─────────────────────────────
   4. MENSAGENS ROTATIVAS
───────────────────────────── */
const MSGS = [
  'Lendo o documento enviado.',
  'Identificando as informações relevantes.',
  'Organizando os dados do arquivo.',
  'Redigindo o comunicado para os moradores.',
  'Revisando tom e clareza do texto.',
  'Finalizando e preparando o documento Word.',
];

/* ─────────────────────────────
   5. REFERÊNCIAS DOM
───────────────────────────── */
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

/* ─────────────────────────────
   6. HELPERS
───────────────────────────── */
function fmtSize(bytes) {
  return bytes < 1_048_576
    ? (bytes / 1024).toFixed(0) + ' KB'
    : (bytes / 1_048_576).toFixed(1) + ' MB';
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
  fpSize.textContent = fmtSize(f.size);
  filePill.classList.add('show');
  btnSend.classList.add('show');
  hideErr();
  setTimeout(() => btnSend.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
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
    const reader = new FileReader();
    reader.onload  = () => res(reader.result.split(',')[1]);
    reader.onerror = () => rej(new Error('Falha ao ler o arquivo'));
    reader.readAsDataURL(f);
  });
}

/* ─────────────────────────────
   7. EVENTOS DE UPLOAD
   iOS Safari fix: input fora do zone, aberto via .click()
───────────────────────────── */
uploadZone.addEventListener('click', (e) => {
  if (e.target === fileInput) return;
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  if (fileInput.files?.[0]) selectFile(fileInput.files[0]);
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

fpRm.addEventListener('click', e => {
  e.stopPropagation();
  clearFile();
});

/* ─────────────────────────────
   8. ENVIO
───────────────────────────── */
btnSend.addEventListener('click', async () => {
  if (!file) return;
  hideErr();

  if (file.size > 4.5 * 1024 * 1024) {
    showErr('Arquivo muito grande. O limite é 4,5 MB.');
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

/* ─────────────────────────────
   9. NOVO ENVIO
───────────────────────────── */
btnNovo.addEventListener('click', () => {
  clearFile();
  showState('upload');
});
