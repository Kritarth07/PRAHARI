/**
 * i18n.js — PRAHARI page-wide language switcher
 *
 * Translates every [data-i18n="key"] element on the page.
 * Also updates html[lang] and persists the choice in localStorage.
 */

/* ── UI string map ─────────────────────────────────────────────── */
const UI_STRINGS = {
  en: {
    /* ── Top-bar ── */
    brandSub:       'Fraud & Scam Intelligence',
    tab00:          'Overview',
    tab01:          'Scam Detector',
    tab02:          'Fraud Shield',
    tab03:          'Message Locator',
    tab04:          'Currency Scan',
    tab05:          'Network Graph',
    tab06:          'Crime Map',
    tab07:          'Report a Scam',
    statusLive:     'Live demo',
    /* ── Overview ── */
    heroEyebrow:    'DIGITAL PUBLIC SAFETY INTELLIGENCE',
    heroH1:         'Stopping scams before the call connects.',
    heroLede:       'PRAHARI detects digital‑arrest scams in real time, traces fraud messages back to their origin on a live map, and flags counterfeit currency — built to act at the point of contact, not the point of complaint.',
    heroCta1:       'Run the scam detector →',
    heroCta2:       'Locate a message on the map →',
    /* ── Scam Detector ── */
    scamEyebrow:    'MODULE CS‑01',
    scamH2:         'Digital Arrest Scam Detector & Alerting',
    scamDesc:       'Paste the transcript of a suspicious call, SMS, or WhatsApp message. The engine scores it against known digital‑arrest and impersonation‑scam script patterns.',
    scamLabel:      'Transcript or message text',
    scamAnalyse:    'Analyse transcript',
    scamSample:     'Load another sample',
    scamClear:      'Clear',
    checkVideo:     'Call was on video / WhatsApp video',
    checkUrgency:   'Caller demanded immediate action',
    /* ── Fraud Shield ── */
    shieldEyebrow:  'MODULE CS‑02',
    shieldH2:       'Citizen Fraud Shield',
    shieldDesc:     'A multi‑channel conversational advisory. Paste a suspicious message or describe a call, choose your language, and get an instant plain‑language verdict.',
    quickChecks:    'Quick checks',
    shieldNote:     'Not sure? When in doubt, hang up and call the organisation back using the number on their official website.',
    /* ── Locator ── */
    locEyebrow:     'MODULE CS‑03 · GEOSPATIAL',
    locH2:          'Message Origin Locator',
    locDesc:        'Enter a flagged phone number, sender ID, or message reference. The engine attributes a likely origin point from carrier‑circle and routing signals.',
    locLabel:       'Phone number / sender ID / message reference',
    locBtn:         'Locate on map',
    locTry:         'Try:',
    /* ── Currency ── */
    curEyebrow:     'MODULE CS‑04',
    curH2:          'Counterfeit Currency Identification',
    curDesc:        'Upload a photo of a currency note. The scanner runs a simulated forensic checklist across standard RBI security features.',
    curDenomLabel:  'Select denomination',
    curUploadTitle: 'Click to upload',
    curUploadHint:  'JPG or PNG · analysed entirely in your browser',
    /* ── Network ── */
    netEyebrow:     'MODULE CS‑05',
    netH2:          'Fraud Network Graph Intelligence',
    netDesc:        'Transaction metadata, call records, device fingerprints and account linkages, clustered into one graph.',
    netSelectNode:  'Select a node',
    netNodeHint:    'Click any node in the graph to inspect it.',
    firGenBtn:      '📄 Generate FIR Intelligence Package',
    /* ── Crime Map ── */
    crimeEyebrow:   'MODULE CS‑06 · GEOSPATIAL',
    crimeH2:        'Geospatial Crime Pattern Intelligence',
    crimeDesc:      'Complaint density across Indian cities, sized by report volume. Filter by fraud category to prioritise patrol and enforcement resourcing.',
    filterAll:      'All types',
    filterArrest:   'Digital arrest',
    filterPhishing: 'Phishing / KYC',
    filterCounterfeit: 'Counterfeit currency',
    filterInvestment: 'Investment fraud',
    filterRomance:  'Romance scam',
    /* ── Report ── */
    reportEyebrow:  'RESOURCES',
    reportH2:       'Report a scam',
    reportDesc:     "If you've received a suspicious call or message, or already lost money to one, here's exactly what to do next.",
    reportActive:   'In an active digital‑arrest call right now?',
    reportStep1:    'Disconnect the call. Real agencies never conduct arrests over video call.',
    reportStep2:    'Do not share an OTP, PIN, or make any payment.',
    reportStep3:    'Call the National Cyber Crime Helpline: 1930',
    reportStep4:    'Report online at cybercrime.gov.in',
    reportPaid:     'Already made a payment?',
    reportPaidDesc: 'Call 1930 immediately — funds can sometimes be frozen if reported within the first few hours.',
    reportNotSure:  'Not sure if it\'s a scam?',
    reportNotSureDesc: 'Run the message through the Scam Detector or chat with Fraud Shield first.',
    reportChannels: 'Reporting channels',
    reportProtect:  'Protect others',
    reportProtectDesc: 'Forward suspicious messages to friends and family who may be less familiar with these tactics.',
    complaintH3:    '📋 File a complaint — guided intake form',
    cNameLabel:     'Full name',
    cPhoneLabel:    'Contact number',
    cTypeLabel:     'Incident type',
    cDateLabel:     'Date of incident',
    cDescLabel:     'Brief description of what happened',
    cSuspectLabel:  'Suspect phone number / sender ID (if known)',
    cSubmit:        'Submit complaint',
    /* ── Footer ── */
    footerMain:     'PRAHARI — Digital Public Safety Intelligence',
    footerSub:      'Prototype build · all data on this page is simulated for demonstration purposes.',
  },

  hi: {
    brandSub:       'धोखाधड़ी और ठगी खुफिया',
    tab00:          'अवलोकन',
    tab01:          'स्कैम डिटेक्टर',
    tab02:          'फ्रॉड शील्ड',
    tab03:          'संदेश लोकेटर',
    tab04:          'करेंसी स्कैन',
    tab05:          'नेटवर्क ग्राफ',
    tab06:          'क्राइम मैप',
    tab07:          'स्कैम रिपोर्ट करें',
    statusLive:     'लाइव डेमो',
    heroEyebrow:    'डिजिटल सार्वजनिक सुरक्षा खुफिया',
    heroH1:         'कॉल कनेक्ट होने से पहले ठगी रोकना।',
    heroLede:       'PRAHARI रियल टाइम में डिजिटल-अरेस्ट स्कैम का पता लगाता है, फ्रॉड संदेशों को उनके मूल स्थान तक ट्रेस करता है और नकली करेंसी को फ्लैग करता है।',
    heroCta1:       'स्कैम डिटेक्टर चलाएं →',
    heroCta2:       'मैप पर संदेश खोजें →',
    scamEyebrow:    'मॉड्यूल CS‑01',
    scamH2:         'डिजिटल अरेस्ट स्कैम डिटेक्टर और अलर्टिंग',
    scamDesc:       'किसी संदिग्ध कॉल, SMS या WhatsApp संदेश का ट्रांसक्रिप्ट यहाँ पेस्ट करें। इंजन इसे ज्ञात स्कैम पैटर्न के विरुद्ध स्कोर करेगा।',
    scamLabel:      'ट्रांसक्रिप्ट या संदेश पाठ',
    scamAnalyse:    'ट्रांसक्रिप्ट विश्लेषण करें',
    scamSample:     'अन्य नमूना लोड करें',
    scamClear:      'साफ करें',
    checkVideo:     'कॉल वीडियो / WhatsApp वीडियो पर था',
    checkUrgency:   'कॉलर ने तुरंत कार्रवाई की मांग की',
    shieldEyebrow:  'मॉड्यूल CS‑02',
    shieldH2:       'नागरिक फ्रॉड शील्ड',
    shieldDesc:     'एक बहु-चैनल परामर्श सेवा। संदिग्ध संदेश पेस्ट करें या कॉल विवरण दें, अपनी भाषा चुनें और तुरंत सादी भाषा में निर्णय पाएं।',
    quickChecks:    'त्वरित जाँचें',
    shieldNote:     'संदेह है? संदेह होने पर, कॉल काटें और संगठन को उनकी आधिकारिक वेबसाइट के नंबर पर वापस कॉल करें।',
    locEyebrow:     'मॉड्यूल CS‑03 · भू-स्थानिक',
    locH2:          'संदेश उत्पत्ति लोकेटर',
    locDesc:        'कोई फ्लैग किया फोन नंबर, सेंडर ID या संदेश संदर्भ दर्ज करें। इंजन कैरियर-सर्कल और रूटिंग संकेतों से संभावित उत्पत्ति बिंदु निर्धारित करेगा।',
    locLabel:       'फोन नंबर / सेंडर ID / संदेश संदर्भ',
    locBtn:         'मानचित्र पर खोजें',
    locTry:         'आज़माएं:',
    curEyebrow:     'मॉड्यूल CS‑04',
    curH2:          'नकली करेंसी पहचान',
    curDesc:        'करेंसी नोट की फ़ोटो अपलोड करें। स्कैनर RBI सुरक्षा फीचर चेकलिस्ट चलाएगा।',
    curDenomLabel:  'मूल्यवर्ग चुनें',
    curUploadTitle: 'अपलोड करने के लिए क्लिक करें',
    curUploadHint:  'JPG या PNG · पूरी तरह आपके ब्राउज़र में विश्लेषित',
    netEyebrow:     'मॉड्यूल CS‑05',
    netH2:          'फ्रॉड नेटवर्क ग्राफ इंटेलिजेंस',
    netDesc:        'लेन-देन मेटाडेटा, कॉल रिकॉर्ड, डिवाइस फिंगरप्रिंट और खाता लिंकेज एक ग्राफ में क्लस्टर किए गए।',
    netSelectNode:  'नोड चुनें',
    netNodeHint:    'निरीक्षण के लिए ग्राफ में कोई भी नोड क्लिक करें।',
    firGenBtn:      '📄 FIR इंटेलिजेंस पैकेज बनाएं',
    crimeEyebrow:   'मॉड्यूल CS‑06 · भू-स्थानिक',
    crimeH2:        'भू-स्थानिक अपराध पैटर्न इंटेलिजेंस',
    crimeDesc:      'भारतीय शहरों में शिकायत घनत्व, रिपोर्ट वॉल्यूम के आधार पर। गश्त प्राथमिकता के लिए धोखाधड़ी श्रेणी से फ़िल्टर करें।',
    filterAll:      'सभी प्रकार',
    filterArrest:   'डिजिटल अरेस्ट',
    filterPhishing: 'फिशिंग / KYC',
    filterCounterfeit: 'नकली करेंसी',
    filterInvestment: 'निवेश धोखाधड़ी',
    filterRomance:  'रोमांस स्कैम',
    reportEyebrow:  'संसाधन',
    reportH2:       'स्कैम रिपोर्ट करें',
    reportDesc:     'यदि आपको कोई संदिग्ध कॉल या संदेश मिला है, या आपने पैसे खो दिए हैं, तो आगे क्या करें।',
    reportActive:   'अभी एक सक्रिय डिजिटल-अरेस्ट कॉल में हैं?',
    reportStep1:    'कॉल काटें। असली एजेंसियां वीडियो कॉल पर कभी गिरफ्तारी नहीं करतीं।',
    reportStep2:    'कोई OTP, PIN साझा न करें, या कोई भुगतान न करें।',
    reportStep3:    'राष्ट्रीय साइबर क्राइम हेल्पलाइन पर कॉल करें: 1930',
    reportStep4:    'cybercrime.gov.in पर ऑनलाइन रिपोर्ट करें',
    reportPaid:     'पहले से भुगतान कर दिया?',
    reportPaidDesc: '1930 पर तुरंत कॉल करें — पहले कुछ घंटों में रिपोर्ट करने पर फंड फ्रीज हो सकते हैं।',
    reportNotSure:  'यकीन नहीं है कि यह स्कैम है?',
    reportNotSureDesc: 'पहले Scam Detector या Fraud Shield से जाँच करें।',
    reportChannels: 'रिपोर्टिंग चैनल',
    reportProtect:  'दूसरों की रक्षा करें',
    reportProtectDesc: 'संदिग्ध संदेश उन मित्रों और परिवार को भेजें जो इन तरकीबों से कम परिचित हो सकते हैं।',
    complaintH3:    '📋 शिकायत दर्ज करें — निर्देशित फ़ॉर्म',
    cNameLabel:     'पूरा नाम',
    cPhoneLabel:    'संपर्क नंबर',
    cTypeLabel:     'घटना का प्रकार',
    cDateLabel:     'घटना की तिथि',
    cDescLabel:     'क्या हुआ इसका संक्षिप्त विवरण',
    cSuspectLabel:  'संदिग्ध फोन नंबर / सेंडर ID (यदि ज्ञात हो)',
    cSubmit:        'शिकायत जमा करें',
    footerMain:     'PRAHARI — डिजिटल सार्वजनिक सुरक्षा खुफिया',
    footerSub:      'प्रोटोटाइप बिल्ड · इस पृष्ठ का सभी डेटा प्रदर्शन उद्देश्यों के लिए अनुकरणीय है।',
  },

  kn: {
    brandSub:       'ವಂಚನೆ ಮತ್ತು ಮೋಸದ ಬುದ್ಧಿಮತ್ತೆ',
    tab00: 'ಅವಲೋಕನ', tab01: 'ಸ್ಕ್ಯಾಮ್ ಡಿಟೆಕ್ಟರ್', tab02: 'ಫ್ರಾಡ್ ಶೀಲ್ಡ್',
    tab03: 'ಸಂದೇಶ ಲೊಕೇಟರ್', tab04: 'ಕರೆನ್ಸಿ ಸ್ಕ್ಯಾನ್', tab05: 'ನೆಟ್‌ವರ್ಕ್ ಗ್ರಾಫ್',
    tab06: 'ಕ್ರೈಮ್ ಮ್ಯಾಪ್', tab07: 'ಸ್ಕ್ಯಾಮ್ ವರದಿ ಮಾಡಿ', statusLive: 'ಲೈವ್ ಡೆಮೊ',
    heroH1: 'ಕರೆ ಸಂಪರ್ಕಿಸುವ ಮೊದಲೇ ಮೋಸ ನಿಲ್ಲಿಸುವುದು.', heroCta1: 'ಸ್ಕ್ಯಾಮ್ ಡಿಟೆಕ್ಟರ್ ಚಲಾಯಿಸಿ →', heroCta2: 'ಮ್ಯಾಪ್‌ನಲ್ಲಿ ಸಂದೇಶ ಹುಡುಕಿ →',
    scamH2: 'ಡಿಜಿಟಲ್ ಅರೆಸ್ಟ್ ಸ್ಕ್ಯಾಮ್ ಡಿಟೆಕ್ಟರ್', scamAnalyse: 'ವಿಶ್ಲೇಷಿಸಿ', scamSample: 'ಮಾದರಿ ಲೋಡ್', scamClear: 'ತೆರವು',
    shieldH2: 'ನಾಗರಿಕ ಫ್ರಾಡ್ ಶೀಲ್ಡ್', quickChecks: 'ತ್ವರಿತ ಪರಿಶೀಲನೆ',
    locH2: 'ಸಂದೇಶ ಮೂಲ ಲೊಕೇಟರ್', locBtn: 'ಮ್ಯಾಪ್‌ನಲ್ಲಿ ಲೊಕೇಟ್', locTry: 'ಪ್ರಯತ್ನಿಸಿ:',
    curH2: 'ನಕಲಿ ಕರೆನ್ಸಿ ಗುರುತಿಸುವಿಕೆ', curDenomLabel: 'ಮುಖಬೆಲೆ ಆಯ್ಕೆ', curUploadTitle: 'ಅಪ್ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್', curUploadHint: 'JPG ಅಥವಾ PNG · ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲೇ ವಿಶ್ಲೇಷಿಸಲಾಗಿದೆ',
    netH2: 'ಫ್ರಾಡ್ ನೆಟ್‌ವರ್ಕ್ ಗ್ರಾಫ್', netSelectNode: 'ನೋಡ್ ಆಯ್ಕೆ', netNodeHint: 'ಯಾವುದಾದರೂ ನೋಡ್ ಕ್ಲಿಕ್ ಮಾಡಿ.', firGenBtn: '📄 FIR ಪ್ಯಾಕೇಜ್ ರಚಿಸಿ',
    crimeH2: 'ಭೂಸ್ಥಾನಿಕ ಅಪರಾಧ ಮಾದರಿ', filterAll: 'ಎಲ್ಲಾ ವಿಧಗಳು', filterArrest: 'ಡಿಜಿಟಲ್ ಅರೆಸ್ಟ್', filterPhishing: 'ಫಿಶಿಂಗ್', filterCounterfeit: 'ನಕಲಿ ಕರೆನ್ಸಿ', filterInvestment: 'ಹೂಡಿಕೆ ವಂಚನೆ', filterRomance: 'ರೊಮಾನ್ಸ್ ಸ್ಕ್ಯಾಮ್',
    reportH2: 'ಸ್ಕ್ಯಾಮ್ ವರದಿ ಮಾಡಿ', cSubmit: 'ದೂರು ಸಲ್ಲಿಸಿ',
    footerMain: 'PRAHARI — ಡಿಜಿಟಲ್ ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತೆ', footerSub: 'ಪ್ರೋಟೋಟೈಪ್ · ಎಲ್ಲಾ ಡೇಟಾ ಪ್ರದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರ.',
  },

  ta: {
    brandSub:       'மோசடி மற்றும் ஏமாற்று நுண்ணறிவு',
    tab00: 'கண்ணோட்டம்', tab01: 'மோசடி கண்டறிவி', tab02: 'மோசடி கவசம்',
    tab03: 'செய்தி இடமறிவி', tab04: 'நாணய ஸ்கேன்', tab05: 'நெட்வொர்க் வரைபடம்',
    tab06: 'குற்ற வரைபடம்', tab07: 'மோசடி புகார்', statusLive: 'நேரடி டெமோ',
    heroH1: 'அழைப்பு இணைவதற்கு முன்பே மோசடியை நிறுத்துகிறோம்.', heroCta1: 'மோசடி கண்டறிவியை இயக்கு →', heroCta2: 'வரைபடத்தில் செய்தியை கண்டறி →',
    scamH2: 'டிஜிட்டல் அரெஸ்ட் மோசடி கண்டறிவி', scamAnalyse: 'பகுப்பாய்வு செய்', scamSample: 'மாதிரி ஏற்று', scamClear: 'அழி',
    shieldH2: 'குடிமக்கள் மோசடி கவசம்', quickChecks: 'விரைவு சரிபார்ப்பு',
    locH2: 'செய்தி தோற்றுவாய் இடமறிவி', locBtn: 'வரைபடத்தில் கண்டறி', locTry: 'முயற்சிக்க:',
    curH2: 'போலி நாணயம் அடையாளம்', curDenomLabel: 'மதிப்பீட்டை தேர்ந்தெடு', curUploadTitle: 'பதிவேற்ற கிளிக் செய்', curUploadHint: 'JPG அல்லது PNG · உங்கள் உலாவியிலேயே பகுப்பாய்வு',
    netH2: 'மோசடி நெட்வொர்க் வரைபடம்', netSelectNode: 'முனையை தேர்', netNodeHint: 'எந்த முனையையும் கிளிக் செய்யுங்கள்.', firGenBtn: '📄 FIR தொகுப்பை உருவாக்கு',
    crimeH2: 'புவிவெளி குற்ற முறை', filterAll: 'அனைத்து வகைகளும்', filterArrest: 'டிஜிட்டல் அரெஸ்ட்', filterPhishing: 'ஃபிஷிங்', filterCounterfeit: 'போலி நாணயம்', filterInvestment: 'முதலீட்டு மோசடி', filterRomance: 'காதல் மோசடி',
    reportH2: 'மோசடி புகார் அளி', cSubmit: 'புகார் சமர்ப்பி',
    footerMain: 'PRAHARI — டிஜிட்டல் பொது பாதுகாப்பு', footerSub: 'முன்மாதிரி · அனைத்து தரவும் செயல்விளக்க நோக்கங்களுக்காக மட்டுமே.',
  },

  bn: {
    brandSub:       'প্রতারণা ও কেলেঙ্কারি গোয়েন্দা',
    tab00: 'সারসংক্ষেপ', tab01: 'স্ক্যাম ডিটেক্টর', tab02: 'ফ্রড শিল্ড',
    tab03: 'বার্তা লোকেটর', tab04: 'মুদ্রা স্ক্যান', tab05: 'নেটওয়ার্ক গ্রাফ',
    tab06: 'ক্রাইম ম্যাপ', tab07: 'স্ক্যাম রিপোর্ট করুন', statusLive: 'লাইভ ডেমো',
    heroH1: 'কল সংযুক্ত হওয়ার আগেই স্ক্যাম থামানো।', heroCta1: 'স্ক্যাম ডিটেক্টর চালান →', heroCta2: 'মানচিত্রে বার্তা খুঁজুন →',
    scamH2: 'ডিজিটাল অ্যারেস্ট স্ক্যাম ডিটেক্টর', scamAnalyse: 'বিশ্লেষণ করুন', scamSample: 'নমুনা লোড করুন', scamClear: 'মুছুন',
    shieldH2: 'নাগরিক ফ্রড শিল্ড', quickChecks: 'দ্রুত যাচাই',
    locH2: 'বার্তা উৎস লোকেটর', locBtn: 'মানচিত্রে খুঁজুন', locTry: 'চেষ্টা করুন:',
    curH2: 'জাল মুদ্রা সনাক্তকরণ', curDenomLabel: 'মূল্যমান বেছে নিন', curUploadTitle: 'আপলোড করতে ক্লিক করুন', curUploadHint: 'JPG বা PNG · আপনার ব্রাউজারেই বিশ্লেষিত',
    netH2: 'ফ্রড নেটওয়ার্ক গ্রাফ', netSelectNode: 'নোড বেছে নিন', netNodeHint: 'গ্রাফে যেকোনো নোড ক্লিক করুন।', firGenBtn: '📄 FIR প্যাকেজ তৈরি করুন',
    crimeH2: 'ভূ-স্থানিক অপরাধ প্যাটার্ন', filterAll: 'সব ধরন', filterArrest: 'ডিজিটাল অ্যারেস্ট', filterPhishing: 'ফিশিং', filterCounterfeit: 'জাল মুদ্রা', filterInvestment: 'বিনিয়োগ জালিয়াতি', filterRomance: 'রোমান্স স্ক্যাম',
    reportH2: 'স্ক্যাম রিপোর্ট করুন', cSubmit: 'অভিযোগ জমা দিন',
    footerMain: 'PRAHARI — ডিজিটাল সরকারি নিরাপত্তা', footerSub: 'প্রোটোটাইপ · সমস্ত ডেটা প্রদর্শনের জন্য অনুকরণীয়।',
  },

  te: {
    brandSub:       'మోసం మరియు స్కామ్ నుండి రక్షణ',
    tab00: 'అవలోకనం', tab01: 'స్కామ్ డిటెక్టర్', tab02: 'ఫ్రాడ్ షీల్డ్',
    tab03: 'మెసేజ్ లొకేటర్', tab04: 'కరెన్సీ స్కాన్', tab05: 'నెట్‌వర్క్ గ్రాఫ్',
    tab06: 'క్రైమ్ మ్యాప్', tab07: 'స్కామ్ రిపోర్ట్', statusLive: 'లైవ్ డెమో',
    heroH1: 'కాల్ కనెక్ట్ అవ్వడానికి ముందే స్కామ్‌లు ఆపడం.', heroCta1: 'స్కామ్ డిటెక్టర్ నడపండి →', heroCta2: 'మ్యాప్‌లో మెసేజ్ కనుగొనండి →',
    scamH2: 'డిజిటల్ అరెస్ట్ స్కామ్ డిటెక్టర్', scamAnalyse: 'విశ్లేషించు', scamSample: 'నమూనా లోడ్', scamClear: 'క్లియర్',
    shieldH2: 'పౌర ఫ్రాడ్ షీల్డ్', quickChecks: 'త్వరిత తనిఖీలు',
    locH2: 'మెసేజ్ మూలం లొకేటర్', locBtn: 'మ్యాప్‌లో లొకేట్', locTry: 'ప్రయత్నించండి:',
    curH2: 'నకిలీ కరెన్సీ గుర్తింపు', curDenomLabel: 'విలువ ఎంచుకోండి', curUploadTitle: 'అప్‌లోడ్ చేయడానికి క్లిక్', curUploadHint: 'JPG లేదా PNG · మీ బ్రౌజర్‌లోనే విశ్లేషించబడింది',
    netH2: 'ఫ్రాడ్ నెట్‌వర్క్ గ్రాఫ్', netSelectNode: 'నోడ్ ఎంచుకోండి', netNodeHint: 'ఏదైనా నోడ్ క్లిక్ చేయండి.', firGenBtn: '📄 FIR ప్యాకేజ్ తయారుచేయి',
    crimeH2: 'భౌగోళిక నేర నమూనా', filterAll: 'అన్ని రకాలు', filterArrest: 'డిజిటల్ అరెస్ట్', filterPhishing: 'ఫిషింగ్', filterCounterfeit: 'నకిలీ కరెన్సీ', filterInvestment: 'పెట్టుబడి మోసం', filterRomance: 'రొమాన్స్ స్కామ్',
    reportH2: 'స్కామ్ రిపోర్ట్ చేయండి', cSubmit: 'ఫిర్యాదు సమర్పించండి',
    footerMain: 'PRAHARI — డిజిటల్ పౌర భద్రత', footerSub: 'ప్రోటోటైప్ · ఈ పేజీలోని అన్ని డేటా ప్రదర్శన ప్రయోజనాల కోసం సిమ్యులేట్ చేయబడింది.',
  },

  mr: {
    brandSub:       'फसवणूक आणि घोटाळा गुप्तचर',
    tab00: 'आढावा', tab01: 'स्कॅम डिटेक्टर', tab02: 'फ्रॉड शील्ड',
    tab03: 'संदेश लोकेटर', tab04: 'चलन स्कॅन', tab05: 'नेटवर्क ग्राफ',
    tab06: 'गुन्हे नकाशा', tab07: 'स्कॅम तक्रार', statusLive: 'थेट डेमो',
    heroH1: 'कॉल जोडण्यापूर्वीच फसवणूक थांबवणे.', heroCta1: 'स्कॅम डिटेक्टर चालवा →', heroCta2: 'नकाशावर संदेश शोधा →',
    scamH2: 'डिजिटल अटक स्कॅम डिटेक्टर', scamAnalyse: 'विश्लेषण करा', scamSample: 'नमुना लोड करा', scamClear: 'साफ करा',
    shieldH2: 'नागरिक फ्रॉड शील्ड', quickChecks: 'त्वरित तपासण्या',
    locH2: 'संदेश उत्पत्ती लोकेटर', locBtn: 'नकाशावर शोधा', locTry: 'वापरून पाहा:',
    curH2: 'बनावट चलन ओळख', curDenomLabel: 'मूल्यवर्ग निवडा', curUploadTitle: 'अपलोड करण्यासाठी क्लिक करा', curUploadHint: 'JPG किंवा PNG · आपल्या ब्राउझरमध्येच विश्लेषण',
    netH2: 'फ्रॉड नेटवर्क ग्राफ', netSelectNode: 'नोड निवडा', netNodeHint: 'कोणत्याही नोडवर क्लिक करा.', firGenBtn: '📄 FIR पॅकेज तयार करा',
    crimeH2: 'भू-स्थानिक गुन्हे नमुना', filterAll: 'सर्व प्रकार', filterArrest: 'डिजिटल अटक', filterPhishing: 'फिशिंग', filterCounterfeit: 'बनावट चलन', filterInvestment: 'गुंतवणूक फसवणूक', filterRomance: 'रोमान्स स्कॅम',
    reportH2: 'स्कॅम तक्रार करा', cSubmit: 'तक्रार सादर करा',
    footerMain: 'PRAHARI — डिजिटल सार्वजनिक सुरक्षा', footerSub: 'प्रोटोटाइप · सर्व डेटा प्रात्यक्षिक उद्देशाने अनुकरणीय.',
  },

  gu: {
    brandSub:       'છેતરપિંડી અને કૌભાંડ ગુપ્તતા',
    tab00: 'ઝાંખી', tab01: 'સ્કૅમ ડિટેક્ટર', tab02: 'ફ્રૉડ શીલ્ડ',
    tab03: 'સંદેશ લોકેટર', tab04: 'ચલણ સ્કૅન', tab05: 'નેટવર્ક ગ્રાફ',
    tab06: 'ક્રાઇમ મૅપ', tab07: 'સ્કૅમ રિપોર્ટ', statusLive: 'લાઇવ ડેમો',
    heroH1: 'કૉલ જોડાતા પહેલા જ ઠગાઈ અટકાવવી.', heroCta1: 'સ્કૅમ ડિટેક્ટર ચલાવો →', heroCta2: 'મૅપ પર સંદેશ શોધો →',
    scamH2: 'ડિજિટલ અટક સ્કૅમ ડિટેક્ટર', scamAnalyse: 'વિશ્લેષણ કરો', scamSample: 'નમૂનો લોડ', scamClear: 'સાફ',
    shieldH2: 'નાગરિક ફ્રૉડ શીલ્ડ', quickChecks: 'ઝડપી ચકાસણી',
    locH2: 'સંદેશ ઉત્પત્તિ લોકેટર', locBtn: 'મૅપ પર શોધો', locTry: 'અજમાવો:',
    curH2: 'નકલી ચલણ ઓળખ', curDenomLabel: 'મૂલ્ય પસંદ કરો', curUploadTitle: 'અપલોડ કરવા ક્લિક', curUploadHint: 'JPG અથવા PNG · તમારા બ્રાઉઝરમાં જ',
    netH2: 'ફ્રૉડ નેટવર્ક ગ્રાફ', netSelectNode: 'નોડ પસંદ', netNodeHint: 'ગ્રાફમાં કોઈ નોડ ક્લિક કરો.', firGenBtn: '📄 FIR પૅકેજ બનાવો',
    crimeH2: 'ભૂ-સ્થાનિક ગુના નમૂના', filterAll: 'બધા પ્રકાર', filterArrest: 'ડિજિટલ અટક', filterPhishing: 'ફિશિંગ', filterCounterfeit: 'નકલી ચલણ', filterInvestment: 'રોકાણ ઠગાઈ', filterRomance: 'રોમાન્સ સ્કૅમ',
    reportH2: 'સ્કૅમ રિપોર્ટ કરો', cSubmit: 'ફરિયાદ સબમિટ',
    footerMain: 'PRAHARI — ડિજિટલ જાહેર સુરક્ષા', footerSub: 'પ્રોટોટાઇપ · બધો ડેટા ડેમો માટે.',
  },

  ml: {
    brandSub:       'തട്ടിപ്പ് ഇന്റലിജൻസ്',
    tab00: 'അവലോകനം', tab01: 'സ്കാം ഡിറ്റക്ടർ', tab02: 'ഫ്രോഡ് ഷീൽഡ്',
    tab03: 'സന്ദേശ ലൊക്കേറ്റർ', tab04: 'കറൻസി സ്കാൻ', tab05: 'നെറ്റ്‌വർക്ക് ഗ്രാഫ്',
    tab06: 'ക്രൈം മ്യാപ്', tab07: 'സ്കാം റിപ്പോർട്ട്', statusLive: 'ലൈവ് ഡെമോ',
    heroH1: 'കോൾ കണക്‌ടാകുന്നതിന് മുൻപ് തട്ടിപ്പ് തടയൽ.', heroCta1: 'സ്കാം ഡിറ്റക്ടർ ഉപയോഗിക്കൂ →', heroCta2: 'മ്യാപ്പിൽ സന്ദേശം കണ്ടെത്തൂ →',
    scamH2: 'ഡിജിറ്റൽ അറസ്റ്റ് സ്കാം ഡിറ്റക്ടർ', scamAnalyse: 'വിശകലനം', scamSample: 'സാമ്പിൾ ലോഡ്', scamClear: 'മായ്‌ക്കൂ',
    shieldH2: 'പൗര ഫ്രോഡ് ഷീൽഡ്', quickChecks: 'ദ്രുത പരിശോധന',
    locH2: 'സന്ദേശ ഉത്ഭവ ലൊക്കേറ്റർ', locBtn: 'മ്യാപ്പിൽ കണ്ടെത്തൂ', locTry: 'ശ്രമിക്കൂ:',
    curH2: 'വ്യാജ കറൻസി തിരിച്ചറിയൽ', curDenomLabel: 'മൂല്യം തിരഞ്ഞെടുക്കൂ', curUploadTitle: 'അപ്‌ലോഡ് ചെയ്യൂ', curUploadHint: 'JPG അല്ലെങ്കിൽ PNG · ബ്രൗസറിൽ തന്നെ',
    netH2: 'ഫ്രോഡ് നെറ്റ്‌വർക്ക് ഗ്രാഫ്', netSelectNode: 'നോഡ് തിരഞ്ഞെടുക്കൂ', netNodeHint: 'ഏതെങ്കിലും നോഡ് ക്ലിക്ക് ചെയ്യൂ.', firGenBtn: '📄 FIR പാക്കേജ് ഉണ്ടാക്കൂ',
    crimeH2: 'ഭൂ-സ്ഥാനിക കുറ്റകൃത്യ പാറ്റേൺ', filterAll: 'എല്ലാ തരം', filterArrest: 'ഡിജിറ്റൽ അറസ്റ്റ്', filterPhishing: 'ഫിഷിംഗ്', filterCounterfeit: 'വ്യാജ കറൻസി', filterInvestment: 'നിക്ഷേപ തട്ടിപ്പ്', filterRomance: 'റൊമാൻസ് സ്കാം',
    reportH2: 'സ്കാം റിപ്പോർട്ട് ചെയ്യൂ', cSubmit: 'പരാതി സമർപ്പിക്കൂ',
    footerMain: 'PRAHARI — ഡിജിറ്റൽ പൊതു സുരക്ഷ', footerSub: 'പ്രോട്ടോടൈപ്പ് · എല്ലാ ഡേറ്റയും ഡെമോ ആവശ്യങ്ങൾക്ക് മാത്രം.',
  },

  pa: {
    brandSub:       'ਧੋਖਾਧੜੀ ਅਤੇ ਠੱਗੀ ਖੁਫੀਆ',
    tab00: 'ਜਾਇਜ਼ਾ', tab01: 'ਸਕੈਮ ਡਿਟੈਕਟਰ', tab02: 'ਫਰਾਡ ਸ਼ੀਲਡ',
    tab03: 'ਸੁਨੇਹਾ ਲੋਕੇਟਰ', tab04: 'ਕਰੰਸੀ ਸਕੈਨ', tab05: 'ਨੈੱਟਵਰਕ ਗ੍ਰਾਫ',
    tab06: 'ਕ੍ਰਾਈਮ ਮੈਪ', tab07: 'ਸਕੈਮ ਰਿਪੋਰਟ', statusLive: 'ਲਾਈਵ ਡੈਮੋ',
    heroH1: 'ਕਾਲ ਜੁੜਨ ਤੋਂ ਪਹਿਲਾਂ ਠੱਗੀ ਰੋਕਣਾ।', heroCta1: 'ਸਕੈਮ ਡਿਟੈਕਟਰ ਚਲਾਓ →', heroCta2: 'ਮੈਪ \'ਤੇ ਸੁਨੇਹਾ ਲੱਭੋ →',
    scamH2: 'ਡਿਜੀਟਲ ਅਰੈਸਟ ਸਕੈਮ ਡਿਟੈਕਟਰ', scamAnalyse: 'ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ', scamSample: 'ਨਮੂਨਾ ਲੋਡ', scamClear: 'ਸਾਫ਼',
    shieldH2: 'ਨਾਗਰਿਕ ਫਰਾਡ ਸ਼ੀਲਡ', quickChecks: 'ਤੇਜ਼ ਜਾਂਚ',
    locH2: 'ਸੁਨੇਹਾ ਮੂਲ ਲੋਕੇਟਰ', locBtn: 'ਮੈਪ \'ਤੇ ਲੱਭੋ', locTry: 'ਅਜ਼ਮਾਓ:',
    curH2: 'ਨਕਲੀ ਕਰੰਸੀ ਪਛਾਣ', curDenomLabel: 'ਮੁੱਲ ਚੁਣੋ', curUploadTitle: 'ਅੱਪਲੋਡ ਕਰਨ ਲਈ ਕਲਿੱਕ', curUploadHint: 'JPG ਜਾਂ PNG · ਤੁਹਾਡੇ ਬ੍ਰਾਉਜ਼ਰ ਵਿੱਚ ਹੀ',
    netH2: 'ਫਰਾਡ ਨੈੱਟਵਰਕ ਗ੍ਰਾਫ', netSelectNode: 'ਨੋਡ ਚੁਣੋ', netNodeHint: 'ਕੋਈ ਵੀ ਨੋਡ ਕਲਿੱਕ ਕਰੋ।', firGenBtn: '📄 FIR ਪੈਕੇਜ ਬਣਾਓ',
    crimeH2: 'ਭੂ-ਸਥਾਨਿਕ ਜੁਰਮ ਨਮੂਨਾ', filterAll: 'ਸਾਰੀਆਂ ਕਿਸਮਾਂ', filterArrest: 'ਡਿਜੀਟਲ ਅਰੈਸਟ', filterPhishing: 'ਫਿਸ਼ਿੰਗ', filterCounterfeit: 'ਨਕਲੀ ਕਰੰਸੀ', filterInvestment: 'ਨਿਵੇਸ਼ ਠੱਗੀ', filterRomance: 'ਰੋਮਾਂਸ ਸਕੈਮ',
    reportH2: 'ਸਕੈਮ ਰਿਪੋਰਟ ਕਰੋ', cSubmit: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ',
    footerMain: 'PRAHARI — ਡਿਜੀਟਲ ਜਨਤਕ ਸੁਰੱਖਿਆ', footerSub: 'ਪ੍ਰੋਟੋਟਾਈਪ · ਸਾਰਾ ਡੇਟਾ ਪ੍ਰਦਰਸ਼ਨ ਲਈ ਹੈ।',
  },

  or: {
    brandSub: 'ଠକାମି ଓ ଧୋଖା ସୂଚନା',
    tab00: 'ଅବଲୋକନ', tab01: 'ସ୍କ୍ୟାମ ଡିଟେକ୍ଟର', tab02: 'ଫ୍ରଡ ଶିଲ୍ଡ',
    tab03: 'ବାର୍ତ୍ତା ଲୋକେଟର', tab04: 'ମୁଦ୍ରା ସ୍କ୍ୟାନ', tab05: 'ନେଟୱର୍କ ଗ୍ରାଫ',
    tab06: 'ଅପରାଧ ମ୍ୟାପ', tab07: 'ସ୍କ୍ୟାମ ରିପୋର୍ଟ', statusLive: 'ଲାଇଭ ଡେମୋ',
    heroH1: 'କଲ ସଂଯୁକ୍ତ ହେବାର ଆଗରୁ ଠକାମି ଅଟକାଇବା।', heroCta1: 'ସ୍କ୍ୟାମ ଡିଟେକ୍ଟର ଚଳାଅ →', heroCta2: 'ମ୍ୟାପରେ ବାର୍ତ୍ତା ଖୋଜ →',
    scamH2: 'ଡିଜିଟାଲ ଅ‌ରେଷ୍ଟ ସ୍କ୍ୟାମ ଡିଟେକ୍ଟର', scamAnalyse: 'ବିଶ୍ଳେଷଣ', scamSample: 'ନମୁନା ଲୋଡ', scamClear: 'ସଫା',
    shieldH2: 'ନାଗରିକ ଫ୍ରଡ ଶିଲ୍ଡ', quickChecks: 'ଶୀଘ୍ର ଯାଞ୍ଚ',
    locH2: 'ବାର୍ତ୍ତା ଉତ୍ସ ଲୋକେଟର', locBtn: 'ମ୍ୟାପରେ ଖୋଜ', locTry: 'ଚେଷ୍ଟା କର:',
    curH2: 'ନକଲ ମୁଦ୍ରା ଚିହ୍ନଟ', curDenomLabel: 'ମୂଲ୍ୟ ବାଛ', curUploadTitle: 'ଅପଲୋଡ ଲାଗି କ୍ଲିକ', curUploadHint: 'JPG ବା PNG · ତୁମ ବ୍ରାଉଜରରେ',
    netH2: 'ଫ୍ରଡ ନେଟୱର୍କ ଗ୍ରାଫ', netSelectNode: 'ନୋଡ ବାଛ', netNodeHint: 'ଯେକୌଣସି ନୋଡ କ୍ଲିକ କର।', firGenBtn: '📄 FIR ପ୍ୟାକେଜ ତିଆର',
    crimeH2: 'ଭୂ-ସ୍ଥାନ ଅପରାଧ ଧାଞ୍ଚା', filterAll: 'ସବୁ ପ୍ରକାର', filterArrest: 'ଡିଜିଟାଲ ଅ‌ରେଷ୍ଟ', filterPhishing: 'ଫିଶିଂ', filterCounterfeit: 'ନକଲ ମୁଦ୍ରା', filterInvestment: 'ନିବେଶ ଠକାମି', filterRomance: 'ରୋମାନ୍ସ ସ୍କ୍ୟାମ',
    reportH2: 'ସ୍କ୍ୟାମ ରିପୋର୍ଟ', cSubmit: 'ଅଭିଯୋଗ ଦାଖଲ',
    footerMain: 'PRAHARI — ଡିଜିଟାଲ ସାର୍ବଜନୀନ ସୁରକ୍ଷା', footerSub: 'ପ୍ରୋଟୋଟାଇପ · ସମସ୍ତ ଡାଟା ଡେମୋ ଉଦ୍ଦେଶ୍ୟ।',
  },

  as: {
    brandSub: 'প্ৰতাৰণা আৰু ঠগবাজি গুপ্তচৰ',
    tab00: 'আলোচনা', tab01: 'স্কাম ডিটেক্টৰ', tab02: 'ফ্ৰড শ্বিল্ড',
    tab03: 'বাৰ্তা লোকেটৰ', tab04: 'মুদ্ৰা স্কান', tab05: 'নেটৱৰ্ক গ্ৰাফ',
    tab06: 'অপৰাধ মেপ', tab07: 'স্কাম প্ৰতিবেদন', statusLive: 'লাইভ ডেমো',
    heroH1: 'কল সংযোগ হোৱাৰ আগতেই ঠগবাজি ৰোধ কৰা।', heroCta1: 'স্কাম ডিটেক্টৰ চলাওক →', heroCta2: 'মেপত বাৰ্তা বিচাৰক →',
    scamH2: 'ডিজিটেল গ্ৰেপ্তাৰ স্কাম ডিটেক্টৰ', scamAnalyse: 'বিশ্লেষণ কৰক', scamSample: 'নমুনা লোড', scamClear: 'পৰিষ্কাৰ',
    shieldH2: 'নাগৰিক ফ্ৰড শ্বিল্ড', quickChecks: 'দ্রুত পৰীক্ষা',
    locH2: 'বাৰ্তা উৎস লোকেটৰ', locBtn: 'মেপত বিচাৰক', locTry: 'চেষ্টা কৰক:',
    curH2: 'নকল মুদ্ৰা সনাক্ত', curDenomLabel: 'মূল্য বাছক', curUploadTitle: 'আপলোড কৰিবলৈ ক্লিক', curUploadHint: 'JPG বা PNG · আপোনাৰ ব্ৰাউজাৰত',
    netH2: 'ফ্ৰড নেটৱৰ্ক গ্ৰাফ', netSelectNode: 'নোড বাছক', netNodeHint: 'যিকোনো নোড ক্লিক কৰক।', firGenBtn: '📄 FIR পেকেজ তৈয়াৰ',
    crimeH2: 'ভৌগোলিক অপৰাধ নমুনা', filterAll: 'সকলো প্ৰকাৰ', filterArrest: 'ডিজিটেল গ্ৰেপ্তাৰ', filterPhishing: 'ফিচিং', filterCounterfeit: 'নকল মুদ্ৰা', filterInvestment: 'বিনিয়োগ প্ৰতাৰণা', filterRomance: 'ৰোমান্স স্কাম',
    reportH2: 'স্কাম প্ৰতিবেদন দিয়ক', cSubmit: 'অভিযোগ দাখিল',
    footerMain: 'PRAHARI — ডিজিটেল ৰাজহুৱা সুৰক্ষা', footerSub: 'প্ৰ\'ট\'টাইপ · সকলো ডেটা ডেমো উদ্দেশ্যৰ বাবে।',
  },
};

/* ── lang codes → html lang attribute ─────────────────────────── */
const HTML_LANG = {
  en:'en', hi:'hi', kn:'kn', ta:'ta', bn:'bn',
  te:'te', mr:'mr', gu:'gu', ml:'ml', pa:'pa', or:'or', as:'as',
};

/* ── Apply all translations ─────────────────────────────────────── */
function applyLang(lang) {
  const strings = UI_STRINGS[lang] || UI_STRINGS.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    // Special handling for HTML content vs text content
    if (key in strings) {
      if (el.dataset.i18nHtml !== undefined) {
         el.innerHTML = strings[key];
      } else {
         el.textContent = strings[key];
      }
    }
  });
  
  // Also sync the Fraud Shield lang dropdown if it exists
  const shieldLang = document.getElementById('chatLang');
  if (shieldLang && shieldLang.value !== lang) {
      shieldLang.value = lang;
      shieldLang.dispatchEvent(new Event('change'));
  }

  document.documentElement.lang = HTML_LANG[lang] || 'en';
  localStorage.setItem('prahari-lang', lang);
}

/* ── Init ───────────────────────────────────────────────────────── */
export function initI18n() {
  const saved = localStorage.getItem('prahari-lang') || 'en';
  const switcher = document.getElementById('globalLangSwitcher');
  if (switcher) switcher.value = saved;
  applyLang(saved);

  if (switcher) {
    switcher.addEventListener('change', () => {
      applyLang(switcher.value);
    });
  }
}
