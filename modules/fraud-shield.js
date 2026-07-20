/**
 * fraud-shield.js — MODULE CS-02
 * Citizen Fraud Shield — 12-language conversational advisory chat.
 *
 * Depends on: scam-detector.js (scoreTranscript re-exported via main.js)
 */

import { scoreTranscript } from './scam-detector.js';

/* ── Language response strings (12 regional languages) ─────────── */
const SHIELD_STRINGS = {
  en: {
    safe:   "This doesn't match known scam patterns, but stay cautious with anything asking for money or OTPs.",
    danger: "This matches known scam patterns. Do not click links, share OTPs, or send money. Report it at cybercrime.gov.in or call 1930.",
    greet:  "Got it — analysing…",
  },
  hi: {
    safe:   "यह किसी ज्ञात धोखाधड़ी पैटर्न से मेल नहीं खाता, फिर भी पैसे या OTP मांगने वाले संदेशों से सावधान रहें।",
    danger: "यह एक ज्ञात धोखाधड़ी पैटर्न से मेल खाता है। लिंक पर क्लिक न करें, OTP साझा न करें। cybercrime.gov.in पर रिपोर्ट करें या 1930 पर कॉल करें।",
    greet:  "समझ गया — जांच हो रही है…",
  },
  kn: {
    safe:   "ಇದು ತಿಳಿದಿರುವ ಮೋಸದ ಮಾದರಿಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ, ಆದರೂ ಹಣ ಅಥವಾ OTP ಕೇಳುವ ಯಾವುದೇ ಸಂದೇಶದ ಬಗ್ಗೆ ಜಾಗರೂಕರಾಗಿರಿ.",
    danger: "ಇದು ತಿಳಿದಿರುವ ಮೋಸದ ಮಾದರಿಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ. ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ, OTP ಹಂಚಿಕೊಳ್ಳಬೇಡಿ. cybercrime.gov.in ನಲ್ಲಿ ವರದಿ ಮಾಡಿ ಅಥವಾ 1930 ಗೆ ಕರೆ ಮಾಡಿ.",
    greet:  "ಸರಿ — ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ…",
  },
  ta: {
    safe:   "இது அறியப்பட்ட மோசடி வடிவங்களுடன் பொருந்தவில்லை, ஆனாலும் பணம் அல்லது OTP கேட்கும் செய்திகளில் எச்சரிக்கையாக இருங்கள்.",
    danger: "இது அறியப்பட்ட மோசடி வடிவத்துடன் பொருந்துகிறது. இணைப்புகளை கிளிக் செய்ய வேண்டாம், OTP பகிர வேண்டாம். cybercrime.gov.in இல் புகாரளிக்கவும் அல்லது 1930 ஐ அழைக்கவும்.",
    greet:  "சரி — பரிசோதிக்கிறோம்…",
  },
  bn: {
    safe:   "এটি কোনো পরিচিত প্রতারণার ধরণের সাথে মেলে না, তবে টাকা বা OTP চাওয়া যেকোনো বার্তায় সতর্ক থাকুন।",
    danger: "এটি পরিচিত প্রতারণার ধরণের সাথে মেলে। লিঙ্কে ক্লিক করবেন না, OTP শেয়ার করবেন না। cybercrime.gov.in-এ রিপোর্ট করুন বা 1930-এ কল করুন।",
    greet:  "বুঝেছি — পরীক্ষা করা হচ্ছে…",
  },
  te: {
    safe:   "ఇది తెలిసిన మోసం నమూనాలతో సరిపోలడం లేదు, కానీ డబ్బు లేదా OTP అడిగే సందేశాలపై జాగ్రత్తగా ఉండండి.",
    danger: "ఇది తెలిసిన మోసం నమూనాతో సరిపోలింది. లింక్‌లు క్లిక్ చేయకండి, OTP షేర్ చేయకండి. cybercrime.gov.in లో నివేదించండి లేదా 1930 కి కాల్ చేయండి.",
    greet:  "అర్థమైంది — తనిఖీ చేస్తున్నాము…",
  },
  mr: {
    safe:   "हे कोणत्याही ज्ञात फसवणूक नमुन्याशी जुळत नाही, तरीही पैसे किंवा OTP मागणाऱ्या कोणत्याही संदेशाबाबत सावध रहा.",
    danger: "हे ज्ञात फसवणूक नमुन्याशी जुळते. लिंकवर क्लिक करू नका, OTP शेअर करू नका. cybercrime.gov.in वर तक्रार करा किंवा 1930 वर कॉल करा.",
    greet:  "समजले — तपासणी सुरू आहे…",
  },
  gu: {
    safe:   "આ કોઈ જાણીતી છેતરપિંડીની પેટર્ન સાથે મેળ ખાતું નથી, છતાં પૈસા અથવા OTP માંગતા સંદેશાઓ અંગે સાવચેત રહો.",
    danger: "આ જાણીતી છેતરપિંડીની પેટર્ન સાથે મેળ ખાય છે. લિંક ક્લિક ન કરો, OTP શેર ન કરો. cybercrime.gov.in પર ફરિયાદ કરો અથવા 1930 પર કૉલ કરો.",
    greet:  "સમજ્યા — તપાસ ચાલુ છે…",
  },
  ml: {
    safe:   "ഇത് അറിയപ്പെടുന്ന തട്ടിപ്പ് പാറ്റേണുകളുമായി പൊരുത്തപ്പെടുന്നില്ല, എന്നാൽ പണം അല്ലെങ്കിൽ OTP ആവശ്യപ്പെടുന്ന സന്ദേശങ്ങളിൽ ജാഗ്രത പാലിക്കുക.",
    danger: "ഇത് അറിയപ്പെടുന്ന തട്ടിപ്പ് പാറ്റേണുമായി പൊരുത്തപ്പെടുന്നു. ലിങ്ക് ക്ലിക്ക് ചെയ്യരുത്, OTP പങ്കിടരുത്. cybercrime.gov.in ൽ റിപ്പോർട്ട് ചെയ്യുക അല്ലെങ്കിൽ 1930 ൽ വിളിക്കുക.",
    greet:  "മനസ്സിലായി — പരിശോധിക്കുന്നു…",
  },
  pa: {
    safe:   "ਇਹ ਕਿਸੇ ਜਾਣੀ-ਪਛਾਣੀ ਧੋਖਾਧੜੀ ਦੀ ਪੈਟਰਨ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ, ਪਰ ਪੈਸੇ ਜਾਂ OTP ਮੰਗਣ ਵਾਲੇ ਸੁਨੇਹਿਆਂ ਬਾਰੇ ਸਾਵਧਾਨ ਰਹੋ।",
    danger: "ਇਹ ਜਾਣੀ-ਪਛਾਣੀ ਧੋਖਾਧੜੀ ਦੀ ਪੈਟਰਨ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ। ਲਿੰਕ ਕਲਿੱਕ ਨਾ ਕਰੋ, OTP ਸਾਂਝਾ ਨਾ ਕਰੋ। cybercrime.gov.in 'ਤੇ ਰਿਪੋਰਟ ਕਰੋ ਜਾਂ 1930 'ਤੇ ਕਾਲ ਕਰੋ।",
    greet:  "ਸਮਝ ਗਿਆ — ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ…",
  },
  or: {
    safe:   "ଏହା କୌଣସି ଜଣା ଠକାମି ଧାଞ୍ଚା ସହ ମେଳ ଖାଉ ନାହିଁ, ତଥାପି ଟଙ୍କା ବା OTP ମାଗୁଥିବା ବାର୍ତ୍ତା ବ୍ୟାପାରରେ ସତର୍କ ରୁହ।",
    danger: "ଏହା ଜଣା ଠକାମି ଧାଞ୍ଚା ସହ ମେଳ ଖାଉଛି। ଲିଙ୍କ କ୍ଲିକ କର ନାହିଁ, OTP ଭାଗ କର ନାହିଁ। cybercrime.gov.in ରେ ରିପୋର୍ଟ କର ବା 1930 ରେ ଫୋନ କର।",
    greet:  "ବୁଝିଲି — ଯାଞ୍ଚ ହେଉଛି…",
  },
  as: {
    safe:   "এইটো কোনো পৰিচিত প্ৰতাৰণাৰ আৰ্হিৰ সৈতে মিল নাখায়, তথাপি টকা বা OTP বিচৰা যিকোনো বাৰ্তাত সতৰ্ক হওক।",
    danger: "এইটো পৰিচিত প্ৰতাৰণাৰ আৰ্হিৰ সৈতে মিলে। লিংক ক্লিক নকৰিব, OTP শ্বেয়াৰ নকৰিব। cybercrime.gov.in ত প্ৰতিবেদন দিয়ক অথবা 1930 ত ফোন কৰক।",
    greet:  "বুজিলোঁ — পৰীক্ষা কৰা হৈছে…",
  },
};

/* ── Chat UI helpers ─────────────────────────────────────────── */
function addChatMsg(text, who, verdict) {
  const win = document.getElementById('chatWindow');
  const div = document.createElement('div');
  div.className = `chat-msg ${who}${verdict ? ' verdict-' + verdict : ''}`;
  div.innerHTML = `<span class="chat-avatar">${who === 'user' ? '🧑' : '🛡️'}</span><div class="chat-bubble"></div>`;
  div.querySelector('.chat-bubble').textContent = text;
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
}

/* ── Event wiring ─────────────────────────────────────────────── */
export function initFraudShield() {
  document.getElementById('chatForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('chatInput');
    const lang  = document.getElementById('chatLang').value;
    const text  = input.value.trim();
    if (!text) return;
    addChatMsg(text, 'user');
    input.value = '';

    setTimeout(() => {
      const { score, tier } = scoreTranscript(text);
      const strings   = SHIELD_STRINGS[lang] || SHIELD_STRINGS.en;
      const isDanger  = tier === 'high' || tier === 'critical';
      const verdict   = isDanger ? strings.danger : strings.safe;
      addChatMsg(`${verdict} (risk score: ${score}/100)`, 'bot', isDanger ? 'danger' : 'safe');
    }, 350);
  });

  document.querySelectorAll('.chip-btn[data-fill]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('chatInput').value = btn.dataset.fill;
      document.getElementById('chatInput').focus();
    });
  });
}
