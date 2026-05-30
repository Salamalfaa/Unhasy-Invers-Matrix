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
