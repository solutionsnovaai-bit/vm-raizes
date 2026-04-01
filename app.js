/* ═══════════════════════════════════════════════════
   RAÍZES VILA MATILDE — Portal do Síndico
   app.js · Nova IA Solutions
═══════════════════════════════════════════════════ */

/* ─────────────────────────────
   1. INJETAR SVG GRADIENT PARA O ANEL DE PROCESSAMENTO
───────────────────────────── */
(function injectSVGDefs() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  svg.innerHTML = `
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="#9b7e4e"/>
        <stop offset="50%"  stop-color="#e2c88a"/>
        <stop offset="100%" stop-color="#c8a96e"/>
      </linearGradient>
    </defs>`;
  document.body.prepend(svg);
})();

/* ─────────────────────────────
   2. CANVAS DE PARTÍCULAS — LOADING SCREEN
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

  // dois tipos: estrelas finas e linhas flutuantes
  const STARS = Array.from({ length: 80 }, () => ({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    r:  Math.random() * 1.0 + 0.2,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    a:  Math.random(),
    da: (Math.random() - 0.5) * 0.003,
  }));

  let raf;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    STARS.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.a += p.da;
      if (p.a < 0) { p.a = 0; p.da *= -1; }
      if (p.a > 1) { p.a = 1; p.da *= -1; }
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,169,110,${p.a * 0.55})`;
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  }
  draw();

  document.getElementById('loading-screen')
    .addEventListener('transitionend', () => {
      cancelAnimationFrame(raf);
      canvas.remove();
    }, { once: true });
})();

/* ─────────────────────────────
   3. CANVAS ANIMADO — BACKGROUND
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

  const orbs = [
    { x: .78, y: .12, r: .42, color: '26,56,40',    a: .18, vx: .00014, vy: .00009 },
    { x: .12, y: .82, r: .34, color: '200,169,110',  a: .10, vx:-.00010, vy:-.00013 },
    { x: .45, y: .50, r: .26, color: '29,60,42',     a: .08, vx: .00007, vy: .00018 },
    { x: .88, y: .70, r: .22, color: '200,169,110',  a: .05, vx:-.00015, vy: .00008 },
  ];

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;

    orbs.forEach(o => {
      o.x += o.vx; o.y += o.vy;
      if (o.x < .08 || o.x > .92) o.vx *= -1;
      if (o.y < .08 || o.y > .92) o.vy *= -1;

      const cx = o.x * W, cy = o.y * H;
      const rad = o.r * Math.min(W, H);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      g.addColorStop(0,   `rgba(${o.color},${o.a})`);
      g.addColorStop(.55, `rgba(${o.color},${o.a * .35})`);
      g.addColorStop(1,   `rgba(${o.color},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────
   4. LOADING → PÁGINA
───────────────────────────── */
window.addEventListener('load', () => {
  const ls   = document.getElementById('loading-screen');
  const page = document.getElementById('main-page');

  setTimeout(() => {
    ls.classList.add('fade-out');
    page.classList.add('visible');
  }, 3800);
});

/* ─────────────────────────────
   5. MENSAGENS ROTATIVAS (PROCESSAMENTO)
───────────────────────────── */
const MSGS = [
  'Lendo o documento enviado.',
  'Identificando informações financeiras.',
  'Organizando dados do arquivo.',
  'Redigindo o comunicado para os moradores.',
  'Revisando tom e clareza do texto.',
  'Gerando documento Word formatado.',
  'Aplicando identidade visual Raízes VM.',
  'Preparando envio ao síndico.',
];

/* ─────────────────────────────
   6. REFERÊNCIAS DOM
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
   7. HELPERS
───────────────────────────── */
function fmtSize(bytes) {
  return bytes < 1_048_576
    ? (bytes / 1024).toFixed(0) + ' KB'
    : (bytes / 1_048_576).toFixed(1) + ' MB';
}
function showErr(msg) { errMsg.textContent = msg; errMsg.classList.add('show'); }
function hideErr()     { errMsg.classList.remove('show'); }

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
  }, 3000);
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
   8. UPLOAD EVENTS
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
   9. ENVIO
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
   10. NOVO ENVIO
───────────────────────────── */
btnNovo.addEventListener('click', () => {
  clearFile();
  showState('upload');
});
