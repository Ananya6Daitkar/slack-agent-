export function previewPage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CrisisOps Agent Demo</title>
  <style>
    :root { color-scheme: light; --ink:#17222b; --muted:#5a6973; --line:#d7e3ea; --accent:#611f69; --green:#2eb67d; --blue:#36c5f0; --gold:#ecb22e; --red:#e01e5a; }
    body { margin:0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:#f5f7f8; color:var(--ink); }
    header { padding:34px 42px 28px; background:linear-gradient(125deg,#241436,#23323f 58%,#12352e); color:#fff; }
    h1 { margin:0; font-size:42px; line-height:1.05; letter-spacing:0; }
    .tag { margin-top:12px; max-width:900px; font-size:18px; color:#dbe8ee; }
    main { padding:28px 42px 46px; display:grid; grid-template-columns: 360px minmax(0,1fr); gap:22px; }
    .panel { background:#fff; border:1px solid var(--line); border-radius:8px; box-shadow:0 8px 24px rgba(18,31,40,.08); }
    .controls { padding:18px; display:grid; gap:10px; align-content:start; }
    button { border:0; border-radius:6px; padding:12px 14px; font-weight:700; font-size:15px; color:#fff; background:var(--accent); cursor:pointer; text-align:left; }
    button:nth-child(2){background:#3b5260} button:nth-child(3){background:var(--green)} button:nth-child(4){background:var(--blue);color:#10232d} button:nth-child(5){background:var(--gold);color:#241b00} button:nth-child(6){background:var(--red)}
    .output { padding:20px; min-height:560px; overflow:auto; }
    pre { white-space:pre-wrap; word-break:break-word; background:#10202a; color:#edf7fb; border-radius:8px; padding:18px; font-size:13px; line-height:1.5; }
    .metrics { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; margin-bottom:16px; }
    .metric { padding:14px; border:1px solid var(--line); border-radius:8px; background:#fafcfd; }
    .metric b { display:block; font-size:24px; }
    .metric span { color:var(--muted); font-size:13px; }
    .small { color:var(--muted); font-size:13px; margin-top:10px; }
    img { width:100%; border-radius:8px; border:1px solid var(--line); margin-top:12px; background:#182530; }
    @media (max-width:900px){ main{grid-template-columns:1fr;padding:18px} header{padding:26px 22px} h1{font-size:32px}.metrics{grid-template-columns:1fr 1fr} }
  </style>
</head>
<body>
  <header>
    <h1>CrisisOps Agent</h1>
    <div class="tag">A Slack-native command center that detects emerging incidents, creates sourced briefings, matches resources through MCP tools, records decisions, and drafts approved updates.</div>
  </header>
  <main>
    <section class="panel controls">
      <button onclick="call('/demo/chaos-radar')">1. Run Chaos Radar</button>
      <button onclick="post('/demo/open-incident')">2. Open Incident</button>
      <button onclick="call('/demo/brief')">3. Generate Brief</button>
      <button onclick="call('/demo/match-resources')">4. Match Resources</button>
      <button onclick="post('/demo/decision')">5. Record Decision</button>
      <button onclick="post('/demo/approve-update')">6. Approve Update</button>
      <button onclick="callText('/demo/postmortem')">7. Generate Postmortem</button>
      <button onclick="post('/demo/reset')">Reset Demo</button>
      <div class="small">Use this page for web preview and DevPost screenshots. The real demo should be recorded inside Slack with <code>/crisisops simulate</code>.</div>
      <img src="/assets/architecture-diagram.svg" alt="CrisisOps architecture diagram" />
    </section>
    <section class="panel output">
      <div class="metrics">
        <div class="metric"><b>98%</b><span>Chaos confidence</span></div>
        <div class="metric"><b>SEV2</b><span>Suggested severity</span></div>
        <div class="metric"><b>6</b><span>Channels detected</span></div>
        <div class="metric"><b>3</b><span>Core systems: Slack + RTS + MCP</span></div>
      </div>
      <pre id="out">Click "Run Chaos Radar" to start the demo.</pre>
    </section>
  </main>
  <script>
    const out = document.getElementById('out');
    async function call(path){ const r = await fetch(path); out.textContent = JSON.stringify(await r.json(), null, 2); }
    async function post(path){ const r = await fetch(path, {method:'POST', headers:{'content-type':'application/json'}, body:'{}'}); out.textContent = JSON.stringify(await r.json(), null, 2); }
    async function callText(path){ const r = await fetch(path); out.textContent = await r.text(); }
  </script>
</body>
</html>`;
}
