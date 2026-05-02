import React, { useEffect, useState, useRef } from 'react';

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const themes = {
  light: {
    bg: '#f4f3ff',
    bgGradient: 'linear-gradient(135deg, #f4f3ff 0%, #ede9fe 50%, #f0f4ff 100%)',
    surface: '#ffffff',
    surfaceAlt: '#f8f7ff',
    border: '#ddd6fe',
    borderMid: 'rgba(167,139,250,0.25)',
    text: '#1e1b4b',
    textSub: '#6d6a8a',
    textMute: '#9896b0',
    accent1: '#6d28d9',
    accent2: '#4f46e5',
    accentGrad: 'linear-gradient(135deg, #6d28d9, #4f46e5)',
    accentGradHero: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    accentLight: '#ede9fe',
    accentLightBorder: 'rgba(109,40,217,0.25)',
    accentText: '#6d28d9',
    pill: '#ede9fe',
    pillText: '#6d28d9',
    trackColor: '#ede9fe',
    header: 'rgba(244,243,255,0.88)',
    cardShadow: '0 2px 16px rgba(109,40,217,0.08)',
    cardShadowHover: '0 12px 32px rgba(109,40,217,0.18)',
    inputBg: '#fafaff',
    inputBorder: '#ddd6fe',
    toggleBg: '#ddd6fe',
    danger: '#be185d',
    dangerBg: '#fdf2f8',
    dangerBorder: '#fbcfe8',
    warn: '#92400e',
    warnBg: '#fffbeb',
    warnBorder: '#fde68a',
    info: '#1e40af',
    infoBg: '#eff6ff',
    infoBorder: '#bfdbfe',
    sevHigh: '#be185d',
    sevHighBg: '#fdf2f8',
    sevMed: '#92400e',
    sevMedBg: '#fffbeb',
    sevLow: '#1d4ed8',
    sevLowBg: '#eff6ff',
    featureBg1: '#ede9fe',
    featureBg2: '#eff6ff',
    featureBg3: '#fef3c7',
    iconBase: '#e0e7ff',
    iconRed: '#fce7f3',
    iconOrange: '#fef3c7',
    ctaBg: 'linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)',
    progressColor: '#7c3aed',
  },
  dark: {
    bg: '#0f0d1a',
    bgGradient: 'linear-gradient(135deg, #0f0d1a 0%, #130e2a 50%, #0d1020 100%)',
    surface: '#1a1730',
    surfaceAlt: '#1e1a38',
    border: '#2d2850',
    borderMid: 'rgba(139,92,246,0.2)',
    text: '#e8e6f5',
    textSub: '#a09cbf',
    textMute: '#6b6890',
    accent1: '#a78bfa',
    accent2: '#818cf8',
    accentGrad: 'linear-gradient(135deg, #7c3aed, #6366f1)',
    accentGradHero: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    accentLight: '#231f42',
    accentLightBorder: 'rgba(139,92,246,0.3)',
    accentText: '#a78bfa',
    pill: '#231f42',
    pillText: '#a78bfa',
    trackColor: '#231f42',
    header: 'rgba(15,13,26,0.9)',
    cardShadow: '0 2px 20px rgba(0,0,0,0.4)',
    cardShadowHover: '0 12px 40px rgba(0,0,0,0.6)',
    inputBg: '#1a1730',
    inputBorder: '#2d2850',
    toggleBg: '#2d2850',
    danger: '#f472b6',
    dangerBg: '#2a1020',
    dangerBorder: '#6b2040',
    warn: '#fbbf24',
    warnBg: '#1a1200',
    warnBorder: '#5a3a00',
    info: '#93c5fd',
    infoBg: '#0d1a30',
    infoBorder: '#1e3a60',
    sevHigh: '#f472b6',
    sevHighBg: '#2a1020',
    sevMed: '#fbbf24',
    sevMedBg: '#1a1200',
    sevLow: '#93c5fd',
    sevLowBg: '#0d1a30',
    featureBg1: '#231f42',
    featureBg2: '#0d1a30',
    featureBg3: '#1a1200',
    iconBase: '#231f42',
    iconRed: '#2a1020',
    iconOrange: '#1a1200',
    ctaBg: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    progressColor: '#a78bfa',
  }
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 24, className = '', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d={d} />
  </svg>
);

const Icons = {
  Activity: (p) => <Icon {...p} d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  Sun: (p) => <Icon {...p} d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM12 2v6m0 6v6M2 12h6m6 0h6" />,
  Moon: (p) => <Icon {...p} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
};

// ─── Spinner ─────────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
  </svg>
);

// ─── Circular Progress ────────────────────────────────────────────────────────
const CircularProgress = ({ value, size = 120, strokeWidth = 8, color, trackColor, children }) => {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={strokeWidth} strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  );
};

// ─── Dark/Light Toggle Button ─────────────────────────────────────────────────
const ThemeToggle = ({ dark, onToggle, t }) => (
  <button
    onClick={onToggle}
    title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 40, height: 40, borderRadius: 12,
      background: t.accentLight, border: `1px solid ${t.border}`,
      cursor: 'pointer', color: t.accentText, flexShrink: 0,
      transition: 'all 0.2s',
    }}
  >
    {dark
      ? <Icons.Sun size={17} />
      : <Icons.Moon size={17} />
    }
  </button>
);

// ─── Main App ─────────────────────────────────────────────────────────────────
const HealthCheckerApp = () => {
  const [dark, setDark] = useState(true);
  const t = dark ? themes.dark : themes.light;

  const [view, setView] = useState('landing');
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [showNux, setShowNux] = useState(false);
  const [nuxStep, setNuxStep] = useState(0);
  const [authError, setAuthError] = useState('');
  const [predictionError, setPredictionError] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const REQUEST_TIMEOUT_MS = 12000;
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const nameRef = useRef(null);

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const symptoms = [
    { id: 1, name: 'Fever', category: 'General', icon: '🌡️' },
    { id: 2, name: 'Cough', category: 'Respiratory', icon: '😷' },
    { id: 3, name: 'Headache', category: 'Neurological', icon: '🤕' },
    { id: 4, name: 'Fatigue', category: 'General', icon: '😴' },
    { id: 5, name: 'Sore Throat', category: 'Respiratory', icon: '🗣️' },
    { id: 6, name: 'Shortness of Breath', category: 'Respiratory', icon: '😮‍💨' },
    { id: 7, name: 'Chest Pain', category: 'Cardiac', icon: '💔' },
    { id: 8, name: 'Nausea', category: 'GI', icon: '🤢' },
    { id: 9, name: 'Vomiting', category: 'GI', icon: '🤮' },
    { id: 10, name: 'Diarrhea', category: 'GI', icon: '🫀' },
    { id: 11, name: 'Abdominal Pain', category: 'GI', icon: '🤰' },
    { id: 12, name: 'Muscle Ache', category: 'Musculoskeletal', icon: '💪' },
    { id: 13, name: 'Joint Pain', category: 'Musculoskeletal', icon: '🦴' },
    { id: 14, name: 'Dizziness', category: 'Neurological', icon: '😵' },
    { id: 15, name: 'Loss of Taste', category: 'Sensory', icon: '👅' },
    { id: 16, name: 'Loss of Smell', category: 'Sensory', icon: '👃' },
    { id: 17, name: 'Runny Nose', category: 'Respiratory', icon: '🤧' },
    { id: 18, name: 'Sneezing', category: 'Respiratory', icon: '🤧' },
    { id: 19, name: 'Chills', category: 'General', icon: '🥶' },
    { id: 20, name: 'Sweating', category: 'General', icon: '💦' },
    { id: 21, name: 'Rash', category: 'Dermatological', icon: '🔴' },
    { id: 22, name: 'Itching', category: 'Dermatological', icon: '🐜' },
    { id: 23, name: 'Back Pain', category: 'Musculoskeletal', icon: '🧍' },
    { id: 24, name: 'Confusion', category: 'Neurological', icon: '🤔' },
    { id: 25, name: 'Rapid Heartbeat', category: 'Cardiac', icon: '💓' },
    { id: 26, name: 'Swelling', category: 'General', icon: '🎈' },
    { id: 27, name: 'Weight Loss', category: 'General', icon: '⚖️' },
    { id: 28, name: 'Difficulty Swallowing', category: 'Throat', icon: '😖' },
    { id: 29, name: 'Blurred Vision', category: 'Visual', icon: '👓' },
    { id: 30, name: 'Ear Pain', category: 'ENT', icon: '👂' },
  ];

  const chronicConditions = ['Diabetes Type 1','Diabetes Type 2','Hypertension','Asthma','COPD','Heart Disease','Kidney Disease','Liver Disease','Arthritis','Thyroid Disorder','Cancer History','Autoimmune Disease','Depression','Anxiety','Epilepsy','None'];
  const commonMedications = ['Blood Pressure Medication','Insulin','Asthma Inhaler','Antibiotics','Pain Relievers','Antidepressants','Blood Thinners','Steroids','Thyroid Medication','Cholesterol Medication','None'];
  const commonAllergies = ['Penicillin','Pollen','Dust','Pet Dander','Food Allergies','Latex','Aspirin','Sulfa Drugs','Shellfish','Nuts','None'];

  const filteredSymptoms = symptoms.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const isPredictionReady = selectedSymptoms.length > 0 && Boolean(age) && Boolean(gender);

  const toggleItem = (item, list, setList) => {
    if (item === 'None') { setList(['None']); return; }
    const filtered = list.filter(i => i !== 'None');
    setList(list.includes(item) ? filtered.filter(i => i !== item) : [...filtered, item]);
  };
  
  const toggleSymptom = (s) => {
    setSelectedSymptoms(prev =>
      prev.find(x => x.id === s.id) ? prev.filter(x => x.id !== s.id) : [...prev, s]
    );
  };

  const handleAuth = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const name = nameRef.current?.value;
    if (!email || !password || (authMode === 'register' && !name)) return;
    setAuthError(''); setLoading(true);
    try {
      const endpoint = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const payload = authMode === 'register' ? { email, password, name } : { email, password };
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      let response;
      try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeoutId);
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || 'Authentication failed');
      if (data?.token) localStorage.setItem('auth_token', data.token);
      setUser({ name: data?.name || name || email.split('@')[0], email });
      setView('dashboard');
      if (authMode === 'register') { setShowNux(true); }
    } catch (error) {
      if (error?.name === 'AbortError') {
        setAuthError(`Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s. Please try again.`);
        return;
      }
      const isNetworkError = error instanceof TypeError && error.message?.toLowerCase().includes('fetch');
      setAuthError(
        isNetworkError
          ? `Cannot reach the server at ${API_BASE_URL}. Make sure the backend is running.`
          : (error.message || 'Authentication failed. Please try again.')
      );
    } finally { setLoading(false); }
  };

  const handlePrediction = async () => {
    if (!isPredictionReady) return;
    setPredictionError(''); setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Please sign in again.');
      await fetch(`${API_BASE_URL}/api/user/me`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ age: Number(age), gender, chronic_conditions: selectedConditions.filter(c => c !== 'None'), medications: selectedMedications.filter(m => m !== 'None'), allergies: selectedAllergies.filter(a => a !== 'None') })
      });
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ age: Number(age), gender, symptoms: selectedSymptoms.map(s => s.id), chronic_conditions: selectedConditions.filter(c => c !== 'None') })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || 'Prediction failed');
      const meta = {
        'Common Cold': { treatment: 'Rest, fluids, OTC medications', icon: '🤧' },
        'Influenza': { treatment: 'Antivirals if early, rest', icon: '🤒' },
        'COVID-19': { treatment: 'Isolation, medical monitoring', icon: '🦠' },
        'Gastroenteritis': { treatment: 'Hydration, bland diet', icon: '🤢' },
        'Migraine': { treatment: 'Pain relievers, dark room', icon: '🤕' },
        'Bronchitis': { treatment: 'Cough suppressants, rest', icon: '😷' },
        'Pneumonia': { treatment: 'Antibiotics, oxygen therapy', icon: '🫁' },
        'Sinusitis': { treatment: 'Decongestants, nasal irrigation', icon: '👃' },
        'Allergic Rhinitis': { treatment: 'Antihistamines', icon: '🌼' },
        'Strep Throat': { treatment: 'Antibiotics', icon: '🗣️' },
      };
      const predictions = (data.predictions || []).map(p => ({
        ...p, treatment: meta[p.disease]?.treatment || 'Consult healthcare provider', icon: meta[p.disease]?.icon || '🩺'
      }));
      setPrediction({ ...data, predictions });
      setView('results');
    } catch (error) {
      setPredictionError(error.message || 'Prediction failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setUser(null); setView('landing'); setPrediction(null);
    setSelectedSymptoms([]); setAge(''); setGender('');
    setSelectedConditions([]); setSelectedMedications([]); setSelectedAllergies([]);
  };

  // ─── Input style helper ───────────────────────────────────────────────────
  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    border: `2px solid ${t.inputBorder}`, outline: 'none',
    fontSize: 15, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0',
    boxSizing: 'border-box', background: t.inputBg,
    color: t.text, transition: 'border 0.15s', wordWrap: 'break-word'
  };

  // ─── NUX Modal ────────────────────────────────────────────────────────────
  const nuxSteps = [
    { title: 'Welcome to Smart Health', desc: "Your AI health companion. Let's take a quick tour.", icon: '✨', color: t.accent1 },
    { title: 'Enter Basic Info', desc: 'Add your age and gender so we can personalise predictions.', icon: '👤', color: t.accent2 },
    { title: 'Add Medical History', desc: 'Optionally enter conditions, meds, or allergies for better accuracy.', icon: '🏥', color: t.danger },
    { title: 'Select Symptoms', desc: 'Browse or search 30+ symptoms. Tap any that apply.', icon: '🩺', color: t.textSub },
    { title: 'Get AI Insights', desc: 'Our ML model ranks the top 5 likely conditions with confidence scores.', icon: '🤖', color: t.accent1 },
    { title: "You're Ready!", desc: 'Remember: for educational use only. Always consult a real doctor.', icon: '🚀', color: t.accent2 },
  ];

  if (showNux) return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      <div style={{ background: t.surface, borderRadius: 24, padding: 40, maxWidth: 440, width: '100%', position: 'relative', boxShadow: '0 32px 80px rgba(0,0,0,0.35)', border: `1px solid ${t.border}`, overflowY: 'auto', maxHeight: '90vh' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>{nuxSteps[nuxStep].icon}</div>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: t.text, marginBottom: 10, wordWrap: 'break-word', wordBreak: 'break-word' }}>{nuxSteps[nuxStep].title}</h2>
          <p style={{ color: t.textSub, fontSize: 15, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", wordWrap: 'break-word', wordBreak: 'break-word' }}>{nuxSteps[nuxStep].desc}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 28 }}>
          {nuxSteps.map((_, i) => (
            <div key={i} style={{ height: 6, borderRadius: 3, background: i === nuxStep ? t.accent1 : t.border, width: i === nuxStep ? 24 : 6, transition: 'all 0.2s', flexShrink: 0 }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {nuxStep > 0 && (
            <button onClick={() => setNuxStep(n => n - 1)} style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: `2px solid ${t.border}`, background: 'transparent', color: t.text, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Back</button>
          )}
          <button onClick={() => { if (nuxStep < nuxSteps.length - 1) setNuxStep(n => n + 1); else setShowNux(false); }}
            style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: 'none', background: t.accentGrad, color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {nuxStep < nuxSteps.length - 1 ? 'Next' : 'Get Started'}
          </button>
        </div>
        <button onClick={() => setShowNux(false)} style={{ position: 'absolute', top: 16, right: 16, background: t.accentLight, border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: t.textSub, fontSize: 14, flexShrink: 0 }}>✕</button>
      </div>
    </div>
  );

  // ─── Shared header component ──────────────────────────────────────────────
  const AppHeader = ({ showUser = false }) => (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: t.header, backdropFilter: 'blur(14px)', borderBottom: `1px solid ${t.borderMid}`, padding: isMobile ? '10px 12px' : '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
        <div style={{ width: 36, height: 36, borderRadius: 11, background: t.accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontSize: 16 }}>💜</span>
        </div>
        <span style={{ fontFamily: isMobile ? "'DM Sans', sans-serif" : "'Poppins', sans-serif", fontWeight: 800, fontSize: isMobile ? 15 : 17, color: t.text, letterSpacing: isMobile ? 0 : '-0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Smart Health</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 8, flexShrink: 0 }}>
        {showUser && user && !isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, background: t.accentLight, minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: t.accentText, fontFamily: "'DM Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
          </div>
        )}
        <ThemeToggle dark={dark} onToggle={() => setDark(d => !d)} t={t} />
        {showUser && (
          <>
            {!isMobile && <button onClick={() => setShowNux(true)} style={{ padding: '8px 12px', borderRadius: 10, background: t.accentLight, color: t.accentText, fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>📖</button>}
            <button onClick={handleLogout} style={{ padding: isMobile ? '8px 10px' : '8px 14px', borderRadius: 10, background: t.surfaceAlt, color: t.text, fontWeight: 600, border: `1px solid ${t.border}`, cursor: 'pointer', fontSize: isMobile ? 12 : 13, fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>Logout</button>
          </>
        )}
        {!showUser && (
          <button onClick={() => setView('auth')} style={{ padding: '10px 20px', borderRadius: 12, background: t.accentGrad, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 14, fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', flexShrink: 0 }}>
            Get Started →
          </button>
        )}
      </div>
    </header>
  );

  // ─── LANDING ──────────────────────────────────────────────────────────────
  if (view === 'landing') return (
    <div style={{ minHeight: '100vh', background: t.bgGradient, fontFamily: "'DM Sans', sans-serif", width: '100%', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      <AppHeader />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px 40px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 99, background: t.accentLight, color: t.accentText, fontWeight: 600, fontSize: 13, marginBottom: 24, border: `1px solid ${t.accentLightBorder}` }}>
            ✨ AI-Powered Health Insights
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(38px, 7vw, 68px)', fontWeight: 800, color: t.text, lineHeight: 1.08, letterSpacing: '-1px', marginBottom: 20, wordWrap: 'break-word', wordBreak: 'break-word' }}>
            Your Personal Health AI
          </h1>
          <p style={{ fontSize: 18, color: t.textSub, maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.7, wordWrap: 'break-word', wordBreak: 'break-word' }}>
            Analyze 30+ symptoms instantly. Get AI-ranked predictions with confidence scores.
          </p>
          <button onClick={() => setView('auth')} style={{ padding: '16px 36px', borderRadius: 16, background: t.accentGrad, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 16, fontFamily: "'DM Sans', sans-serif", boxShadow: `0 8px 32px ${t.accent1}44`, transition: 'transform 0.15s, box-shadow 0.15s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 14px 40px ${t.accent1}55`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 8px 32px ${t.accent1}44`; }}>
            Start Free Assessment
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 48 }}>
          {[
            { icon: '🛡️', title: 'Secure & Private', desc: 'Military-grade encryption protects all your health data.', bg: t.featureBg1, accent: t.accent1 },
            { icon: '🤖', title: 'AI-Powered', desc: 'ML models trained on extensive medical datasets.', bg: t.featureBg2, accent: t.accent2 },
            { icon: '⚡', title: 'Instant Results', desc: 'Predictions in seconds with detailed explanations.', bg: t.featureBg3, accent: t.warn },
          ].map((f, i) => (
            <div key={i} style={{ background: t.surface, borderRadius: 20, padding: 28, boxShadow: t.cardShadow, border: `1px solid ${t.border}`, transition: 'transform 0.15s, box-shadow 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = t.cardShadowHover; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = t.cardShadow; }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>{f.icon}</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 8, wordWrap: 'break-word', wordBreak: 'break-word' }}>{f.title}</div>
              <div style={{ fontSize: 14, color: t.textSub, lineHeight: 1.6, wordWrap: 'break-word', wordBreak: 'break-word' }}>{f.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ borderRadius: 24, background: t.ctaBg, padding: '48px 40px', textAlign: 'center', color: '#fff', boxShadow: `0 24px 64px ${t.accent1}44` }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.5px', wordWrap: 'break-word', wordBreak: 'break-word' }}>Ready to check your symptoms?</h2>
          <p style={{ opacity: 0.85, marginBottom: 28, fontSize: 16, wordWrap: 'break-word', wordBreak: 'break-word' }}>Join thousands using AI for smarter health insights.</p>
          <button onClick={() => setView('auth')} style={{ padding: '14px 32px', borderRadius: 14, background: '#fff', color: t.accent1, fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 15, fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>
            Get Started Free →
          </button>
        </div>
      </div>
    </div>
  );

  // ─── AUTH ─────────────────────────────────────────────────────────────────
  if (view === 'auth') return (
    <div style={{ minHeight: '100vh', background: t.bgGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: "'DM Sans', sans-serif", width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />

      {/* Theme toggle floating */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 10 }}>
        <ThemeToggle dark={dark} onToggle={() => setDark(d => !d)} t={t} />
      </div>

      <div style={{ background: t.surface, borderRadius: 28, padding: '44px 40px', maxWidth: 440, width: '100%', boxShadow: t.cardShadow, border: `1px solid ${t.border}`, boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: t.accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span style={{ fontSize: 26 }}>💜</span>
          </div>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 800, color: t.text, marginBottom: 6, letterSpacing: '-0.5px', wordWrap: 'break-word', wordBreak: 'break-word' }}>
            {authMode === 'login' ? 'Welcome back 👋' : 'Create account 🚀'}
          </h2>
          <p style={{ color: t.textSub, fontSize: 14, wordWrap: 'break-word', wordBreak: 'break-word' }}>
            {authMode === 'login' ? 'Sign in to your health dashboard' : 'Start your AI health assessment'}
          </p>
        </div>

        <form onSubmit={e => { e.preventDefault(); handleAuth(); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {authMode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: t.textSub, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.2 }}>Full Name</label>
              <input ref={nameRef} type="text" placeholder="John Doe" autoComplete="name" style={inputStyle}
                onFocus={e => e.target.style.border = `2px solid ${t.accent1}`}
                onBlur={e => e.target.style.border = `2px solid ${t.inputBorder}`} />
            </div>
          )}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: t.textSub, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.2 }}>Email</label>
            <input ref={emailRef} type="email" placeholder="you@example.com" autoComplete="email" style={inputStyle}
              onFocus={e => e.target.style.border = `2px solid ${t.accent1}`}
              onBlur={e => e.target.style.border = `2px solid ${t.inputBorder}`} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: t.textSub, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.2 }}>Password</label>
            <input ref={passwordRef} type="password" placeholder="••••••••" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} style={inputStyle}
              onFocus={e => e.target.style.border = `2px solid ${t.accent1}`}
              onBlur={e => e.target.style.border = `2px solid ${t.inputBorder}`} />
          </div>
          {authError && <p style={{ color: t.danger, fontSize: 13, fontWeight: 500, wordWrap: 'break-word', wordBreak: 'break-word' }}>{authError}</p>}
          <button type="submit" disabled={loading}
            style={{ padding: '14px', borderRadius: 14, background: loading ? t.border : t.accentGrad, color: loading ? t.textMute : '#fff', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? <><Spinner /> Please wait…</> : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}
            style={{ background: 'none', border: 'none', color: t.accentText, fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: "'DM Sans', sans-serif", wordWrap: 'break-word', wordBreak: 'break-word' }}>
            {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button onClick={() => setView('landing')} style={{ background: 'none', border: 'none', color: t.textSub, cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>← Back to home</button>
        </div>
      </div>
    </div>
  );

  // ─── RESULTS ──────────────────────────────────────────────────────────────
  if (view === 'results' && prediction) {
    const top = prediction.predictions[0];
    const topPct = Math.round((top?.score || 0) * 100);
    return (
      <div style={{ minHeight: '100vh', background: t.bg, fontFamily: "'DM Sans', sans-serif", width: '100%', overflowX: 'hidden' }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
        <AppHeader showUser />
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 800, color: t.text, letterSpacing: '-0.5px', marginBottom: 6, wordWrap: 'break-word', wordBreak: 'break-word' }}>Analysis Results</h2>
            <p style={{ color: t.textSub, fontSize: 15, wordWrap: 'break-word', wordBreak: 'break-word' }}>AI-ranked conditions based on your symptoms</p>
          </div>

          <div style={{ background: t.surface, borderRadius: 24, padding: 32, marginBottom: 20, boxShadow: t.cardShadow, display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap', border: `1px solid ${t.border}` }}>
            <CircularProgress value={topPct} size={130} strokeWidth={10} color={t.progressColor} trackColor={t.trackColor}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 800, color: t.accentText }}>{topPct}%</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: t.textMute, textTransform: 'uppercase', letterSpacing: 0.6 }}>Top Match</div>
              </div>
            </CircularProgress>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: t.textMute, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Most Likely Condition</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 800, color: t.text, marginBottom: 8, wordWrap: 'break-word', wordBreak: 'break-word' }}>{top?.icon} {top?.disease}</div>
              <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
                background: prediction.confidence_level === 'high' ? t.accentLight : prediction.confidence_level === 'moderate' ? t.warnBg : t.infoBg,
                color: prediction.confidence_level === 'high' ? t.accentText : prediction.confidence_level === 'moderate' ? t.warn : t.info }}>
                {prediction.confidence_level} confidence
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {prediction.predictions.map((pred, i) => {
              const pct = Math.round(pred.score * 100);
              const sevColor = pred.severity === 'severe' ? t.sevHigh : pred.severity === 'moderate' ? t.sevMed : t.sevLow;
              const sevBg = pred.severity === 'severe' ? t.sevHighBg : pred.severity === 'moderate' ? t.sevMedBg : t.sevLowBg;
              return (
                <div key={i} style={{ background: t.surface, borderRadius: 20, padding: '20px 24px', boxShadow: t.cardShadow, border: i === 0 ? `2px solid ${t.accentLightBorder}` : `1px solid ${t.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                      <span style={{ fontSize: 26, flexShrink: 0 }}>{pred.icon}</span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 16, color: t.text, wordWrap: 'break-word', wordBreak: 'break-word' }}>{pred.disease}</div>
                <div style={{ display: 'inline-block', marginTop: 3, padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: sevBg, color: sevColor, textTransform: 'uppercase', letterSpacing: 0.2 }}>
                          {pred.severity}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: t.accentText, flexShrink: 0 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: t.trackColor, marginBottom: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: t.accentGrad, width: `${pct}%`, transition: 'width 0.8s ease' }} />
                  </div>
                  <p style={{ fontSize: 14, color: t.textSub, marginBottom: 6, lineHeight: 1.6, wordWrap: 'break-word', wordBreak: 'break-word' }}>{pred.description}</p>
                  <p style={{ fontSize: 13, color: t.text, fontWeight: 500, wordWrap: 'break-word', wordBreak: 'break-word' }}>💊 <strong>Treatment:</strong> {pred.treatment}</p>
                </div>
              );
            })}
          </div>

          <div style={{ background: t.infoBg, borderRadius: 20, padding: '20px 24px', marginBottom: 20, display: 'flex', gap: 14, alignItems: 'flex-start', border: `1px solid ${t.infoBorder}` }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>ℹ️</span>
            <div>
              <div style={{ fontWeight: 700, color: t.text, marginBottom: 4 }}>Recommendation</div>
              <p style={{ color: t.textSub, fontSize: 14, lineHeight: 1.6, wordWrap: 'break-word', wordBreak: 'break-word' }}>{prediction.recommendation}</p>
            </div>
          </div>

          {selectedConditions.length > 0 && !selectedConditions.includes('None') && (
            <div style={{ background: t.warnBg, borderRadius: 20, padding: '16px 20px', marginBottom: 20, border: `1px solid ${t.warnBorder}` }}>
              <p style={{ color: t.warn, fontSize: 14, wordWrap: 'break-word', wordBreak: 'break-word' }}>⚠️ Your chronic condition(s) ({selectedConditions.filter(c => c !== 'None').join(', ')}) may interact with these predictions. Consult your doctor.</p>
            </div>
          )}

          <button onClick={() => { setPrediction(null); setView('dashboard'); setSelectedSymptoms([]); setAge(''); setGender(''); setSelectedConditions([]); setSelectedMedications([]); setSelectedAllergies([]); }}
            style={{ width: '100%', padding: '16px', borderRadius: 16, background: t.surfaceAlt, color: t.text, fontWeight: 700, border: `1px solid ${t.border}`, cursor: 'pointer', fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>
            ← Start New Assessment
          </button>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: t.bg, fontFamily: "'DM Sans', sans-serif", width: '100%', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      <AppHeader showUser />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 20px 80px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: isMobile ? "'DM Sans', sans-serif" : "'Poppins', sans-serif", fontSize: isMobile ? 34 : 28, fontWeight: 800, color: t.text, letterSpacing: isMobile ? 0 : '-0.5px', lineHeight: 1.1, marginBottom: 4, wordWrap: 'break-word', wordBreak: 'break-word' }}>Health Assessment</h2>
          <p style={{ color: t.textSub, fontSize: 15, wordWrap: 'break-word', wordBreak: 'break-word' }}>Fill in your details to get AI-powered health insights</p>
        </div>

        {/* Summary rings */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, background: t.surface, borderRadius: 22, padding: 24, boxShadow: t.cardShadow, display: 'flex', alignItems: 'center', gap: 20, border: `1px solid ${t.border}` }}>
            <CircularProgress value={Math.min((selectedSymptoms.length / 5) * 100, 100)} size={80} strokeWidth={8} color={t.progressColor} trackColor={t.trackColor}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 18, color: t.accentText }}>{selectedSymptoms.length}</span>
            </CircularProgress>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: t.text, wordWrap: 'break-word', wordBreak: 'break-word' }}>Symptoms Selected</div>
              <div style={{ fontSize: 13, color: t.textSub, marginTop: 2, wordWrap: 'break-word', wordBreak: 'break-word' }}>{selectedSymptoms.length === 0 ? 'Select at least 1' : selectedSymptoms.length >= 3 ? 'Good coverage' : 'Add more for accuracy'}</div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200, background: age && gender ? t.accentGrad : t.surface, borderRadius: 22, padding: 24, boxShadow: t.cardShadow, border: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: age && gender ? 'rgba(255,255,255,0.7)' : t.textSub, marginBottom: 6 }}>Profile Status</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 20, color: age && gender ? '#fff' : t.text, wordWrap: 'break-word', wordBreak: 'break-word' }}>{age && gender ? '✓ Ready' : '⚠ Incomplete'}</div>
            <div style={{ fontSize: 13, color: age && gender ? 'rgba(255,255,255,0.8)' : t.textSub, marginTop: 4, wordWrap: 'break-word', wordBreak: 'break-word' }}>{age && gender ? `Age ${age} · ${gender}` : 'Enter age & gender below'}</div>
          </div>
        </div>

        {/* Basic Info */}
        <div style={{ background: t.surface, borderRadius: 22, padding: 24, marginBottom: 16, boxShadow: t.cardShadow, border: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: t.iconBase, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>👤</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: t.text, wordWrap: 'break-word', wordBreak: 'break-word' }}>Basic Information</div>
              <div style={{ fontSize: 12, color: t.textSub, wordWrap: 'break-word', wordBreak: 'break-word' }}>Required for personalised analysis</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: t.textSub, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.2 }}>Age</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} min="1" max="120" placeholder="Your age" style={inputStyle}
                onFocus={e => e.target.style.border = `2px solid ${t.accent1}`}
                onBlur={e => e.target.style.border = `2px solid ${t.inputBorder}`} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: t.textSub, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.2 }}>Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.border = `2px solid ${t.accent1}`}
                onBlur={e => e.target.style.border = `2px solid ${t.inputBorder}`}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div style={{ background: t.surface, borderRadius: 22, padding: 24, marginBottom: 16, boxShadow: t.cardShadow, border: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: t.iconRed, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🏥</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: t.text, wordWrap: 'break-word', wordBreak: 'break-word' }}>Medical History</div>
              <div style={{ fontSize: 12, color: t.textSub, wordWrap: 'break-word', wordBreak: 'break-word' }}>Optional — improves prediction accuracy</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
            {[
              { label: 'Chronic Conditions', items: chronicConditions, list: selectedConditions, setList: setSelectedConditions, activeColor: t.accent1, activeBg: t.accentLight },
              { label: 'Current Medications', items: commonMedications, list: selectedMedications, setList: setSelectedMedications, activeColor: t.accent2, activeBg: t.infoBg },
              { label: 'Known Allergies', items: commonAllergies, list: selectedAllergies, setList: setSelectedAllergies, activeColor: t.danger, activeBg: t.dangerBg },
            ].map((section, si) => (
              <div key={si}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.2, color: t.textMute, marginBottom: 10, wordWrap: 'break-word', wordBreak: 'break-word' }}>{section.label}</div>
                <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {section.items.map(item => {
                    const active = section.list.includes(item);
                    return (
                      <button key={item} onClick={() => toggleItem(item, section.list, section.setList)}
                        style={{ padding: '9px 14px', borderRadius: 10, border: `2px solid ${active ? section.activeColor + '40' : t.border}`, background: active ? section.activeBg : t.surfaceAlt, color: active ? section.activeColor : t.text, fontWeight: active ? 700 : 500, fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.12s', wordWrap: 'break-word', wordBreak: 'break-word' }}>
                        {active && '✓ '}{item}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div style={{ background: t.surface, borderRadius: 22, padding: 24, marginBottom: 20, boxShadow: t.cardShadow, border: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: t.iconOrange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🩺</div>
            <div style={{ flex: 1, minWidth: 150 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: t.text, wordWrap: 'break-word', wordBreak: 'break-word' }}>Current Symptoms</div>
              <div style={{ fontSize: 12, color: t.textSub, wordWrap: 'break-word', wordBreak: 'break-word' }}>{selectedSymptoms.length} selected</div>
            </div>
            {selectedSymptoms.length > 0 && (
              <button onClick={() => setSelectedSymptoms([])} style={{ fontSize: 12, color: t.danger, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", flexShrink: 0, whiteSpace: 'nowrap' }}>Clear all</button>
            )}
          </div>

          <div style={{ position: 'relative', marginBottom: 16 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: t.textMute, fontSize: 16 }}>🔍</span>
            <input type="text" placeholder="Search symptoms…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ ...inputStyle, paddingLeft: 42 }}
              onFocus={e => e.target.style.border = `2px solid ${t.accent1}`}
              onBlur={e => e.target.style.border = `2px solid ${t.inputBorder}`} />
          </div>

          {selectedSymptoms.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {selectedSymptoms.map(s => (
                <span key={s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 99, background: t.accentLight, color: t.accentText, fontSize: 13, fontWeight: 600, border: `1px solid ${t.accentLightBorder}` }}>
                  {s.icon} {s.name}
                  <button onClick={() => toggleSymptom(s)} style={{ background: 'none', border: 'none', color: t.accentText, cursor: 'pointer', padding: 0, fontSize: 14, lineHeight: 1, flexShrink: 0 }}>×</button>
                </span>
              ))}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
            {filteredSymptoms.map(s => {
              const sel = !!selectedSymptoms.find(x => x.id === s.id);
              return (
                <button key={s.id} onClick={() => toggleSymptom(s)}
                  style={{ padding: '14px 10px', borderRadius: 14, border: `2px solid ${sel ? t.accent1 : t.border}`, background: sel ? t.accentLight : t.surfaceAlt, cursor: 'pointer', textAlign: 'left', transition: 'all 0.12s', position: 'relative', fontFamily: "'DM Sans', sans-serif", wordWrap: 'break-word', wordBreak: 'break-word' }}>
                  {sel && <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 12, color: t.accentText }}>✓</span>}
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 12, color: sel ? t.accentText : t.text, lineHeight: 1.3, wordWrap: 'break-word', wordBreak: 'break-word' }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: t.textMute, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.2, wordWrap: 'break-word', wordBreak: 'break-word' }}>{s.category}</div>
                </button>
              );
            })}
          </div>
          {filteredSymptoms.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: t.textSub, fontSize: 14 }}>No symptoms match your search.</div>
          )}
        </div>

        {!isPredictionReady && (
          <div style={{ padding: '12px 18px', borderRadius: 14, background: t.warnBg, color: t.warn, fontSize: 14, fontWeight: 500, marginBottom: 14, border: `1px solid ${t.warnBorder}`, wordWrap: 'break-word', wordBreak: 'break-word' }}>
            ⚠️ Please enter age, gender, and select at least one symptom.
          </div>
        )}
        {predictionError && (
          <div style={{ padding: '12px 18px', borderRadius: 14, background: t.dangerBg, color: t.danger, fontSize: 14, fontWeight: 500, marginBottom: 14, border: `1px solid ${t.dangerBorder}`, wordWrap: 'break-word', wordBreak: 'break-word' }}>{predictionError}</div>
        )}
        <button onClick={handlePrediction} disabled={loading || !isPredictionReady}
          style={{ width: '100%', padding: '18px', borderRadius: 18, background: (loading || !isPredictionReady) ? t.border : t.accentGrad, color: (loading || !isPredictionReady) ? t.textMute : '#fff', fontWeight: 800, border: 'none', cursor: (loading || !isPredictionReady) ? 'not-allowed' : 'pointer', fontSize: 16, fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: (!loading && isPredictionReady) ? `0 8px 32px ${t.accent1}44` : 'none', transition: 'all 0.2s' }}>
          {loading ? <><Spinner /> Analyzing Symptoms…</> : '🔍 Analyze Symptoms'}
        </button>
      </div>
    </div>
  );
};

export default HealthCheckerApp;