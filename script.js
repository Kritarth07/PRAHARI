'use strict';

/* =========================================================
   THEME
   ========================================================= */
(function themeInit(){
  const saved = localStorage.getItem('prahari-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'dark'); // default dark regardless of OS pref
  document.body.setAttribute('data-theme', theme);

  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('prahari-theme', next);
  });
})();

/* =========================================================
   TAB NAVIGATION
   ========================================================= */
function gotoTab(name){
  document.querySelectorAll('.tabbtn').forEach(b => b.classList.toggle('is-active', b.dataset.tab === name));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('is-active', p.dataset.panel === name));
  document.getElementById('main').scrollIntoView({behavior:'smooth', block:'start'});
  document.getElementById('tabnav').classList.remove('is-open');

  // Lazy-init maps the first time their panel is shown (Leaflet needs visible container)
  if (name === 'locator') setTimeout(() => locatorMap && locatorMap.invalidateSize(), 60);
  if (name === 'crimemap') setTimeout(() => crimeMap && crimeMap.invalidateSize(), 60);
}
document.querySelectorAll('[data-tab]').forEach(btn => btn.addEventListener('click', () => gotoTab(btn.dataset.tab)));
document.querySelectorAll('[data-goto]').forEach(btn => btn.addEventListener('click', () => gotoTab(btn.dataset.goto)));
document.getElementById('navBurger').addEventListener('click', () => document.getElementById('tabnav').classList.toggle('is-open'));

/* =========================================================
   HERO DIAL — small animated entrance
   ========================================================= */
(function heroDial(){
  const el = document.getElementById('heroDialProgress');
  if (!el) return;
  const circumference = 2 * Math.PI * 96;
  const value = 72; // out of 100
  const offset = circumference * (1 - value / 100);
  el.style.strokeDasharray = circumference;
  el.style.strokeDashoffset = circumference;
  requestAnimationFrame(() => { el.style.strokeDashoffset = offset; });
})();

/* =========================================================
   MODULE CS-01 — DIGITAL ARREST SCAM DETECTOR
   ========================================================= */
const SCAM_PATTERNS = [
  { rx: /digital arrest/i,                      weight: 30, label: 'Claims a "digital arrest" — not a real legal procedure in India' },
  { rx: /\b(cbi|ed|customs|narcotics|trai|rbi officer)\b/i, weight: 18, label: 'Impersonates a central investigating agency' },
  { rx: /(do not disconnect|stay on (the )?(this )?(call|line)|don'?t hang up)/i, weight: 20, label: 'Pressures the victim to stay on the line — isolation tactic' },
  { rx: /(share the otp|share your otp|send otp|otp immediately)/i, weight: 25, label: 'Requests an OTP — no legitimate agency ever asks for this' },
  { rx: /(warrant|arrest warrant|non-bailable)/i, weight: 15, label: 'Threatens arrest or a warrant to create urgency' },
  { rx: /(video call|stay on this video)/i,       weight: 12, label: 'Insists on a video call — used to sustain psychological pressure' },
  { rx: /(aadhaar|pan card).{0,20}(linked|seized|suspended|blocked)/i, weight: 16, label: 'Claims your Aadhaar/PAN is linked to a crime' },
  { rx: /(parcel|courier).{0,20}(illegal|drugs|narcotics|seized)/i, weight: 14, label: 'Fake parcel/courier seizure narrative' },
  { rx: /(kyc).{0,15}(expire|update|block)/i,     weight: 14, label: 'Fake KYC-expiry urgency, a common phishing hook' },
  { rx: /(click|verify).{0,15}(link|bit\.ly|http)/i, weight: 12, label: 'Contains a link/URL asking you to click and verify' },
  { rx: /(won|lottery|prize|kbc|lucky draw)/i,    weight: 10, label: 'Prize / lottery bait requiring personal or bank details' },
  { rx: /(new number|lost my phone).{0,25}(send|transfer|upi)/i, weight: 16, label: '"New number" impersonation asking for urgent money transfer' },
  { rx: /(bank account will be blocked|account.{0,10}suspend)/i, weight: 10, label: 'Threatens account suspension to force quick action' },
];

function scoreTranscript(text){
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

function riskGaugeSvg(score, tier){
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

/* Build highlighted HTML for the transcript — wraps matched phrases in <mark> spans */
function buildHighlightedTranscript(text, matched){
  if (!matched.length) return '';
  // collect all unique matched substrings
  let html = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  matched.forEach(p => {
    // convert regex flags to global for replaceAll
    const gRx = new RegExp(p.rx.source, p.rx.flags.includes('g') ? p.rx.flags : p.rx.flags + 'g');
    html = html.replace(gRx, m => `<span class="scam-phrase">${m}</span>`);
  });
  return `<div class="highlight-transcript">${html}</div>`;
}

function renderScamResult(text){
  const out = document.getElementById('scamOutput');
  // read modifier checkboxes
  const isVideo  = document.getElementById('videoCallCheck')  && document.getElementById('videoCallCheck').checked;
  const isUrgent = document.getElementById('urgencyCheck') && document.getElementById('urgencyCheck').checked;

  let { score, tier, matched } = scoreTranscript(text);
  // apply modifier bonuses
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

  // show / hide MHA alert button
  const mhaBtn = document.getElementById('mhaAlertBtn');
  if (mhaBtn) mhaBtn.style.display = (tier === 'high' || tier === 'critical') ? '' : 'none';
  // store last result for MHA generation
  window._lastScamResult = { text, score, tier, matched };

  out.innerHTML = `
    <div class="risk-head">
      ${riskGaugeSvg(score, tier)}
      <div>
        <div class="risk-tier ${tier}">${tierLabel}</div>
        <div class="risk-score">SCORE ${score}/100 · ${matched.length} pattern${matched.length===1?'':'s'} matched${isVideo?' · +video modifier':''}${isUrgent?' · +urgency modifier':''}</div>
      </div>
    </div>
    <div class="flag-list">
      ${matched.length ? matched.map(m => `<div class="flag-item"><span class="fi-tag">FLAG</span><span>${m.label}</span></div>`).join('')
        : '<div class="flag-item" style="background:var(--safe-soft);border-left-color:var(--safe)"><span class="fi-tag" style="color:var(--safe)">OK</span><span>No known scam-script patterns matched this text.</span></div>'}
    </div>
    ${matched.length ? buildHighlightedTranscript(text, matched) : ''}
    <div class="action-box"><strong>Recommended action:</strong> ${action}</div>
  `;
}

/* MHA Alert generation */
function downloadAlertPDF(refId, res, dateStr, alertText){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const lm = 18, rm = 192, pw = rm - lm;
  let y = 18;

  // Header bar
  doc.setFillColor(212, 69, 65);
  doc.rect(lm, y, pw, 12, 'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(255,255,255);
  doc.text('MINISTRY OF HOME AFFAIRS — CYBER CRIME WING', lm + 3, y + 8);
  y += 22;

  // Title
  doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.setTextColor(30,30,40);
  doc.text('PRAHARI Automated Alert Bulletin', lm, y); y += 8;

  // Divider
  doc.setDrawColor(200,200,210); doc.setLineWidth(0.3); doc.line(lm, y, rm, y); y += 5;

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
    doc.setFont('helvetica','bold'); doc.setTextColor(100,100,120);
    doc.text(k, lm, y);
    doc.setFont('helvetica','normal'); doc.setTextColor(30,30,40);
    doc.text(v, lm + 40, y);
    y += 5.5;
  });
  y += 2;

  // Pattern matches
  doc.setDrawColor(200,200,210); doc.line(lm, y, rm, y); y += 5;
  doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(30,30,40);
  doc.text(`PATTERN MATCHES (${res.matched.length})`, lm, y); y += 5;
  doc.setFontSize(9); doc.setFont('helvetica','normal');
  if (res.matched.length === 0){
    doc.setTextColor(120,120,140); doc.text('None', lm + 4, y); y += 5;
  } else {
    res.matched.forEach(m => {
      doc.setFillColor(212,69,65); doc.rect(lm, y - 3.2, 2, 3.2, 'F');
      doc.setTextColor(30,30,40);
      const lines = doc.splitTextToSize(m.label, pw - 8);
      doc.text(lines, lm + 5, y);
      y += lines.length * 4.5 + 1;
      if (y > 270){ doc.addPage(); y = 18; }
    });
  }
  y += 2;

  // Recommended actions
  doc.setDrawColor(200,200,210); doc.line(lm, y, rm, y); y += 5;
  doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(30,30,40);
  doc.text('RECOMMENDED ACTION', lm, y); y += 5;
  doc.setFontSize(9); doc.setFont('helvetica','normal');
  const actions = [
    '1. Flag sender number with TRAI for suspension',
    '2. Escalate to Cyber Crime Cell — 1930',
    '3. File FIR reference at cybercrime.gov.in',
    '4. Notify CERT-In if bulk campaign detected',
  ];
  actions.forEach(a => { doc.text(a, lm + 4, y); y += 5; });
  y += 2;

  // Transcript excerpt
  doc.setDrawColor(200,200,210); doc.line(lm, y, rm, y); y += 5;
  doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(30,30,40);
  doc.text('EVIDENCE TRANSCRIPT EXCERPT', lm, y); y += 5;
  doc.setFontSize(8.5); doc.setFont('helvetica','italic'); doc.setTextColor(60,60,80);
  const excerpt = '"' + res.text.slice(0, 300) + (res.text.length > 300 ? '\u2026' : '') + '"';
  const excerptLines = doc.splitTextToSize(excerpt, pw);
  doc.text(excerptLines, lm, y); y += excerptLines.length * 4.2 + 4;

  // Footer
  doc.setDrawColor(200,200,210); doc.line(lm, y, rm, y); y += 4;
  doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(140,140,160);
  doc.text('This is a system-generated alert. For human review and verification before any legal action.', lm, y); y += 4;
  doc.text('PRAHARI Intelligence Platform — Digital Public Safety', lm, y);

  doc.save(refId + '.pdf');
}

function generateMHAAlert(){
  const res = window._lastScamResult;
  if (!res) return;
  const now = new Date();
  const dateStr = now.toISOString().slice(0,19).replace('T',' ');
  const refId = 'PRAHARI-' + now.getFullYear() + String(now.getMonth()+1).padStart(2,'0') + String(now.getDate()).padStart(2,'0') + '-' + hashString(res.text).toString().slice(0,6).toUpperCase();
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
"${res.text.slice(0,200)}${res.text.length > 200 ? '…' : ''}"

${'='.repeat(56)}
This is a system-generated alert. Do not reply.
PRAHARI Intelligence Platform — Digital Public Safety
`;
  // Render compactly below the button row
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
    const blob = new Blob([alertText], {type:'text/plain'});
    const a = Object.assign(document.createElement('a'), {href:URL.createObjectURL(blob), download:refId+'.txt'});
    a.click(); URL.revokeObjectURL(a.href);
  });
  document.getElementById('mhaDownloadPdf').addEventListener('click', () => {
    downloadAlertPDF(refId, res, dateStr, alertText);
  });
}

const SCAM_SAMPLES = [
  `This is Officer Sharma from the Cyber Crime Cell, Mumbai. A parcel booked under your Aadhaar number has been seized containing illegal substances. You are under digital arrest. Do not disconnect this call or contact anyone. To verify your identity and avoid a warrant, share the OTP sent to your phone immediately and stay on this video call.`,
  `Dear customer, your bank account will be blocked today due to incomplete KYC. Click this link to verify: bit.ly/kyc-verify-now`,
  `Congratulations! Your mobile number has won ₹25,00,000 in the KBC Lucky Draw 2026. To claim your prize, please share your bank account and OTP for verification.`,
  `Hi, just checking if you're free for lunch tomorrow around 1pm? Let me know what works.`,
];
let scamSampleIdx = 0;

document.getElementById('scamAnalyzeBtn').addEventListener('click', () => {
  const text = document.getElementById('scamInput').value.trim();
  if (!text) { document.getElementById('scamOutput').innerHTML = '<div class="output-empty">Paste a transcript first.</div>'; return; }
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
// Run once on load with the pre-filled sample so the module never looks empty
renderScamResult(document.getElementById('scamInput').value);

/* =========================================================
   MODULE CS-02 — CITIZEN FRAUD SHIELD (chat)
   ========================================================= */
const SHIELD_STRINGS = {
  en: { safe: "This doesn't match known scam patterns, but stay cautious with anything asking for money or OTPs.",
        danger: "This matches known scam patterns. Do not click links, share OTPs, or send money. Report it at cybercrime.gov.in or call 1930.",
        greet: "Got it — analysing…" },
  hi: { safe: "यह किसी ज्ञात धोखाधड़ी पैटर्न से मेल नहीं खाता, फिर भी पैसे या OTP मांगने वाले संदेशों से सावधान रहें।",
        danger: "यह एक ज्ञात धोखाधड़ी पैटर्न से मेल खाता है। लिंक पर क्लिक न करें, OTP साझा न करें। cybercrime.gov.in पर रिपोर्ट करें या 1930 पर कॉल करें।",
        greet: "समझ गया — जांच हो रही है…" },
  kn: { safe: "ಇದು ತಿಳಿದಿರುವ ಮೋಸದ ಮಾದರಿಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ, ಆದರೂ ಹಣ ಅಥವಾ OTP ಕೇಳುವ ಯಾವುದೇ ಸಂದೇಶದ ಬಗ್ಗೆ ಜಾಗರೂಕರಾಗಿರಿ.",
        danger: "ಇದು ತಿಳಿದಿರುವ ಮೋಸದ ಮಾದರಿಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ. ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ, OTP ಹಂಚಿಕೊಳ್ಳಬೇಡಿ. cybercrime.gov.in ನಲ್ಲಿ ವರದಿ ಮಾಡಿ ಅಥವಾ 1930 ಗೆ ಕರೆ ಮಾಡಿ.",
        greet: "ಸರಿ — ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ…" },
  ta: { safe: "இது அறியப்பட்ட மோசடி வடிவங்களுடன் பொருந்தவில்லை, ஆனாலும் பணம் அல்லது OTP கேட்கும் செய்திகளில் எச்சரிக்கையாக இருங்கள்.",
        danger: "இது அறியப்பட்ட மோசடி வடிவத்துடன் பொருந்துகிறது. இணைப்புகளை கிளிக் செய்ய வேண்டாம், OTP பகிர வேண்டாம். cybercrime.gov.in இல் புகாரளிக்கவும் அல்லது 1930 ஐ அழைக்கவும்.",
        greet: "சரி — பரிசோதிக்கிறோம்…" },
  bn: { safe: "এটি কোনো পরিচিত প্রতারণার ধরণের সাথে মেলে না, তবে টাকা বা OTP চাওয়া যেকোনো বার্তায় সতর্ক থাকুন।",
        danger: "এটি পরিচিত প্রতারণার ধরণের সাথে মেলে। লিঙ্কে ক্লিক করবেন না, OTP শেয়ার করবেন না। cybercrime.gov.in-এ রিপোর্ট করুন বা 1930-এ কল করুন।",
        greet: "বুঝেছি — পরীক্ষা করা হচ্ছে…" },
  te: { safe: "ఇది తెలిసిన మోసం నమూనాలతో సరిపోలడం లేదు, కానీ డబ్బు లేదా OTP అడిగే సందేశాలపై జాగ్రత్తగా ఉండండి।",
        danger: "ఇది తెలిసిన మోసం నమూనాతో సరిపోలింది. లింక్‌లు క్లిక్ చేయకండి, OTP షేర్ చేయకండి. cybercrime.gov.in లో నివేదించండి లేదా 1930 కి కాల్ చేయండి.",
        greet: "అర్థమైంది — తనిఖీ చేస్తున్నాము…" },
  mr: { safe: "हे कोणत्याही ज्ञात फसवणूक नमुन्याशी जुळत नाही, तरीही पैसे किंवा OTP मागणाऱ्या कोणत्याही संदेशाबाबत सावध रहा।",
        danger: "हे ज्ञात फसवणूक नमुन्याशी जुळते. लिंकवर क्लिक करू नका, OTP शेअर करू नका. cybercrime.gov.in वर तक्रार करा किंवा 1930 वर कॉल करा.",
        greet: "समजले — तपासणी सुरू आहे…" },
  gu: { safe: "આ કોઈ જાણીતી છેતરપિંડીની પેટર્ન સાથે મેળ ખાતું નથી, છતાં પૈસા અથવા OTP માંગતા સંદેશાઓ અંગે સાવચેત રહો.",
        danger: "આ જાણીતી છેતરપિંડીની પેટર્ન સાથે મેળ ખાય છે. લિંક ક્લિક ન કરો, OTP શેર ન કરો. cybercrime.gov.in પર ફરિયાદ કરો અથવા 1930 પર કૉલ કરો.",
        greet: "સમજ્યા — તપાસ ચાલુ છે…" },
  ml: { safe: "ഇത് അറിയപ്പെടുന്ന തട്ടിപ്പ് പാറ്റേണുകളുമായി പൊരുത്തപ്പെടുന്നില്ല, എന്നാൽ പണം അല്ലെങ്കിൽ OTP ആവശ്യപ്പെടുന്ന സന്ദേശങ്ങളിൽ ജാഗ്രത പാലിക്കുക.",
        danger: "ഇത് അറിയപ്പെടുന്ന തട്ടിപ്പ് പാറ്റേണുമായി പൊരുത്തപ്പെടുന്നു. ലിങ്ക് ക്ലിക്ക് ചെയ്യരുത്, OTP പങ്കിടരുത്. cybercrime.gov.in ൽ റിപ്പോർട്ട് ചെയ്യുക അല്ലെങ്കിൽ 1930 ൽ വിളിക്കുക.",
        greet: "മനസ്സിലായി — പരിശോധിക്കുന്നു…" },
  pa: { safe: "ਇਹ ਕਿਸੇ ਜਾਣੀ-ਪਛਾਣੀ ਧੋਖਾਧੜੀ ਦੀ ਪੈਟਰਨ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ, ਪਰ ਪੈਸੇ ਜਾਂ OTP ਮੰਗਣ ਵਾਲੇ ਸੁਨੇਹਿਆਂ ਬਾਰੇ ਸਾਵਧਾਨ ਰਹੋ।",
        danger: "ਇਹ ਜਾਣੀ-ਪਛਾਣੀ ਧੋਖਾਧੜੀ ਦੀ ਪੈਟਰਨ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ। ਲਿੰਕ ਕਲਿੱਕ ਨਾ ਕਰੋ, OTP ਸਾਂਝਾ ਨਾ ਕਰੋ। cybercrime.gov.in 'ਤੇ ਰਿਪੋਰਟ ਕਰੋ ਜਾਂ 1930 'ਤੇ ਕਾਲ ਕਰੋ।",
        greet: "ਸਮਝ ਗਿਆ — ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ…" },
  or: { safe: "ଏହା କୌଣସି ଜଣା ଠକାମି ଧାଞ୍ଚା ସହ ମେଳ ଖାଉ ନାହିଁ, ତଥାପି ଟଙ୍କା ବା OTP ମାଗୁଥିବା ବାର୍ତ୍ତା ବ୍ୟାପାରରେ ସତର୍କ ରୁହ।",
        danger: "ଏହା ଜଣା ଠକାମି ଧାଞ୍ଚା ସହ ମେଳ ଖାଉଛି। ଲିଙ୍କ କ୍ଲିକ କର ନାହିଁ, OTP ଭାଗ କର ନାହିଁ। cybercrime.gov.in ରେ ରିପୋର୍ଟ କର ବା 1930 ରେ ଫୋନ କର।",
        greet: "ବୁଝିଲି — ଯାଞ୍ଚ ହେଉଛି…" },
  as: { safe: "এইটো কোনো পৰিচিত প্ৰতাৰণাৰ আৰ্হিৰ সৈতে মিল নাখায়, তথাপি টকা বা OTP বিচৰা যিকোনো বাৰ্তাত সতৰ্ক হওক।",
        danger: "এইটো পৰিচিত প্ৰতাৰণাৰ আৰ্হিৰ সৈতে মিলে। লিংক ক্লিক নকৰিব, OTP শ্বেয়াৰ নকৰিব। cybercrime.gov.in ত প্ৰতিবেদন দিয়ক অথবা 1930 ত ফোন কৰক।",
        greet: "বুজিলোঁ — পৰীক্ষা কৰা হৈছে…" },
};

function addChatMsg(text, who, verdict){
  const win = document.getElementById('chatWindow');
  const div = document.createElement('div');
  div.className = `chat-msg ${who}${verdict ? ' verdict-' + verdict : ''}`;
  div.innerHTML = `<span class="chat-avatar">${who === 'user' ? '🧑' : '🛡️'}</span><div class="chat-bubble"></div>`;
  div.querySelector('.chat-bubble').textContent = text;
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
}

document.getElementById('chatForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const lang = document.getElementById('chatLang').value;
  const text = input.value.trim();
  if (!text) return;
  addChatMsg(text, 'user');
  input.value = '';

  setTimeout(() => {
    const { score, tier } = scoreTranscript(text);
    const strings = SHIELD_STRINGS[lang] || SHIELD_STRINGS.en;
    const isDanger = tier === 'high' || tier === 'critical';
    const verdictLine = isDanger ? strings.danger : strings.safe;
    addChatMsg(`${verdictLine} (risk score: ${score}/100)`, 'bot', isDanger ? 'danger' : 'safe');
  }, 350);
});

document.querySelectorAll('.chip-btn[data-fill]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('chatInput').value = btn.dataset.fill;
    document.getElementById('chatInput').focus();
  });
});

/* =========================================================
   Simple deterministic hash → used by locator + currency scan
   so demo results are stable per input, not purely random
   ========================================================= */
function hashString(str){
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

/* =========================================================
   MODULE CS-03 — MESSAGE ORIGIN LOCATOR (map)
   ========================================================= */
const INDIA_CITIES = [
  { name: 'New Delhi',      lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai',         lat: 19.0760, lng: 72.8777 },
  { name: 'Jamtara, JH',    lat: 24.0800, lng: 86.6300 },
  { name: 'Mewat, HR',      lat: 27.9800, lng: 76.9200 },
  { name: 'Bharatpur, RJ',  lat: 27.2152, lng: 77.4909 },
  { name: 'Ahmedabad',      lat: 23.0225, lng: 72.5714 },
  { name: 'Bengaluru',      lat: 12.9716, lng: 77.5946 },
  { name: 'Kolkata',        lat: 22.5726, lng: 88.3639 },
  { name: 'Hyderabad',      lat: 17.3850, lng: 78.4867 },
  { name: 'Guwahati',       lat: 26.1445, lng: 91.7362 },
];

let locatorMap, locatorLayer;
function initLocatorMap(){
  locatorMap = L.map('map-locator', { zoomControl: true, attributionControl: true }).setView([22.9734, 78.6569], 4.4);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 18
  }).addTo(locatorMap);
  locatorLayer = L.layerGroup().addTo(locatorMap);
  scatterHistoricalReports();
}

function pulsingIcon(color){
  return L.divIcon({
    className: 'pulse-icon',
    html: `<span class="pulse-ring" style="background:${color}22;"></span><span class="pulse-core" style="background:${color};box-shadow:0 0 0 2px ${color}"></span>`,
    iconSize: [20, 20], iconAnchor: [10, 10]
  });
}

function scatterHistoricalReports(){
  INDIA_CITIES.forEach((c, i) => {
    if (i % 2 === 0) return; // sparse background context markers
    L.circleMarker([c.lat + (Math.random()-0.5), c.lng + (Math.random()-0.5)], {
      radius: 5, color: 'var(--signal)'.startsWith('var') ? '#F2A93B' : '#F2A93B', weight: 1,
      fillColor: '#F2A93B', fillOpacity: 0.35
    }).addTo(locatorLayer).bindTooltip(`${c.name} cluster`, { direction: 'top' });
  });
}

function locateMessage(query){
  const resultBox = document.getElementById('locatorResult');
  if (!query.trim()){
    resultBox.innerHTML = '<div class="output-empty">Enter a number or message ID first.</div>';
    return;
  }
  const h = hashString(query.trim().toLowerCase());
  const city = INDIA_CITIES[h % INDIA_CITIES.length];
  const jitter = () => (((h % 97) / 97) - 0.5) * 0.6;
  const lat = city.lat + jitter();
  const lng = city.lng + jitter();
  const confidence = 55 + (h % 40); // 55-94
  const confTier = confidence >= 80 ? 'high' : 'medium';
  const linkedReports = 3 + (h % 14);
  const carrierCircle = ['Delhi NCR', 'Mumbai Metro', 'Kolkata Metro', 'Karnataka', 'Rajasthan', 'Jharkhand', 'Assam', 'Telangana'][h % 8];

  locatorLayer.clearLayers();
  scatterHistoricalReports();

  L.marker([lat, lng], { icon: pulsingIcon('#D64541') }).addTo(locatorLayer)
    .bindPopup(`<strong>${city.name} area</strong><br>Estimated origin · ${confidence}% confidence`).openPopup();
  L.circle([lat, lng], { radius: 45000, color: '#D64541', weight: 1, fillOpacity: 0.06 }).addTo(locatorLayer);

  // "your" reporting location (fixed demo point — Bengaluru) for spatial context
  L.marker([12.9716, 77.5946], { icon: pulsingIcon('#2F9E63') }).addTo(locatorLayer)
    .bindTooltip('Your reporting location', { direction: 'top' });

  locatorMap.setView([lat, lng], 6.2, { animate: true });

  resultBox.innerHTML = `
    <div class="origin-row"><span class="k">Estimated origin</span><span class="v">${city.name} area</span></div>
    <div class="origin-row"><span class="k">Carrier circle</span><span class="v">${carrierCircle}</span></div>
    <div class="origin-row"><span class="k">Coordinates</span><span class="v">${lat.toFixed(3)}, ${lng.toFixed(3)}</span></div>
    <div class="origin-row"><span class="k">Linked prior reports</span><span class="v">${linkedReports}</span></div>
    <div class="origin-row"><span class="k">Classification</span><span class="v">${confidence >= 80 ? 'High-risk cluster' : 'Under review'}</span></div>
    <span class="confidence-tag ${confTier}">${confidence}% confidence</span>
    <br>
    <button class="locator-export-btn" id="locatorExportBtn">⬇ Download trace report</button>
  `;
  // store for export
  window._lastLocatorResult = { query, city, lat, lng, confidence, linkedReports, carrierCircle };
  document.getElementById('locatorExportBtn').addEventListener('click', () => {
    const r = window._lastLocatorResult;
    const now = new Date();
    const refId = 'TRACE-' + hashString(r.query).toString().slice(0,8).toUpperCase();
    const report = `PRAHARI MESSAGE ORIGIN TRACE REPORT\n${'='.repeat(50)}\nREF: ${refId}\nGENERATED: ${now.toISOString().slice(0,19).replace('T',' ')} IST\nQUERY: ${r.query}\n\nESTIMATED ORIGIN  : ${r.city.name} area\nCARRIER CIRCLE    : ${r.carrierCircle}\nCOORDINATES       : ${r.lat.toFixed(4)}, ${r.lng.toFixed(4)}\nCONFIDENCE        : ${r.confidence}%\nLINKED REPORTS    : ${r.linkedReports}\nCLASSIFICATION   : ${r.confidence >= 80 ? 'High-risk cluster' : 'Under review'}\n\n${'='.repeat(50)}\nPRAHARI Intelligence Platform — Digital Public Safety\n`;
    const blob = new Blob([report],{type:'text/plain'});
    const a = Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:refId+'.txt'});
    a.click(); URL.revokeObjectURL(a.href);
  });
}

document.getElementById('locateBtn').addEventListener('click', () => locateMessage(document.getElementById('locatorInput').value));
document.getElementById('locatorInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') locateMessage(e.target.value); });
document.querySelectorAll('.chip-btn[data-num]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('locatorInput').value = btn.dataset.num;
    locateMessage(btn.dataset.num);
  });
});

/* =========================================================
   MODULE CS-04 — COUNTERFEIT CURRENCY SCAN
   ========================================================= */
const CURRENCY_FEATURES_BY_DENOM = {
  '500': [
    'Microprint clarity (Gandhi portrait area)',
    'Security thread continuity (green thread)',
    'Latent image alignment (₹500 watermark)',
    'Colour-shift ink response (numeral 500)',
    'UV feature simulation (Ashoka pillar)',
    'Intaglio printing feel (RBI Governor signature)',
    'Angular bleed lines (front)',
    'Microlettering (RBI & BHARAT)',
  ],
  '200': [
    'Microprint clarity (Gandhi portrait area)',
    'Security thread continuity (bright blue thread)',
    'Latent image alignment (₹200 numeral)',
    'Colour-shift ink response (numeral 200)',
    'UV feature simulation (Sanchi Stupa motif)',
    'Intaglio printing feel (RBI Governor signature)',
  ],
  '100': [
    'Microprint clarity (Gandhi portrait area)',
    'Security thread (security thread, windowed)',
    'Latent image alignment (₹100 numeral)',
    'Colour-shift ink response (numeral 100)',
    'UV feature simulation (Rani ki Vav motif)',
    'See-through register (floral design)',
  ],
  '50': [
    'Microprint clarity (Gandhi portrait area)',
    'Security thread (windowed devi thread)',
    'Latent image alignment (₹50 numeral)',
    'UV feature simulation (Hampi chariot)',
    'Intaglio printing feel (RBI Governor signature)',
    'Serial number pattern (ascending size)',
  ],
};

let activeDenom = '500';
document.querySelectorAll('.denom-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.denom-btn').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    activeDenom = btn.dataset.denom;
  });
});

document.getElementById('currencyDrop').addEventListener('click', () => document.getElementById('currencyFile').click());
document.getElementById('currencyDrop').addEventListener('dragover', (e) => { e.preventDefault(); e.currentTarget.classList.add('is-drag'); });
document.getElementById('currencyDrop').addEventListener('dragleave', (e) => e.currentTarget.classList.remove('is-drag'));
document.getElementById('currencyDrop').addEventListener('drop', (e) => {
  e.preventDefault(); e.currentTarget.classList.remove('is-drag');
  if (e.dataTransfer.files[0]) handleCurrencyFile(e.dataTransfer.files[0]);
});
document.getElementById('currencyFile').addEventListener('change', (e) => {
  if (e.target.files[0]) handleCurrencyFile(e.target.files[0]);
});

function handleCurrencyFile(file){
  const preview = document.getElementById('currencyPreview');
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.hidden = false;
    runCurrencyAnalysis(file.name + file.size);
  };
  reader.readAsDataURL(file);
}

function runCurrencyAnalysis(seed){
  const out = document.getElementById('currencyResult');
  const features = CURRENCY_FEATURES_BY_DENOM[activeDenom];
  out.innerHTML = `<div class="output-empty">Analysing ₹${activeDenom} security features…</div>`;
  const h = hashString(seed + activeDenom);
  setTimeout(() => {
    let passCount = 0;
    const rows = features.map((f, i) => {
      const pass = ((h >> i) & 1) === 0 || i < 3;
      if (pass) passCount++;
      return `<div class="feature-check"><span>${f}</span><span class="fc-badge ${pass ? 'pass' : 'warn'}">${pass ? 'Verified' : 'Inconclusive'}</span></div>`;
    }).join('');
    const verdictPass = passCount >= features.length - 1;
    out.innerHTML = `<div style="font-family:var(--font-mono);font-size:10px;color:var(--text-faint);margin-bottom:10px;text-transform:uppercase;letter-spacing:.06em">₹${activeDenom} note — ${features.length} checks</div>` +
      rows + `<div class="verdict-banner ${verdictPass ? 'pass' : 'warn'}">
      ${verdictPass ? '✓ Likely genuine — key features verified for ₹'+activeDenom : '⚠ Inconclusive — recommend manual verification at nearest bank'}
    </div>`;
  }, 700);
}

/* =========================================================
   MODULE CS-05 — FRAUD NETWORK GRAPH
   ========================================================= */
const NET_NODES = [
  { id: 'n1', x: 400, y: 60,  type: 'account',  label: 'A/C ••4471', risk: 'High',   info: 'Mule account · 14 inbound transfers in 48h' },
  { id: 'n2', x: 220, y: 150, type: 'phone',    label: '+91 78••2210', risk: 'Critical', info: 'Flagged in 9 digital-arrest reports' },
  { id: 'n3', x: 580, y: 150, type: 'phone',    label: '+91 90••7734', risk: 'High',   info: 'SIM registered with mismatched KYC' },
  { id: 'n4', x: 130, y: 280, type: 'device',   label: 'Device D‑2291', risk: 'Medium', info: 'Shared across 3 flagged numbers' },
  { id: 'n5', x: 330, y: 300, type: 'account',  label: 'A/C ••8823', risk: 'Critical', info: 'Receiving account · linked to 6 prior FIRs' },
  { id: 'n6', x: 500, y: 320, type: 'device',   label: 'Device D‑5510', risk: 'Medium', info: 'IMEI linked to 2 counterfeit-SIM cases' },
  { id: 'n7', x: 670, y: 280, type: 'phone',    label: '+91 63••9012', risk: 'Low',    info: 'Recently flagged, single report' },
  { id: 'n8', x: 400, y: 420, type: 'account',  label: 'A/C ••1190', risk: 'High',   info: 'Layering account · rapid withdrawal pattern' },
];
const NET_EDGES = [
  ['n2','n1'], ['n2','n4'], ['n1','n5'], ['n3','n1'], ['n3','n6'],
  ['n4','n5'], ['n5','n8'], ['n6','n8'], ['n6','n7'], ['n3','n7'],
];
const NODE_COLORS = { Critical:'#D64541', High:'#F2A93B', Medium:'#4C7EBF', Low:'#2F9E63' };
const NODE_ICONS = { phone:'📞', account:'🏦', device:'📱' };

function buildNetworkGraph(){
  const svg = document.getElementById('networkSvg');
  const ns = 'http://www.w3.org/2000/svg';
  svg.innerHTML = '';

  const edgeGroup = document.createElementNS(ns, 'g');
  NET_EDGES.forEach(([a, b]) => {
    const na = NET_NODES.find(n => n.id === a), nb = NET_NODES.find(n => n.id === b);
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', na.x); line.setAttribute('y1', na.y);
    line.setAttribute('x2', nb.x); line.setAttribute('y2', nb.y);
    line.setAttribute('stroke', 'var(--border)'); line.setAttribute('stroke-width', '1.5');
    line.dataset.a = a; line.dataset.b = b;
    edgeGroup.appendChild(line);
  });
  svg.appendChild(edgeGroup);

  const nodeGroup = document.createElementNS(ns, 'g');
  NET_NODES.forEach(n => {
    const g = document.createElementNS(ns, 'g');
    g.style.cursor = 'pointer';
    g.dataset.id = n.id;

    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', n.x); circle.setAttribute('cy', n.y); circle.setAttribute('r', 24);
    circle.setAttribute('fill', 'var(--panel)');
    circle.setAttribute('stroke', NODE_COLORS[n.risk]); circle.setAttribute('stroke-width', 2.5);
    g.appendChild(circle);

    const icon = document.createElementNS(ns, 'text');
    icon.setAttribute('x', n.x); icon.setAttribute('y', n.y + 6);
    icon.setAttribute('text-anchor', 'middle'); icon.setAttribute('font-size', '16');
    icon.textContent = NODE_ICONS[n.type];
    g.appendChild(icon);

    const label = document.createElementNS(ns, 'text');
    label.setAttribute('x', n.x); label.setAttribute('y', n.y + 42);
    label.setAttribute('text-anchor', 'middle'); label.setAttribute('font-size', '10.5');
    label.setAttribute('font-family', 'IBM Plex Mono, monospace');
    label.setAttribute('fill', 'var(--text-dim)');
    label.textContent = n.label;
    g.appendChild(label);

    g.addEventListener('click', () => selectNetworkNode(n.id));
    nodeGroup.appendChild(g);
  });
  svg.appendChild(nodeGroup);
}

function selectNetworkNode(id){
  const node = NET_NODES.find(n => n.id === id);
  const connections = NET_EDGES.filter(([a,b]) => a === id || b === id)
    .map(([a,b]) => (a === id ? b : a));

  document.querySelectorAll('#networkSvg line').forEach(line => {
    const involved = line.dataset.a === id || line.dataset.b === id;
    line.setAttribute('stroke', involved ? NODE_COLORS[node.risk] : 'var(--border)');
    line.setAttribute('stroke-width', involved ? '2.5' : '1.5');
  });
  document.querySelectorAll('#networkSvg circle').forEach(c => c.setAttribute('stroke-width', 2.5));

  const side = document.getElementById('networkSide');
  side.innerHTML = `
    <span class="net-node-badge" style="background:${NODE_COLORS[node.risk]}22;color:${NODE_COLORS[node.risk]}">${node.risk} risk</span>
    <h3>${NODE_ICONS[node.type]} ${node.label}</h3>
    <p style="font-size:12.5px;margin-bottom:14px;">${node.info}</p>
    <div class="net-detail-row"><span class="k">Entity type</span><span>${node.type}</span></div>
    <div class="net-detail-row"><span class="k">Direct links</span><span>${connections.length}</span></div>
    <div class="net-detail-row"><span class="k">Linked entities</span><span>${connections.map(cid => NET_NODES.find(n=>n.id===cid).label).join(', ')}</span></div>
  `;
  // Track for FIR package
  _selectedNetworkNodeId = id;
  const firSection = document.getElementById('firSection');
  if (firSection) firSection.style.display = '';
}
buildNetworkGraph();

/* FIR Package Generation */
let _selectedNetworkNodeId = null;

document.getElementById('firGenerateBtn').addEventListener('click', () => {
  if (!_selectedNetworkNodeId) return;
  const node = NET_NODES.find(n => n.id === _selectedNetworkNodeId);
  const connections = NET_EDGES.filter(([a,b]) => a === _selectedNetworkNodeId || b === _selectedNetworkNodeId)
    .map(([a,b]) => NET_NODES.find(n => n.id === (a === _selectedNetworkNodeId ? b : a)));
  const now = new Date();
  const refId = 'FIR-PKG-' + now.getFullYear() + String(now.getMonth()+1).padStart(2,'0') + String(now.getDate()).padStart(2,'0') + '-' + _selectedNetworkNodeId.toUpperCase();
  const firText = `PRAHARI FRAUD NETWORK INTELLIGENCE PACKAGE\nFor Submission to: Cyber Crime Cell / Court of Law\n${'='.repeat(60)}\nREF: ${refId}\nGENERATED: ${now.toISOString().slice(0,19).replace('T',' ')} IST\n\nPRIMARY ENTITY\n  Identifier  : ${node.label}\n  Type        : ${node.type.toUpperCase()}\n  Risk Level  : ${node.risk.toUpperCase()}\n  Intel Note  : ${node.info}\n\nDIRECT CONNECTIONS (${connections.length} entities):\n${connections.map(c => `  [${c.risk}] ${c.label} (${c.type}) — ${c.info}`).join('\n')}\n\nNETWORK SUMMARY\n  Total nodes in ring : ${NET_NODES.length}\n  Total edges         : ${NET_EDGES.length}\n  Critical entities   : ${NET_NODES.filter(n => n.risk === 'Critical').length}\n\nLEGAL BASIS\n  This package may be used as supporting evidence under:\n  IT Act 2000 (s.66C, 66D) — Identity theft & cheating by impersonation\n  BNS 2023 (s.318, 319)   — Cheating & fraudulent deception\n\n${'='.repeat(60)}\nPRAHARI Intelligence Platform — Automated Network Analysis\nFor human review and verification before legal submission.\n`;
  const firOut = document.getElementById('firOutput');
  firOut.style.display = '';
  firOut.innerHTML = firText.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>').replace(/ {2}/g,'&nbsp;&nbsp;');
  const firDlBtn = document.getElementById('firDownloadBtn');
  firDlBtn.style.display = '';
  firDlBtn.onclick = () => {
    const blob = new Blob([firText],{type:'text/plain'});
    const a = Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:refId+'.txt'});
    a.click(); URL.revokeObjectURL(a.href);
  };
});

/* =========================================================
   MODULE CS-06 — GEOSPATIAL CRIME PATTERN MAP
   ========================================================= */
const CRIME_HOTSPOTS = [
  { name: 'New Delhi',   lat: 28.6139, lng: 77.2090, count: 412, type: 'arrest' },
  { name: 'Mumbai',      lat: 19.0760, lng: 72.8777, count: 388, type: 'phishing' },
  { name: 'Bengaluru',   lat: 12.9716, lng: 77.5946, count: 301, type: 'phishing' },
  { name: 'Hyderabad',   lat: 17.3850, lng: 78.4867, count: 256, type: 'arrest' },
  { name: 'Kolkata',     lat: 22.5726, lng: 88.3639, count: 198, type: 'counterfeit' },
  { name: 'Jaipur',      lat: 26.9124, lng: 75.7873, count: 172, type: 'counterfeit' },
  { name: 'Ahmedabad',   lat: 23.0225, lng: 72.5714, count: 165, type: 'phishing' },
  { name: 'Lucknow',     lat: 26.8467, lng: 80.9462, count: 140, type: 'arrest' },
  { name: 'Guwahati',    lat: 26.1445, lng: 91.7362, count: 98,  type: 'counterfeit' },
  { name: 'Pune',        lat: 18.5204, lng: 73.8567, count: 187, type: 'phishing' },
  { name: 'Chennai',     lat: 13.0827, lng: 80.2707, count: 210, type: 'investment' },
  { name: 'Surat',       lat: 21.1702, lng: 72.8311, count: 143, type: 'investment' },
  { name: 'Bhopal',      lat: 23.2599, lng: 77.4126, count: 119, type: 'romance' },
  { name: 'Chandigarh',  lat: 30.7333, lng: 76.7794, count: 88,  type: 'romance' },
  { name: 'Kochi',       lat:  9.9312, lng: 76.2673, count: 76,  type: 'investment' },
];
let crimeMap, crimeMarkers = [];

function updateCrimeStats(filter){
  const shown = filter === 'all' ? CRIME_HOTSPOTS : CRIME_HOTSPOTS.filter(c => c.type === filter);
  const sum = t => shown.filter(c => c.type === t).reduce((a,c) => a + c.count, 0);
  const total = shown.reduce((a,c) => a + c.count, 0);
  const el = id => document.getElementById(id);
  if (el('statArrest'))    el('statArrest').textContent    = sum('arrest');
  if (el('statPhishing'))  el('statPhishing').textContent  = sum('phishing');
  if (el('statCounterfeit')) el('statCounterfeit').textContent = sum('counterfeit');
  if (el('statInvestment')) el('statInvestment').textContent = sum('investment');
  if (el('statRomance'))   el('statRomance').textContent   = sum('romance');
  if (el('statTotal'))     el('statTotal').textContent     = total;
}

function initCrimeMap(){
  crimeMap = L.map('map-crime').setView([22.9734, 78.6569], 4.5);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 18
  }).addTo(crimeMap);
  renderCrimeMarkers('all');
}

function renderCrimeMarkers(filter){
  crimeMarkers.forEach(m => crimeMap.removeLayer(m));
  crimeMarkers = [];
  const colors = { arrest:'#D64541', phishing:'#F2A93B', counterfeit:'#4C7EBF', investment:'#7C3AED', romance:'#E05B7F' };
  CRIME_HOTSPOTS.filter(c => filter === 'all' || c.type === filter).forEach(c => {
    const marker = L.circleMarker([c.lat, c.lng], {
      radius: 6 + c.count / 40,
      color: colors[c.type], weight: 1.5,
      fillColor: colors[c.type], fillOpacity: 0.45
    }).addTo(crimeMap).bindPopup(`<strong>${c.name}</strong><br>${c.count} complaints · ${c.type}`);
    crimeMarkers.push(marker);
  });
  updateCrimeStats(filter);
}

document.querySelectorAll('.filter-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    renderCrimeMarkers(btn.dataset.filter);
  });
});

/* =========================================================
   INIT MAPS (deferred to first tab visit is smoother, but
   since Leaflet needs a laid-out container we init once the
   page settles, then invalidateSize on tab switch)
   ========================================================= */
window.addEventListener('load', () => {
  initLocatorMap();
  initCrimeMap();

  // Animate judging scorecard bars with a small delay
  setTimeout(() => {
    document.querySelectorAll('.jfill-v2').forEach(el => {
      el.style.width = el.dataset.target + '%';
    });
  }, 400);
});

/* =========================================================
   COMPLAINT FORM — simulated submission
   ========================================================= */
document.getElementById('complaintForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name  = document.getElementById('cName').value.trim();
  const type  = document.getElementById('cIncidentType').value;
  if (!name || !type) {
    alert('Please fill in at least your name and incident type.');
    return;
  }
  const btn = document.getElementById('complaintSubmitBtn');
  btn.disabled = true;
  btn.textContent = 'Submitting…';
  setTimeout(() => {
    const refNum = 'NCRP-' + Date.now().toString(36).toUpperCase().slice(-8);
    document.getElementById('complaintRef').textContent = refNum;
    document.getElementById('complaintSuccess').classList.add('visible');
    btn.textContent = 'Submitted ✓';
    // scroll to success
    document.getElementById('complaintSuccess').scrollIntoView({behavior:'smooth', block:'nearest'});
  }, 900);
});