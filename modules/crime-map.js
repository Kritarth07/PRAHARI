/**
 * crime-map.js — MODULE CS-06
 * Geospatial Crime Pattern Map (Leaflet)
 * Requires Leaflet to be loaded globally (L).
 */

/* ── Hotspot data ─────────────────────────────────────────────── */
const CRIME_HOTSPOTS = [
  { name: 'New Delhi',   lat: 28.6139, lng: 77.2090, count: 412, type: 'arrest' },
  { name: 'Mumbai',      lat: 19.0760, lng: 72.8777, count: 388, type: 'phishing' },
  { name: 'Bengaluru',   lat: 12.9716, lng: 77.5946, count: 301, type: 'phishing' },
  { name: 'Hyderabad',   lat: 17.3850, lng: 78.4867, count: 256, type: 'arrest' },
  { name: 'Kolkata',     lat: 22.5726, lng: 88.3639, count: 198, type: 'counterfeit' },
  { name: 'Jaipur',      lat: 26.9124, lng: 75.7873, count: 172, type: 'counterfeit' },
  { name: 'Ahmedabad',   lat: 23.0225, lng: 72.5714, count: 165, type: 'phishing' },
  { name: 'Lucknow',     lat: 26.8467, lng: 80.9462, count: 140, type: 'arrest' },
  { name: 'Guwahati',    lat: 26.1445, lng: 91.7362, count:  98, type: 'counterfeit' },
  { name: 'Pune',        lat: 18.5204, lng: 73.8567, count: 187, type: 'phishing' },
  { name: 'Chennai',     lat: 13.0827, lng: 80.2707, count: 210, type: 'investment' },
  { name: 'Surat',       lat: 21.1702, lng: 72.8311, count: 143, type: 'investment' },
  { name: 'Bhopal',      lat: 23.2599, lng: 77.4126, count: 119, type: 'romance' },
  { name: 'Chandigarh',  lat: 30.7333, lng: 76.7794, count:  88, type: 'romance' },
  { name: 'Kochi',       lat:  9.9312, lng: 76.2673, count:  76, type: 'investment' },
];

const TYPE_COLORS = {
  arrest: '#D64541', phishing: '#F2A93B', counterfeit: '#4C7EBF',
  investment: '#7C3AED', romance: '#E05B7F',
};

let crimeMap;
let crimeMarkers = [];

/* ── Stats bar ────────────────────────────────────────────────── */
function updateCrimeStats(filter) {
  const shown = filter === 'all' ? CRIME_HOTSPOTS : CRIME_HOTSPOTS.filter(c => c.type === filter);
  const sum   = t => shown.filter(c => c.type === t).reduce((a, c) => a + c.count, 0);
  const total = shown.reduce((a, c) => a + c.count, 0);
  const el    = id => document.getElementById(id);
  if (el('statArrest'))     el('statArrest').textContent     = sum('arrest');
  if (el('statPhishing'))   el('statPhishing').textContent   = sum('phishing');
  if (el('statCounterfeit'))el('statCounterfeit').textContent= sum('counterfeit');
  if (el('statInvestment')) el('statInvestment').textContent = sum('investment');
  if (el('statRomance'))    el('statRomance').textContent    = sum('romance');
  if (el('statTotal'))      el('statTotal').textContent      = total;
}

/* ── Map init ─────────────────────────────────────────────────── */
export function initCrimeMap() {
  crimeMap = L.map('map-crime').setView([22.9734, 78.6569], 4.5);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 18,
  }).addTo(crimeMap);
  renderCrimeMarkers('all');
}

/* ── Markers ──────────────────────────────────────────────────── */
function renderCrimeMarkers(filter) {
  crimeMarkers.forEach(m => crimeMap.removeLayer(m));
  crimeMarkers = [];
  CRIME_HOTSPOTS
    .filter(c => filter === 'all' || c.type === filter)
    .forEach(c => {
      const marker = L.circleMarker([c.lat, c.lng], {
        radius: 6 + c.count / 40,
        color: TYPE_COLORS[c.type], weight: 1.5,
        fillColor: TYPE_COLORS[c.type], fillOpacity: 0.45,
      }).addTo(crimeMap)
        .bindPopup(`<strong>${c.name}</strong><br>${c.count} complaints · ${c.type}`);
      crimeMarkers.push(marker);
    });
  updateCrimeStats(filter);
}

/* ── Filter chip wiring ────────────────────────────────────────── */
export function initCrimeMapFilters() {
  document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderCrimeMarkers(btn.dataset.filter);
    });
  });
}

/** Call to force Leaflet to recalculate container size after tab switch */
export function invalidateCrimeMap() {
  crimeMap && crimeMap.invalidateSize();
}
