import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Droplets, Activity, CloudFog, MapPin, CloudSun, Sun, Radio, Wind, Thermometer } from 'lucide-react';
import axios from 'axios';

// --- COMPOSANT MINI-GRAPHIQUE PREMIUM (Encore plus grand) ---
const MiniChart = ({ title, data, dataKey, color, icon: Icon, unit }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col h-96 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-5xl font-black tracking-tight dark:text-white" style={{ color: color }}>
          {data && data.length > 0 ? data[data.length - 1][dataKey] : 0} 
          <span className="text-xl font-medium text-slate-400 ml-2">{unit}</span>
        </p>
      </div>
      <div className="p-5 rounded-2xl" style={{ backgroundColor: `${color}15` }}>
        <Icon color={color} size={36} />
      </div>
    </div>
    <div className="flex-1 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.2} />
          <XAxis dataKey="time" tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 700}} tickLine={false} axisLine={false} dy={10} />
          <YAxis hide domain={['auto', 'auto']} />
          <RechartsTooltip 
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
            contentStyle={{borderRadius: '16px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.9)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold', padding: '16px'}} 
            itemStyle={{color: color, fontSize: '18px'}} 
          />
          <Area type="monotone" dataKey={dataKey} stroke={color} fillOpacity={1} fill={`url(#color${dataKey})`} strokeWidth={5} activeDot={{ r: 8, strokeWidth: 3, stroke: '#fff', fill: color }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// --- COMPOSANT MÉTÉO ---
const WeatherWidget = ({ weather }) => {
  if (!weather) return null;
  return (
    <div className="bg-gradient-to-br from-slate-900 via-[#0F172A] to-blue-900 text-white rounded-[2rem] p-8 shadow-2xl shadow-blue-900/20 dark:shadow-none w-full font-sans mb-8 relative overflow-hidden border border-slate-700/50">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="flex flex-col xl:flex-row justify-between items-start mb-8 gap-8 relative z-10">
        <div className="flex items-center gap-6">
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/10">
            <Sun size={64} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
          </div>
          <div className="flex items-start">
            <span className="text-7xl font-light tracking-tighter">{weather.temp}</span>
            <div className="flex flex-col mt-3 ml-2">
              <span className="text-2xl font-bold text-slate-300">°C</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-10 text-sm font-medium text-slate-300">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3"><Droplets size={18} className="text-blue-400"/> Humidité: <span className="text-white font-bold text-base">{weather.humidity}</span></div>
            <div className="flex items-center gap-3"><Wind size={18} className="text-slate-300"/> Vent: <span className="text-white font-bold text-base">{weather.wind}</span></div>
            <div className="flex items-center gap-3"><CloudFog size={18} className="text-slate-400"/> Précip: <span className="text-white font-bold text-base">{weather.precipitation}</span></div>
          </div>
          <div className="xl:text-right flex flex-col gap-1">
            <p className="text-3xl font-black text-white tracking-tight">Météo Dakar</p>
            <p className="text-blue-300 uppercase tracking-widest text-xs font-bold mt-1">Aujourd'hui • {weather.time}</p>
            <p className="text-lg mt-2 text-slate-200">{weather.condition}</p>
          </div>
        </div>
      </div>

      <div className="h-40 w-full mb-8 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weather.hourly} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <XAxis dataKey="time" tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} axisLine={false} tickLine={false} dy={10} />
            <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
            <RechartsTooltip contentStyle={{backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff'}} itemStyle={{color: '#facc15', fontWeight: 'bold'}} cursor={{stroke: 'rgba(255,255,255,0.1)'}} />
            <Area type="monotone" dataKey="temp" stroke="#facc15" strokeWidth={4} fill="#facc15" fillOpacity={0.1} activeDot={{ r: 7, fill: '#facc15', stroke: '#0F172A', strokeWidth: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-7 gap-3 text-center text-sm z-10 relative">
        {weather.forecast?.map((day, i) => (
          <div key={i} className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 cursor-pointer ${i === 0 ? 'bg-white/10 border border-white/20 shadow-lg' : 'hover:bg-white/5 border border-transparent'}`}>
            <p className={`mb-3 font-bold uppercase tracking-wider text-xs ${i === 0 ? 'text-white' : 'text-slate-400'}`}>{day.day}</p>
            {day.icon === 'sun' ? <Sun size={32} className="text-yellow-400 mb-3 drop-shadow-md" /> : <CloudSun size={32} className="text-slate-300 mb-3 drop-shadow-md" />}
            <div className="flex gap-2 font-bold text-base">
              <span className="text-white">{day.max}°</span>
              <span className="text-slate-500">{day.min}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL DASHBOARD ---
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [activeZone, setActiveZone] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/dashboard-stats');
        setData(res.data);
        if (res.data && res.data.history) {
            const availableZones = Object.keys(res.data.history);
            if (availableZones.length > 0) {
                setActiveZone(prev => availableZones.includes(prev) ? prev : availableZones[0]);
            }
        }
      } catch (e) { console.error(e); }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <div className="text-lg font-black text-slate-800 dark:text-white tracking-widest uppercase animate-pulse">Initialisation du Dashboard...</div>
      </div>
  );

  const zones = Object.keys(data.history || {});

  return (
    <div className="space-y-10 font-sans pb-10 animate-fade-in w-full">
      
      <WeatherWidget weather={data.weather} />

      {zones.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-16 rounded-[2rem] text-center shadow-sm">
              <div className="bg-blue-50 dark:bg-blue-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Radio size={40} className="text-blue-500 dark:text-blue-400 animate-ping" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Synchronisation des capteurs...</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">En attente des premières données du réseau AirGradient.</p>
          </div>
      ) : (
          <>
            {/* GRILLE DES 4 GRAPHIQUES COMPARATIFS GLOBAUX */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                
                {/* 1. COMPARATIF PM 2.5 */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-red-50 dark:bg-red-500/10 p-3 rounded-xl"><Activity className="text-red-500" size={24} /></div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Qualité de l'Air (PM 2.5)</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Comparatif Réseau en µg/m³</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.latest_by_zone} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.2} />
                            <XAxis dataKey="sensor_id" tick={{fontSize: 12, fill: '#64748B', fontWeight: 800}} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={{fontSize: 12, fill: '#64748B', fontWeight: 800}} axisLine={false} tickLine={false} />
                            <RechartsTooltip cursor={{fill: 'rgba(100, 116, 139, 0.1)'}} contentStyle={{borderRadius: '16px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff', padding: '12px'}} />
                            <Bar dataKey="pm25" name="PM 2.5" radius={[8, 8, 0, 0]} maxBarSize={50}>
                                {data.latest_by_zone.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.pm25 > 35 ? '#EF4444' : entry.pm25 > 15 ? '#F59E0B' : '#10B981'} />
                                ))}
                            </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. COMPARATIF CO2 */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl"><CloudFog className="text-emerald-500" size={24} /></div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Taux de CO2</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Comparatif Réseau en ppm</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.latest_by_zone} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.2} />
                            <XAxis dataKey="sensor_id" tick={{fontSize: 12, fill: '#64748B', fontWeight: 800}} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={{fontSize: 12, fill: '#64748B', fontWeight: 800}} axisLine={false} tickLine={false} domain={[400, 'auto']} />
                            <RechartsTooltip cursor={{fill: 'rgba(100, 116, 139, 0.1)'}} contentStyle={{borderRadius: '16px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff', padding: '12px'}} />
                            <Bar dataKey="co2" name="CO2" radius={[8, 8, 0, 0]} maxBarSize={50}>
                                {data.latest_by_zone.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.co2 > 1000 ? '#EF4444' : entry.co2 > 800 ? '#F59E0B' : '#10B981'} />
                                ))}
                            </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. COMPARATIF TEMPÉRATURE */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-orange-50 dark:bg-orange-500/10 p-3 rounded-xl"><Thermometer className="text-orange-500" size={24} /></div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Température</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Comparatif Réseau en °C</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.latest_by_zone} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.2} />
                            <XAxis dataKey="sensor_id" tick={{fontSize: 12, fill: '#64748B', fontWeight: 800}} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={{fontSize: 12, fill: '#64748B', fontWeight: 800}} axisLine={false} tickLine={false} domain={[20, 'auto']} />
                            <RechartsTooltip cursor={{fill: 'rgba(100, 116, 139, 0.1)'}} contentStyle={{borderRadius: '16px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff', padding: '12px'}} />
                            <Bar dataKey="temp" name="Température" radius={[8, 8, 0, 0]} maxBarSize={50}>
                                {data.latest_by_zone.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.temp > 35 ? '#EF4444' : entry.temp > 28 ? '#F97316' : '#3B82F6'} />
                                ))}
                            </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. COMPARATIF HUMIDITÉ */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-xl"><Droplets className="text-blue-500" size={24} /></div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Taux d'Humidité</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Comparatif Réseau en %</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.latest_by_zone} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.2} />
                            <XAxis dataKey="sensor_id" tick={{fontSize: 12, fill: '#64748B', fontWeight: 800}} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={{fontSize: 12, fill: '#64748B', fontWeight: 800}} axisLine={false} tickLine={false} />
                            <RechartsTooltip cursor={{fill: 'rgba(100, 116, 139, 0.1)'}} contentStyle={{borderRadius: '16px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff', padding: '12px'}} />
                            <Bar dataKey="humidite" name="Humidité" radius={[8, 8, 0, 0]} maxBarSize={50}>
                                {data.latest_by_zone.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.humidite > 70 ? '#3B82F6' : entry.humidite > 30 ? '#0EA5E9' : '#F59E0B'} />
                                ))}
                            </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-800 my-10"></div>

            {/* SYSTÈME D'ONGLETS POUR LE DÉTAIL PAR CAPTEUR */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight ml-2">Historique par Capteur</h3>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {zones.map(zone => {
                    const isActive = activeZone === zone;
                    return (
                        <button
                            key={zone}
                            onClick={() => setActiveZone(zone)}
                            className={`px-10 py-5 rounded-2xl font-bold text-base transition-all duration-300 whitespace-nowrap flex items-center gap-3 ${
                            isActive 
                                ? 'bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.2)] -translate-y-1' 
                                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:text-white'
                            }`}
                        >
                            <MapPin size={20} className={isActive ? 'text-blue-200' : 'text-slate-400'} />
                            {zone}
                        </button>
                    );
                })}
            </div>

            {/* GRILLE EN 2 COLONNES (Pour des graphiques géants) */}
            {activeZone && data.history[activeZone] && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <MiniChart title={`PM 2.5 - ${activeZone}`} data={data.history[activeZone]} dataKey="pm25" color="#EF4444" icon={CloudFog} unit="µg/m³" />
                    <MiniChart title={`PM 10 - ${activeZone}`} data={data.history[activeZone]} dataKey="pm10" color="#F59E0B" icon={CloudFog} unit="µg/m³" />
                    <MiniChart title={`CO2 - ${activeZone}`} data={data.history[activeZone]} dataKey="co2" color="#10B981" icon={Activity} unit="ppm" />
                    <MiniChart title={`Humidité - ${activeZone}`} data={data.history[activeZone]} dataKey="humidite" color="#3B82F6" icon={Droplets} unit="%" />
                </div>
            )}
          </>
      )}
    </div>
  );
}