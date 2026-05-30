
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Invers Matriks — Single File</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Mono:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&display=swap" rel="stylesheet">
<style>
/* Inlined from assets/css/style.css */
:root {
  --ink: #0d0d0f;
  --paper: #f5f0e8;
  --surface: #ffffff;
  --surface-alt: #f7f3eb;
  --cream: #ede7d6;
  --gold: #c9973a;
  --rust: #b84a2e;
  --sage: #4a6741;
  --slate: #2d3a4a;
  --muted: #8a7f72;
  --line: rgba(13,13,15,0.12);
}

html[data-theme='dark'] {
  --ink: #f4f3ee;
  --paper: #0e1520;
  --surface: #111b28;
  --surface-alt: #122432;
  --cream: #1f3247;
  --gold: #d9b86c;
  --rust: #e18c62;
  --sage: #84a68f;
  --slate: #8fa7bb;
  --muted: #b7c1d0;
  --line: rgba(255,255,255,0.1);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--paper);
  color: var(--ink);
  font-family: 'DM Mono', monospace;
  min-height: 100vh;
  overflow-x: hidden;
}

/* GRID BACKGROUND */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.page-wrap {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}

/* HEADER */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 18px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  flex: 1 1 250px;
  min-width: 220px;
}

.header-badge {
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(201,151,58,0.14);
  color: var(--rust);
  font-size: 11px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  font-weight: 700;
}

.header-time {
  font-family: 'DM Mono', monospace;
  color: var(--muted);
  font-size: 14px;
  letter-spacing: 0.02em;
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: none;
  border-radius: 999px;
  padding: 12px 18px;
  background: rgba(13,13,15,0.06);
  color: var(--ink);
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s, background 0.2s, color 0.2s;
}

.theme-toggle:hover {
  transform: translateY(-1px);
  background: rgba(201,151,58,0.18);
  color: var(--gold);
}

.theme-toggle::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  background: rgba(13,13,15,0.92);
  color: #fff;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 5;
}

.theme-toggle:hover::after,
.theme-toggle:focus-visible::after {
  opacity: 1;
}

.theme-icon {
  font-size: 16px;
}

.theme-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.taskbar-mini-wrap {
  position: relative;
}

.mini-taskbar {
  width: 42px;
  height: 42px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: rgba(255,255,255,0.18);
  color: var(--ink);
  font-size: 16px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, background 0.2s, border-color 0.2s;
}

.mini-taskbar:hover {
  transform: translateY(-1px);
  border-color: var(--gold);
  background: rgba(201,151,58,0.18);
}

.taskbar-confirm {
  position: absolute;
  right: 0;
  top: calc(100% + 12px);
  min-width: 260px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 18px 40px rgba(13,13,15,0.18);
  display: none;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
  z-index: 10;
}

.taskbar-confirm.visible {
  display: block;
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}


.taskbar-confirm p {
  margin: 0 0 10px;
  font-size: 12px;
  color: var(--slate);
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 8px;
}

.btn-small {
  padding: 10px 14px;
  font-size: 11px;
}

.app-note {
  margin: 18px 0 32px;
  padding: 18px 22px;
  background: linear-gradient(135deg, rgba(201,151,58,0.14), rgba(74,103,65,0.1));
  border: 1px solid rgba(201,151,58,0.22);
  border-radius: 14px;
  color: var(--slate);
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px;
  line-height: 1.7;
  box-shadow: 0 18px 40px rgba(13,13,15,0.08);
}

.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(13,13,15,0.45);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  opacity: 1;
  visibility: visible;
  z-index: 50;
}

.ad-popup {
  width: min(520px, 100%);
  max-width: 520px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(13,13,15,0.2);
  animation: popupEntrance 0.6s ease both;
  resize: both;
  overflow: auto;
}

.ad-popup.minimized {
  width: 260px;
  height: 90px;
}

.ad-popup.maximized {
  width: calc(100vw - 80px);
  height: calc(100vh - 140px);
}

.ad-popup.minimized .ad-body,
.ad-popup.minimized .ad-footer {
  display: none;
}

.ad-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  background: linear-gradient(90deg, rgba(201,151,58,0.18), rgba(74,103,65,0.16));
}

.ad-title {
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  color: var(--ink);
}

.ad-controls {
  display: flex;
  gap: 8px;
}

.window-btn {
  width: 34px;
  height: 34px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface-alt);
  color: var(--ink);
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s, border-color 0.2s;
}

.window-btn:hover {
  background: rgba(201,151,58,0.16);
  transform: translateY(-1px);
  border-color: var(--gold);
}

.ad-body {
  padding: 22px;
  color: var(--slate);
  line-height: 1.8;
}

.ad-body p {
  margin: 0 0 12px;
}

.ad-body ul {
  margin: 0 0 14px 18px;
  color: var(--ink);
}

.ad-body li {
  margin-bottom: 8px;
}

@keyframes popupEntrance {
  from { opacity: 0; transform: translateY(-24px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.page-wrap {
  animation: pageEntrance 0.9s ease both;
}

@keyframes pageEntrance {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

.header, .app-note, .card, .popup-overlay {
  transform-origin: center;
}

.header {
  text-align: center;
  margin-bottom: 56px;
  animation: fadeDown 0.8s ease both;
}

.header-label {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--rust);
  margin-bottom: 12px;
}

.header h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(42px, 8vw, 80px);
  font-weight: 900;
  line-height: 0.95;
  color: var(--ink);
  letter-spacing: -0.02em;
}

.header h1 span {
  color: var(--gold);
  font-style: italic;
}

.header-sub {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 18px;
  color: var(--muted);
  margin-top: 16px;
}

.divider {
  width: 60px;
  height: 2px;
  background: var(--gold);
  margin: 24px auto;
}

/* CARD */
.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 2px;
  padding: 32px;
  margin-bottom: 24px;
  position: relative;
  animation: fadeUp 0.6s ease both;
}

.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 4px;
  height: 100%;
  background: var(--gold);
  border-radius: 2px 0 0 2px;
}

.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 20px;
}

/* SIZE SELECTOR */
.size-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.size-label {
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--muted);
}

.size-btns {
  display: flex;
  gap: 8px;
}

.size-btn {
  width: 42px;
  height: 42px;
  border: 1.5px solid var(--line);
  background: transparent;
  border-radius: 2px;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  cursor: pointer;
  color: var(--ink);
  transition: all 0.2s;
}

.size-btn:hover { border-color: var(--gold); color: var(--gold); }
.size-btn.active {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}

/* MATRIX GRID */
.matrix-section {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.matrix-label-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.matrix-name {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-style: italic;
  color: var(--ink);
}

.matrix-bracket-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.bracket {
  font-size: 48px;
  font-weight: 100;
  color: var(--ink);
  line-height: 1;
  opacity: 0.7;
  font-family: 'Cormorant Garamond', serif;
}

.matrix-grid {
  display: grid;
  gap: 8px;
}

.matrix-cell {
  width: 64px;
  height: 52px;
  border: 1.5px solid var(--line);
  border-radius: 2px;
  background: var(--cream);
  font-family: 'DM Mono', monospace;
  font-size: 16px;
  text-align: center;
  color: var(--ink);
  transition: border-color 0.2s, background 0.2s;
  outline: none;
}

.matrix-cell:focus {
  border-color: var(--gold);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(201,151,58,0.12);
}

/* BUTTONS */
.btn-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  padding: 14px 32px;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--ink);
  color: var(--paper);
}

.btn-primary:hover {
  background: var(--slate);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(13,13,15,0.2);
}

.btn-secondary {
  background: transparent;
  color: var(--ink);
  border: 1.5px solid var(--line);
}

.btn-secondary:hover {
  border-color: var(--gold);
  color: var(--gold);
}

.btn-fill {
  background: var(--sage);
  color: white;
}

.btn-fill:hover { background: #3a5233; }

/* RESULT SECTION */
.result-section {
  display: none;
  animation: fadeUp 0.5s ease both;
}

.result-section.show { display: block; }

/* STEPS */
.steps-container { display: flex; flex-direction: column; gap: 16px; }

.step {
  border: 1px solid var(--line);
  border-radius: 2px;
  overflow: hidden;
  animation: fadeUp 0.4s ease both;
}

.step-header {
  background: var(--cream);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.step-num {
  width: 28px;
  height: 28px;
  background: var(--ink);
  color: var(--paper);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 500;
  flex-shrink: 0;
}

.step-title {
  font-family: 'Playfair Display', serif;
  font-size: 15px;
  color: var(--ink);
  flex: 1;
}

.step-chevron {
  color: var(--muted);
  font-size: 12px;
  transition: transform 0.3s;
}

.step.open .step-chevron { transform: rotate(180deg); }

.step-body {
  display: none;
  padding: 20px;
  background: var(--surface-alt);
  border-top: 1px solid var(--line);
}

.step.open .step-body { display: block; }

.step-desc {
  font-family: 'Cormorant Garamond', serif;
  font-size: 16px;
  color: var(--muted);
  margin-bottom: 16px;
  line-height: 1.6;
}

/* MATRIX DISPLAY */
.mat-display {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 8px 0;
}

.mat-display-grid {
  display: grid;
  gap: 6px;
}

.mat-cell {
  width: 60px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Mono', monospace;
  font-size: 14px;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 2px;
  color: var(--ink);
  transition: background 0.3s;
}

.mat-cell.highlight { background: rgba(201,151,58,0.2); border-color: var(--gold); }
.mat-cell.pivot { background: rgba(184,74,46,0.15); border-color: var(--rust); font-weight: 700; }
.mat-cell.result { background: rgba(74,103,65,0.15); border-color: var(--sage); }

/* FORMULA */
.formula {
  background: var(--cream);
  border-left: 3px solid var(--gold);
  padding: 12px 16px;
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  color: var(--slate);
  margin: 12px 0;
  border-radius: 0 2px 2px 0;
  line-height: 1.7;
}

/* AUGMENTED MATRIX */
.aug-wrap {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  position: relative;
}

.aug-divider {
  width: 2px;
  height: 100%;
  background: var(--rust);
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  opacity: 0.5;
}

.section-tag {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 2px;
  margin-bottom: 8px;
}

.tag-a { background: rgba(201,151,58,0.15); color: var(--gold); }
.tag-i { background: rgba(74,103,65,0.15); color: var(--sage); }
.tag-result { background: rgba(184,74,46,0.15); color: var(--rust); }

/* ERROR */
.error-box {
  background: rgba(184,74,46,0.08);
  border: 1px solid var(--rust);
  border-radius: 2px;
  padding: 16px 20px;
  color: var(--rust);
  font-size: 13px;
  display: none;
}

.error-box.show { display: block; }

/* FINAL RESULT */
.final-card {
  background: var(--ink);
  color: var(--paper);
  border-radius: 2px;
  padding: 32px;
  text-align: center;
}

.final-title {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 16px;
  color: var(--muted);
  margin-bottom: 20px;
  letter-spacing: 0.1em;
}

.final-mat-cell {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: var(--gold);
  font-family: 'DM Mono', monospace;
  font-size: 14px;
  width: 72px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
}

.det-display {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px;
  margin-top: 20px;
  color: rgba(245,240,232,0.7);
}

.det-display span { color: var(--gold); font-weight: 600; }

/* ANIMATE */
@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.step-body table { width: 100%; border-collapse: collapse; font-size: 12px; }
.step-body th { background: var(--cream); padding: 8px 12px; text-align: left; font-weight: 500; border: 1px solid var(--line); }
.step-body td { padding: 8px 12px; border: 1px solid var(--line); font-family: 'DM Mono', monospace; }

.cofactor-grid { display: grid; gap: 6px; margin: 10px 0; }
.cofactor-cell { padding: 8px 12px; background: var(--cream); border: 1px solid var(--line); border-radius: 2px; font-size: 12px; text-align: center; }

.row-op {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: var(--rust);
  margin: 6px 0;
}

.scroll-note { font-size: 11px; color: var(--muted); margin-top: 8px; }
</style>
</head>
<body>

<div class="page-wrap">

  <div class="header-top">
    <div class="header-info">
      <div class="header-badge">Waktu Indonesia Barat</div>
      <div class="header-time" id="dateTimeLabel">Mengambil waktu...</div>
    </div>
    <div class="theme-actions">
      <button class="theme-toggle" id="themeToggle" data-tooltip="Klik untuk beralih tema" onclick="toggleTheme()">
        <span class="theme-icon" id="themeIcon">🌙</span>
        <span id="themeLabel">Gelap</span>
      </button>
      <div class="taskbar-mini-wrap" id="taskbarMiniWrap">
        <button class="mini-taskbar" id="miniTaskbar" onclick="openAdPopup()" data-tooltip="Buka iklan proyek">🗔</button>
      </div>
    </div>
  </div>

  <div class="app-note">
    Project ini sangat berguna buat kalian semua para mahasiswa Universitas Hasyim Asy'ari Tebuireng Jombang dan juga para Bapak Ibu Dosen yang tidak ingin ribet untuk menghitungnya......
  </div>

  <!-- HEADER -->
  <div class="header">
    <div class="header-label">Proyek Matematika · Aljabar Linear</div>
    <h1>Invers<br><span>Matriks</span></h1>
    <div class="divider"></div>
    <div class="header-sub">Kalkulator interaktif dengan langkah-langkah lengkap</div>
  </div>

  <!-- INPUT CARD -->
  <div class="card" style="animation-delay:0.1s">
    <div class="card-title">01 — Konfigurasi Matriks</div>

    <div class="size-row">
      <span class="size-label">Ukuran matriks:</span>
      <div class="size-btns" id="sizeBtns">
        <button class="size-btn active" onclick="setSize(2)">2×2</button>
        <button class="size-btn" onclick="setSize(3)">3×3</button>
        <button class="size-btn" onclick="setSize(4)">4×4</button>
      </div>
    </div>

    <div class="matrix-section">
      <div>
        <div class="matrix-label-wrap">
          <div class="matrix-name">A</div>
        </div>
        <div class="matrix-bracket-wrap">
          <div class="bracket">[</div>
          <div class="matrix-grid" id="matrixInput"></div>
          <div class="bracket">]</div>
        </div>
      </div>
    </div>

    <div class="btn-row">
      <button class="btn btn-primary" onclick="calculate()">Hitung Invers</button>
      <button class="btn btn-fill" onclick="fillExample()">Contoh Isian</button>
      <button class="btn btn-secondary" onclick="clearMatrix()">Reset</button>
    </div>
  </div>

  <!-- ERROR -->
  <div class="error-box" id="errorBox"></div>

  <!-- RESULT SECTION -->
  <div class="result-section" id="resultSection">

    <!-- STEPS -->
    <div class="card" style="animation-delay:0.1s">
      <div class="card-title">02 — Langkah-Langkah Penyelesaian</div>
      <div class="steps-container" id="stepsContainer"></div>
    </div>

    <!-- FINAL RESULT -->
    <div class="card" style="animation-delay:0.2s">
      <div class="card-title">03 — Hasil Akhir</div>
      <div class="final-card" id="finalCard"></div>
    </div>

  </div>

</div>

<div class="popup-overlay" id="adOverlay">
  <div class="ad-popup" id="adPopup">
    <div class="ad-header">
      <div class="ad-title">Iklan Proyek</div>
      <div class="ad-controls">
        <button class="window-btn" onclick="minimizeAd()" title="Minimize">−</button>
        <button class="window-btn" onclick="maximizeAd()" title="Maximize">▢</button>
        <button class="window-btn" onclick="closeAdPopup()" title="Close">✕</button>
      </div>
    </div>
    <div class="ad-body">
      <p>Project ini dibuat oleh:</p>
      <ul>
        <li>M. Jamil Salam Alfaris — 2495114041</li>
        <li>Alfin Bachtiar — 2495114029</li>
        <li>Khuriyatul Rizkiyah Al-Ula — 2495114031</li>
        <li>M. Agustian Nasrullah — 2495114021</li>
      </ul>
      <p>Silakan klik tombol close atau minimize jika Anda ingin melanjutkan penggunaan aplikasi dengan nyaman.</p>
    </div>
  </div>
</div>

<script>
// Inlined from assets/js/app.js
let currentSize = 2;

function setSize(n) {
  currentSize = n;
  document.querySelectorAll('.size-btn').forEach((b,i) => {
    b.classList.toggle('active', [2,3,4][i] === n);
  });
  buildMatrix(n);
  hideResult();
}

function buildMatrix(n) {
  const grid = document.getElementById('matrixInput');
  grid.style.gridTemplateColumns = `repeat(${n}, 64px)`;
  grid.innerHTML = '';
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const inp = document.createElement('input');
      inp.type = 'number';
      inp.className = 'matrix-cell';
      inp.id = `m${i}${j}`;
      inp.placeholder = '0';
      inp.step = 'any';
      grid.appendChild(inp);
    }
  }
}

function getMatrix() {
  const n = currentSize;
  const A = [];
  for (let i = 0; i < n; i++) {
    A[i] = [];
    for (let j = 0; j < n; j++) {
      const v = parseFloat(document.getElementById(`m${i}${j}`).value);
      A[i][j] = isNaN(v) ? 0 : v;
    }
  }
  return A;
}

function clearMatrix() {
  const n = currentSize;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      document.getElementById(`m${i}${j}`).value = '';
  hideResult();
}

function fillExample() {
  const min = 1;
  const max = 9;
  for (let i = 0; i < currentSize; i++) {
    for (let j = 0; j < currentSize; j++) {
      const rand = Math.floor(Math.random() * (max - min + 1)) + min;
      document.getElementById(`m${i}${j}`).value = rand;
    }
  }
  hideResult();
}

function hideResult() {
  document.getElementById('resultSection').classList.remove('show');
  document.getElementById('errorBox').classList.remove('show');
}

function fmt(v) {
  if (Math.abs(v) < 1e-9) return '0';
  const r = Math.round(v * 1000) / 1000;
  if (Number.isInteger(r)) return r.toString();
  for (let d = 1; d <= 12; d++) {
    const n = Math.round(r * d);
    if (Math.abs(n / d - r) < 1e-8) return n === 0 ? '0' : (d === 1 ? `${n}` : `${n}/${d}`);
  }
  return r.toFixed(4).replace(/\.?0+$/, '');
}

function copyMatrix(M) {
  return M.map(r => [...r]);
}

function identityMatrix(n) {
  return Array.from({length: n}, (_, i) => Array.from({length: n}, (_, j) => i === j ? 1 : 0));
}

function calcDet(M) {
  const n = M.length;
  if (n === 1) return M[0][0];
  if (n === 2) return M[0][0]*M[1][1] - M[0][1]*M[1][0];
  let det = 0;
  for (let j = 0; j < n; j++) {
    const sub = M.slice(1).map(r => r.filter((_, c) => c !== j));
    det += Math.pow(-1, j) * M[0][j] * calcDet(sub);
  }
  return det;
}

function makeMatDisplay(M, highlight=[], pivot=[], resultCols=[], n2=null) {
  const n = M.length;
  const cols = M[0].length;
  let html = `<div class="mat-display"><div class="bracket" style="font-size:${36+n*3}px">[</div><div class="mat-display-grid" style="grid-template-columns:repeat(${cols},60px)">`;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < cols; j++) {
      let cls = 'mat-cell';
      if (highlight.some(h => h[0]===i && h[1]===j)) cls += ' highlight';
      if (pivot.some(p => p[0]===i && p[1]===j)) cls += ' pivot';
      if (n2 && j >= n2) cls += ' result';
      html += `<div class="${cls}">${fmt(M[i][j])}</div>`;
    }
  }
  html += `</div><div class="bracket" style="font-size:${36+n*3}px">]</div></div>`;
  return html;
}

function makeAugDisplay(A, I, pivotRow=-1, pivotCol=-1) {
  const n = A.length;
  const combined = A.map((r, i) => [...r, ...I[i]]);
  let html = `<div style="margin:8px 0"><span class="section-tag tag-a">Matriks A</span> <span style="font-size:12px;color:var(--muted);margin:0 8px">|</span> <span class="section-tag tag-i">Matriks Identitas</span></div>`;
  html += `<div class="mat-display"><div class="bracket" style="font-size:${36+n*3}px">[</div><div class="mat-display-grid" style="grid-template-columns:repeat(${n},60px) 2px repeat(${n},60px)">`;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < 2*n+1; j++) {
      if (j === n) {
        html += `<div style="width:2px;background:var(--rust);opacity:0.5;height:100%;align-self:stretch"></div>`;
        continue;
      }
      const jj = j < n ? j : j - n - 1;
      const val = j < n ? A[i][jj] : I[i][jj];
      let cls = 'mat-cell';
      if (j < n && j === pivotCol && i === pivotRow) cls += ' pivot';
      else if (j < n && j === pivotCol) cls += ' highlight';
      else if (j >= n+1) cls += ' result';
      html += `<div class="${cls}">${fmt(val)}</div>`;
    }
  }
  html += `</div><div class="bracket" style="font-size:${36+n*3}px">]</div></div>`;
  return html;
}

function calculate() {
  const A = getMatrix();
  const n = currentSize;
  const det = calcDet(A);
  const errBox = document.getElementById('errorBox');

  if (Math.abs(det) < 1e-10) {
    errBox.innerHTML = `<strong>Matriks Singular!</strong><br>Determinan = ${fmt(det)} → Invers tidak ada karena matriks tidak memiliki determinan yang valid (det = 0).`;
    errBox.classList.add('show');
    document.getElementById('resultSection').classList.remove('show');
    return;
  }

  errBox.classList.remove('show');

  const steps = [];
  steps.push({
    title: 'Tampilkan Matriks A',
    desc: 'Berikut adalah matriks A yang akan dicari inversnya.',
    html: makeMatDisplay(copyMatrix(A))
  });

  let detHtml = '';
  if (n === 2) {
    detHtml = `<div class="formula">det(A) = (a₁₁ × a₂₂) − (a₁₂ × a₂₁)<br>det(A) = (${fmt(A[0][0])} × ${fmt(A[1][1])}) − (${fmt(A[0][1])} × ${fmt(A[1][0])})<br>det(A) = ${fmt(A[0][0]*A[1][1])} − ${fmt(A[0][1]*A[1][0])}<br>det(A) = <strong>${fmt(det)}</strong></div>`;
  } else {
    let cofSum = '';
    let dval = 0;
    for (let j = 0; j < n; j++) {
      const sub = A.slice(1).map(r => r.filter((_, c) => c !== j));
      const cof = Math.pow(-1, j) * A[0][j] * calcDet(sub);
      const sign = j === 0 ? '' : (cof >= 0 ? ' + ' : ' − ');
      cofSum += `${sign}(${Math.pow(-1,j)===1?'+':'-'}1)×${fmt(A[0][j])}×M₀${j} = ${fmt(cof)}`;
      dval += cof;
    }
    detHtml = `<div class="formula">Ekspansi kofaktor baris pertama:<br>${cofSum}<br>det(A) = <strong>${fmt(dval)}</strong></div>`;
  }
  steps.push({
    title: 'Hitung Determinan',
    desc: `Determinan harus ≠ 0 agar matriks memiliki invers. Jika det(A) = 0, maka matriks bersifat singular dan tidak dapat diinverskan.`,
    html: detHtml + `<p style="margin-top:8px;font-size:13px;color:var(--sage)">✓ det(A) = ${fmt(det)} ≠ 0 → Invers ada!</p>`
  });

  const aug_A = copyMatrix(A);
  const aug_I = identityMatrix(n);
  steps.push({
    title: 'Bentuk Matriks Augmentasi [A | I]',
    desc: 'Gabungkan matriks A dengan matriks identitas I untuk membentuk matriks augmentasi. Kita akan mentransformasi bagian kiri menjadi I, sehingga bagian kanan menjadi A⁻¹.',
    html: makeAugDisplay(aug_A, aug_I)
  });

  const elimSteps = [];
  const cur_A = copyMatrix(A);
  const cur_I = identityMatrix(n);

  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let r = col+1; r < n; r++)
      if (Math.abs(cur_A[r][col]) > Math.abs(cur_A[maxRow][col])) maxRow = r;

    if (maxRow !== col) {
      [cur_A[col], cur_A[maxRow]] = [cur_A[maxRow], cur_A[col]];
      [cur_I[col], cur_I[maxRow]] = [cur_I[maxRow], cur_I[col]];
      elimSteps.push({
        op: `Tukar baris R${col+1} ↔ R${maxRow+1}`,
        A: copyMatrix(cur_A), I: copyMatrix(cur_I), pivotRow: col, pivotCol: col
      });
    }

    const pivot = cur_A[col][col];
    if (Math.abs(pivot) > 1e-12) {
      for (let j = 0; j < n; j++) {
        cur_A[col][j] /= pivot;
        cur_I[col][j] /= pivot;
      }
      if (Math.abs(pivot - 1) > 1e-9) {
        elimSteps.push({
          op: `R${col+1} → R${col+1} ÷ ${fmt(pivot)}`,
          A: copyMatrix(cur_A), I: copyMatrix(cur_I), pivotRow: col, pivotCol: col
        });
      }
    }

    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = cur_A[row][col];
      if (Math.abs(factor) < 1e-12) continue;
      for (let j = 0; j < n; j++) {
        cur_A[row][j] -= factor * cur_A[col][j];
        cur_I[row][j] -= factor * cur_I[col][j];
      }
      const sign = factor > 0 ? '−' : '+';
      elimSteps.push({
        op: `R${row+1} → R${row+1} ${sign} ${fmt(Math.abs(factor))}×R${col+1}`,
        A: copyMatrix(cur_A), I: copyMatrix(cur_I), pivotRow: col, pivotCol: col
      });
    }
  }

  let elimHtml = '<div style="display:flex;flex-direction:column;gap:16px">';
  elimSteps.forEach((s, idx) => {
    elimHtml += `<div>
      <div class="row-op">Operasi ${idx+1}: ${s.op}</div>
      ${makeAugDisplay(s.A, s.I, s.pivotRow, s.pivotCol)}
    </div>`;
  });
  elimHtml += '</div>';

  steps.push({
    title: 'Eliminasi Gauss-Jordan',
    desc: 'Lakukan operasi baris elementer (OBE) untuk mengubah bagian kiri menjadi matriks identitas. Setiap langkah menerapkan satu operasi baris.',
    html: elimHtml + '<p class="scroll-note" style="margin-top:10px">Scroll untuk melihat semua langkah eliminasi →</p>'
  });

  const inv = cur_I;
  steps.push({
    title: 'Hasilkan Matriks Invers A⁻¹',
    desc: 'Setelah bagian kiri menjadi matriks identitas, bagian kanan adalah A⁻¹ yang kita cari.',
    html: `<div><span class="section-tag tag-result">A⁻¹</span></div>` + makeMatDisplay(inv)
  });

  const verify = A.map((row, i) => inv.map((_, j) => row.reduce((s, _, k) => s + A[i][k]*inv[k][j], 0)));
  steps.push({
    title: 'Verifikasi: A × A⁻¹ = I',
    desc: 'Untuk memastikan hasilnya benar, kita kalikan A dengan A⁻¹. Hasilnya harus berupa matriks identitas.',
    html: `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
      ${makeMatDisplay(A)}
      <span style="font-size:24px;color:var(--muted)">×</span>
      ${makeMatDisplay(inv)}
      <span style="font-size:24px;color:var(--muted)">=</span>
      ${makeMatDisplay(verify)}
    </div>
    <p style="margin-top:12px;font-size:13px;color:var(--sage)">✓ Terbukti! A × A⁻¹ = I (matriks identitas)</p>`
  });

  const container = document.getElementById('stepsContainer');
  container.innerHTML = '';
  steps.forEach((s, idx) => {
    const div = document.createElement('div');
    div.className = 'step' + (idx === 0 ? ' open' : '');
    div.style.animationDelay = `${idx*0.07}s`;
    div.innerHTML = `
      <div class="step-header" onclick="toggleStep(this.parentElement)">
        <div class="step-num">${idx+1}</div>
        <div class="step-title">${s.title}</div>
        <div class="step-chevron">▼</div>
      </div>
      <div class="step-body">
        <div class="step-desc">${s.desc}</div>
        ${s.html}
      </div>
    `;
    container.appendChild(div);
  });

  const fc = document.getElementById('finalCard');
  let invHtml = `<div class="final-title">Matriks A</div>
    <div class="mat-display" style="justify-content:center">
      <div class="bracket" style="color:var(--paper);font-size:${36+n*3}px">[</div>
      <div class="mat-display-grid" style="grid-template-columns:repeat(${n},72px)">`;
  A.forEach(row => row.forEach(v => { invHtml += `<div class="mat-cell" style="background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.12);color:var(--paper)">${fmt(v)}</div>`; }));
  invHtml += `</div><div class="bracket" style="color:var(--paper);font-size:${36+n*3}px">]</div></div>`;

  invHtml += `<div class="final-title" style="margin-top:28px">Invers Matriks A⁻¹</div>
    <div class="mat-display" style="justify-content:center">
      <div class="bracket" style="color:var(--gold);font-size:${36+n*3}px">[</div>
      <div class="mat-display-grid" style="grid-template-columns:repeat(${n},72px)">`;
  inv.forEach(row => row.forEach(v => { invHtml += `<div class="final-mat-cell">${fmt(v)}</div>`; }));
  invHtml += `</div><div class="bracket" style="color:var(--gold);font-size:${36+n*3}px">]</div></div>`;

  invHtml += `<div class="det-display">Determinan: det(A) = <span>${fmt(det)}</span></div>`;

  fc.innerHTML = invHtml;

  document.getElementById('resultSection').classList.add('show');
  document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleStep(el) {
  el.classList.toggle('open');
}

function updateDateTime() {
  const now = new Date();
  const options = {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  const formatter = new Intl.DateTimeFormat('id-ID', options);
  document.getElementById('dateTimeLabel').textContent = formatter.format(now) + ' WIB';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  const toggle = document.getElementById('themeToggle');
  if (theme === 'dark') {
    icon.textContent = '☀️';
    label.textContent = 'Terang';
    toggle.setAttribute('data-tooltip', 'Alihkan ke tema terang');
  } else {
    icon.textContent = '🌙';
    label.textContent = 'Gelap';
    toggle.setAttribute('data-tooltip', 'Alihkan ke tema gelap');
  }
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
}

function startClock() {
  updateDateTime();
  setInterval(updateDateTime, 1000);
}

function openAdPopup() {
  const overlay = document.getElementById('adOverlay');
  const popup = document.getElementById('adPopup');
  const mini = document.getElementById('miniTaskbar');
  if (overlay) overlay.style.display = 'flex';
  if (popup) popup.classList.remove('minimized', 'maximized');
  if (mini) mini.style.display = 'inline-flex';
}

function closeAdPopup() {
  const overlay = document.getElementById('adOverlay');
  const mini = document.getElementById('miniTaskbar');
  if (overlay) overlay.style.display = 'none';
  if (mini) mini.style.display = 'none';
}

function minimizeAd() {
  const overlay = document.getElementById('adOverlay');
  if (overlay) overlay.style.display = 'none';
}


function maximizeAd() {
  const popup = document.getElementById('adPopup');
  if (!popup) return;
  popup.classList.toggle('maximized');
  popup.classList.remove('minimized');
}

function hideTaskbarMini() {
  const wrap = document.getElementById('taskbarMiniWrap');
  if (wrap) wrap.style.display = 'none';
}

initTheme();
startClock();
buildMatrix(2);
fillExample();
</script>
</body>
</html>
