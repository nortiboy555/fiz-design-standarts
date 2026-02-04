// FIZ Creative Hub - Client Application

// ===== State =====
const state = {
  currentPage: 'dashboard',
  language: 'pt',
  checklistState: {},
  headlineFilter: 'all',
  data: null
};

// ===== API =====
const api = {
  async get(endpoint) {
    const response = await fetch(`/api${endpoint}`);
    return response.json();
  },

  async post(endpoint, body) {
    const response = await fetch(`/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return response.json();
  }
};

// ===== Router =====
function navigateTo(page) {
  state.currentPage = page;

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  document.querySelectorAll('.page').forEach(p => {
    p.classList.toggle('active', p.id === `page-${page}`);
  });

  initPage(page);
}

async function initPage(page) {
  switch (page) {
    case 'icp':
      await renderIcpCards();
      break;
    case 'competitors':
      await renderCompetitors();
      break;
    case 'checklist':
      await renderChecklist();
      break;
    case 'formats':
      await renderFormats();
      break;
    case 'visuals':
      await renderVisuals();
      break;
    case 'headlines':
      await renderHeadlines();
      break;
    case 'banwords':
      await renderBanWords();
      break;
    case 'testplanner':
      await renderTestPlanner();
      break;
    case 'preview':
      await initCreativePreview();
      break;
  }
}

// ===== ICP Cards =====
async function renderIcpCards() {
  const container = document.getElementById('icp-container');
  const data = await api.get('/icp');

  container.innerHTML = '';

  Object.values(data).forEach(icp => {
    const card = document.createElement('div');
    card.className = 'icp-card';
    card.innerHTML = `
      <div class="icp-card-header">
        <h3>${icp.name}</h3>
        <p>${icp.nameEn}</p>
      </div>
      <div class="icp-card-body">
        <div class="icp-tabs">
          <button class="icp-tab active" data-tab="fears">Fears</button>
          <button class="icp-tab" data-tab="triggers">Triggers</button>
          <button class="icp-tab" data-tab="keywords">Keywords</button>
          <button class="icp-tab" data-tab="visuals">Visuals</button>
          <button class="icp-tab" data-tab="avoid">Avoid</button>
        </div>

        <div class="icp-content active" data-content="fears">
          <ul class="icp-list">
            ${icp.fears.map(f => `
              <li>
                <strong>${state.language === 'pt' ? f.pt : f.en}</strong>
                <span class="icp-insight">${f.insight}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="icp-content" data-content="triggers">
          <ul class="icp-list">
            ${icp.triggers.map(t => `
              <li>${state.language === 'pt' ? t.text : t.en}</li>
            `).join('')}
          </ul>
        </div>

        <div class="icp-content" data-content="keywords">
          <div class="keyword-tags">
            ${icp.keywords[state.language].map(k => `
              <span class="keyword-tag">${k}</span>
            `).join('')}
          </div>
        </div>

        <div class="icp-content" data-content="visuals">
          <ul class="icp-list">
            ${icp.trustVisuals.map(v => `<li>${v}</li>`).join('')}
          </ul>
        </div>

        <div class="icp-content" data-content="avoid">
          <ul class="icp-list">
            ${icp.tooGoodToBe.map(t => `
              <li class="text-danger">${state.language === 'pt' ? t.bad : t.en}</li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;

    card.querySelectorAll('.icp-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        card.querySelectorAll('.icp-tab').forEach(t => t.classList.remove('active'));
        card.querySelectorAll('.icp-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        card.querySelector(`[data-content="${tab.dataset.tab}"]`).classList.add('active');
      });
    });

    container.appendChild(card);
  });
}

// ===== Competitors =====
async function renderCompetitors() {
  const container = document.getElementById('competitors-container');
  const data = await api.get('/competitors');

  container.innerHTML = `
    <div class="competitors-header">
      <h3>FIZ Positioning</h3>
      <p class="text-secondary">Category: <strong class="text-accent">${data.fizPositioning.category}</strong> <span class="text-muted">(not "${data.fizPositioning.notCategory}")</span></p>

      <div class="positioning-cards">
        ${data.fizPositioning.differentiators.map(d => `
          <div class="positioning-card">
            <strong>${d.name}</strong>
            <p class="text-muted mt-sm" style="font-size: 0.9rem;">${d.description}</p>
            <p class="text-accent mt-sm" style="font-size: 0.85rem;">"${d.emotion}"</p>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="section-header">
      <h3>Competitor Comparison</h3>
    </div>

    <div class="competitors-table-wrapper">
      <table class="competitors-table">
        <thead>
          <tr>
            <th>Competitor</th>
            <th>Positioning</th>
            <th>Key Strengths</th>
            <th>FIZ Angle</th>
          </tr>
        </thead>
        <tbody>
          ${Object.values(data.competitors).map(c => `
            <tr>
              <td class="competitor-name">${c.name}</td>
              <td style="max-width: 280px; font-size: 0.9rem; line-height: 1.5;">${c.positioning}</td>
              <td style="font-size: 0.9rem;">
                <ul style="margin: 0; padding-left: 18px; line-height: 1.6;">
                  ${c.strengths.slice(0, 2).map(s => `<li>${s}</li>`).join('')}
                </ul>
              </td>
              <td class="fiz-angle">${c.fizAngle}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ===== Copy Lab =====
async function generateCopy() {
  const lang = state.language;
  const offer = document.getElementById('gen-offer').value;

  const data = await api.get(`/copy/generate?lang=${lang}&offer=${offer}`);

  document.getElementById('gen-headline').textContent = data.headline || '-';
  document.getElementById('gen-subhead').textContent = data.subhead || '-';
  document.getElementById('gen-cta').textContent = data.cta || '-';
}

async function checkCopy() {
  const input = document.getElementById('check-input').value;
  const results = document.getElementById('check-results');

  if (!input.trim()) {
    results.innerHTML = '<p class="text-muted">Enter some text to check</p>';
    return;
  }

  const data = await api.post('/copy/check', { text: input });

  if (data.isClean) {
    results.innerHTML = `
      <div class="check-item success">
        <span class="icon">✓</span>
        <div>
          <div class="check-message"><strong>All clear!</strong> No banned words or risky patterns found.</div>
        </div>
      </div>
    `;
  } else {
    results.innerHTML = data.issues.map(issue => `
      <div class="check-item ${issue.severity === 'high' ? 'danger' : 'warning'}">
        <span class="icon">${issue.severity === 'high' ? '✕' : '!'}</span>
        <div>
          <div class="check-message">
            <strong>${issue.severity === 'high' ? 'High Risk' : 'Warning'}:</strong>
            Found "<strong>${issue.word}</strong>" — ${issue.reason}
          </div>
          <span class="check-suggestion">Suggestion: ${issue.suggestion}</span>
        </div>
      </div>
    `).join('');
  }
}

// ===== Checklist =====
async function renderChecklist() {
  const container = document.getElementById('checklist-container');
  const data = await api.get('/checklist');
  const lang = state.language;

  container.innerHTML = Object.entries(data.sections).map(([key, section]) => `
    <div class="checklist-section">
      <div class="checklist-section-header">
        <span class="checklist-section-title">${lang === 'pt' ? section.titlePt : section.title}</span>
        <span class="checklist-progress" data-section="${key}">0 / ${section.items.length}</span>
      </div>
      <ul class="checklist-items">
        ${section.items.map(item => `
          <li class="checklist-item">
            <div class="checklist-checkbox ${state.checklistState[item.id] ? 'checked' : ''}"
                 data-id="${item.id}"></div>
            <span class="checklist-label ${item.critical ? 'critical' : ''}">
              ${lang === 'pt' ? item.textPt : item.text}
            </span>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');

  container.querySelectorAll('.checklist-checkbox').forEach(checkbox => {
    checkbox.addEventListener('click', () => {
      const id = checkbox.dataset.id;
      state.checklistState[id] = !state.checklistState[id];
      checkbox.classList.toggle('checked', state.checklistState[id]);
      updateChecklistProgress(data.sections);
    });
  });

  updateChecklistProgress(data.sections);
}

function updateChecklistProgress(sections) {
  Object.entries(sections).forEach(([key, section]) => {
    const checked = section.items.filter(item => state.checklistState[item.id]).length;
    const progress = document.querySelector(`[data-section="${key}"]`);
    if (progress) {
      progress.textContent = `${checked} / ${section.items.length}`;
    }
  });
}

// ===== Formats =====
async function renderFormats() {
  const tabsContainer = document.getElementById('format-tabs');
  const data = await api.get('/formats');

  tabsContainer.innerHTML = Object.values(data.formats).map((f, i) => `
    <button class="format-tab ${i === 0 ? 'active' : ''}" data-format="${f.id}">
      ${f.ratio} ${f.name}
    </button>
  `).join('');

  tabsContainer.querySelectorAll('.format-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabsContainer.querySelectorAll('.format-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderFormatContent(data.formats[tab.dataset.format]);
    });
  });

  renderFormatContent(data.formats['9:16']);
}

function renderFormatContent(format) {
  const container = document.getElementById('format-content');
  const scale = format.id === '16:9' ? 0.22 : 0.18;
  const previewWidth = format.baseSize.width * scale;
  const previewHeight = format.baseSize.height * scale;

  let safeZonesHtml = '';
  if (format.id === '9:16') {
    safeZonesHtml = `
      <div class="safe-zone zone-ui" style="top:0;left:0;right:0;height:${250*scale}px;">UI Zone</div>
      <div class="safe-zone zone-ui" style="bottom:0;left:0;right:0;height:${250*scale}px;">UI Zone</div>
      <div class="safe-zone zone-45" style="top:${285*scale}px;left:0;right:0;height:${1350*scale}px;">Safe 4:5</div>
      <div class="safe-zone zone-11" style="top:${420*scale}px;left:0;right:0;height:${1080*scale}px;">Safe 1:1</div>
    `;
  }

  container.innerHTML = `
    <div class="format-content active">
      <div class="format-preview">
        <div class="format-canvas" style="width:${previewWidth}px;height:${previewHeight}px;position:relative;">
          <div class="format-canvas-inner" style="width:100%;height:100%;">${format.ratio}</div>
          ${safeZonesHtml}
        </div>
      </div>
      <div class="format-specs">
        <h3>${format.name}</h3>
        <ul class="specs-list">
          <li><span class="specs-label">Base Size</span><span class="specs-value">${format.baseSize.width} x ${format.baseSize.height}</span></li>
          <li><span class="specs-label">Hi-Res Size</span><span class="specs-value">${format.hiResSize.width} x ${format.hiResSize.height}</span></li>
          <li><span class="specs-label">Placements</span><span class="specs-value">${format.placements.join(', ')}</span></li>
          <li><span class="specs-label">Role</span><span class="specs-value">${format.role}</span></li>
          <li><span class="specs-label">Grid Margins</span><span class="specs-value">${format.gridSpec.margins}px</span></li>
        </ul>
        ${format.id === '9:16' ? `
          <h4>Safe Zones</h4>
          <ul class="specs-list">
            <li><span class="specs-label text-danger">UI Zones (avoid)</span><span class="specs-value">250px top/bottom</span></li>
            <li><span class="specs-label text-warning">Safe 4:5</span><span class="specs-value">285px offset</span></li>
            <li><span class="specs-label text-accent">Safe 1:1 (critical)</span><span class="specs-value">420px offset</span></li>
          </ul>
        ` : ''}
        ${format.note ? `<p class="text-warning mt-lg" style="font-size:0.9rem;"><strong>Note:</strong> ${format.note}</p>` : ''}
      </div>
    </div>
  `;
}

// ===== Visuals =====
async function renderVisuals() {
  const container = document.getElementById('visuals-container');
  const templatesContainer = document.getElementById('templates-container');
  const data = await api.get('/visuals');

  container.innerHTML = Object.values(data.directions).map(dir => `
    <div class="visual-card">
      <div class="visual-card-header">
        <h3>${dir.name}</h3>
        <p class="text-muted">${dir.concept}</p>
      </div>
      <div class="visual-card-body">
        <div class="mb-lg">
          <label class="text-muted" style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.05em;">Color Palette</label>
          <div class="color-palette">
            ${Object.entries(dir.colorApproach.palette).slice(0,5).map(([name, color]) => `
              <div class="color-swatch" style="background:${color};" title="${name}: ${color}"></div>
            `).join('')}
          </div>
        </div>

        <div class="mb-lg">
          <label class="text-muted" style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.05em;">Iconography</label>
          <ul style="margin:8px 0 0 18px;font-size:0.9rem;color:var(--color-text-secondary);line-height:1.8;">
            ${dir.iconography.map(i => `<li>${i}</li>`).join('')}
          </ul>
        </div>

        <div style="background:var(--color-bg);padding:12px 16px;border-radius:8px;font-size:0.85rem;">
          <strong class="text-accent">Best for:</strong>
          <span class="text-secondary">${dir.recommendedFor.join(', ')}</span>
          <span class="text-muted"> | </span>
          <strong class="text-accent">ICP:</strong>
          <span class="text-secondary">${dir.bestIcp}</span>
        </div>
      </div>
    </div>
  `).join('');

  templatesContainer.innerHTML = `
    <div class="card">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
        ${data.staticTemplates.map(t => `
          <div style="background:var(--color-bg);padding:16px;border-radius:12px;border-left:3px solid var(--color-primary);">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <strong>${t.id}. ${t.name}</strong>
              <span style="font-size:0.7rem;font-weight:600;background:var(--color-bg-elevated);padding:3px 8px;border-radius:4px;text-transform:uppercase;">${t.type}</span>
            </div>
            <p style="font-size:0.85rem;color:var(--color-text-muted);line-height:1.5;">${t.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ===== Headlines =====
async function renderHeadlines() {
  const container = document.getElementById('headlines-container');
  const lang = state.language;
  const filter = state.headlineFilter;

  const [headlinesData, subheadsData, ctasData] = await Promise.all([
    api.get(`/headlines?lang=${lang}&offer=${filter}`),
    api.get(`/subheads?lang=${lang}`),
    api.get(`/ctas?lang=${lang}`)
  ]);

  container.innerHTML = `
    <div class="headlines-section">
      <div class="headlines-section-header">
        <h3>Headlines (${headlinesData.length})</h3>
      </div>
      <div class="headlines-list">
        ${headlinesData.map(h => `
          <div class="headline-item">
            <span class="headline-text">${h.text}</span>
            <div class="headline-meta">
              <span class="headline-tag">${h.offer}</span>
              <button class="copy-btn" onclick="copyText('${h.text.replace(/'/g, "\\'")}')">Copy</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="headlines-section">
      <div class="headlines-section-header">
        <h3>Subheads (${subheadsData.length})</h3>
      </div>
      <div class="headlines-list">
        ${subheadsData.slice(0, 15).map(s => `
          <div class="headline-item">
            <span class="headline-text">${s.text}</span>
            <button class="copy-btn" onclick="copyText('${s.text.replace(/'/g, "\\'")}')">Copy</button>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="headlines-section">
      <div class="headlines-section-header">
        <h3>CTAs (${ctasData.length})</h3>
      </div>
      <div style="padding:16px;display:flex;flex-wrap:wrap;gap:10px;">
        ${ctasData.map(c => `
          <button class="btn btn-secondary" onclick="copyText('${c.text}')" style="font-size:0.9rem;">
            ${c.text}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

// ===== Ban Words =====
async function renderBanWords() {
  const container = document.getElementById('banwords-container');
  const data = await api.get('/banwords');

  container.innerHTML = `
    <div class="banwords-section">
      <div class="banwords-header danger">
        <h3>Hard Bans — High Risk</h3>
        <p class="text-muted">These will likely cause rejection or severely throttle delivery</p>
      </div>
      <div class="banwords-content">
        ${data.hardBan.map(ban => `
          <div class="banword-item">
            <div class="banword-tags">
              ${ban.words.map(w => `<span class="banword-tag danger">${w}</span>`).join('')}
            </div>
            <p class="banword-reason">${ban.reason}</p>
            <p class="banword-suggestion">Suggestion: ${ban.suggestion}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="banwords-section">
      <div class="banwords-header warning">
        <h3>Soft Bans — Medium Risk</h3>
        <p class="text-muted">May reduce delivery or trigger manual review</p>
      </div>
      <div class="banwords-content">
        ${data.softBan.map(ban => `
          <div class="banword-item">
            <div class="banword-tags">
              ${ban.words.map(w => `<span class="banword-tag warning">${w}</span>`).join('')}
            </div>
            <p class="banword-reason">${ban.reason}</p>
            <p class="banword-suggestion">Suggestion: ${ban.suggestion}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="section-header">
      <h3>Compliance Examples</h3>
    </div>

    <div class="compliance-grid">
      ${Object.entries(data.complianceRules).map(([key, rule]) => `
        <div class="compliance-card">
          <h4>${key.replace(/([A-Z])/g, ' $1')}</h4>
          <div class="compliance-example good">
            <div class="compliance-label good">Good</div>
            <p style="font-size:0.95rem;">${rule.example.good}</p>
          </div>
          <div class="compliance-example bad">
            <div class="compliance-label bad">Bad</div>
            <p style="font-size:0.95rem;">${rule.example.bad}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ===== Test Planner =====
let testPlannerData = null;
let selectedVariables = [];

async function renderTestPlanner() {
  if (!testPlannerData) {
    testPlannerData = await api.get('/testmatrix');
  }

  renderPrebuiltMatrices();
  renderVariableSelector();
  renderSprintTemplate();
  renderKpiBenchmarks();

  // Event listeners
  document.getElementById('generate-matrix-btn')?.addEventListener('click', generateMatrix);
  document.getElementById('clear-matrix-btn')?.addEventListener('click', clearMatrix);
}

function renderPrebuiltMatrices() {
  const container = document.getElementById('prebuilt-matrices');
  if (!container) return;

  container.innerHTML = testPlannerData.prebuiltMatrices.map(m => `
    <div class="test-template-card" data-template="${m.id}">
      <h4>${m.name}</h4>
      <p>${m.description}</p>
      <div class="test-template-meta">
        <span>Variables: <strong>${m.variables.join(', ')}</strong></span>
        <span class="count">${m.combinations} combinations</span>
      </div>
      <p class="text-muted mt-sm" style="font-size:0.8rem;">${m.estimated}</p>
    </div>
  `).join('');

  container.querySelectorAll('.test-template-card').forEach(card => {
    card.addEventListener('click', () => {
      const template = testPlannerData.prebuiltMatrices.find(m => m.id === card.dataset.template);
      if (template) {
        selectedVariables = [...template.variables];
        updateVariableSelection();
        generateMatrix();
      }
    });
  });
}

function renderVariableSelector() {
  const container = document.getElementById('variable-selector');
  if (!container) return;

  container.innerHTML = Object.values(testPlannerData.variables).map(v => `
    <div class="variable-card" data-variable="${v.id}">
      <div class="variable-card-header">
        <h5>${v.name}</h5>
        <span class="priority ${v.priority <= 2 ? 'high' : ''}">Priority ${v.priority}</span>
      </div>
      <p>${v.description}</p>
      <div class="impact">Impact: ${v.impact}</div>
    </div>
  `).join('');

  container.querySelectorAll('.variable-card').forEach(card => {
    card.addEventListener('click', () => {
      const varId = card.dataset.variable;
      if (selectedVariables.includes(varId)) {
        selectedVariables = selectedVariables.filter(v => v !== varId);
      } else {
        selectedVariables.push(varId);
      }
      updateVariableSelection();
    });
  });
}

function updateVariableSelection() {
  document.querySelectorAll('.variable-card').forEach(card => {
    card.classList.toggle('selected', selectedVariables.includes(card.dataset.variable));
  });
}

async function generateMatrix() {
  if (selectedVariables.length === 0) {
    document.getElementById('matrix-result').innerHTML = `
      <div class="card" style="text-align:center;padding:48px;">
        <p class="text-muted">Select at least one variable to generate a test matrix</p>
      </div>
    `;
    return;
  }

  const result = await api.post('/testmatrix/generate', { variables: selectedVariables });
  renderMatrixResult(result);
}

function renderMatrixResult(result) {
  const container = document.getElementById('matrix-result');
  if (!container) return;

  const varNames = result.variables.map(v => v.name);

  container.innerHTML = `
    <div class="matrix-header">
      <h4>Generated Test Matrix</h4>
      <div class="matrix-stats">
        <span>Variables: <strong>${varNames.join(' × ')}</strong></span>
        <span>Total: <strong>${result.total} combinations</strong></span>
      </div>
    </div>
    <div class="matrix-table-wrapper">
      <table class="matrix-table">
        <thead>
          <tr>
            <th>ID</th>
            ${result.variables.map(v => `<th>${v.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${result.combinations.map(combo => `
            <tr>
              <td class="matrix-id">${combo.id}</td>
              ${combo.elements.map(el => `
                <td class="matrix-cell">
                  <div class="option-name">${el.name}</div>
                  <div class="option-example">${el.example}</div>
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function clearMatrix() {
  selectedVariables = [];
  updateVariableSelection();
  document.getElementById('matrix-result').innerHTML = '';
}

function renderSprintTemplate() {
  const container = document.getElementById('sprint-template');
  if (!container) return;

  const days = Object.entries(testPlannerData.sprintTemplate);

  container.innerHTML = days.map(([key, day], index) => `
    <div class="sprint-day">
      <div class="sprint-day-header">
        <span class="day-num">Day ${index + 1}</span>
        <span class="day-name">${day.name}</span>
      </div>
      <div class="sprint-day-body">
        <ul>
          ${day.tasks.map(task => `<li>${task}</li>`).join('')}
        </ul>
        <div class="sprint-metrics">
          ${day.metrics.map(m => `<span class="sprint-metric">${m}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function renderKpiBenchmarks() {
  const container = document.getElementById('kpi-benchmarks');
  if (!container) return;

  container.innerHTML = Object.entries(testPlannerData.kpiBenchmarks).map(([key, kpi]) => `
    <div class="kpi-card">
      <h5>${key.toUpperCase()}</h5>
      <div class="kpi-values">
        <div class="kpi-value">
          <div class="label">Good</div>
          <div class="number good">${kpi.good}<span class="unit">${kpi.unit}</span></div>
        </div>
        <div class="kpi-value">
          <div class="label">Great</div>
          <div class="number great">${kpi.great}<span class="unit">${kpi.unit}</span></div>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== Creative Preview =====
let previewData = {
  headlines: [],
  subheads: [],
  ctas: [],
  currentCopy: {
    headline: '',
    subhead: '',
    cta: ''
  },
  backgroundColor: '#FFFFFF', // Default white background
  // Figma templates for each format
  figmaTemplates: {
    '9:16': null,
    '4:5': null,
    '1:1': null,
    '16:9': null
  },
  // Shared Picture elements (same name across all formats)
  sharedPictures: [], // Array of { name, nodes: { '9:16': node, '4:5': node, ... } }
  // Image variants carousel: [{ type: 'original'|'generated', dataUrl, label }]
  imageVariants: [],
  currentVariantIndex: 0,
  // Generated image to replace Picture (current selected variant)
  generatedImage: null // { name, dataUrl }
};

const formatSpecs = {
  '916': { width: 1080, height: 1920, ratio: '9:16', name: '9:16', previewHeight: 340 },
  '45': { width: 1080, height: 1350, ratio: '4:5', name: '4:5', previewHeight: 300 },
  '11': { width: 1080, height: 1080, ratio: '1:1', name: '1:1', previewHeight: 280 },
  '169': { width: 1920, height: 1080, ratio: '16:9', name: '16:9', previewHeight: 200 }
};

// Map format ratios to formatSpec keys
const formatRatioToKey = {
  '9:16': '916',
  '4:5': '45',
  '1:1': '11',
  '16:9': '169'
};

async function initCreativePreview() {
  const lang = state.language;

  // Load copy data
  const [headlines, subheads, ctas] = await Promise.all([
    api.get(`/headlines?lang=${lang}`),
    api.get(`/subheads?lang=${lang}`),
    api.get(`/ctas?lang=${lang}`)
  ]);

  previewData.headlines = headlines;
  previewData.subheads = subheads;
  previewData.ctas = ctas;

  // Populate dropdowns
  populatePreviewDropdowns();

  // Setup event listeners
  setupPreviewListeners();

  // Setup Figma import
  setupFigmaImport();

  // Initialize empty previews (will show placeholder until Figma import)
  updateAllPreviews();
}

// ===== Figma Import =====
let figmaData = {
  fileKey: null,
  frames: [],
  selectedFrame: null
};

function setupFigmaImport() {
  const importBtn = document.getElementById('figma-import-btn');
  const urlInput = document.getElementById('figma-url-input');

  importBtn?.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (url) {
      importFromFigma(url);
    }
  });

  // Allow Enter key to trigger import
  urlInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const url = urlInput.value.trim();
      if (url) {
        importFromFigma(url);
      }
    }
  });
}

async function importFromFigma(url) {
  const resultsContainer = document.getElementById('figma-results');

  // Show loading
  resultsContainer.innerHTML = `
    <div class="figma-loading">
      <div class="figma-loading-spinner"></div>
      <span>Importing from Figma...</span>
    </div>
  `;

  try {
    const data = await api.post('/figma/parse', { url });

    if (data.error) {
      throw new Error(data.error);
    }

    figmaData.fileKey = data.fileKey;

    // Check if single node or multiple frames
    if (data.node) {
      figmaData.frames = [data.node];
    } else if (data.frames) {
      figmaData.frames = data.frames;
    } else {
      throw new Error('No compatible frames found');
    }

    if (figmaData.frames.length === 0) {
      resultsContainer.innerHTML = `
        <div class="figma-error">
          No frames matching ad formats (9:16, 4:5, 1:1, 16:9) found.
        </div>
      `;
      return;
    }

    // Store templates for each format (with nodes data)
    for (const frame of figmaData.frames) {
      if (frame.format && frame.nodes) {
        previewData.figmaTemplates[frame.format] = frame;

        // Set background color from first template
        if (frame.backgroundColor && previewData.backgroundColor === '#FFFFFF') {
          previewData.backgroundColor = frame.backgroundColor;
          const colorPicker = document.getElementById('bg-color-picker');
          const colorHex = document.getElementById('bg-color-hex');
          if (colorPicker) colorPicker.value = frame.backgroundColor;
          if (colorHex) colorHex.value = frame.backgroundColor.toUpperCase();
        }
      }
    }

    // Find shared Picture elements (IMAGE nodes with same name across formats)
    findSharedPictures();

    // Update copy state from current form values and refresh previews
    updateCopyFromInputs();
    updateAllPreviews();

    // Show success
    const formatsLoaded = Object.entries(previewData.figmaTemplates)
      .filter(([_, t]) => t && t.nodes)
      .map(([format]) => format);

    resultsContainer.innerHTML = `
      <div class="figma-success">
        <span class="success-icon">✓</span>
        <div class="figma-success-details">
          <strong>Imported ${formatsLoaded.length} templates from Figma</strong>
          <div class="figma-frames-summary">
            ${formatsLoaded.map(f => `<span class="figma-format-badge">${f}</span>`).join('')}
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="clearFigmaImport()">Clear</button>
      </div>
    `;

  } catch (error) {
    console.error('Figma import error:', error);
    resultsContainer.innerHTML = `
      <div class="figma-error">
        Error: ${error.message}
      </div>
    `;
  }
}

function clearFigmaImport() {
  previewData.figmaTemplates = {
    '9:16': null,
    '4:5': null,
    '1:1': null,
    '16:9': null
  };
  previewData.sharedPictures = [];
  previewData.imageVariants = [];
  previewData.currentVariantIndex = 0;
  previewData.generatedImage = null;
  document.getElementById('figma-results').innerHTML = '';
  document.getElementById('image-gen-section').style.display = 'none';
  updateAllPreviews();
}

window.clearFigmaImport = clearFigmaImport;

// Find IMAGE nodes with the same name across all formats
function findSharedPictures() {
  previewData.sharedPictures = [];

  // Get all loaded formats
  const loadedFormats = Object.entries(previewData.figmaTemplates)
    .filter(([_, t]) => t && t.nodes)
    .map(([format, template]) => ({ format, template }));

  if (loadedFormats.length < 2) return;

  // Collect all IMAGE nodes by name
  const imagesByName = {};

  for (const { format, template } of loadedFormats) {
    const imageNodes = (template.nodes || []).filter(n => n.nodeType === 'IMAGE');
    for (const node of imageNodes) {
      const name = node.nodeName.toLowerCase();
      if (!imagesByName[name]) {
        imagesByName[name] = {};
      }
      imagesByName[name][format] = node;
    }
  }

  // Find names that exist in ALL loaded formats
  const formatCount = loadedFormats.length;
  for (const [name, nodes] of Object.entries(imagesByName)) {
    if (Object.keys(nodes).length >= formatCount) {
      previewData.sharedPictures.push({
        name: Object.values(nodes)[0].nodeName, // Original case
        nodes
      });
    }
  }

  // Setup UI if we found shared pictures
  if (previewData.sharedPictures.length > 0) {
    setupImageGenerationUI();
  } else {
    document.getElementById('image-gen-section').style.display = 'none';
  }
}

// Setup the image generation UI
function setupImageGenerationUI() {
  const section = document.getElementById('image-gen-section');
  const sizeInfo = document.getElementById('picture-size-info');
  const generateBtn = document.getElementById('generate-image-btn');
  const promptInput = document.getElementById('image-prompt');
  const popupOverlay = document.getElementById('image-popup');
  const popupClose = document.getElementById('popup-close');
  const popupCancel = document.getElementById('popup-cancel');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (!section) return;

  section.style.display = 'block';

  // Get first shared picture
  const firstPicture = previewData.sharedPictures[0];
  const firstNode = Object.values(firstPicture.nodes)[0];

  // Show Picture size from Figma
  if (sizeInfo && firstNode) {
    const w = Math.round(firstNode.width);
    const h = Math.round(firstNode.height);
    sizeInfo.innerHTML = `<span style="color: var(--color-text-muted);">Figma size:</span> <span class="size-badge figma">${w}×${h}</span>`;
  }

  // Initialize variants with original image
  previewData.imageVariants = [{
    type: 'original',
    dataUrl: firstNode?.imageUrl || null,
    label: 'Original'
  }];
  previewData.currentVariantIndex = 0;

  // Render carousel
  renderCarousel();

  // Setup carousel navigation
  prevBtn.onclick = () => navigateCarousel(-1);
  nextBtn.onclick = () => navigateCarousel(1);

  // Setup generate button handler
  generateBtn.onclick = async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert('Please enter an image description');
      return;
    }

    await generateImagesWithGemini(prompt, firstPicture);
  };

  // Setup popup close handlers
  popupClose.onclick = () => closeImagePopup();
  popupCancel.onclick = () => closeImagePopup();
  popupOverlay.onclick = (e) => {
    if (e.target === popupOverlay) closeImagePopup();
  };
}

// Render the variants carousel
function renderCarousel() {
  const track = document.getElementById('carousel-track');
  const indicator = document.getElementById('carousel-indicator');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const promptInput = document.getElementById('image-prompt');

  if (!track || !indicator) return;

  const variants = previewData.imageVariants;
  const currentIdx = previewData.currentVariantIndex;
  const current = variants[currentIdx];

  // Render current variant
  if (current && current.dataUrl) {
    const isGenerated = current.type === 'generated';
    track.innerHTML = `
      <span class="variant-label">${current.label}${isGenerated ? ' (click to download)' : ''}</span>
      <img src="${current.dataUrl}" alt="${current.label}" class="${isGenerated ? 'downloadable' : ''}">
    `;

    // Add click-to-download for generated variants
    if (isGenerated) {
      const img = track.querySelector('img');
      img.style.cursor = 'pointer';
      img.onclick = (e) => {
        e.stopPropagation();
        const filename = `fiz-generated-${current.label.replace(/\s+/g, '-').toLowerCase()}.png`;
        downloadGeneratedImage(current.dataUrl, filename);
      };
    }
  } else {
    track.innerHTML = `<div class="placeholder">No image</div>`;
  }

  // Show prompt if this is a generated variant
  if (promptInput && current) {
    if (current.type === 'generated' && current.prompt) {
      promptInput.value = current.prompt;
      promptInput.placeholder = 'Prompt used for this variant';
    } else if (current.type === 'original') {
      promptInput.value = '';
      promptInput.placeholder = 'Describe the image to generate...\n\nExample: Professional photo of a person using banking app on phone, modern office, soft lighting';
    }
  }

  // Render indicator dots
  indicator.innerHTML = variants.map((v, i) => `
    <span class="dot ${i === currentIdx ? 'active' : ''} ${v.type === 'original' ? 'original' : ''}"
          data-index="${i}" title="${v.label}${v.prompt ? ': ' + v.prompt.substring(0, 30) + '...' : ''}"></span>
  `).join('');

  // Add click handlers to dots
  indicator.querySelectorAll('.dot').forEach(dot => {
    dot.onclick = () => {
      previewData.currentVariantIndex = parseInt(dot.dataset.index);
      renderCarousel();
      applyCurrentVariant();
    };
  });

  // Update button states
  prevBtn.disabled = currentIdx === 0;
  nextBtn.disabled = currentIdx === variants.length - 1;
}

// Navigate carousel
function navigateCarousel(direction) {
  const newIdx = previewData.currentVariantIndex + direction;
  if (newIdx >= 0 && newIdx < previewData.imageVariants.length) {
    previewData.currentVariantIndex = newIdx;
    renderCarousel();
    applyCurrentVariant();
  }
}

// Apply current carousel variant to preview
function applyCurrentVariant() {
  const current = previewData.imageVariants[previewData.currentVariantIndex];
  const firstPicture = previewData.sharedPictures[0];

  if (current && current.type !== 'original' && current.dataUrl) {
    previewData.generatedImage = {
      name: firstPicture.name,
      dataUrl: current.dataUrl
    };
  } else {
    previewData.generatedImage = null;
  }

  updateAllPreviews();
}

// Get current variant URL for reference
function getCurrentVariantUrl() {
  const current = previewData.imageVariants[previewData.currentVariantIndex];
  return current?.dataUrl || null;
}

// Close image selection popup
function closeImagePopup() {
  document.getElementById('image-popup').style.display = 'none';
}

// Temporary storage for popup generated images (avoid storing in DOM attributes)
let popupGeneratedImages = [];

// Generate multiple images with Gemini API
async function generateImagesWithGemini(prompt, picture) {
  const generateBtn = document.getElementById('generate-image-btn');
  const btnText = document.getElementById('generate-btn-text');
  const spinner = document.getElementById('generate-spinner');
  const useReference = document.getElementById('use-reference').checked;
  const variantCount = parseInt(document.getElementById('variant-count').value) || 4;
  const popupOverlay = document.getElementById('image-popup');
  const popupGrid = document.getElementById('popup-grid');

  // Show loading state
  generateBtn.disabled = true;
  btnText.style.display = 'none';
  spinner.style.display = 'inline';

  // Get dimensions from first node
  const firstNode = Object.values(picture.nodes)[0];
  const width = Math.round(firstNode.width || 1024);
  const height = Math.round(firstNode.height || 1024);

  // Use current carousel variant as reference (not always original)
  const referenceUrl = useReference ? getCurrentVariantUrl() : null;

  // Show popup with loading placeholders
  popupGrid.innerHTML = Array(variantCount).fill(0).map(() =>
    `<div class="image-popup-item loading"><div class="loader"></div></div>`
  ).join('');
  popupOverlay.style.display = 'flex';

  try {
    const response = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        width,
        height,
        referenceImageUrl: referenceUrl,
        useReference,
        count: variantCount
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate images');
    }

    if (data.success && data.images && data.images.length > 0) {
      // Store images in JS array (not DOM) to preserve data URLs
      popupGeneratedImages = data.images.map(img => `data:${img.mimeType};base64,${img.base64}`);

      // Show generated images in popup
      popupGrid.innerHTML = popupGeneratedImages.map((dataUrl, idx) => `
        <div class="image-popup-item" data-index="${idx}">
          <img src="${dataUrl}" alt="Variant ${idx + 1}">
        </div>
      `).join('');

      // Add click handlers to select and download image
      popupGrid.querySelectorAll('.image-popup-item').forEach(item => {
        item.onclick = () => {
          const idx = parseInt(item.dataset.index);
          const dataUrl = popupGeneratedImages[idx];
          // Download the image
          downloadGeneratedImage(dataUrl, `gemini-variant-${idx + 1}.png`);
          // Add to carousel and select (with prompt)
          addVariantToCarousel(dataUrl, picture.name, prompt);
        };
      });
    } else {
      throw new Error('No images generated');
    }

  } catch (error) {
    console.error('Gemini generation error:', error);
    popupGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--color-danger);">
      Generation error: ${error.message}
    </div>`;
  } finally {
    // Reset button state
    generateBtn.disabled = false;
    btnText.style.display = 'inline';
    spinner.style.display = 'none';
  }
}

// Download generated image
function downloadGeneratedImage(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Add variant to carousel and select it
function addVariantToCarousel(dataUrl, pictureName, prompt = '') {
  // Generate label (Gen 1, Gen 2, etc.)
  const genCount = previewData.imageVariants.filter(v => v.type === 'generated').length;
  const label = `Gen ${genCount + 1}`;

  // Add to variants with prompt
  previewData.imageVariants.push({
    type: 'generated',
    dataUrl,
    label,
    prompt
  });

  // Select the new variant
  previewData.currentVariantIndex = previewData.imageVariants.length - 1;

  // Apply to preview
  previewData.generatedImage = {
    name: pictureName,
    dataUrl
  };

  // Close popup
  closeImagePopup();

  // Update carousel (will also update prompt field)
  renderCarousel();

  // Update all canvas previews
  updateAllPreviews();
}



function populatePreviewDropdowns() {
  const headlineSelect = document.getElementById('preview-headline-select');
  const subheadSelect = document.getElementById('preview-subhead-select');
  const ctaSelect = document.getElementById('preview-cta-select');

  if (headlineSelect) {
    headlineSelect.innerHTML = '<option value="">Select headline...</option>' +
      previewData.headlines.map((h, i) =>
        `<option value="${i}">${h.text.substring(0, 50)}${h.text.length > 50 ? '...' : ''}</option>`
      ).join('');
  }

  if (subheadSelect) {
    subheadSelect.innerHTML = '<option value="">Select subhead...</option>' +
      previewData.subheads.map((s, i) =>
        `<option value="${i}">${s.text.substring(0, 50)}${s.text.length > 50 ? '...' : ''}</option>`
      ).join('');
  }

  if (ctaSelect) {
    ctaSelect.innerHTML = '<option value="">Select CTA...</option>' +
      previewData.ctas.map((c, i) =>
        `<option value="${i}">${c.text}</option>`
      ).join('');
  }
}

function setupPreviewListeners() {
  // Mode toggle (Library / Manual)
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.input-mode').forEach(m => m.classList.remove('active'));
      document.getElementById(`${btn.dataset.mode}-mode`).classList.add('active');

      // Update preview when switching modes
      updateCopyFromInputs();
      updateAllPreviews();
    });
  });

  // Random buttons
  document.getElementById('random-headline-btn')?.addEventListener('click', () => {
    randomizeField('headline');
  });

  document.getElementById('random-subhead-btn')?.addEventListener('click', () => {
    randomizeField('subhead');
  });

  document.getElementById('random-cta-btn')?.addEventListener('click', () => {
    randomizeField('cta');
  });

  document.getElementById('random-all-btn')?.addEventListener('click', randomizeAll);

  // Apply button - update all previews
  document.getElementById('apply-text-btn')?.addEventListener('click', () => {
    updateCopyFromInputs();
    updateAllPreviews();
  });

  // Background color picker
  const colorPicker = document.getElementById('bg-color-picker');
  const colorHex = document.getElementById('bg-color-hex');

  colorPicker?.addEventListener('input', (e) => {
    const color = e.target.value;
    colorHex.value = color.toUpperCase();
    previewData.backgroundColor = color;
    updateAllPreviews();
  });

  colorHex?.addEventListener('change', (e) => {
    let color = e.target.value.trim();
    if (!color.startsWith('#')) color = '#' + color;
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      colorPicker.value = color;
      previewData.backgroundColor = color;
      updateAllPreviews();
    }
  });

  // Dropdown changes - live update
  ['preview-headline-select', 'preview-subhead-select', 'preview-cta-select'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', () => {
      updateCopyFromInputs();
      updateAllPreviews();
    });
  });

  // Manual input changes - live update on blur
  ['preview-headline-input', 'preview-subhead-input', 'preview-cta-input'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      updateCopyFromInputs();
      updateAllPreviews();
    });
  });

  // Click on preview canvas to download
  document.querySelectorAll('.preview-canvas.preview-clickable').forEach(canvas => {
    canvas.addEventListener('click', () => {
      downloadPreview(canvas.dataset.download, 'png');
    });
  });

  document.getElementById('download-all-btn')?.addEventListener('click', downloadAllAsZip);
}

function randomizeField(field) {
  const select = document.getElementById(`preview-${field}-select`);
  const data = field === 'headline' ? previewData.headlines :
               field === 'subhead' ? previewData.subheads : previewData.ctas;

  if (data.length > 0 && select) {
    const randomIndex = Math.floor(Math.random() * data.length);
    select.value = randomIndex;
    updateCopyFromInputs();
    updateAllPreviews();
  }
}

function randomizeAll() {
  ['headline', 'subhead', 'cta'].forEach(field => {
    const select = document.getElementById(`preview-${field}-select`);
    const data = field === 'headline' ? previewData.headlines :
                 field === 'subhead' ? previewData.subheads : previewData.ctas;

    if (data.length > 0 && select) {
      const randomIndex = Math.floor(Math.random() * data.length);
      select.value = randomIndex;
    }
  });

  updateCopyFromInputs();
  updateAllPreviews();
}

function updateCopyFromInputs() {
  const isLibraryMode = document.querySelector('.mode-btn.active')?.dataset.mode === 'library';

  if (isLibraryMode) {
    const headlineIdx = document.getElementById('preview-headline-select')?.value;
    const subheadIdx = document.getElementById('preview-subhead-select')?.value;
    const ctaIdx = document.getElementById('preview-cta-select')?.value;

    previewData.currentCopy.headline = headlineIdx !== '' && previewData.headlines[headlineIdx]
      ? previewData.headlines[headlineIdx].text : '';
    previewData.currentCopy.subhead = subheadIdx !== '' && previewData.subheads[subheadIdx]
      ? previewData.subheads[subheadIdx].text : '';
    previewData.currentCopy.cta = ctaIdx !== '' && previewData.ctas[ctaIdx]
      ? previewData.ctas[ctaIdx].text : '';
  } else {
    previewData.currentCopy.headline = document.getElementById('preview-headline-input')?.value || '';
    previewData.currentCopy.subhead = document.getElementById('preview-subhead-input')?.value || '';
    previewData.currentCopy.cta = document.getElementById('preview-cta-input')?.value || '';
  }
}

function updateAllPreviews() {
  Object.keys(formatSpecs).forEach(format => {
    renderPreview(format);
  });
}

function renderPreview(formatId) {
  const container = document.getElementById(`canvas-${formatId}`);
  if (!container) return;

  const spec = formatSpecs[formatId];
  const formatRatio = spec.ratio;
  const figmaTemplate = previewData.figmaTemplates[formatRatio];
  const { headline, subhead, cta } = previewData.currentCopy;

  // Calculate preview dimensions
  const aspectRatio = spec.width / spec.height;
  const previewHeight = spec.previewHeight;
  const previewWidth = Math.round(previewHeight * aspectRatio);

  // If we have Figma template, render with Canvas
  if (figmaTemplate && figmaTemplate.nodes) {
    renderCanvasPreview(container, formatId, figmaTemplate, { headline, subhead, cta }, previewWidth, previewHeight);
    return;
  }

  // Fallback: render placeholder
  renderPlaceholderPreview(container, formatId, spec, { headline, subhead, cta }, previewWidth, previewHeight);
}

// Image loader helper
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Word wrap text
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}

async function renderCanvasPreview(container, formatId, template, copy, previewWidth, previewHeight) {
  const { headline, subhead, cta } = copy;

  // Create or get canvas
  let canvas = container.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.style.borderRadius = '0';
    canvas.style.display = 'block';
    container.innerHTML = '';
    container.appendChild(canvas);
  }

  canvas.width = previewWidth;
  canvas.height = previewHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Scale from template to preview
  const scale = previewWidth / template.width;

  // 1. Draw background color (ALWAYS draw solid background to avoid transparency)
  const bgColor = previewData.backgroundColor && previewData.backgroundColor !== 'transparent'
    ? previewData.backgroundColor
    : (template.backgroundColor && template.backgroundColor !== 'transparent'
      ? template.backgroundColor
      : '#FFFFFF');
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, previewWidth, previewHeight);

  // 2. Sort nodes by zIndex
  const sortedNodes = [...(template.nodes || [])].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  // 3. Draw all nodes
  for (const node of sortedNodes) {
    const x = node.x * scale;
    const y = node.y * scale;
    const w = node.width * scale;
    const h = node.height * scale;

    if (node.nodeType === 'SHAPE' || node.nodeType === 'IMAGE') {
      // Check if this is a shared picture with generated image
      let imageUrl = node.imageUrl;

      if (node.nodeType === 'IMAGE' && previewData.generatedImage) {
        // Check if node name matches generated image
        if (node.nodeName.toLowerCase() === previewData.generatedImage.name.toLowerCase()) {
          imageUrl = previewData.generatedImage.dataUrl;
        }
      }

      // Draw shape/image
      if (imageUrl) {
        try {
          const img = await loadImage(imageUrl);
          ctx.drawImage(img, x, y, w, h);
        } catch (e) {
          console.warn('Failed to load image:', node.nodeName, e);
        }
      }
    } else if (node.nodeType === 'TEXT') {
      // Get text value - use form input for roles, default for others
      let textValue = node.defaultValue || '';
      if (node.role === 'headline' && headline) textValue = headline;
      else if (node.role === 'subhead' && subhead) textValue = subhead;
      else if (node.role === 'cta' && cta) textValue = cta;

      if (!textValue) continue;

      // Apply text case transformation
      if (node.textCase === 'UPPER') {
        textValue = textValue.toUpperCase();
      } else if (node.textCase === 'LOWER') {
        textValue = textValue.toLowerCase();
      } else if (node.textCase === 'TITLE') {
        textValue = textValue.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      }

      const fontSize = (node.fontSize || 16) * scale;
      const fontFamily = node.fontFamily || 'Inter';
      const fontWeight = node.fontWeight || 400;
      const fontStyle = node.fontStyle || 'normal'; // italic or normal
      const lineHeight = node.lineHeight ? node.lineHeight * scale : fontSize * 1.2;
      const letterSpacing = (node.letterSpacing || 0) * scale;

      // Set font with style (italic)
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;

      // Set color with opacity
      const opacity = node.opacity !== undefined ? node.opacity : 1;
      ctx.globalAlpha = opacity;
      ctx.fillStyle = node.color || '#000000';
      ctx.textBaseline = 'top';

      // Apply letter spacing if needed
      if (letterSpacing !== 0) {
        ctx.letterSpacing = `${letterSpacing}px`;
      }

      // Text alignment
      let textX = x;
      if (node.textAlign === 'center') {
        ctx.textAlign = 'center';
        textX = x + w / 2;
      } else if (node.textAlign === 'right') {
        ctx.textAlign = 'right';
        textX = x + w;
      } else {
        ctx.textAlign = 'left';
      }

      // Word wrap - only if shouldWrap is true (from Figma textAutoResize setting)
      // If shouldWrap is false, text stays on one line (auto-width in Figma)
      let lines;
      if (node.shouldWrap === false) {
        // No wrapping - single line
        lines = [textValue];
      } else {
        lines = wrapText(ctx, textValue, w);
      }
      const totalTextHeight = lines.length * lineHeight;

      // Vertical alignment
      let startY = y;
      if (node.textAlignVertical === 'center') {
        startY = y + (h - totalTextHeight) / 2;
      } else if (node.textAlignVertical === 'bottom') {
        startY = y + h - totalTextHeight;
      }

      // Draw lines
      lines.forEach((line, i) => {
        const lineY = startY + i * lineHeight;
        ctx.fillText(line, textX, lineY);

        // Draw text decoration (underline/strikethrough)
        if (node.textDecoration === 'UNDERLINE' || node.textDecoration === 'STRIKETHROUGH') {
          const textWidth = ctx.measureText(line).width;
          let decorX = textX;
          if (node.textAlign === 'center') {
            decorX = textX - textWidth / 2;
          } else if (node.textAlign === 'right') {
            decorX = textX - textWidth;
          }

          ctx.beginPath();
          if (node.textDecoration === 'UNDERLINE') {
            ctx.moveTo(decorX, lineY + fontSize * 0.9);
            ctx.lineTo(decorX + textWidth, lineY + fontSize * 0.9);
          } else {
            ctx.moveTo(decorX, lineY + fontSize * 0.5);
            ctx.lineTo(decorX + textWidth, lineY + fontSize * 0.5);
          }
          ctx.strokeStyle = node.color || '#000000';
          ctx.lineWidth = fontSize * 0.05;
          ctx.stroke();
        }
      });

      // Reset global alpha
      ctx.globalAlpha = 1;
      // Reset letter spacing
      if (letterSpacing !== 0) {
        ctx.letterSpacing = '0px';
      }
    }
  }
}

function renderPlaceholderPreview(container, formatId, spec, copy, previewWidth, previewHeight) {
  const { headline, subhead, cta } = copy;

  // Show placeholder message
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="${previewWidth}"
         height="${previewHeight}"
         viewBox="0 0 ${previewWidth} ${previewHeight}"
         class="preview-svg preview-placeholder"
         style="border-radius: 0;">

      <!-- Background -->
      <rect width="${previewWidth}" height="${previewHeight}" fill="#1e293b" rx="8"/>

      <!-- Placeholder message -->
      <text x="${previewWidth / 2}" y="${previewHeight / 2 - 20}"
            text-anchor="middle"
            font-family="Inter, sans-serif"
            font-size="14"
            font-weight="500"
            fill="#64748b">
        Import from Figma to see design
      </text>

      <text x="${previewWidth / 2}" y="${previewHeight / 2 + 5}"
            text-anchor="middle"
            font-family="Inter, sans-serif"
            font-size="11"
            fill="#475569">
        ${spec.name} · ${spec.width}×${spec.height}
      </text>

      <!-- Format badge -->
      <rect x="${previewWidth / 2 - 25}" y="${previewHeight / 2 + 20}"
            width="50" height="20" rx="4" fill="#334155"/>
      <text x="${previewWidth / 2}" y="${previewHeight / 2 + 34}"
            text-anchor="middle"
            font-family="Inter, sans-serif"
            font-size="10"
            font-weight="600"
            fill="#94a3b8">
        ${spec.name}
      </text>
    </svg>
  `;

  container.innerHTML = svg;
}

// Helper to darken/lighten colors
function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function downloadPreview(formatId, type) {
  const container = document.getElementById(`canvas-${formatId}`);
  const spec = formatSpecs[formatId];
  const formatRatio = spec.ratio;
  const template = previewData.figmaTemplates[formatRatio];

  if (!template) {
    alert('Сначала импортируйте шаблон из Figma');
    return;
  }

  // Create full-size canvas for export
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = spec.width;
  exportCanvas.height = spec.height;
  const ctx = exportCanvas.getContext('2d');

  // Render at full size
  const scale = spec.width / template.width;
  const { headline, subhead, cta } = previewData.currentCopy;

  // 1. Background (ALWAYS draw solid background to avoid transparency)
  const bgColor = previewData.backgroundColor && previewData.backgroundColor !== 'transparent'
    ? previewData.backgroundColor
    : (template.backgroundColor && template.backgroundColor !== 'transparent'
      ? template.backgroundColor
      : '#FFFFFF');
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, spec.width, spec.height);

  // 2. Sort and draw nodes
  const sortedNodes = [...(template.nodes || [])].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  for (const node of sortedNodes) {
    const x = node.x * scale;
    const y = node.y * scale;
    const w = node.width * scale;
    const h = node.height * scale;

    if (node.nodeType === 'SHAPE' || node.nodeType === 'IMAGE') {
      // Check if this is a shared picture with generated image
      let imageUrl = node.imageUrl;

      if (node.nodeType === 'IMAGE' && previewData.generatedImage) {
        if (node.nodeName.toLowerCase() === previewData.generatedImage.name.toLowerCase()) {
          imageUrl = previewData.generatedImage.dataUrl;
        }
      }

      if (imageUrl) {
        try {
          const img = await loadImage(imageUrl);
          ctx.drawImage(img, x, y, w, h);
        } catch (e) {
          console.warn('Failed to load image:', node.nodeName);
        }
      }
    } else if (node.nodeType === 'TEXT') {
      let textValue = node.defaultValue || '';
      if (node.role === 'headline' && headline) textValue = headline;
      else if (node.role === 'subhead' && subhead) textValue = subhead;
      else if (node.role === 'cta' && cta) textValue = cta;

      if (!textValue) continue;

      // Apply text case transformation
      if (node.textCase === 'UPPER') {
        textValue = textValue.toUpperCase();
      } else if (node.textCase === 'LOWER') {
        textValue = textValue.toLowerCase();
      } else if (node.textCase === 'TITLE') {
        textValue = textValue.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      }

      const fontSize = (node.fontSize || 16) * scale;
      const fontFamily = node.fontFamily || 'Inter';
      const fontWeight = node.fontWeight || 400;
      const fontStyle = node.fontStyle || 'normal';
      const lineHeight = node.lineHeight ? node.lineHeight * scale : fontSize * 1.2;
      const letterSpacing = (node.letterSpacing || 0) * scale;

      // Set font with style
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;

      // Set color with opacity
      const opacity = node.opacity !== undefined ? node.opacity : 1;
      ctx.globalAlpha = opacity;
      ctx.fillStyle = node.color || '#000000';
      ctx.textBaseline = 'top';

      // Apply letter spacing
      if (letterSpacing !== 0) {
        ctx.letterSpacing = `${letterSpacing}px`;
      }

      let textX = x;
      if (node.textAlign === 'center') {
        ctx.textAlign = 'center';
        textX = x + w / 2;
      } else if (node.textAlign === 'right') {
        ctx.textAlign = 'right';
        textX = x + w;
      } else {
        ctx.textAlign = 'left';
      }

      // Word wrap - only if shouldWrap is true
      let lines;
      if (node.shouldWrap === false) {
        lines = [textValue];
      } else {
        lines = wrapText(ctx, textValue, w);
      }
      const totalTextHeight = lines.length * lineHeight;

      let startY = y;
      if (node.textAlignVertical === 'center') {
        startY = y + (h - totalTextHeight) / 2;
      } else if (node.textAlignVertical === 'bottom') {
        startY = y + h - totalTextHeight;
      }

      lines.forEach((line, i) => {
        const lineY = startY + i * lineHeight;
        ctx.fillText(line, textX, lineY);

        // Draw text decoration
        if (node.textDecoration === 'UNDERLINE' || node.textDecoration === 'STRIKETHROUGH') {
          const textWidth = ctx.measureText(line).width;
          let decorX = textX;
          if (node.textAlign === 'center') {
            decorX = textX - textWidth / 2;
          } else if (node.textAlign === 'right') {
            decorX = textX - textWidth;
          }

          ctx.beginPath();
          if (node.textDecoration === 'UNDERLINE') {
            ctx.moveTo(decorX, lineY + fontSize * 0.9);
            ctx.lineTo(decorX + textWidth, lineY + fontSize * 0.9);
          } else {
            ctx.moveTo(decorX, lineY + fontSize * 0.5);
            ctx.lineTo(decorX + textWidth, lineY + fontSize * 0.5);
          }
          ctx.strokeStyle = node.color || '#000000';
          ctx.lineWidth = fontSize * 0.05;
          ctx.stroke();
        }
      });

      // Reset
      ctx.globalAlpha = 1;
      if (letterSpacing !== 0) {
        ctx.letterSpacing = '0px';
      }
    }
  }

  // Download
  const filename = `fiz-creative-${spec.name.replace(':', 'x')}.png`;
  exportCanvas.toBlob(blob => {
    downloadBlob(blob, filename);
  }, 'image/png');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function downloadAllAsZip() {
  // Simple implementation - download each format sequentially
  // For a real ZIP, you'd use JSZip library
  const formats = Object.keys(formatSpecs);

  for (const format of formats) {
    downloadPreview(format, 'svg');
    await new Promise(r => setTimeout(r, 300)); // Small delay between downloads
  }
}

// ===== Utilities =====
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Could add a toast notification here
  });
}

// Make copyText available globally
window.copyText = copyText;

// ===== Event Listeners =====
function initEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-link, .quick-action').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (link.dataset.page) {
        navigateTo(link.dataset.page);
      }
    });
  });

  // Language toggle
  document.querySelectorAll('.lang-toggle').forEach(toggle => {
    toggle.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        toggle.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.language = btn.dataset.lang;

        document.querySelectorAll('.lang-toggle .lang-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.lang === state.language);
        });

        initPage(state.currentPage);
      });
    });
  });

  // Copy Lab
  document.getElementById('generate-btn')?.addEventListener('click', generateCopy);
  document.getElementById('check-btn')?.addEventListener('click', checkCopy);

  document.getElementById('copy-all-btn')?.addEventListener('click', () => {
    const headline = document.getElementById('gen-headline').textContent;
    const subhead = document.getElementById('gen-subhead').textContent;
    const cta = document.getElementById('gen-cta').textContent;
    copyText(`Headline: ${headline}\nSubhead: ${subhead}\nCTA: ${cta}`);
  });

  document.querySelectorAll('.copy-btn[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.copy;
      const text = document.getElementById(`gen-${type}`).textContent;
      copyText(text);
    });
  });

  // Checklist reset
  document.getElementById('reset-checklist')?.addEventListener('click', () => {
    state.checklistState = {};
    renderChecklist();
  });

  // Headlines filter
  document.getElementById('headline-filters')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('format-tab')) {
      document.querySelectorAll('#headline-filters .format-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      state.headlineFilter = e.target.dataset.filter;
      renderHeadlines();
    }
  });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  navigateTo('dashboard');
});
