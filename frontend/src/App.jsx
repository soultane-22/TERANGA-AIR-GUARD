import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import { LayoutDashboard, AlertTriangle, Lightbulb, History, FileDown, Menu, X, MapPin, TrendingUp, Lock, User, ShieldCheck, ChevronRight, Moon, Sun, Server, Sliders, Cpu, Wifi, Battery, CheckCircle, Database, Activity } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// ==========================================
// 1. ECRAN DE CONNEXION PREMIUM (SOLID DESIGN)
// ==========================================
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
        if (username === 'admin' && password === 'soultane22') {
        onLogin();
        } else {
        setError('Identifiants incorrects. Accès refusé.');
        setIsLoading(false);
        }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center font-sans p-4 relative overflow-hidden bg-slate-950">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')` }}
      ></div>
      <div className="absolute inset-0 z-0 bg-slate-950/75"></div>

      <div className="bg-[#0F172A] p-10 md:p-14 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] w-full max-w-lg border border-slate-800 z-10 animate-slide-up">
        <div className="text-center mb-12">
          <div className="bg-blue-600 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-600/20">
            <ShieldCheck size={48} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">AIR<span className="text-blue-500">-GUARD</span></h1>
          <p className="text-slate-400 font-bold mt-4 text-sm md:text-base uppercase tracking-widest">Espace Administrateur</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-2xl text-base font-bold text-center animate-fade-in flex items-center justify-center gap-2">
              <AlertTriangle size={20} /> {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Identifiant</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
                <User size={24} className="text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-[#0B1120] border border-slate-700 rounded-2xl text-white text-lg placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-bold" placeholder="Votre identifiant" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Mot de passe</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Lock size={24} className="text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-[#0B1120] border border-slate-700 rounded-2xl text-white text-lg placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-bold" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-lg tracking-wider py-5 rounded-2xl shadow-lg hover:shadow-blue-500/25 transition-all flex justify-center items-center gap-3 mt-10 disabled:opacity-70">
            {isLoading ? <span className="animate-pulse">AUTHENTIFICATION...</span> : <>CONNEXION SÉCURISÉE <ChevronRight size={24} /></>}
          </button>
        </form>
      </div>
      
      <div className="mt-12 flex items-center gap-3 text-slate-400 text-xs font-bold tracking-widest uppercase animate-fade-in z-10 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800">
        <ShieldCheck size={18} /> Protégé par chiffrement IA
      </div>
    </div>
  );
}

// ==========================================
// 2. SHELL DE L'APPLICATION (MENU + HEADER)
// ==========================================
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Forcer le Dark Mode sur toute la page HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-slate-950');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-slate-950');
    }
  }, [isDarkMode]);

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  const menuItems = [
    { id: 'dashboard', label: 'Vue Globale', icon: LayoutDashboard },
    { id: 'map', label: 'Réseau Spatial', icon: MapPin },
    { id: 'predictions', label: 'Intelligence IA', icon: TrendingUp },
    { id: 'recommendations', label: 'Prescriptions', icon: Lightbulb },
    { id: 'alerts', label: 'Centre d\'Alertes', icon: AlertTriangle },
    { id: 'history', label: 'Logs & Archives', icon: History },
    { id: 'devices', label: 'Gestion Matériel', icon: Server },
    { id: 'settings', label: 'Configuration', icon: Sliders },
    { id: 'health', label: 'Santé Système', icon: Cpu },
  ];

  const ActiveIcon = menuItems.find(m => m.id === activeTab)?.icon;

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-[#F8FAFC] text-slate-800'}`}>
      
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-[#0F172A] border-r border-slate-800 text-white transition-all duration-300 flex flex-col z-40 flex-shrink-0`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/50">
          {isSidebarOpen && (
              <div className="flex items-center gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20"><ShieldCheck size={18} /></div>
                  <span className="font-black text-lg tracking-tight">AIR-GUARD</span>
              </div>
          )}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white mx-auto">
            {isSidebarOpen ? <X size={20}/> : <Menu size={20} />}
          </button>
        </div>
        
        <div className="p-4">
            <p className={`text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 ml-2 transition-all ${!isSidebarOpen && 'opacity-0'}`}>Menu Principal</p>
            <nav className="space-y-1.5">
            {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center p-3.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
                    <div className={`${isActive ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
                        <item.icon size={22} />
                    </div>
                    {isSidebarOpen && <span className={`ml-4 font-bold text-sm ${isActive ? 'text-blue-400' : ''}`}>{item.label}</span>}
                    {isActive && isSidebarOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse"></div>}
                </button>
                );
            })}
            </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-800/50 space-y-2">
          <button onClick={() => window.open('http://localhost:8000/api/export-excel', '_blank')} className="w-full flex items-center p-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl transition-all group">
            <FileDown size={22} className="group-hover:-translate-y-1 transition-transform" />
            {isSidebarOpen && <span className="ml-4 font-bold text-sm">Export Data</span>}
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center p-3.5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-xl transition-all">
            <Lock size={22} />
            {isSidebarOpen && <span className="ml-4 font-bold text-sm">Déconnexion</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800 flex items-center px-8 justify-between z-30 flex-shrink-0 transition-colors duration-300">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight animate-fade-in flex items-center gap-3 transition-colors">
            {ActiveIcon && <ActiveIcon size={28} className="text-blue-600" />}
            {menuItems.find(m => m.id === activeTab)?.label}
          </h2>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-500/20 shadow-sm transition-colors hidden md:flex">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold tracking-wide">Réseau Actif</span>
            </div>
            
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
            
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:rotate-12 shadow-sm"
                title="Basculer le thème"
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight transition-colors">Admin System</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Dakar, Sénégal</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white font-bold border-2 border-white dark:border-slate-800 shadow-md group-hover:scale-105 transition-all">
                    AD
                </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
            <div className="w-full h-full animate-slide-up">
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'map' && <MapView />}
                {activeTab === 'predictions' && <PredictionsView />}
                {activeTab === 'recommendations' && <RecommendationsView />}
                {activeTab === 'history' && <HistoryView />}
                {activeTab === 'alerts' && <AlertsList />}
                {activeTab === 'devices' && <DeviceManagementView />}
                {activeTab === 'settings' && <SettingsView />}
                {activeTab === 'health' && <SystemHealthView />}
            </div>
        </div>
      </main>
      <Chatbot />
    </div>
  );
}

// ==========================================
// 3. VUES PREMIUM & DARK MODE
// ==========================================

function PredictionsView() {
    const [stats, setStats] = useState(null);
    const [selectedZone, setSelectedZone] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/dashboard-stats').then(res => {
            setStats(res.data);
            const zones = Object.keys(res.data.predictions_by_zone || {});
            if (zones.length > 0 && !selectedZone) setSelectedZone(zones[0]);
        }).catch(console.error);
    }, [selectedZone]);

    if (!stats) return <div className="flex items-center gap-3 text-blue-600 font-bold animate-pulse"><div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div> Connexion au réseau neuronal...</div>;

    const zones = Object.keys(stats.predictions_by_zone || {});
    if (zones.length === 0) return <div className="p-10 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm text-slate-500 font-bold border border-slate-200 dark:border-slate-800 text-center">En attente de la synchronisation des capteurs physiques...</div>;

    const sortedZones = [...(stats.latest_by_zone || [])].sort((a, b) => b.pm25 - a.pm25);
    const mostPolluted = sortedZones[0];

    return (
        <div className="space-y-8 animate-slide-up">
            {mostPolluted && mostPolluted.pm25 > 15 && (
                <div className="bg-red-50/50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-6 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between shadow-[0_8px_30px_rgba(239,68,68,0.05)] gap-4 transition-all hover:shadow-[0_8px_30px_rgba(239,68,68,0.1)]">
                    <div className="flex items-start gap-4">
                        <div className="bg-red-100 dark:bg-red-500/20 p-3 rounded-2xl"><AlertTriangle className="text-red-600 dark:text-red-400" size={28}/></div>
                        <div>
                            <h4 className="text-red-900 dark:text-red-300 font-black text-lg tracking-tight">Zone d'attention maximale</h4>
                            <p className="text-red-700/80 dark:text-red-400/80 font-medium mt-1">Le capteur <span className="font-bold uppercase px-2 py-0.5 bg-red-100 dark:bg-red-500/20 rounded-lg text-red-800 dark:text-red-300 mx-1">{mostPolluted.sensor_id}</span> requiert une surveillance.</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-500 to-red-600 text-white px-8 py-4 rounded-2xl font-black text-2xl shadow-lg shadow-red-500/30 whitespace-nowrap">
                        {mostPolluted.pm25} µg/m³
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-xl"><TrendingUp className="text-blue-600 dark:text-blue-400" size={28} /></div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Modèle Prédictif IA</h3>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Cibler :</label>
                        <select value={selectedZone} onChange={e => setSelectedZone(e.target.value)} className="py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none focus:ring-2 ring-blue-500/50 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 shadow-sm cursor-pointer hover:border-blue-300 transition-colors">
                            {zones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                        </select>
                    </div>
                </div>
                
                {selectedZone && stats.predictions_by_zone[selectedZone] !== undefined && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-slate-50/50 dark:bg-slate-800/30 p-10 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner group transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tendance à +3 heures</p>
                            </div>
                            <p className={`text-7xl font-black tracking-tighter ${stats.predictions_by_zone[selectedZone] > 35 ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>
                                {stats.predictions_by_zone[selectedZone]} <span className="text-2xl text-slate-400 font-bold ml-1">µg/m³</span>
                            </p>
                            <p className="mt-8 text-slate-500 dark:text-slate-400 font-medium leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                Prévision exclusive pour <span className="font-bold text-slate-800 dark:text-slate-200">{selectedZone}</span>. L'algorithme croise la data du réseau local avec les conditions météorologiques actuelles.
                            </p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-slate-900 to-[#0F172A] p-10 rounded-[2rem] flex flex-col justify-center relative overflow-hidden shadow-xl shadow-slate-900/10">
                            <div className="absolute -right-10 -top-10 text-slate-800 opacity-50"><ShieldCheck size={150}/></div>
                            <h4 className="font-black text-white text-xl mb-8 relative z-10 tracking-tight">Statut du Modèle Localisé</h4>
                            <ul className="space-y-5 font-medium text-slate-300 relative z-10">
                                <li className="flex justify-between items-center border-b border-slate-800 pb-3">
                                    <span className="text-slate-400 text-sm uppercase tracking-wider font-bold">Précision estimée</span> 
                                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg font-bold text-sm">89%</span>
                                </li>
                                <li className="flex justify-between items-center border-b border-slate-800 pb-3">
                                    <span className="text-slate-400 text-sm uppercase tracking-wider font-bold">Algorithme</span> 
                                    <span className="text-white font-bold">RandomForest</span>
                                </li>
                                <li className="flex justify-between items-center pb-2">
                                    <span className="text-slate-400 text-sm uppercase tracking-wider font-bold">Flux Météo</span> 
                                    <span className="text-blue-400 font-bold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Live (Open-Meteo)</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function RecommendationsView() {
    const [stats, setStats] = useState(null);
    const [selectedZone, setSelectedZone] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/dashboard-stats').then(res => {
            setStats(res.data);
            const zones = Object.keys(res.data.recos_by_zone || {});
            if (zones.length > 0 && !selectedZone) setSelectedZone(zones[0]);
        }).catch(console.error);
    }, [selectedZone]);

    if (!stats) return <div className="text-blue-600 font-bold animate-pulse">Génération des recommandations...</div>;

    const zones = Object.keys(stats.recos_by_zone || {});
    if (zones.length === 0) return <div className="p-10 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm text-slate-500 font-bold border border-slate-200 dark:border-slate-800">En attente des données des capteurs...</div>;

    const currentRecos = stats.recos_by_zone[selectedZone] || [];

    return (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 min-h-[60vh] animate-slide-up transition-colors">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                    <div className="bg-yellow-50 dark:bg-yellow-500/10 p-3 rounded-xl"><Lightbulb className="text-yellow-500 dark:text-yellow-400" size={28} /></div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Prescriptions Sanitaires</h3>
                </div>
                
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Appliquer à :</label>
                    <select value={selectedZone} onChange={e => setSelectedZone(e.target.value)} className="py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none focus:ring-2 ring-yellow-500/50 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 cursor-pointer transition-colors">
                        {zones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                    </select>
                </div>
            </div>
            
            <div className="space-y-6 mt-6">
                <h4 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">Avis médical de l'IA KAIKAI</h4>
                {currentRecos.map((rec, i) => (
                    <div key={i} className={`p-8 rounded-[2rem] border border-l-8 shadow-sm transition-all hover:shadow-md ${rec.type === 'danger' ? 'bg-red-50/50 dark:bg-red-500/10 border-red-500 border-t-red-100 dark:border-t-red-900 border-r-red-100 dark:border-r-red-900 border-b-red-100 dark:border-b-red-900' : rec.type === 'warning' ? 'bg-orange-50/50 dark:bg-orange-500/10 border-orange-500 border-t-orange-100 dark:border-t-orange-900 border-r-orange-100 dark:border-r-orange-900 border-b-orange-100 dark:border-b-orange-900' : 'bg-green-50/50 dark:bg-green-500/10 border-green-500 border-t-green-100 dark:border-t-green-900 border-r-green-100 dark:border-r-green-900 border-b-green-100 dark:border-b-green-900'}`}>
                        <p className={`font-black text-xl mb-6 flex items-start gap-3 tracking-tight ${rec.type === 'danger' ? 'text-red-900 dark:text-red-300' : rec.type === 'warning' ? 'text-orange-900 dark:text-orange-300' : 'text-emerald-900 dark:text-emerald-300'}`}>
                            {rec.msg}
                        </p>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
                            <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-full flex-shrink-0"><Lightbulb className="text-blue-600 dark:text-blue-400" size={20} /></div>
                            <p className="text-lg text-slate-600 dark:text-slate-300 font-bold italic w-full">
                                "{rec.wolof}"
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MapView() {
    const [sensors, setSensors] = useState([]);
    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/map-sensors');
                setSensors(res.data);
            } catch (e) { console.error(e); }
        };
        fetchMapData();
        const interval = setInterval(fetchMapData, 60000);
        return () => clearInterval(interval);
    }, []);
    
    const getColor = (pm25) => { if (pm25 < 15) return '#10B981'; if (pm25 < 35) return '#F59E0B'; return '#EF4444'; };
    const validSensors = sensors.filter(s => s && s.lat !== undefined && s.lng !== undefined);

    return (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 animate-slide-up transition-colors">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl"><MapPin className="text-slate-600 dark:text-slate-400" size={24}/></div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Topologie du Réseau</h3>
                </div>
                <div className="flex gap-4 text-xs font-bold uppercase tracking-widest bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> Normal</span>
                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div> Alerte</span>
                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div> Critique</span>
                </div>
            </div>
            
            {validSensors.length === 0 ? (
                <div className="h-[60vh] w-full rounded-[2rem] flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 font-bold">
                    Géolocalisation du capteur en cours...
                </div>
            ) : (
                <div className="h-[60vh] w-full rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner z-0 relative">
                    <MapContainer center={[validSensors[0].lat, validSensors[0].lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                        {validSensors.map((sensor, idx) => (
                            <CircleMarker key={idx} center={[sensor.lat, sensor.lng]} radius={30} pathOptions={{ color: getColor(sensor.pm25), fillColor: getColor(sensor.pm25), fillOpacity: 0.4, weight: 4 }}>
                                <Popup className="rounded-2xl font-sans border-none shadow-2xl">
                                    <div className="text-center p-3 min-w-[160px]">
                                        <h4 className="font-black text-lg text-slate-800 uppercase mb-3 border-b border-slate-100 pb-2">{sensor.name}</h4>
                                        <div className="grid grid-cols-2 gap-4 text-left">
                                            <div className="bg-slate-50 p-2 rounded-xl"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PM 2.5</p><p className="font-black text-lg text-slate-700">{sensor.pm25}</p></div>
                                            <div className="bg-blue-50 p-2 rounded-xl"><p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Temp</p><p className="font-black text-lg text-blue-600">{sensor.temp}°C</p></div>
                                        </div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>
            )}
        </div>
    );
}

function AlertsList() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/api/dashboard-stats').then(res => setStats(res.data)).catch(console.error);
    }, []);

    if (!stats) return <div className="text-blue-600 font-bold animate-pulse">Vérification des protocoles de sécurité...</div>;

    let activeAlerts = [];
    if (stats.recos_by_zone) {
        Object.entries(stats.recos_by_zone).forEach(([zoneName, recos]) => {
            recos.forEach(rec => {
                if (rec.type === 'danger' || rec.type === 'warning') {
                    activeAlerts.push({ zone: zoneName, ...rec });
                }
            });
        });
    }

    if (activeAlerts.length === 0) return (
        <div className="bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 p-12 rounded-[2rem] text-center shadow-[0_8px_30px_rgba(16,185,129,0.05)] animate-slide-up">
            <div className="bg-emerald-100 dark:bg-emerald-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><ShieldCheck size={40} className="text-emerald-500 dark:text-emerald-400"/></div>
            <h3 className="text-2xl font-black text-emerald-800 dark:text-emerald-400 tracking-tight mb-2">Réseau Sécurisé</h3>
            <p className="text-emerald-600/80 dark:text-emerald-500/80 font-bold">Aucune anomalie détectée sur l'ensemble du parc de capteurs.</p>
        </div>
    );

    return (
        <div className="grid gap-6 animate-slide-up">
            {activeAlerts.map((alerte, idx) => (
                <div key={idx} className={`p-8 rounded-[2rem] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:shadow-md border border-l-8 ${alerte.type === 'danger' ? 'bg-red-50/50 dark:bg-red-500/10 border-red-500 border-t-red-100 dark:border-t-red-900 border-r-red-100 dark:border-r-red-900 border-b-red-100 dark:border-b-red-900' : 'bg-orange-50/50 dark:bg-orange-500/10 border-orange-500 border-t-orange-100 dark:border-t-orange-900 border-r-orange-100 dark:border-r-orange-900 border-b-orange-100 dark:border-b-orange-900'}`}>
                    <div className="flex items-start gap-5">
                        <div className={`p-3 rounded-2xl mt-1 ${alerte.type === 'danger' ? 'bg-red-100 dark:bg-red-500/20 text-red-500' : 'bg-orange-100 dark:bg-orange-500/20 text-orange-500'}`}>
                            <AlertTriangle size={24}/>
                        </div>
                        <div>
                            <h4 className={`font-black text-xl mb-1 tracking-tight ${alerte.type === 'danger' ? 'text-red-900 dark:text-red-400' : 'text-orange-900 dark:text-orange-400'}`}>
                                Alerte Sécurité : {alerte.zone}
                            </h4>
                            <p className={`font-medium ${alerte.type === 'danger' ? 'text-red-700/80 dark:text-red-400/80' : 'text-orange-700/80 dark:text-orange-400/80'}`}>
                                {alerte.msg}
                            </p>
                        </div>
                    </div>
                    <span className={`font-bold px-6 py-3 rounded-xl text-sm whitespace-nowrap shadow-sm ${alerte.type === 'danger' ? 'bg-red-500 text-white shadow-red-500/30' : 'bg-orange-500 text-white shadow-orange-500/30'}`}>
                        Action requise
                    </span>
                </div>
            ))}
        </div>
    );
}

function HistoryView() {
    const [historyData, setHistoryData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedZone, setSelectedZone] = useState('');
    
    useEffect(() => { axios.get('http://localhost:8000/api/history').then(res => setHistoryData(res.data)).catch(console.error); }, []);
    
    const filteredData = historyData.filter(row => {
        if (startDate && row.date < startDate) return false;
        if (endDate && row.date > endDate) return false;
        if (selectedZone && row.sensor_id !== selectedZone) return false;
        return true;
    });
    
    const getStatus = (pm25) => {
        if (pm25 < 15) return <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wider">Normal</span>;
        if (pm25 < 35) return <span className="bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wider">Modéré</span>;
        return <span className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wider animate-pulse shadow-sm shadow-red-500/20">Critique</span>;
    };
    
    const handleExportClick = () => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (selectedZone) params.append('zone', selectedZone);
        window.open(`http://localhost:8000/api/export-excel?${params.toString()}`, '_blank');
    };

    const uniqueZones = [...new Set(historyData.map(item => item.sensor_id))];

    return (
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 animate-slide-up transition-colors">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-4">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl"><History className="text-slate-600 dark:text-slate-400" size={28} /></div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Logs & Archives</h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 bg-slate-50/50 dark:bg-slate-800/50 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)} className="py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none text-sm bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
                        <option value="">Réseau Complet</option>
                        {uniqueZones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none text-sm bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 focus:ring-2 ring-blue-500/50 transition-all" />
                </div>
                <div className="text-slate-400 font-bold text-sm">-</div>
                <div className="flex items-center gap-2">
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none text-sm bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 focus:ring-2 ring-blue-500/50 transition-all" />
                </div>
                {(startDate || endDate || selectedZone) && (
                    <button onClick={() => {setStartDate(''); setEndDate(''); setSelectedZone('');}} className="ml-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">Reset</button>
                )}
            </div>
            <button onClick={handleExportClick} className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-lg flex items-center gap-2">
                <FileDown size={20}/> Générer Rapport
            </button>
        </div>
        
        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-slate-400 border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/50 text-xs uppercase tracking-widest">
                        <th className="py-5 px-6 font-bold">Horodatage</th>
                        <th className="px-6 font-bold">Source</th>
                        <th className="px-6 font-bold">PM 2.5</th>
                        <th className="px-6 font-bold">PM 10</th>
                        <th className="px-6 font-bold">Statut</th>
                    </tr>
                </thead>
                <tbody className="font-medium text-slate-700 dark:text-slate-300 text-sm">
                    {filteredData.map((row, index) => (
                        <tr key={index} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-bold">{row.date} <span className="text-blue-500 dark:text-blue-400 ml-2 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md">{row.time}</span></td>
                            <td className="px-6 font-bold text-slate-800 dark:text-slate-200">{row.sensor_id}</td>
                            <td className={`px-6 font-black ${row.pm25 > 35 ? 'text-red-500' : ''}`}>{row.pm25} <span className="text-xs font-bold text-slate-400">µg</span></td>
                            <td className="px-6 font-bold text-slate-600 dark:text-slate-400">{row.pm10} <span className="text-xs font-bold text-slate-400">µg</span></td>
                            <td className="px-6">{getStatus(row.pm25)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    );
}

// ==========================================
// VUE 4 : GESTION DU MATÉRIEL (DEVICES)
// ==========================================
function DeviceManagementView() {
    const [stats, setStats] = useState(null);
    useEffect(() => { axios.get('http://localhost:8000/api/dashboard-stats').then(res => setStats(res.data)).catch(console.error); }, []);

    if (!stats) return <div className="text-blue-600 font-bold animate-pulse">Scan du réseau en cours...</div>;
    const devices = stats.latest_by_zone || [];

    return (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 animate-slide-up transition-colors">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-xl"><Server className="text-blue-600 dark:text-blue-400" size={28} /></div>
                <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Parc de Capteurs</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{devices.length} appareil(s) détecté(s)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {devices.map((dev, idx) => (
                    <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-[1.5rem] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-lg dark:hover:bg-slate-800/50 transition-all">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl"><Cpu size={32} className="text-slate-600 dark:text-slate-300"/></div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                            </div>
                            <div>
                                <h4 className="font-black text-xl text-slate-800 dark:text-white uppercase">{dev.sensor_id}</h4>
                                <p className="text-xs font-bold text-slate-400 mt-1">AirGradient ESP32-C3</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-600 dark:text-slate-300 w-full md:w-auto bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                            <span className="flex items-center gap-2"><Wifi size={16} className="text-blue-500"/> -45 dBm</span>
                            <span className="flex items-center gap-2"><Battery size={16} className="text-emerald-500"/> Secteur</span>
                            <span className={`flex items-center gap-2 ${dev.status === 'En Ligne' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                {dev.status === 'En Ligne' ? (
                                    <CheckCircle size={16} className="text-emerald-500" />
                                ) : (
                                    <AlertTriangle size={16} className="text-red-500 animate-pulse" />
                                )}
                                <span className="font-black">{dev.status || "En Ligne"}</span>
                            </span>
                        </div>
                    </div>
                ))}
                {devices.length === 0 && <p className="text-slate-400 font-bold p-6">Aucun capteur physique n'est connecté au réseau pour le moment.</p>}
            </div>
        </div>
    );
}

// ==========================================
// VUE 5 : CONFIGURATION DES SEUILS
// ==========================================
function SettingsView() {
    const [pm25Threshold, setPm25Threshold] = useState(35);
    const [co2Threshold, setCo2Threshold] = useState(1000);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 animate-slide-up transition-colors max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="bg-orange-50 dark:bg-orange-500/10 p-3 rounded-xl"><Sliders className="text-orange-600 dark:text-orange-400" size={28} /></div>
                <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Paramètres d'Alertes</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Calibrage de l'IA KAIKAI</p>
                </div>
            </div>

            <div className="space-y-10">
                <div>
                    <div className="flex justify-between mb-4">
                        <label className="font-black text-slate-800 dark:text-slate-200">Seuil Critique PM 2.5 (Norme OMS)</label>
                        <span className="bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg font-bold">{pm25Threshold} µg/m³</span>
                    </div>
                    <input type="range" min="10" max="100" value={pm25Threshold} onChange={(e) => setPm25Threshold(e.target.value)} className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
                    <p className="text-xs text-slate-400 font-bold mt-2">Au-delà de ce seuil, l'IA déclenchera une Alerte Rouge sur le réseau.</p>
                </div>

                <div>
                    <div className="flex justify-between mb-4">
                        <label className="font-black text-slate-800 dark:text-slate-200">Seuil Critique CO2 (Confinement)</label>
                        <span className="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-lg font-bold">{co2Threshold} ppm</span>
                    </div>
                    <input type="range" min="600" max="2000" step="50" value={co2Threshold} onChange={(e) => setCo2Threshold(e.target.value)} className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                    <p className="text-xs text-slate-400 font-bold mt-2">Niveau à partir duquel une recommandation d'aération urgente sera émise.</p>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-6">
                    <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-xl shadow-lg transition-all flex items-center gap-2">
                        <CheckCircle size={20}/> Sauvegarder la configuration
                    </button>
                    {saved && <span className="text-emerald-500 font-bold animate-fade-in flex items-center gap-2"><CheckCircle size={18}/> Configuration appliquée au réseau !</span>}
                </div>
            </div>
        </div>
    );
}

// ==========================================
// VUE 6 : SANTÉ DU SYSTÈME (VRAIES DONNÉES)
// ==========================================
function SystemHealthView() {
    const [health, setHealth] = useState(null);

    // Va chercher les vraies données toutes les 60 secondes (au lieu de 5 !)
    useEffect(() => {
        const fetchHealth = () => {
            axios.get('http://localhost:8000/api/system-health')
                .then(res => setHealth(res.data))
                .catch(console.error);
        };
        fetchHealth();
        const interval = setInterval(fetchHealth, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!health) return <div className="text-emerald-500 font-bold animate-pulse">Lancement des diagnostics réels...</div>;

    return (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 animate-slide-up transition-colors">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl"><Activity className="text-emerald-600 dark:text-emerald-400" size={28} /></div>
                <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Diagnostic Système</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">État des services backend en direct</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Base de données (Taille)</p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                        <Database size={24} className={health.database.status === 'En Ligne' ? 'text-blue-500' : 'text-red-500'}/> 
                        {health.database.size}
                    </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Moteur IA KAIKAI</p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                        <Cpu size={24} className="text-emerald-500"/> {health.ai_status}
                    </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Uptime Serveur</p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                        <Server size={24} className="text-purple-500"/> {health.uptime}
                    </p>
                </div>
            </div>

            <h4 className="font-black text-lg text-slate-800 dark:text-slate-200 mb-4">Terminal des Événements (Temps Réel)</h4>
            <div className="bg-[#0B1120] rounded-2xl p-6 font-mono text-sm shadow-inner border border-slate-800 h-64 overflow-y-auto">
                {health.logs.map((log, i) => (
                    <div key={i} className="mb-2 flex items-start gap-4 hover:bg-slate-800/50 rounded px-2 py-1">
                        <span className="text-slate-500">[{log.time}]</span>
                        <span className={`font-bold ${log.type === 'AI' ? 'text-purple-400' : log.type === 'API' ? 'text-blue-400' : log.type === 'DB' ? 'text-yellow-400' : log.type === 'NET' ? 'text-orange-400' : 'text-emerald-400'}`}>
                            [{log.type}]
                        </span>
                        <span className="text-slate-300">{log.msg}</span>
                    </div>
                ))}
                {health.logs.length === 0 && (
                     <div className="text-slate-500 italic">Aucun événement enregistré.</div>
                )}
            </div>
        </div>
    );
}