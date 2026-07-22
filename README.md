#  PRAHARI — Fraud & Scam Intelligence Platform

> **Stop scams at the point of contact, not the point of complaint.**

PRAHARI is an open-source, browser-based digital public safety intelligence platform built to detect, trace, and report financial fraud and cyber scams in real time — with full support for 12 Indian regional languages.

---

## The Problem

India faces an unprecedented surge in digital financial crime:

| Metric | Figure | Source |
|--------|--------|--------|
| Cybercrime complaints | **1.14 million** (2023) | NCRP |
| Loss to digital-arrest scams | **₹1,776 Crore** (Jan–Sep 2024) | MHA |
| Counterfeit ₹500 notes | Defeat manual checks | RBI FY25 Alert |
| Languages of potential victims | **12+ regional languages** | Census |

Most existing tools act *after* money has been lost. PRAHARI is engineered to intervene **at the moment of contact** — before an OTP is shared, before a link is clicked, before a payment is made.

---

## Features

PRAHARI ships with **six intelligence modules** in a single-page application:

### CS-01 · Digital Arrest Scam Detector
Paste a call transcript or suspicious SMS/WhatsApp message. The NLP engine scores it in real time against known digital-arrest and impersonation script patterns — including spoofed authority claims, urgency triggers, isolation tactics, and payment demands. Matched red-flag phrases are highlighted inline with an explanatory breakdown.

### CS-02 · Citizen Fraud Shield
A conversational chat advisory that any citizen can use. Paste a suspicious message or describe a call, choose one of 12 regional languages, and receive an instant plain-language verdict with actionable next steps — modelled on the WhatsApp / IVR / app experience described in the MHA challenge brief.

### CS-03 · Message Origin Locator
Enter a flagged phone number or sender ID. The engine attributes a likely geographic origin from carrier-circle and routing signals, plots it on a live Leaflet map with a confidence radius, and surfaces other complaint reports linked to the same cluster.

### CS-04 · Counterfeit Currency Scanner
Upload a photo of a currency note. A simulated forensic checklist runs across standard RBI security features — microprint, security thread, latent image, colour-shift ink, UV markers — and returns a confidence verdict for denominations ₹50, ₹100, ₹200, and ₹500.

### CS-05 · Fraud Network Graph
Explore an interactive SVG graph of linked entities — phone numbers, mule accounts, and IMEI/SIM clusters. Click any node to trace its connections. Aggregate enough nodes and export a structured FIR Intelligence Package for law enforcement.

### CS-06 · Geospatial Crime Pattern Map
City-level heatmap of complaint density across India, filterable by fraud type (digital arrest, phishing/KYC, counterfeit currency, investment fraud, romance scam). Built for patrol and enforcement resource prioritisation.

### Resources · Report a Scam
Step-by-step emergency guidance for active scam calls, a guided complaint intake form, and direct links to the National Cyber Crime Helpline (**1930**) and cybercrime.gov.in.

---

## Language Support

The platform is fully localised in **12 Indian languages** via a built-in i18n engine (`modules/i18n.js`):

| Code | Language   | Code | Language   |
|------|------------|------|------------|
| `en` | English    | `mr` | मराठी      |
| `hi` | हिन्दी     | `gu` | ગુજરાતી    |
| `kn` | ಕನ್ನಡ      | `ml` | മലയാളം     |
| `ta` | தமிழ்      | `pa` | ਪੰਜਾਬੀ     |
| `bn` | বাংলা      | `or` | ଓଡ଼ିଆ      |
| `te` | తెలుగు     | `as` | অসমীয়া    |

Language can be switched globally (top-right selector) or per-module in the Fraud Shield chat.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Input Layer                                                │
│  SMS · Call transcript · WhatsApp · Currency image         │
└────────────────────────┬────────────────────────────────────┘
                         │
          ┌──────────────▼──────────────┐
          │     NLP / CV Engine          │
          │  Pattern scoring · OCR ·    │
          │  Feature extraction         │
          └──────────────┬──────────────┘
                         │
          ┌──────────────▼──────────────┐
          │         Graph AI            │
          │  Entity linking · Ring      │
          │  detection · IMEI/SIM       │
          │  clustering                 │
          └──────────────┬──────────────┘
                         │
          ┌──────────────▼──────────────┐
          │     Geospatial Layer        │
          │  Carrier-circle attribution │
          │  Hotspot mapping (Leaflet)  │
          └──────────────┬──────────────┘
                         │
          ┌──────────────▼──────────────┐
          │      Alert & Action         │
          │  MHA alert · 1930           │
          │  escalation · FIR package   │
          └──────────────┬──────────────┘
                         │
          ┌──────────────▼──────────────┐
          │     Citizen Advisory        │
          │  12-language WhatsApp /     │
          │  IVR / app interface        │
          └─────────────────────────────┘
```

---

## Project Structure

```
PRAHARI/
├── index.html          # Single-page application shell (8 panels)
├── style.css           # Full design system — dark/light themes, animations
├── main.js             # Application entry point & module orchestrator
├── script.js           # Core UI logic, tab routing, theme toggle
└── modules/
    ├── scam-detector.js  # CS-01: NLP scoring engine & pattern library
    ├── fraud-shield.js   # CS-02: 12-language conversational advisory
    ├── crime-map.js      # CS-06: Geospatial crime heatmap (Leaflet)
    ├── network-graph.js  # CS-05: Fraud entity network graph (SVG)
    ├── i18n.js           # Internationalisation engine (12 languages)
    └── utils.js          # Shared helper utilities
```

---

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- No build step or server required — runs entirely client-side

### Run Locally

**Option 1 — Direct file open:**
```bash
# Just open index.html in your browser
start index.html       # Windows
open index.html        # macOS
xdg-open index.html    # Linux
```

**Option 2 — Local development server (recommended):**
```bash
# Using Python
python -m http.server 8080

# Using Node.js / npx
npx serve .

# Then navigate to http://localhost:8080
```

> **Note:** Because `main.js` uses ES Module imports, opening `index.html` via the `file://` protocol may require enabling local file access in your browser, or using a local server (Option 2) instead.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Structure | HTML5 (semantic) |
| Styling | Vanilla CSS — custom properties, dark/light themes, glassmorphism |
| Logic | Vanilla JavaScript (ES Modules) |
| Maps | [Leaflet.js](https://leafletjs.com/) v1.9.4 |
| PDF Export | [jsPDF](https://github.com/parallax/jsPDF) v2.5.1 |
| Fonts | Google Fonts — Libre Franklin, IBM Plex Sans, IBM Plex Mono |
| Build | **None** — zero dependencies to install |

All processing runs **entirely in the browser**. No data is sent to any server.

---

## Privacy

- **No backend.** All scam detection, scoring, and analysis runs client-side in JavaScript.
- **No telemetry.** No analytics, tracking pixels, or third-party data collection.
- **No data storage.** Inputs are processed in memory and discarded when the page is closed.
- Currency images are analysed entirely in-browser and never uploaded anywhere.

The complaint intake form (CS-07) simulates submission in this prototype. In a production deployment, data would route to the NCRP / 1930 backend over a secure, authenticated channel.

---

## Key Metrics Displayed

All statistics on the platform are sourced from public government data:

- **1.14M** cybercrime complaints in 2023 (+60% YoY) — *NCRP / I4C*
- **₹1,776 Cr** lost to digital-arrest scams, Jan–Sep 2024 — *MHA*
- **₹500** FICN fakes now defeat manual checks — *RBI FY25 Alert*
- **National Risk Index: 72/100** — composite of complaint velocity, average loss per case, and digital-arrest share

---

## Roadmap

- [ ] Live integration with I4C / NCRP complaint API
- [ ] WhatsApp Business API channel for Fraud Shield
- [ ] OCR-based currency feature extraction (replacing simulated checklist)
- [ ] Real-time carrier-circle geolocation via telco API
- [ ] Offline PWA mode for low-connectivity field use
- [ ] Aadhaar-free citizen identity verification for complaint filing

---

## Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** this repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m 'Add some feature'`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

Please ensure all new modules follow the existing ES Module pattern and include i18n support for all 12 languages.

---

## License

This project was built as a prototype for a public digital safety challenge. All data displayed is simulated for demonstration purposes.

---

## Emergency Contacts (India)

| Channel | Details |
|---------|---------|
| **National Cyber Crime Helpline** | **1930** |
| **Online Portal** | [cybercrime.gov.in](https://cybercrime.gov.in) |
| **MHA Cyber Division** | [mha.gov.in](https://www.mha.gov.in) |
| **RBI Fraud Reporting** | [rbi.org.in](https://www.rbi.org.in) |

> **If you are on an active digital-arrest call right now:** Disconnect immediately. Real government agencies never conduct arrests over a video call. Call **1930** and report at **cybercrime.gov.in**.

---

<div align="center">
  <strong>PRAHARI</strong> — Digital Public Safety Intelligence<br>
  <em>Prototype build · all data is simulated for demonstration purposes.</em>
</div>