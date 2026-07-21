/**
 * main.js — PRAHARI entry point
 *
 * Imports and initialises all feature modules.
 * Also contains the smaller sections that don't warrant their own file:
 *   - Theme toggle
 *   - Tab navigation & hero dial
 *   - CS-03 Message Origin Locator
 *   - CS-04 Counterfeit Currency Scan
 *   - CS-07 Complaint Form
 */

'use strict';

import { initScamDetector }                     from './modules/scam-detector.js';
import { initFraudShield }                      from './modules/fraud-shield.js';
import { initNetworkGraph }                     from './modules/network-graph.js';
import { initCrimeMap, initCrimeMapFilters,
         invalidateCrimeMap }                   from './modules/crime-map.js';
import { hashString }                           from './modules/utils.js';
import { initI18n }                             from './modules/i18n.js';

/* =========================================================
   THEME
   ========================================================= */
(function themeInit() {
  const saved = localStorage.getItem('prahari-theme');
  const theme = saved || 'dark'; // default dark
  document.body.setAttribute('data-theme', theme);

  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('prahari-theme', next);
  });
})();

/* =========================================================
   TAB NAVIGATION
   ========================================================= */
let locatorMapRef = null; // set by initLocatorMap below

function gotoTab(name) {
  document.querySelectorAll('.tabbtn').forEach(b => b.classList.toggle('is-active', b.dataset.tab === name));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('is-active', p.dataset.panel === name));
  document.getElementById('main').scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.getElementById('tabnav').classList.remove('is-open');

  // Lazy invalidate Leaflet containers on first reveal
  if (name === 'locator')  setTimeout(() => locatorMapRef && locatorMapRef.invalidateSize(), 60);
  if (name === 'crimemap') setTimeout(() => invalidateCrimeMap(), 60);
}

document.querySelectorAll('[data-tab]').forEach(btn =>
  btn.addEventListener('click', () => gotoTab(btn.dataset.tab)));
document.querySelectorAll('[data-goto]').forEach(btn =>
  btn.addEventListener('click', () => gotoTab(btn.dataset.goto)));
document.getElementById('navBurger').addEventListener('click', () =>
  document.getElementById('tabnav').classList.toggle('is-open'));

/* =========================================================
   HERO DIAL — animated entrance
   ========================================================= */
(function heroDial() {
  const el = document.getElementById('heroDialProgress');
  if (!el) return;
  const circumference = 2 * Math.PI * 96;
  const value  = 72;
  const offset = circumference * (1 - value / 100);
  el.style.strokeDasharray  = circumference;
  el.style.strokeDashoffset = circumference;
  requestAnimationFrame(() => { el.style.strokeDashoffset = offset; });
})();

/* =========================================================
   MODULE CS-03 — MESSAGE ORIGIN LOCATOR
   ========================================================= */
const INDIA_CITIES = [
  { name: 'New Delhi',     lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai',        lat: 19.0760, lng: 72.8777 },
  { name: 'Jamtara, JH',   lat: 24.0800, lng: 86.6300 },
  { name: 'Mewat, HR',     lat: 27.9800, lng: 76.9200 },
  { name: 'Bharatpur, RJ', lat: 27.2152, lng: 77.4909 },
  { name: 'Ahmedabad',     lat: 23.0225, lng: 72.5714 },
  { name: 'Bengaluru',     lat: 12.9716, lng: 77.5946 },
  { name: 'Kolkata',       lat: 22.5726, lng: 88.3639 },
  { name: 'Hyderabad',     lat: 17.3850, lng: 78.4867 },
  { name: 'Guwahati',      lat: 26.1445, lng: 91.7362 },
];

let locatorLayer;

function initLocatorMap() {
  const map = L.map('map-locator', { zoomControl: true, attributionControl: true })
    .setView([22.9734, 78.6569], 4.4);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 18,
  }).addTo(map);
  locatorLayer = L.layerGroup().addTo(map);
  scatterHistoricalReports();
  locatorMapRef = map; // expose for tab invalidation
}

function pulsingIcon(color) {
  return L.divIcon({
    className: 'pulse-icon',
    html: `<span class="pulse-ring" style="background:${color}22;"></span><span class="pulse-core" style="background:${color};box-shadow:0 0 0 2px ${color}"></span>`,
    iconSize: [20, 20], iconAnchor: [10, 10],
  });
}

function scatterHistoricalReports() {
  INDIA_CITIES.forEach((c, i) => {
    if (i % 2 === 0) return;
    L.circleMarker([c.lat + (Math.random() - 0.5), c.lng + (Math.random() - 0.5)], {
      radius: 5, color: '#F2A93B', weight: 1,
      fillColor: '#F2A93B', fillOpacity: 0.35,
    }).addTo(locatorLayer).bindTooltip(`${c.name} cluster`, { direction: 'top' });
  });
}

function locateMessage(query) {
  const resultBox = document.getElementById('locatorResult');
  if (!query.trim()) {
    resultBox.innerHTML = '<div class="output-empty">Enter a number or message ID first.</div>';
    return;
  }
  const h           = hashString(query.trim().toLowerCase());
  const city        = INDIA_CITIES[h % INDIA_CITIES.length];
  const jitter      = () => (((h % 97) / 97) - 0.5) * 0.6;
  const lat         = city.lat + jitter();
  const lng         = city.lng + jitter();
  const confidence  = 55 + (h % 40);
  const confTier    = confidence >= 80 ? 'high' : 'medium';
  const linkedReports  = 3 + (h % 14);
  const carrierCircle  = ['Delhi NCR','Mumbai Metro','Kolkata Metro','Karnataka','Rajasthan','Jharkhand','Assam','Telangana'][h % 8];

  locatorLayer.clearLayers();
  scatterHistoricalReports();

  L.marker([lat, lng], { icon: pulsingIcon('#D64541') }).addTo(locatorLayer)
    .bindPopup(`<strong>${city.name} area</strong><br>Estimated origin · ${confidence}% confidence`).openPopup();
  L.circle([lat, lng], { radius: 45000, color: '#D64541', weight: 1, fillOpacity: 0.06 }).addTo(locatorLayer);
  L.marker([12.9716, 77.5946], { icon: pulsingIcon('#2F9E63') }).addTo(locatorLayer)
    .bindTooltip('Your reporting location', { direction: 'top' });

  locatorMapRef.setView([lat, lng], 6.2, { animate: true });

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
  window._lastLocatorResult = { query, city, lat, lng, confidence, linkedReports, carrierCircle };
  document.getElementById('locatorExportBtn').addEventListener('click', () => {
    const r      = window._lastLocatorResult;
    const now    = new Date();
    const refId  = 'TRACE-' + hashString(r.query).toString().slice(0, 8).toUpperCase();
    const report = `PRAHARI MESSAGE ORIGIN TRACE REPORT\n${'='.repeat(50)}\nREF: ${refId}\nGENERATED: ${now.toISOString().slice(0,19).replace('T',' ')} IST\nQUERY: ${r.query}\n\nESTIMATED ORIGIN  : ${r.city.name} area\nCARRIER CIRCLE    : ${r.carrierCircle}\nCOORDINATES       : ${r.lat.toFixed(4)}, ${r.lng.toFixed(4)}\nCONFIDENCE        : ${r.confidence}%\nLINKED REPORTS    : ${r.linkedReports}\nCLASSIFICATION   : ${r.confidence >= 80 ? 'High-risk cluster' : 'Under review'}\n\n${'='.repeat(50)}\nPRAHARI Intelligence Platform — Digital Public Safety\n`;
    const blob = new Blob([report], { type: 'text/plain' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: refId + '.txt' });
    a.click(); URL.revokeObjectURL(a.href);
  });
}

document.getElementById('locateBtn').addEventListener('click', () =>
  locateMessage(document.getElementById('locatorInput').value));
document.getElementById('locatorInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') locateMessage(e.target.value);
});
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

document.getElementById('currencyDrop').addEventListener('click',    () => document.getElementById('currencyFile').click());
document.getElementById('currencyDrop').addEventListener('dragover',  (e) => { e.preventDefault(); e.currentTarget.classList.add('is-drag'); });
document.getElementById('currencyDrop').addEventListener('dragleave', (e) => e.currentTarget.classList.remove('is-drag'));
document.getElementById('currencyDrop').addEventListener('drop',      (e) => {
  e.preventDefault(); e.currentTarget.classList.remove('is-drag');
  if (e.dataTransfer.files[0]) handleCurrencyFile(e.dataTransfer.files[0]);
});
document.getElementById('currencyFile').addEventListener('change',   (e) => {
  if (e.target.files[0]) handleCurrencyFile(e.target.files[0]);
});

function handleCurrencyFile(file) {
  const preview = document.getElementById('currencyPreview');
  const reader  = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.hidden = false;
    runCurrencyAnalysis(file.name + file.size);
  };
  reader.readAsDataURL(file);
}

function runCurrencyAnalysis(seed) {
  const out      = document.getElementById('currencyResult');
  const features = CURRENCY_FEATURES_BY_DENOM[activeDenom];
  out.innerHTML  = `<div class="output-empty">Analysing ₹${activeDenom} security features…</div>`;
  const h = hashString(seed + activeDenom);
  setTimeout(() => {
    let passCount = 0;
    const rows = features.map((f, i) => {
      const pass = ((h >> i) & 1) === 0 || i < 3;
      if (pass) passCount++;
      return `<div class="feature-check"><span>${f}</span><span class="fc-badge ${pass ? 'pass' : 'warn'}">${pass ? 'Verified' : 'Inconclusive'}</span></div>`;
    }).join('');
    const verdictPass = passCount >= features.length - 1;
    out.innerHTML =
      `<div style="font-family:var(--font-mono);font-size:10px;color:var(--text-faint);margin-bottom:10px;text-transform:uppercase;letter-spacing:.06em">₹${activeDenom} note — ${features.length} checks</div>` +
      rows +
      `<div class="verdict-banner ${verdictPass ? 'pass' : 'warn'}">${verdictPass ? '✓ Likely genuine — key features verified for ₹' + activeDenom : '⚠ Inconclusive — recommend manual verification at nearest bank'}</div>`;
  }, 700);
}

/* =========================================================
   MODULE CS-07 — COMPLAINT FORM (simulated NCRP)
   ========================================================= */
document.getElementById('complaintForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('cName').value.trim();
  const type = document.getElementById('cIncidentType').value;
  if (!name || !type) {
    alert('Please fill in at least your name and incident type.');
    return;
  }
  const btn = document.getElementById('complaintSubmitBtn');
  btn.disabled    = true;
  btn.textContent = 'Submitting…';
  setTimeout(() => {
    const refNum = 'NCRP-' + Date.now().toString(36).toUpperCase().slice(-8);
    document.getElementById('complaintRef').textContent = refNum;
    document.getElementById('complaintSuccess').classList.add('visible');
    btn.textContent = 'Submitted ✓';
    document.getElementById('complaintSuccess').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 900);
});

/* =========================================================
   BOOT — initialise all modules
   ========================================================= */
initI18n();
initScamDetector();
initFraudShield();
initNetworkGraph();
initCrimeMapFilters();

window.addEventListener('load', () => {
  initLocatorMap();
  initCrimeMap();
});
