import React, { useState, useEffect } from 'react';
import { AlertCircle, Activity, TrendingUp, User, Calendar, Shield, Check, X, Search } from 'lucide-react';
import './index.css';  

const HealthCheckerApp = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Symptoms data
  const availableSymptoms = [
    { id: 1, name: 'Fever', category: 'general' },
    { id: 2, name: 'Cough', category: 'respiratory' },
    { id: 3, name: 'Headache', category: 'neurological' },
    { id: 4, name: 'Fatigue', category: 'general' },
    { id: 5, name: 'Sore Throat', category: 'respiratory' },
    { id: 6, name: 'Shortness of Breath', category: 'respiratory' },
    { id: 7, name: 'Chest Pain', category: 'cardiac' },
    { id: 8, name: 'Nausea', category: 'gastrointestinal' },
    { id: 9, name: 'Vomiting', category: 'gastrointestinal' },
    { id: 10, name: 'Diarrhea', category: 'gastrointestinal' },
  ];

  // States for symptom checker
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleAuth = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockToken = 'mock-jwt-token-' + Date.now();
      setToken(mockToken);
      setUser({ name: formData.name || 'User', email: formData.email });
      setCurrentView('dashboard');
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setCurrentView('landing');
  };

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.find(s => s.id === symptom.id)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptom.id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handlePrediction = () => {
    if (selectedSymptoms.length === 0 || !age || !gender) {
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockPrediction = {
        predictions: [
          { disease: 'Common Cold', score: 0.75, severity: 'mild', description: 'Viral upper respiratory infection' },
          { disease: 'Influenza', score: 0.65, severity: 'moderate', description: 'Flu virus infection' },
          { disease: 'COVID-19', score: 0.45, severity: 'moderate', description: 'Coronavirus disease' }
        ],
        confidence_level: 'moderate',
        recommendation: 'Consider scheduling an appointment with your healthcare provider to discuss these symptoms.',
        model_version: 'v1.0.0'
      };
      setPrediction(mockPrediction);
      setLoading(false);
    }, 1500);
  };

  const filteredSymptoms = availableSymptoms.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Landing Page
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Activity className="text-indigo-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-900">Smart Health Checker</h1>
          </div>
          <button
            onClick={() => setCurrentView('auth')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Health Assessment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant insights about your symptoms using advanced machine learning. 
            Our system analyzes your symptoms to help you understand potential health conditions.
          </p>
          <div className="mt-8 flex justify-center items-center space-x-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-2xl mx-auto">
            <AlertCircle size={20} />
            <p className="text-sm">
              <strong>Disclaimer:</strong> For educational purposes only. Not a substitute for professional medical advice.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Shield className="text-indigo-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">Your health data is encrypted and protected with industry-standard security.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="text-green-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">ML-Powered</h3>
            <p className="text-gray-600">Advanced machine learning models trained on medical datasets for accuracy.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Activity className="text-purple-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
            <p className="text-gray-600">Get immediate insights about your symptoms with detailed recommendations.</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Auth Page
  const AuthPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <Activity className="text-indigo-600 mx-auto mb-4" size={48} />
          <h2 className="text-3xl font-bold text-gray-900">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-gray-600 mt-2">
            {authMode === 'login' ? 'Sign in to access your health dashboard' : 'Start your health journey today'}
          </p>
        </div>

        <div className="space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Please wait...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="text-indigo-600 hover:text-indigo-700 text-sm"
          >
            {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );

  // Dashboard
  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Activity className="text-indigo-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-900">Smart Health Checker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User size={20} className="text-gray-600" />
              <span className="text-gray-700">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Health Check Dashboard</h2>
          <p className="text-gray-600">Enter your symptoms to get an AI-powered health assessment</p>
        </div>

        {!prediction ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Demographics */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  max="120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Symptom Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Symptoms</label>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search symptoms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Selected Symptoms */}
              {selectedSymptoms.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedSymptoms.map(symptom => (
                    <span
                      key={symptom.id}
                      className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                    >
                      <Check size={14} />
                      <span>{symptom.name}</span>
                      <button
                        onClick={() => toggleSymptom(symptom)}
                        className="hover:text-indigo-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Available Symptoms */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredSymptoms.map(symptom => {
                  const isSelected = selectedSymptoms.find(s => s.id === symptom.id);
                  return (
                    <button
                      key={symptom.id}
                      onClick={() => toggleSymptom(symptom)}
                      className={`p-3 rounded-lg border-2 transition text-left ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{symptom.name}</span>
                        {isSelected && <Check size={16} className="text-indigo-600" />}
                      </div>
                      <span className="text-xs text-gray-500 capitalize">{symptom.category}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handlePrediction}
              disabled={loading || selectedSymptoms.length === 0 || !age || !gender}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze Symptoms'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Analysis Results</h3>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  prediction.confidence_level === 'high' ? 'bg-green-100 text-green-800' :
                  prediction.confidence_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {prediction.confidence_level.toUpperCase()} Confidence
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {prediction.predictions.map((pred, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{pred.disease}</h4>
                      <span className="text-2xl font-bold text-indigo-600">
                        {(pred.score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${pred.score * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">{pred.description}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${
                      pred.severity === 'severe' ? 'bg-red-100 text-red-800' :
                      pred.severity === 'moderate' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {pred.severity.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">Recommendation</h4>
                <p className="text-blue-800">{prediction.recommendation}</p>
              </div>

              <button
                onClick={() => {
                  setPrediction(null);
                  setSelectedSymptoms([]);
                  setAge('');
                  setGender('');
                }}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                New Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render based on current view
  if (!token) {
    return currentView === 'landing' ? <LandingPage /> : <AuthPage />;
  }

  return <Dashboard />;
};

export default HealthCheckerApp;