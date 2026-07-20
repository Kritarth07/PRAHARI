/**
 * network-graph.js — MODULE CS-05
 * Fraud Network Graph (SVG) + FIR Intelligence Package export
 */

/* ── Static graph data ────────────────────────────────────────── */
const NET_NODES = [
  { id: 'n1', x: 400, y: 60,  type: 'account', label: 'A/C ••4471',     risk: 'High',     info: 'Mule account · 14 inbound transfers in 48h' },
  { id: 'n2', x: 220, y: 150, type: 'phone',   label: '+91 78••2210',   risk: 'Critical',  info: 'Flagged in 9 digital-arrest reports' },
  { id: 'n3', x: 580, y: 150, type: 'phone',   label: '+91 90••7734',   risk: 'High',      info: 'SIM registered with mismatched KYC' },
  { id: 'n4', x: 130, y: 280, type: 'device',  label: 'Device D‑2291', risk: 'Medium',    info: 'Shared across 3 flagged numbers' },
  { id: 'n5', x: 330, y: 300, type: 'account', label: 'A/C ••8823',     risk: 'Critical',  info: 'Receiving account · linked to 6 prior FIRs' },
  { id: 'n6', x: 500, y: 320, type: 'device',  label: 'Device D‑5510', risk: 'Medium',    info: 'IMEI linked to 2 counterfeit-SIM cases' },
  { id: 'n7', x: 670, y: 280, type: 'phone',   label: '+91 63••9012',   risk: 'Low',       info: 'Recently flagged, single report' },
  { id: 'n8', x: 400, y: 420, type: 'account', label: 'A/C ••1190',     risk: 'High',      info: 'Layering account · rapid withdrawal pattern' },
];

const NET_EDGES = [
  ['n2', 'n1'], ['n2', 'n4'], ['n1', 'n5'], ['n3', 'n1'], ['n3', 'n6'],
  ['n4', 'n5'], ['n5', 'n8'], ['n6', 'n8'], ['n6', 'n7'], ['n3', 'n7'],
];

const NODE_COLORS = { Critical: '#D64541', High: '#F2A93B', Medium: '#4C7EBF', Low: '#2F9E63' };
const NODE_ICONS  = { phone: '📞', account: '🏦', device: '📱' };

/* ── SVG graph builder ─────────────────────────────────────────── */
function buildNetworkGraph() {
  const svg = document.getElementById('networkSvg');
  const ns  = 'http://www.w3.org/2000/svg';
  svg.innerHTML = '';

  // Edges
  const edgeGroup = document.createElementNS(ns, 'g');
  NET_EDGES.forEach(([a, b]) => {
    const na = NET_NODES.find(n => n.id === a);
    const nb = NET_NODES.find(n => n.id === b);
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', na.x); line.setAttribute('y1', na.y);
    line.setAttribute('x2', nb.x); line.setAttribute('y2', nb.y);
    line.setAttribute('stroke', 'var(--border)'); line.setAttribute('stroke-width', '1.5');
    line.dataset.a = a; line.dataset.b = b;
    edgeGroup.appendChild(line);
  });
  svg.appendChild(edgeGroup);

  // Nodes
  const nodeGroup = document.createElementNS(ns, 'g');
  NET_NODES.forEach(n => {
    const g = document.createElementNS(ns, 'g');
    g.style.cursor = 'pointer';
    g.dataset.id = n.id;

    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', n.x); circle.setAttribute('cy', n.y); circle.setAttribute('r', 24);
    circle.setAttribute('fill', 'var(--panel)');
    circle.setAttribute('stroke', NODE_COLORS[n.risk]); circle.setAttribute('stroke-width', '2.5');
    g.appendChild(circle);

    const icon = document.createElementNS(ns, 'text');
    icon.setAttribute('x', n.x); icon.setAttribute('y', n.y + 6);
    icon.setAttribute('text-anchor', 'middle'); icon.setAttribute('font-size', '16');
    icon.textContent = NODE_ICONS[n.type];
    g.appendChild(icon);

    const labelEl = document.createElementNS(ns, 'text');
    labelEl.setAttribute('x', n.x); labelEl.setAttribute('y', n.y + 42);
    labelEl.setAttribute('text-anchor', 'middle'); labelEl.setAttribute('font-size', '10.5');
    labelEl.setAttribute('font-family', 'IBM Plex Mono, monospace');
    labelEl.setAttribute('fill', 'var(--text-dim)');
    labelEl.textContent = n.label;
    g.appendChild(labelEl);

    g.addEventListener('click', () => selectNetworkNode(n.id));
    nodeGroup.appendChild(g);
  });
  svg.appendChild(nodeGroup);
}

/* ── Node selection + side panel ──────────────────────────────── */
let _selectedNetworkNodeId = null;

function selectNetworkNode(id) {
  const node        = NET_NODES.find(n => n.id === id);
  const connections = NET_EDGES
    .filter(([a, b]) => a === id || b === id)
    .map(([a, b]) => (a === id ? b : a));

  document.querySelectorAll('#networkSvg line').forEach(line => {
    const involved = line.dataset.a === id || line.dataset.b === id;
    line.setAttribute('stroke',       involved ? NODE_COLORS[node.risk] : 'var(--border)');
    line.setAttribute('stroke-width', involved ? '2.5' : '1.5');
  });
  document.querySelectorAll('#networkSvg circle').forEach(c => c.setAttribute('stroke-width', '2.5'));

  const side = document.getElementById('networkSide');
  side.innerHTML = `
    <span class="net-node-badge" style="background:${NODE_COLORS[node.risk]}22;color:${NODE_COLORS[node.risk]}">${node.risk} risk</span>
    <h3>${NODE_ICONS[node.type]} ${node.label}</h3>
    <p style="font-size:12.5px;margin-bottom:14px;">${node.info}</p>
    <div class="net-detail-row"><span class="k">Entity type</span><span>${node.type}</span></div>
    <div class="net-detail-row"><span class="k">Direct links</span><span>${connections.length}</span></div>
    <div class="net-detail-row"><span class="k">Linked entities</span><span>${connections.map(cid => NET_NODES.find(n => n.id === cid).label).join(', ')}</span></div>
  `;

  _selectedNetworkNodeId = id;
  const firSection = document.getElementById('firSection');
  if (firSection) firSection.style.display = '';
}

/* ── FIR package export ────────────────────────────────────────── */
function handleFIRGenerate() {
  if (!_selectedNetworkNodeId) return;
  const node        = NET_NODES.find(n => n.id === _selectedNetworkNodeId);
  const connections = NET_EDGES
    .filter(([a, b]) => a === _selectedNetworkNodeId || b === _selectedNetworkNodeId)
    .map(([a, b]) => NET_NODES.find(n => n.id === (a === _selectedNetworkNodeId ? b : a)));
  const now   = new Date();
  const refId = 'FIR-PKG-' + now.getFullYear()
    + String(now.getMonth() + 1).padStart(2, '0')
    + String(now.getDate()).padStart(2, '0')
    + '-' + _selectedNetworkNodeId.toUpperCase();

  const firText = `PRAHARI FRAUD NETWORK INTELLIGENCE PACKAGE
For Submission to: Cyber Crime Cell / Court of Law
${'='.repeat(60)}
REF: ${refId}
GENERATED: ${now.toISOString().slice(0, 19).replace('T', ' ')} IST

PRIMARY ENTITY
  Identifier  : ${node.label}
  Type        : ${node.type.toUpperCase()}
  Risk Level  : ${node.risk.toUpperCase()}
  Intel Note  : ${node.info}

DIRECT CONNECTIONS (${connections.length} entities):
${connections.map(c => `  [${c.risk}] ${c.label} (${c.type}) — ${c.info}`).join('\n')}

NETWORK SUMMARY
  Total nodes in ring : ${NET_NODES.length}
  Total edges         : ${NET_EDGES.length}
  Critical entities   : ${NET_NODES.filter(n => n.risk === 'Critical').length}

LEGAL BASIS
  This package may be used as supporting evidence under:
  IT Act 2000 (s.66C, 66D) — Identity theft & cheating by impersonation
  BNS 2023 (s.318, 319)   — Cheating & fraudulent deception

${'='.repeat(60)}
PRAHARI Intelligence Platform — Automated Network Analysis
For human review and verification before legal submission.
`;

  const firOut = document.getElementById('firOutput');
  firOut.style.display = '';
  firOut.innerHTML = firText
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>').replace(/ {2}/g, '&nbsp;&nbsp;');

  const firDlBtn = document.getElementById('firDownloadBtn');
  firDlBtn.style.display = '';
  firDlBtn.onclick = () => {
    const blob = new Blob([firText], { type: 'text/plain' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob), download: refId + '.txt',
    });
    a.click(); URL.revokeObjectURL(a.href);
  };
}

/* ── Init ─────────────────────────────────────────────────────── */
export function initNetworkGraph() {
  buildNetworkGraph();
  document.getElementById('firGenerateBtn').addEventListener('click', handleFIRGenerate);
}
