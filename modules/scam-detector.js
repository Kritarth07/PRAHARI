/**
 * scam-detector.js — MODULE CS-01
 * Digital Arrest Scam Detector & MHA Alert (PDF + TXT)
 *
 * Depends on: utils.js (hashString), jsPDF (global window.jspdf)
 */

import { hashString } from './utils.js';

/* ── Pattern library ──────────────────────────────────────────── */
const SCAM_PATTERNS = [
  { rx: /digital arrest/i,                      weight: 30, label: 'Claims a "digital arrest" — not a real legal procedure in India' },
  { rx: /\b(cbi|ed|customs|narcotics|trai|rbi officer)\b/i, weight: 18, label: 'Impersonates a central investigating agency' },
  { rx: /(do not disconnect|stay on (the )?(this )?(call|line)|don'?t hang up)/i, weight: 20, label: 'Pressures the victim to stay on the line — isolation tactic' },
  { rx: /(share the otp|share your otp|send otp|otp immediately)/i, weight: 25, label: 'Requests an OTP — no legitimate agency ever asks for this' },
  { rx: /(warrant|arrest warrant|non-bailable)/i, weight: 15, label: 'Threatens arrest or a warrant to create urgency' },
  { rx: /(video call|stay on this video)/i,       weight: 12, label: 'Insists on a video call — used to sustain psychological pressure' },
  { rx: /(aadhaar|pan card).{0,20}(linked|seized|suspended|blocked)/i, weight: 16, label: 'Claims your Aadhaar/PAN is linked to a crime' },
  { rx: /(parcel|courier).{0,20}(illegal|drugs|narcotics|seized)/i,    weight: 14, label: 'Fake parcel/courier seizure narrative' },
  { rx: /(kyc).{0,15}(expire|update|block)/i,     weight: 14, label: 'Fake KYC-expiry urgency, a common phishing hook' },
  { rx: /(click|verify).{0,15}(link|bit\.ly|http)/i, weight: 12, label: 'Contains a link/URL asking you to click and verify' },
  { rx: /(won|lottery|prize|kbc|lucky draw)/i,    weight: 10, label: 'Prize / lottery bait requiring personal or bank details' },
  { rx: /(new number|lost my phone).{0,25}(send|transfer|upi)/i, weight: 16, label: '"New number" impersonation asking for urgent money transfer' },
  { rx: /(bank account will be blocked|account.{0,10}suspend)/i, weight: 10, label: 'Threatens account suspension to force quick action' },
];

/* ── Scoring engine ───────────────────────────────────────────── */
export function scoreTranscript(text) {
  const matched = [];
  let score = 0;
  SCAM_PATTERNS.forEach(p => {
    if (p.rx.test(text)) { score += p.weight; matched.push(p); }
  });
  score = Math.min(100, score);
  let tier = 'low';
  if (score >= 70) tier = 'critical';
  else if (score >= 45) tier = 'high';
  else if (score >= 20) tier = 'medium';
  return { score, tier, matched };
}

/* ── SVG risk gauge ───────────────────────────────────────────── */
function riskGaugeSvg(score, tier) {
  const colorVar = tier === 'low' ? 'var(--safe)' : (tier === 'medium' ? 'var(--signal)' : 'var(--danger)');
  const c = 2 * Math.PI * 30;
  const offset = c * (1 - score / 100);
  return `<svg viewBox="0 0 72 72" class="risk-gauge">
    <circle cx="36" cy="36" r="30" fill="none" stroke="var(--border)" stroke-width="7"/>
    <circle cx="36" cy="36" r="30" fill="none" stroke="${colorVar}" stroke-width="7" stroke-linecap="round"
      stroke-dasharray="${c}" stroke-dashoffset="${offset}" transform="rotate(-90 36 36)"/>
    <text x="36" y="41" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="16" font-weight="600" fill="var(--text)">${score}</text>
  </svg>`;
}

/* ── Inline phrase highlighting ───────────────────────────────── */
function buildHighlightedTranscript(text, matched) {
  if (!matched.length) return '';
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  matched.forEach(p => {
    const gRx = new RegExp(p.rx.source, p.rx.flags.includes('g') ? p.rx.flags : p.rx.flags + 'g');
    html = html.replace(gRx, m => `<span class="scam-phrase">${m}</span>`);
  });
  return `<div class="highlight-transcript">${html}</div>`;
}

/* ── Render result into output panel ─────────────────────────── */
function renderScamResult(text) {
  const out = document.getElementById('scamOutput');
  const isVideo  = document.getElementById('videoCallCheck')?.checked;
  const isUrgent = document.getElementById('urgencyCheck')?.checked;

  let { score, tier, matched } = scoreTranscript(text);
  if (isVideo)  score = Math.min(100, score + 12);
  if (isUrgent) score = Math.min(100, score + 8);
  if (score >= 70) tier = 'critical';
  else if (score >= 45) tier = 'high';
  else if (score >= 20) tier = 'medium';
  else tier = 'low';

  const tierLabel = { low: 'Low risk', medium: 'Medium risk', high: 'High risk', critical: 'Critical — likely scam' }[tier];
  const action = tier === 'low'
    ? 'No strong scam indicators detected. Still, never share OTPs or make payments to unsolicited callers.'
    : 'Disconnect immediately. Do not share an OTP, PIN, or make any payment. Report at cybercrime.gov.in or call the 1930 helpline.';

  const mhaBtn = document.getElementById('mhaAlertBtn');
  if (mhaBtn) mhaBtn.style.display = (tier === 'high' || tier === 'critical') ? '' : 'none';
  window._lastScamResult = { text, score, tier, matched };

  out.innerHTML = `
    <div class="risk-head">
      ${riskGaugeSvg(score, tier)}
      <div>
        <div class="risk-tier ${tier}">${tierLabel}</div>
        <div class="risk-score">SCORE ${score}/100 · ${matched.length} pattern${matched.length === 1 ? '' : 's'} matched${isVideo ? ' · +video modifier' : ''}${isUrgent ? ' · +urgency modifier' : ''}</div>
      </div>
    </div>
    <div class="flag-list">
      ${matched.length
        ? matched.map(m => `<div class="flag-item"><span class="fi-tag">FLAG</span><span>${m.label}</span></div>`).join('')
        : '<div class="flag-item" style="background:var(--safe-soft);border-left-color:var(--safe)"><span class="fi-tag" style="color:var(--safe)">OK</span><span>No known scam-script patterns matched this text.</span></div>'}
    </div>
    ${matched.length ? buildHighlightedTranscript(text, matched) : ''}
    <div class="action-box"><strong>Recommended action:</strong> ${action}</div>
  `;
}

/* ── PDF generation (jsPDF) ───────────────────────────────────── */
function downloadAlertPDF(refId, res, dateStr) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const lm = 18, rm = 192, pw = rm - lm;
  let y = 18;

  // Header bar
  doc.setFillColor(212, 69, 65);
  doc.rect(lm, y, pw, 12, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(255, 255, 255);
  doc.text('MINISTRY OF HOME AFFAIRS — CYBER CRIME WING', lm + 3, y + 8);
  y += 22;

  // Title
  doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(30, 30, 40);
  doc.text('PRAHARI Automated Alert Bulletin', lm, y); y += 8;

  // Divider
  doc.setDrawColor(200, 200, 210); doc.setLineWidth(0.3); doc.line(lm, y, rm, y); y += 5;

  // Metadata table
  const meta = [
    ['REF', refId],
    ['GENERATED', dateStr + ' IST'],
    ['CLASSIFICATION', res.tier.toUpperCase() + ' RISK INTERCEPT'],
    ['SOURCE', 'Real-time NLP pattern-matching engine (v2)'],
    ['RISK SCORE', res.score + '/100'],
    ['TIER', res.tier.toUpperCase()],
  ];
  doc.setFontSize(9);
  meta.forEach(([k, v]) => {
    doc.setFont('helvetica', 'bold'); doc.setTextColor(100, 100, 120); doc.text(k, lm, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(30, 30, 40); doc.text(v, lm + 40, y);
    y += 5.5;
  });
  y += 2;

  // Pattern matches
  doc.setDrawColor(200, 200, 210); doc.line(lm, y, rm, y); y += 5;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(30, 30, 40);
  doc.text(`PATTERN MATCHES (${res.matched.length})`, lm, y); y += 5;
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  if (res.matched.length === 0) {
    doc.setTextColor(120, 120, 140); doc.text('None', lm + 4, y); y += 5;
  } else {
    res.matched.forEach(m => {
      doc.setFillColor(212, 69, 65); doc.rect(lm, y - 3.2, 2, 3.2, 'F');
      doc.setTextColor(30, 30, 40);
      const lines = doc.splitTextToSize(m.label, pw - 8);
      doc.text(lines, lm + 5, y);
      y += lines.length * 4.5 + 1;
      if (y > 270) { doc.addPage(); y = 18; }
    });
  }
  y += 2;

  // Recommended actions
  doc.setDrawColor(200, 200, 210); doc.line(lm, y, rm, y); y += 5;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(30, 30, 40);
  doc.text('RECOMMENDED ACTION', lm, y); y += 5;
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  ['1. Flag sender number with TRAI for suspension',
   '2. Escalate to Cyber Crime Cell — 1930',
   '3. File FIR reference at cybercrime.gov.in',
   '4. Notify CERT-In if bulk campaign detected'].forEach(a => { doc.text(a, lm + 4, y); y += 5; });
  y += 2;

  // Transcript excerpt
  doc.setDrawColor(200, 200, 210); doc.line(lm, y, rm, y); y += 5;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(30, 30, 40);
  doc.text('EVIDENCE TRANSCRIPT EXCERPT', lm, y); y += 5;
  doc.setFontSize(8.5); doc.setFont('helvetica', 'italic'); doc.setTextColor(60, 60, 80);
  const excerpt = '"' + res.text.slice(0, 300) + (res.text.length > 300 ? '…' : '') + '"';
  const excerptLines = doc.splitTextToSize(excerpt, pw);
  doc.text(excerptLines, lm, y); y += excerptLines.length * 4.2 + 4;

  // Footer
  doc.setDrawColor(200, 200, 210); doc.line(lm, y, rm, y); y += 4;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(140, 140, 160);
  doc.text('This is a system-generated alert. For human review and verification before any legal action.', lm, y); y += 4;
  doc.text('PRAHARI Intelligence Platform — Digital Public Safety', lm, y);

  doc.save(refId + '.pdf');
}

/* ── MHA Alert generation ─────────────────────────────────────── */
function generateMHAAlert() {
  const res = window._lastScamResult;
  if (!res) return;
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 19).replace('T', ' ');
  const refId = 'PRAHARI-' + now.getFullYear()
    + String(now.getMonth() + 1).padStart(2, '0')
    + String(now.getDate()).padStart(2, '0')
    + '-' + hashString(res.text).toString().slice(0, 6).toUpperCase();

  const flagLines = res.matched.map(m => `  [FLAG] ${m.label}`).join('\n');
  const alertText = `
MINISTRY OF HOME AFFAIRS — CYBER CRIME WING
PRAHARI AUTOMATED ALERT BULLETIN
${'='.repeat(56)}
REF: ${refId}
GENERATED: ${dateStr} IST
CLASSIFICATION: ${res.tier.toUpperCase()} RISK INTERCEPT
SOURCE: Real-time NLP pattern-matching engine (v2)

RISK SCORE : ${res.score}/100
TIER       : ${res.tier.toUpperCase()}

PATTERN MATCHES (${res.matched.length}):
${flagLines || '  NONE'}

RECOMMENDED ACTION:
  1. Flag sender number with TRAI for suspension
  2. Escalate to Cyber Crime Cell — 1930
  3. File FIR reference at cybercrime.gov.in
  4. Notify CERT-In if bulk campaign detected

EVIDENCE TRANSCRIPT EXCERPT:
"${res.text.slice(0, 200)}${res.text.length > 200 ? '…' : ''}"

${'='.repeat(56)}
This is a system-generated alert. Do not reply.
PRAHARI Intelligence Platform — Digital Public Safety
`;

  const alertOut = document.getElementById('mhaAlertOut');
  alertOut.style.display = '';
  alertOut.innerHTML = `
    <div class="mha-alert-header">
      <span>MHA Alert generated — <strong>${refId}</strong></span>
      <div style="display:flex;gap:8px;">
        <button class="mha-download-btn" id="mhaDownloadTxt">⬇ .txt</button>
        <button class="mha-download-btn" id="mhaDownloadPdf">⬇ PDF</button>
      </div>
    </div>
  `;
  document.getElementById('mhaDownloadTxt').addEventListener('click', () => {
    const blob = new Blob([alertText], { type: 'text/plain' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: refId + '.txt' });
    a.click(); URL.revokeObjectURL(a.href);
  });
  document.getElementById('mhaDownloadPdf').addEventListener('click', () => {
    downloadAlertPDF(refId, res, dateStr);
  });
}

/* ── Sample transcripts ───────────────────────────────────────── */
const SCAM_SAMPLES = [
  `This is Officer Sharma from the Cyber Crime Cell, Mumbai. A parcel booked under your Aadhaar number has been seized containing illegal substances. You are under digital arrest. Do not disconnect this call or contact anyone. To verify your identity and avoid a warrant, share the OTP sent to your phone immediately and stay on this video call.`,
  `Dear customer, your bank account will be blocked today due to incomplete KYC. Click this link to verify: bit.ly/kyc-verify-now`,
  `Congratulations! Your mobile number has won ₹25,00,000 in the KBC Lucky Draw 2026. To claim your prize, please share your bank account and OTP for verification.`,
  `Hi, just checking if you're free for lunch tomorrow around 1pm? Let me know what works.`,
];
let scamSampleIdx = 0;

/* ── Event wiring ─────────────────────────────────────────────── */
export function initScamDetector() {
  document.getElementById('scamAnalyzeBtn').addEventListener('click', () => {
    const text = document.getElementById('scamInput').value.trim();
    if (!text) {
      document.getElementById('scamOutput').innerHTML = '<div class="output-empty">Paste a transcript first.</div>';
      return;
    }
    renderScamResult(text);
  });

  document.getElementById('scamSampleBtn').addEventListener('click', () => {
    scamSampleIdx = (scamSampleIdx + 1) % SCAM_SAMPLES.length;
    document.getElementById('scamInput').value = SCAM_SAMPLES[scamSampleIdx];
  });

  document.getElementById('scamClearBtn').addEventListener('click', () => {
    document.getElementById('scamInput').value = '';
    document.getElementById('scamOutput').innerHTML = '<div class="output-empty">Run an analysis to see the risk score, matched patterns, and recommended action.</div>';
    const mhaBtn = document.getElementById('mhaAlertBtn');
    if (mhaBtn) mhaBtn.style.display = 'none';
    const mhaOut = document.getElementById('mhaAlertOut');
    if (mhaOut) { mhaOut.style.display = 'none'; mhaOut.innerHTML = ''; }
  });

  document.getElementById('mhaAlertBtn').addEventListener('click', generateMHAAlert);

  // Run once on load with the pre-filled sample
  renderScamResult(document.getElementById('scamInput').value);
}
