import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Na nga def ! Je suis KAIKAI Air-Bot, propulsé par Gemini. Posez-moi vos questions par écrit sur la qualité de l'air, la météo de Dakar ou mes recommandations.", sender: 'bot' }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const fetchGeminiResponse = async (userMsg) => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Clé API Gemini manquante");

      let liveContext = "Données en temps réel indisponibles pour le moment.";
      try {
        const res = await axios.get('http://localhost:8000/api/dashboard-stats');
        const data = res.data;
        
        if (data && data.weather && data.latest_by_zone) {
            const w = data.weather;
            const sensorsText = data.latest_by_zone.map(s => `Capteur ${s.sensor_id}: PM2.5=${s.pm25} µg/m³, Température=${s.temp}°C, Humidité=${s.humidite}%, CO2=${s.co2} ppm.`).join(' | ');
            
            let alertesText = "Aucune alerte critique.";
            if (data.recos_by_zone) {
                const toutesAlertes = [];
                Object.entries(data.recos_by_zone).forEach(([zone, recos]) => {
                    recos.forEach(r => {
                        if (r.type !== 'success') toutesAlertes.push(`[${zone}] ${r.msg}`);
                    });
                });
                if (toutesAlertes.length > 0) alertesText = toutesAlertes.join(' | ');
            }

            liveContext = `
            MÉTÉO ACTUELLE (Dakar): Température ${w.temp}°C, Conditions: ${w.condition}, Vent: ${w.wind}, Humidité: ${w.humidity}.
            CAPTEURS EN DIRECT: ${sensorsText}
            ALERTES ET RECOMMANDATIONS EN COURS: ${alertesText}
            `;
        }
      } catch (err) {
        console.error("Impossible de récupérer le contexte live", err);
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      // Utilisation de 1.5-flash pour plus de rapidité (ou garde "gemini-pro" si 1.5 te fait une erreur)
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const systemPrompt = `Tu t'appelles KAIKAI. Tu es l'assistant virtuel intelligent du projet TERANGA AIR-GUARD, une plateforme de surveillance de la qualité de l'air à Dakar (Sénégal). 
      Ton rôle est de répondre aux questions de l'utilisateur de manière claire, structurée et chaleureuse. 
      Tu peux utiliser une ou deux expressions en Wolof (comme "Waaw", "Jërëjëf", "Naka mu") si c'est pertinent.
      
      === DONNÉES EN TEMPS RÉEL ===
      Voici les informations actuelles de notre réseau de capteurs et de la météo. Utilise impérativement ces données pour répondre de façon précise si la question s'y prête :
      ${liveContext}
      =============================

      Voici la question de l'utilisateur : ${userMsg}`;

      const result = await model.generateContent(systemPrompt);
      return result.response.text();
    } catch (error) {
      console.error("Erreur Gemini:", error);
      return "Désolé, je rencontre des difficultés techniques avec ma connexion à l'IA. Veuillez vérifier votre clé API.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    const botReply = await fetchGeminiResponse(userMsg);

    setIsTyping(false);
    setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        // Fenêtre plus large (w-[450px]) et plus haute (h-[650px])
        <div className="bg-white dark:bg-slate-900 w-[90vw] md:w-[450px] h-[650px] rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-slide-up">
          <div className="bg-blue-600 text-white p-5 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl">
                  <Bot size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black text-xl tracking-wide">KAIKAI Air-Bot</h3>
                  <p className="text-xs font-bold text-blue-200 uppercase tracking-wider flex items-center gap-2 mt-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span> Données Live Actives
                  </p>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-3 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50 dark:bg-slate-950">
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[85%] p-5 rounded-3xl text-base font-medium shadow-sm leading-relaxed ${msg.sender === 'bot' ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 self-start rounded-tl-none' : 'bg-blue-600 text-white ml-auto rounded-tr-none shadow-blue-600/20'}`}>
                <span className="whitespace-pre-wrap">{msg.text}</span>
              </div>
            ))}
            
            {isTyping && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 self-start rounded-3xl rounded-tl-none p-5 shadow-sm w-fit flex items-center gap-4 text-base font-bold">
                    <Loader2 size={24} className="animate-spin text-blue-600" /> KAIKAI analyse le réseau...
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Posez votre question..." 
              disabled={isTyping}
              // Input plus large et lisible (text-base, py-4)
              className="flex-1 p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base text-slate-800 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
            />
            <button 
              onClick={handleSend} 
              disabled={isTyping || !input.trim()} 
              // Bouton plus grand (p-4)
              className="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-600/30 transition-all disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:shadow-none flex-shrink-0"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          // Bouton flottant plus massif (p-6)
          className="bg-blue-600 text-white p-6 rounded-full shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all transform hover:scale-105 hover:-translate-y-2 flex items-center gap-4 group border-[6px] border-blue-100 dark:border-slate-800"
        >
          <MessageCircle size={36} />
          <span className="hidden group-hover:block font-black pr-2 tracking-wide text-lg">KAIKAI IA</span>
        </button>
      )}
    </div>
  );
}