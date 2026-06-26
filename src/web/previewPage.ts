export function previewPage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CrisisOps Agent — Command Center</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

    :root {
      --bg: #0a0e14;
      --surface: #0f1520;
      --surface2: #151d2b;
      --border: #1e2d42;
      --border-glow: #2a4060;
      --text: #e2eaf5;
      --muted: #5a7494;
      --accent: #4f8ef7;
      --accent2: #7c5cfc;
      --green: #22d07a;
      --red: #f74f6a;
      --amber: #f5a623;
      --cyan: #22d0d0;
      --pulse: #f74f6a;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* ── Animated background grid ── */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(79,142,247,.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(79,142,247,.03) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
      z-index: 0;
    }

    /* ── Top header ── */
    header {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 32px;
      border-bottom: 1px solid var(--border);
      background: rgba(15,21,32,.9);
      backdrop-filter: blur(12px);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #4f8ef7, #7c5cfc);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .logo-text {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #fff;
    }

    .logo-badge {
      font-size: 11px;
      font-weight: 600;
      background: rgba(79,142,247,.15);
      border: 1px solid rgba(79,142,247,.3);
      color: var(--accent);
      padding: 2px 8px;
      border-radius: 20px;
      letter-spacing: .5px;
      text-transform: uppercase;
    }

    .header-status {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .status-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--green);
      letter-spacing: .5px;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 8px var(--green);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: .6; transform: scale(.85); }
    }

    /* ── Hero banner ── */
    .hero {
      position: relative;
      z-index: 1;
      padding: 40px 32px 32px;
      border-bottom: 1px solid var(--border);
      background: linear-gradient(180deg, rgba(79,142,247,.05) 0%, transparent 100%);
    }

    .hero h1 {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: -1px;
      line-height: 1.1;
      background: linear-gradient(135deg, #fff 0%, #8ab8ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
    }

    .hero p {
      font-size: 15px;
      color: var(--muted);
      max-width: 620px;
      line-height: 1.6;
    }

    /* ── Metrics bar ── */
    .metrics-bar {
      display: flex;
      gap: 16px;
      padding: 20px 32px;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
      overflow-x: auto;
    }

    .metric-card {
      flex: 1;
      min-width: 130px;
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px 18px;
      transition: border-color .2s;
    }

    .metric-card:hover { border-color: var(--border-glow); }

    .metric-card .val {
      font-size: 26px;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 4px;
    }

    .metric-card .label {
      font-size: 11px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: .6px;
    }

    .val-red   { color: var(--red); text-shadow: 0 0 20px rgba(247,79,106,.4); }
    .val-amber { color: var(--amber); text-shadow: 0 0 20px rgba(245,166,35,.4); }
    .val-green { color: var(--green); text-shadow: 0 0 20px rgba(34,208,122,.4); }
    .val-blue  { color: var(--accent); text-shadow: 0 0 20px rgba(79,142,247,.4); }

    /* ── Main layout ── */
    .workspace {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 0;
      min-height: calc(100vh - 240px);
    }

    /* ── Sidebar ── */
    .sidebar {
      border-right: 1px solid var(--border);
      background: var(--surface);
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sidebar-label {
      font-size: 10px;
      font-weight: 700;
      color: var(--muted);
      letter-spacing: 1.2px;
      text-transform: uppercase;
      padding: 4px 12px 8px;
    }

    .step-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 10px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--muted);
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
      transition: all .18s;
      width: 100%;
    }

    .step-btn:hover {
      background: var(--surface2);
      color: var(--text);
      border-color: var(--border);
    }

    .step-btn.active {
      background: rgba(79,142,247,.1);
      border-color: rgba(79,142,247,.3);
      color: #fff;
    }

    .step-btn.done {
      color: var(--green);
    }

    .step-btn.done .step-num {
      background: var(--green);
      color: #000;
    }

    .step-num {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      background: var(--surface2);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      flex-shrink: 0;
      transition: all .18s;
    }

    .step-btn.active .step-num {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
    }

    .step-icon { font-size: 14px; flex-shrink: 0; }

    .sidebar-divider {
      height: 1px;
      background: var(--border);
      margin: 8px 0;
    }

    .reset-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--muted);
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all .18s;
      width: 100%;
      text-align: left;
    }

    .reset-btn:hover {
      border-color: var(--red);
      color: var(--red);
    }

    /* ── Output panel ── */
    .output-panel {
      display: flex;
      flex-direction: column;
      background: var(--bg);
    }

    .output-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 24px;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
    }

    .output-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .output-tag {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 4px;
      letter-spacing: .5px;
      text-transform: uppercase;
    }

    .tag-live {
      background: rgba(247,79,106,.15);
      color: var(--red);
      border: 1px solid rgba(247,79,106,.3);
    }

    .tag-json {
      background: rgba(79,142,247,.12);
      color: var(--accent);
      border: 1px solid rgba(79,142,247,.25);
    }

    .output-actions {
      display: flex;
      gap: 8px;
    }

    .icon-btn {
      background: var(--surface2);
      border: 1px solid var(--border);
      color: var(--muted);
      border-radius: 6px;
      padding: 5px 10px;
      font-size: 12px;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      transition: all .15s;
    }

    .icon-btn:hover { border-color: var(--border-glow); color: var(--text); }

    .output-body {
      flex: 1;
      padding: 24px;
      overflow: auto;
    }

    /* ── Welcome state ── */
    .welcome {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 400px;
      gap: 16px;
      text-align: center;
      color: var(--muted);
    }

    .welcome-icon {
      font-size: 48px;
      filter: grayscale(.3);
    }

    .welcome h2 {
      font-size: 18px;
      font-weight: 700;
      color: var(--text);
    }

    .welcome p {
      font-size: 14px;
      max-width: 380px;
      line-height: 1.6;
    }

    .welcome-hint {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .kbd {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 5px;
      padding: 3px 8px;
      font-size: 12px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--accent);
    }

    /* ── Result cards ── */
    .result-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 16px;
    }

    .result-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      border-bottom: 1px solid var(--border);
      background: var(--surface2);
    }

    .result-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .result-body {
      padding: 18px;
    }

    /* ── Severity badge ── */
    .sev {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 5px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .8px;
      text-transform: uppercase;
    }

    .sev-1 { background: rgba(247,79,106,.15); color: var(--red); border: 1px solid rgba(247,79,106,.3); }
    .sev-2 { background: rgba(245,166,35,.15); color: var(--amber); border: 1px solid rgba(245,166,35,.3); }
    .sev-3 { background: rgba(79,142,247,.12); color: var(--accent); border: 1px solid rgba(79,142,247,.25); }

    /* ── Timeline ── */
    .timeline { display: flex; flex-direction: column; gap: 0; }

    .timeline-item {
      display: flex;
      gap: 14px;
      padding: 10px 0;
      border-left: 2px solid var(--border);
      padding-left: 18px;
      margin-left: 10px;
      position: relative;
    }

    .timeline-item::before {
      content: '';
      position: absolute;
      left: -5px;
      top: 16px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
      border: 2px solid var(--bg);
    }

    .timeline-item.red::before { background: var(--red); }
    .timeline-item.green::before { background: var(--green); }
    .timeline-item.amber::before { background: var(--amber); }

    .timeline-time {
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--muted);
      min-width: 80px;
      padding-top: 1px;
    }

    .timeline-content { font-size: 13px; line-height: 1.5; }

    .timeline-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .5px;
      text-transform: uppercase;
      color: var(--muted);
    }

    /* ── Data grid ── */
    .data-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .data-item {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 14px;
    }

    .data-item .key {
      font-size: 10px;
      font-weight: 700;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: .6px;
      margin-bottom: 5px;
    }

    .data-item .value {
      font-size: 13px;
      font-weight: 500;
      line-height: 1.4;
    }

    /* ── Resource match card ── */
    .resource-match {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px;
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 10px;
      margin-bottom: 10px;
      transition: border-color .15s;
    }

    .resource-match:hover { border-color: var(--border-glow); }

    .resource-score {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 800;
      flex-shrink: 0;
    }

    .score-high { background: rgba(34,208,122,.15); color: var(--green); border: 1px solid rgba(34,208,122,.3); }
    .score-med  { background: rgba(245,166,35,.15);  color: var(--amber); border: 1px solid rgba(245,166,35,.3); }

    .resource-info { flex: 1; }
    .resource-name { font-size: 14px; font-weight: 700; margin-bottom: 3px; }
    .resource-detail { font-size: 12px; color: var(--muted); }

    .resource-tag {
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: .4px;
    }

    .tag-available { background: rgba(34,208,122,.12); color: var(--green); border: 1px solid rgba(34,208,122,.2); }
    .tag-reserved  { background: rgba(245,166,35,.12);  color: var(--amber); border: 1px solid rgba(245,166,35,.2); }

    /* ── Decision card ── */
    .decision-card {
      border-left: 3px solid var(--accent2);
      padding-left: 16px;
      margin-bottom: 14px;
    }

    .decision-text { font-size: 15px; font-weight: 600; margin-bottom: 8px; line-height: 1.4; }

    .decision-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .meta-chip {
      font-size: 11px;
      padding: 3px 9px;
      border-radius: 4px;
      background: var(--surface2);
      border: 1px solid var(--border);
      color: var(--muted);
    }

    /* ── JSON code block ── */
    .code-block {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      line-height: 1.6;
      color: #a8c4e0;
      background: #060c14;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 18px;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }

    /* ── Loading spinner ── */
    .loading {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px;
      color: var(--muted);
      font-size: 14px;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid var(--border);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin .7s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Postmortem ── */
    .postmortem-body {
      font-size: 14px;
      line-height: 1.8;
      white-space: pre-wrap;
      color: #c8d8e8;
      font-family: 'JetBrains Mono', monospace;
    }

    /* ── Chaos score bar ── */
    .chaos-bar-wrap {
      background: var(--surface2);
      border-radius: 6px;
      height: 8px;
      overflow: hidden;
      margin-top: 6px;
    }

    .chaos-bar-fill {
      height: 100%;
      border-radius: 6px;
      background: linear-gradient(90deg, var(--amber), var(--red));
      transition: width 1s cubic-bezier(.4,0,.2,1);
    }

    /* ── Toast ── */
    .toast {
      position: fixed;
      bottom: 28px;
      right: 28px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px 20px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
      box-shadow: 0 8px 32px rgba(0,0,0,.5);
      z-index: 100;
      transform: translateY(80px);
      opacity: 0;
      transition: all .3s cubic-bezier(.4,0,.2,1);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }

    .toast.success { border-color: rgba(34,208,122,.4); }
    .toast.error   { border-color: rgba(247,79,106,.4); }

    /* ── Architecture section ── */
    .arch-section {
      padding: 24px;
      border-top: 1px solid var(--border);
    }

    .arch-label {
      font-size: 11px;
      font-weight: 700;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 14px;
    }

    .arch-section img {
      width: 100%;
      border-radius: 10px;
      border: 1px solid var(--border);
      opacity: .85;
      transition: opacity .2s;
    }

    .arch-section img:hover { opacity: 1; }

    /* ── Responsive ── */
    @media (max-width: 860px) {
      .workspace { grid-template-columns: 1fr; }
      .sidebar { border-right: none; border-bottom: 1px solid var(--border); flex-direction: row; flex-wrap: wrap; padding: 12px; }
      .sidebar-label { display: none; }
      .step-btn { flex: 1 0 140px; }
      .metrics-bar { padding: 14px 16px; }
      .hero { padding: 28px 16px 22px; }
      header { padding: 14px 16px; }
      .output-body { padding: 16px; }
    }
  </style>
</head>
<body>

<header>
  <div class="logo">
    <div class="logo-icon">🚨</div>
    <span class="logo-text">CrisisOps</span>
    <span class="logo-badge">Agent</span>
  </div>
  <div class="header-status">
    <div class="status-pill">
      <div class="status-dot"></div>
      LIVE DEMO
    </div>
  </div>
</header>

<div class="hero">
  <h1>Slack-Native Emergency Command</h1>
  <p>Detect incidents early, generate sourced briefings, match resources, record decisions, and create postmortems — all without leaving Slack.</p>
</div>

<div class="metrics-bar">
  <div class="metric-card">
    <div class="val val-red" id="m-chaos">—</div>
    <div class="label">Chaos Score</div>
  </div>
  <div class="metric-card">
    <div class="val val-amber" id="m-sev">—</div>
    <div class="label">Severity</div>
  </div>
  <div class="metric-card">
    <div class="val val-blue" id="m-channels">6</div>
    <div class="label">Channels Monitored</div>
  </div>
  <div class="metric-card">
    <div class="val val-green" id="m-resources">—</div>
    <div class="label">Resources Matched</div>
  </div>
  <div class="metric-card">
    <div class="val val-blue" id="m-decisions">—</div>
    <div class="label">Decisions Logged</div>
  </div>
</div>

<div class="workspace">
  <aside class="sidebar">
    <div class="sidebar-label">Workflow</div>

    <button class="step-btn" id="btn-1" onclick="runStep(1)">
      <span class="step-num" id="num-1">1</span>
      <span class="step-icon">📡</span>
      Chaos Radar
    </button>
    <button class="step-btn" id="btn-2" onclick="runStep(2)">
      <span class="step-num" id="num-2">2</span>
      <span class="step-icon">🔴</span>
      Open Incident
    </button>
    <button class="step-btn" id="btn-3" onclick="runStep(3)">
      <span class="step-num" id="num-3">3</span>
      <span class="step-icon">📋</span>
      Situation Brief
    </button>
    <button class="step-btn" id="btn-4" onclick="runStep(4)">
      <span class="step-num" id="num-4">4</span>
      <span class="step-icon">🔧</span>
      Match Resources
    </button>
    <button class="step-btn" id="btn-5" onclick="runStep(5)">
      <span class="step-num" id="num-5">5</span>
      <span class="step-icon">📝</span>
      Record Decision
    </button>
    <button class="step-btn" id="btn-6" onclick="runStep(6)">
      <span class="step-num" id="num-6">6</span>
      <span class="step-icon">✅</span>
      Approve Update
    </button>
    <button class="step-btn" id="btn-7" onclick="runStep(7)">
      <span class="step-num" id="num-7">7</span>
      <span class="step-icon">📊</span>
      Postmortem
    </button>

    <div class="sidebar-divider"></div>

    <button class="reset-btn" onclick="resetDemo()">
      ↺ &nbsp;Reset Demo
    </button>

    <div class="arch-section">
      <div class="arch-label">Architecture</div>
      <img src="/assets/architecture-diagram.svg" alt="CrisisOps architecture" />
    </div>
  </aside>

  <main class="output-panel">
    <div class="output-toolbar">
      <div class="output-title">
        <span id="output-label">Output</span>
        <span class="output-tag tag-live" id="output-tag" style="display:none">LIVE</span>
      </div>
      <div class="output-actions">
        <button class="icon-btn" onclick="copyOutput()">Copy</button>
        <button class="icon-btn" onclick="clearOutput()">Clear</button>
      </div>
    </div>
    <div class="output-body" id="output-body">
      <div class="welcome">
        <div class="welcome-icon">🛰️</div>
        <h2>Command Center Ready</h2>
        <p>Click a step in the sidebar to run the demo workflow, or start from the beginning with Chaos Radar.</p>
        <div class="welcome-hint">
          <span class="kbd">/crisisops simulate</span>
          <span class="kbd">@CrisisOps brief</span>
          <span class="kbd">/crisisops postmortem</span>
        </div>
      </div>
    </div>
  </main>
</div>

<div class="toast" id="toast"></div>

<script>
  const steps = [
    { id: 1, label: 'Chaos Radar',     method: 'GET',  url: '/demo/chaos-radar',    render: renderChaos },
    { id: 2, label: 'Open Incident',   method: 'POST', url: '/demo/open-incident',  render: renderIncident },
    { id: 3, label: 'Situation Brief', method: 'GET',  url: '/demo/brief',          render: renderBrief },
    { id: 4, label: 'Match Resources', method: 'GET',  url: '/demo/match-resources',render: renderResources },
    { id: 5, label: 'Record Decision', method: 'POST', url: '/demo/decision',       render: renderDecision },
    { id: 6, label: 'Approve Update',  method: 'POST', url: '/demo/approve-update', render: renderApproval },
    { id: 7, label: 'Postmortem',      method: 'GET',  url: '/demo/postmortem',     render: renderPostmortem, text: true },
  ];

  let completedSteps = new Set();
  let lastData = null;

  async function runStep(n) {
    const step = steps[n - 1];
    setActive(n);
    showLoading(step.label);

    try {
      const opts = step.method === 'POST'
        ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }
        : {};
      const r = await fetch(step.url, opts);
      const data = step.text ? await r.text() : await r.json();
      lastData = data;
      completedSteps.add(n);
      updateMetrics(n, data);
      step.render(data);
      markDone(n);
      showToast('✅ ' + step.label + ' complete', 'success');
    } catch (e) {
      document.getElementById('output-body').innerHTML =
        '<div class="result-card"><div class="result-header"><div class="result-title">❌ Error</div></div><div class="result-body"><div class="code-block">' + e.message + '</div></div></div>';
      showToast('❌ Error: ' + e.message, 'error');
    }
  }

  function setActive(n) {
    document.querySelectorAll('.step-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + n)?.classList.add('active');
    document.getElementById('output-label').textContent = steps[n-1].label;
    document.getElementById('output-tag').style.display = 'inline-flex';
  }

  function markDone(n) {
    const btn = document.getElementById('btn-' + n);
    const num = document.getElementById('num-' + n);
    if (btn) btn.classList.add('done');
    if (num) num.textContent = '✓';
  }

  function showLoading(label) {
    document.getElementById('output-body').innerHTML =
      '<div class="loading"><div class="spinner"></div>Running ' + label + '...</div>';
  }

  function updateMetrics(step, data) {
    if (step === 1 && data.confidence !== undefined) {
      document.getElementById('m-chaos').textContent = data.confidence + '%';
      document.getElementById('m-sev').textContent = data.severity;
    }
    if (step === 4 && Array.isArray(data)) {
      document.getElementById('m-resources').textContent = data.length;
    }
    if (step === 5 && data.decision) {
      const cur = parseInt(document.getElementById('m-decisions').textContent) || 0;
      document.getElementById('m-decisions').textContent = cur + 1;
    }
  }

  function card(icon, title, body) {
    return '<div class="result-card">' +
      '<div class="result-header"><div class="result-title">' + icon + '&nbsp;&nbsp;' + title + '</div></div>' +
      '<div class="result-body">' + body + '</div></div>';
  }

  function chip(label, val) {
    return '<div class="data-item"><div class="key">' + label + '</div><div class="value">' + val + '</div></div>';
  }

  function renderChaos(d) {
    const pct = d.confidence || 0;
    const barW = pct + '%';
    let html = card('📡', 'Chaos Radar — ' + (d.severity || ''),
      '<div class="data-grid">' +
        chip('Confidence', '<span style="color:var(--red);font-weight:800">' + pct + '%</span>') +
        chip('Severity', '<span class="sev sev-2">' + (d.severity||'') + '</span>') +
        chip('Recommended Action', d.recommendedAction || '') +
        chip('Evidence Messages', (d.evidence||[]).length) +
      '</div>' +
      '<div style="margin:16px 0 8px;font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px">Chaos score</div>' +
      '<div class="chaos-bar-wrap"><div class="chaos-bar-fill" style="width:' + barW + '"></div></div>' +
      '<div style="margin-top:18px">' +
        (d.signals||[]).map(function(s){ return '<div class="timeline-item red"><div class="timeline-content">' + s + '</div></div>'; }).join('') +
      '</div>'
    );

    if (d.evidence && d.evidence.length) {
      html += card('📨', 'Source Evidence (' + d.evidence.length + ' messages)',
        '<div class="timeline">' +
        d.evidence.map(function(m){
          return '<div class="timeline-item"><div class="timeline-time">' + m.channel + '</div><div class="timeline-content"><div class="timeline-label">' + m.user + '</div>' + m.text + '</div></div>';
        }).join('') +
        '</div>'
      );
    }
    document.getElementById('output-body').innerHTML = html;
  }

  function renderIncident(d) {
    const inc = d.incident || {};
    const tasks = d.tasks || [];
    let html = card('🔴', 'Incident Command Center',
      '<div class="data-grid">' +
        chip('Incident ID', '<code style="font-size:11px;color:var(--accent)">' + (inc.id||'').slice(0,8) + '…</code>') +
        chip('Severity', '<span class="sev sev-2">' + (inc.severity||'') + '</span>') +
        chip('Status', inc.status || '') +
        chip('Commander', inc.commanderUserId || '') +
      '</div>'
    );
    if (tasks.length) {
      html += card('✅', 'Response Tasks (' + tasks.length + ')',
        tasks.map(function(t){
          return '<div class="resource-match"><div class="resource-score score-high" style="font-size:11px">' + t.priority.toUpperCase() + '</div><div class="resource-info"><div class="resource-name">' + t.title + '</div><div class="resource-detail">' + t.description + '</div></div><span class="resource-tag tag-available">' + t.status + '</span></div>';
        }).join('')
      );
    }
    document.getElementById('output-body').innerHTML = html;
  }

  function renderBrief(d) {
    const lines = (d.content || '').split('\\n');
    const html = card('📋', 'Situation Brief',
      '<div class="code-block">' + (d.content || '').replace(/</g, '&lt;') + '</div>' +
      '<div style="margin-top:12px;font-size:12px;color:var(--muted)">📎 Evidence cited from ' + (d.evidenceUrls||[]).length + ' messages</div>'
    );
    document.getElementById('output-body').innerHTML = html;
  }

  function renderResources(matches) {
    if (!Array.isArray(matches) || !matches.length) {
      document.getElementById('output-body').innerHTML = card('🔧', 'Resource Matches', '<p style="color:var(--muted)">No matches found.</p>');
      return;
    }
    const scoreClass = function(s) { return s >= 80 ? 'score-high' : 'score-med'; };
    const html = card('🔧', 'Resource Matches — ' + matches.length + ' ranked',
      '<div style="margin-bottom:8px;font-size:12px;color:var(--muted)">🛠 MCP tools called: <code>search_inventory → get_location_eta → reserve_resource</code></div>' +
      matches.slice(0,5).map(function(m, i){
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
        return '<div class="resource-match">' +
          '<div class="resource-score ' + scoreClass(m.score) + '">' + medal + '</div>' +
          '<div class="resource-info"><div class="resource-name">Score: ' + m.score + '/100</div><div class="resource-detail">' + m.rationale + '</div></div>' +
          '<span class="resource-tag tag-available">match</span></div>';
      }).join('')
    );
    document.getElementById('output-body').innerHTML = html;
  }

  function renderDecision(d) {
    const dec = d.decision;
    if (!dec) {
      document.getElementById('output-body').innerHTML = card('📝', 'Decision Ledger', '<p style="color:var(--muted)">No decision proposal found in current evidence.</p>');
      return;
    }
    const html = card('📝', 'Decision Ledger Entry',
      '<div class="decision-card">' +
        '<div class="decision-text">' + dec.text + '</div>' +
        '<div class="decision-meta">' +
          '<span class="meta-chip">Owner: ' + dec.owner + '</span>' +
          '<span class="meta-chip">Status: ' + dec.approvalStatus + '</span>' +
          '<span class="meta-chip">Risk: ' + dec.risk + '</span>' +
        '</div>' +
      '</div>' +
      '<div style="margin-top:12px;font-size:12px;color:var(--muted)">📎 Evidence: ' + (dec.evidenceUrls||[]).join(', ') + '</div>'
    );
    document.getElementById('output-body').innerHTML = html;
  }

  function renderApproval(d) {
    const html = card('✅', 'Update Approved & Sent',
      '<div class="data-grid">' +
        chip('Status ID', d.result?.statusId || '—') +
        chip('Audience', d.result?.audience || '—') +
        chip('Posted', d.result?.posted ? '✅ Yes' : '❌ No') +
        chip('Approved By', d.draft?.incident?.commanderUserId || 'demo-user') +
      '</div>' +
      '<div style="margin-top:16px;padding:14px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;font-size:13px;line-height:1.6">' +
        '<div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px">Approved Message Content</div>' +
        (d.draft?.content || '') +
      '</div>'
    );
    document.getElementById('output-body').innerHTML = html;
  }

  function renderPostmortem(text) {
    document.getElementById('output-body').innerHTML = card('📊', 'Postmortem Report',
      '<div class="postmortem-body">' + text.replace(/</g, '&lt;').replace(/^# .*/m, '').trim() + '</div>'
    );
  }

  async function resetDemo() {
    await fetch('/demo/reset', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
    completedSteps.clear();
    document.querySelectorAll('.step-btn').forEach(b => { b.classList.remove('active','done'); });
    document.querySelectorAll('.step-num').forEach((n, i) => { n.textContent = i + 1; });
    document.getElementById('m-chaos').textContent = '—';
    document.getElementById('m-sev').textContent = '—';
    document.getElementById('m-resources').textContent = '—';
    document.getElementById('m-decisions').textContent = '—';
    document.getElementById('output-tag').style.display = 'none';
    document.getElementById('output-label').textContent = 'Output';
    document.getElementById('output-body').innerHTML =
      '<div class="welcome"><div class="welcome-icon">🛰️</div><h2>Demo Reset</h2><p>All incident data cleared. Click Chaos Radar to start again.</p></div>';
    showToast('↺ Demo reset', 'success');
  }

  function copyOutput() {
    const text = document.getElementById('output-body').innerText;
    navigator.clipboard.writeText(text).then(function(){ showToast('📋 Copied to clipboard', 'success'); });
  }

  function clearOutput() {
    document.getElementById('output-body').innerHTML =
      '<div class="welcome"><div class="welcome-icon">🛰️</div><h2>Command Center Ready</h2><p>Click a step in the sidebar to run the demo workflow.</p></div>';
    document.getElementById('output-tag').style.display = 'none';
  }

  let toastTimeout;
  function showToast(msg, type) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast ' + type + ' show';
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function(){ t.classList.remove('show'); }, 3000);
  }
</script>
</body>
</html>`;
}
