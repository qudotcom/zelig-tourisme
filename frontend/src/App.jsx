import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Send, MapPin, ShieldAlert, Menu, X, Sparkles, 
  Map, BookOpen, Phone, ChevronRight, ArrowLeft, 
  Plus, Trash2, Calendar, Clock, CheckCircle, 
  Languages, Copy, ArrowRight, Search, Globe, Code
} from 'lucide-react';
import { chatWithGuide, translateText, checkCitySecurity } from './services/api';

// --- DONNÉES STATIQUES ---
const TOURS_DATA = [
  {
    id: 'imperiales', title: "Les Villes Impériales", duration: "7 Jours", level: "Facile", image: "bg-blue-900",
    description: "Le circuit historique par excellence : Marrakech, Fès, Meknès et Rabat.",
    itinerary: [
      { day: "J1", title: "Marrakech", desc: "Arrivée et place Jemaa el-Fna." },
      { day: "J2", title: "Monuments", desc: "Bahia, Koutoubia, Souks." },
      { day: "J3", title: "Rabat", desc: "Route vers la capitale via Casablanca." },
      { day: "J4", title: "Meknès & Fès", desc: "Bab Mansour et arrivée à Fès." },
      { day: "J5", title: "Fès", desc: "Immersion dans la Médina." },
      { day: "J6", title: "Atlas", desc: "Retour via Ifrane." },
      { day: "J7", title: "Départ", desc: "Transfert aéroport." }
    ]
  },
  {
    id: 'desert', title: "Route des Kasbahs", duration: "5 Jours", level: "Modéré", image: "bg-orange-800",
    description: "L'aventure du sud, de Ouarzazate aux dunes de Merzouga.",
    itinerary: [
      { day: "J1", title: "Ouarzazate", desc: "Aït Ben Haddou." },
      { day: "J2", title: "Dades", desc: "Vallée des Roses." },
      { day: "J3", title: "Merzouga", desc: "Nuit au désert." },
      { day: "J4", title: "Draa", desc: "Retour par Agdz." },
      { day: "J5", title: "Marrakech", desc: "Fin du voyage." }
    ]
  },
  {
    id: 'nord', title: "Le Nord Bleu", duration: "6 Jours", level: "Détente", image: "bg-blue-500",
    description: "Tanger et la perle bleue Chefchaouen.",
    itinerary: [
      { day: "J1", title: "Tanger", desc: "Kasbah et Café Hafa." },
      { day: "J2", title: "Cap Spartel", desc: "Grottes d'Hercule." },
      { day: "J3", title: "Chefchaouen", desc: "La ville bleue." },
      { day: "J4", title: "Akchour", desc: "Cascades." },
      { day: "J5", title: "Asilah", desc: "Médina artistique." },
      { day: "J6", title: "Départ", desc: "Retour Tanger." }
    ]
  }
];

// --- APP ---
const App = () => {
  const [activeView, setActiveView] = useState('guide');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateTo = (view) => { setActiveView(view); setMobileMenuOpen(false); };

  return (
    <div className="flex h-[100dvh] w-full font-sans overflow-hidden text-slate-800 relative bg-kech-sand">
      
      {/* Mobile Menu */}
      {mobileMenuOpen && <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-kech-primary text-white transition-transform duration-300 shadow-2xl flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-widest text-kech-accent">ZELIG</h1>
            <p className="text-xs text-blue-200 mt-1 uppercase tracking-wider">Digital Morocco</p>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden"><X /></button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavItem icon={<Sparkles size={20}/>} label="Guide Royal IA" isActive={activeView === 'guide'} onClick={() => navigateTo('guide')} />
          <NavItem icon={<Languages size={20}/>} label="Terjman (Traduction)" isActive={activeView === 'translate'} onClick={() => navigateTo('translate')} />
          <NavItem icon={<Map size={20}/>} label="Grand Tour" isActive={activeView === 'tour'} onClick={() => navigateTo('tour')} />
          <NavItem icon={<ShieldAlert size={20}/>} label="Sécurité Voyage" isActive={activeView === 'safety'} onClick={() => navigateTo('safety')} />
          <NavItem icon={<BookOpen size={20}/>} label="Carnet de Route" isActive={activeView === 'carnet'} onClick={() => navigateTo('carnet')} />
        </nav>

        {/* --- FOOTER AVEC SIGNATURE --- */}
        <div className="p-6 border-t border-white/10 bg-black/20 mt-auto">
          {/* Profil Utilisateur Mock */}
          <div className="flex items-center gap-3 mb-6 opacity-70">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-bold font-serif">M</div>
            <div><p className="text-sm font-bold">Profil Voyageur</p><p className="text-[10px] text-blue-200">Connecté</p></div>
          </div>
          
          {/* Signature Développeur */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-[10px] text-blue-300 uppercase tracking-widest mb-1 flex items-center gap-1"><Code size={10}/> Réalisé par</p>
            <p className="text-sm font-bold text-white leading-tight">Abdelouahed Tahri</p>
            <p className="text-[10px] text-blue-200 italic mt-0.5">École Centrale Casablanca</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative min-w-0 bg-kech-sand bg-zellij-pattern">
        
        <header className="lg:hidden p-4 bg-kech-primary text-white flex justify-between items-center shadow-md">
          <h1 className="font-serif text-lg font-bold text-kech-accent">ZELIG</h1>
          <button onClick={() => setMobileMenuOpen(true)}><Menu /></button>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {activeView === 'guide' && <ChatView />}
          {activeView === 'translate' && <TranslationView />}
          {activeView === 'tour' && <TourView />}
          {activeView === 'safety' && <SafetyView />}
          {activeView === 'carnet' && <CarnetView />}
        </div>
      </main>
    </div>
  );
};

// --- VUES ---

const ChatView = () => {
  const [messages, setMessages] = useState([{ role: 'ai', content: 'Salam ! Je suis ton guide expert Zelig. Une question sur le Maroc ?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setLoading(true);
    try {
      const response = await chatWithGuide(userText);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: "Désolé, je n'arrive pas à joindre le serveur." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 lg:p-5 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-kech-primary text-white rounded-br-none' 
                  : 'bg-white text-slate-800 rounded-bl-none shadow-md border border-white/50'
              }`}>
                {msg.role === 'ai' ? (
                  <ReactMarkdown 
                    components={{
                      strong: ({node, ...props}) => <span className="font-bold text-kech-primary" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-4 my-2 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="pl-1" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-sm text-gray-500 italic ml-4 flex items-center gap-2"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div> Zelig écrit...</div>}
          <div ref={endRef} />
        </div>
      </div>
      <div className="p-4 bg-white/90 backdrop-blur border-t shadow-lg">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Posez votre question..." className="flex-1 p-3 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-kech-secondary transition" />
          <button disabled={loading} className="p-3 bg-kech-secondary text-white rounded-full hover:bg-orange-700 transition shadow-md"><Send size={20} /></button>
        </form>
      </div>
    </div>
  );
};

const TranslationView = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text) return;
    setLoading(true);
    const res = await translateText(text);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 overflow-y-auto">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-kech-primary font-bold mb-2">Terjman AI</h2>
          <p className="text-gray-600">Traducteur Anglais ➔ Darija</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg h-64 flex flex-col">
            <label className="text-xs font-bold text-gray-400 uppercase mb-2">Anglais</label>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Hello friend..." className="flex-1 resize-none outline-none text-lg bg-transparent" />
          </div>
          <div className="bg-kech-primary/5 p-6 rounded-2xl border border-kech-primary/10 h-64 flex flex-col relative">
            <label className="text-xs font-bold text-kech-primary uppercase mb-2 text-right">Darija</label>
            {loading ? <div className="m-auto animate-pulse text-kech-primary">Traduction...</div> : 
              <div className="flex-1 text-2xl text-kech-primary font-serif text-right dir-rtl">{result}</div>}
            {result && <button onClick={() => navigator.clipboard.writeText(result)} className="absolute bottom-4 left-4 p-2 bg-white rounded-full shadow hover:bg-gray-50"><Copy size={18}/></button>}
          </div>
        </div>
        <div className="text-center">
          <button onClick={handleTranslate} disabled={loading || !text} className="px-8 py-3 bg-kech-secondary text-white rounded-full font-bold shadow-lg hover:bg-orange-700 transition disabled:opacity-50 flex items-center gap-2 mx-auto">
            Traduire <ArrowRight size={18}/>
          </button>
        </div>
      </div>
    </div>
  );
};

const SafetyView = () => {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [scanning, setScanning] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!city) return;
    setScanning(true);
    setData(null);
    const res = await checkCitySecurity(city);
    setData(res);
    setScanning(false);
  };

  return (
    <div className="h-full p-8 overflow-y-auto">
      <h2 className="text-3xl font-serif text-kech-primary font-bold mb-6">Sécurité Voyage Live</h2>
      
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-2xl mx-auto mb-8">
        <label className="text-xs font-bold text-gray-400 uppercase flex gap-2 mb-2"><Globe size={14}/> Scanner une destination</label>
        <form onSubmit={handleScan} className="flex gap-2">
          <input value={city} onChange={e => setCity(e.target.value)} placeholder="Ville (ex: Tanger)..." className="flex-1 p-3 bg-gray-50 rounded-lg outline-none border focus:border-kech-secondary" />
          <button disabled={scanning} className="px-6 py-3 bg-kech-secondary text-white rounded-lg font-bold hover:bg-orange-700 transition flex items-center gap-2">
            {scanning ? "Scan..." : <><Search size={18}/> Analyser</>}
          </button>
        </form>
      </div>

      {data && (
        <div className={`max-w-4xl mx-auto bg-white/95 backdrop-blur p-6 rounded-2xl shadow-lg border-l-8 mb-8 ${data.risk_color === 'green' ? 'border-green-500' : data.risk_color === 'orange' ? 'border-orange-500' : 'border-red-500'}`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{data.city} <span className="text-gray-400 text-lg font-serif">({data.city_ar})</span></h3>
              <p className="mt-2 text-lg text-slate-700">{data.recommendation}</p>
              <div className="mt-4 text-sm text-gray-500">Basé sur {data.sources_count} sources de presse locale.</div>
            </div>
            <div className={`px-4 py-2 rounded-full text-white font-bold uppercase ${data.risk_color === 'green' ? 'bg-green-600' : data.risk_color === 'orange' ? 'bg-orange-500' : 'bg-red-600'}`}>
              {data.risk_level}
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <EmergencyCard icon={<Phone/>} title="Police" number="19" color="red" />
        <EmergencyCard icon={<ShieldAlert/>} title="Ambulance" number="15" color="orange" />
        <EmergencyCard icon={<ShieldAlert/>} title="Gendarmerie" number="177" color="blue" />
      </div>
    </div>
  );
};

const TourView = () => {
  const [selected, setSelected] = useState(null);
  if (selected) return (
    <div className="h-full p-8 overflow-y-auto bg-white/90 backdrop-blur">
      <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-kech-primary font-bold mb-6 hover:underline"><ArrowLeft/> Retour</button>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className={`h-48 ${selected.image} flex items-center justify-center relative`}>
           <div className="absolute inset-0 bg-black/30"></div>
           <h2 className="text-4xl font-serif text-white font-bold relative z-10">{selected.title}</h2>
        </div>
        <div className="p-8">
          <p className="text-xl italic text-gray-700 mb-8 border-l-4 border-kech-accent pl-4">{selected.description}</p>
          <div className="space-y-6">
            {selected.itinerary.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-kech-primary text-white flex items-center justify-center font-bold shrink-0">{i+1}</div>
                <div><h4 className="font-bold text-lg">{step.title}</h4><p className="text-gray-600">{step.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="h-full p-8 overflow-y-auto">
      <h2 className="text-3xl font-serif text-kech-primary font-bold mb-6">Le Grand Tour</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {TOURS_DATA.map(t => (
          <div key={t.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden group border border-white/50">
            <div className={`h-40 ${t.image} group-hover:scale-105 transition duration-500`}/>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">{t.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{t.description}</p>
              <button onClick={() => setSelected(t)} className="w-full py-2 border border-kech-primary text-kech-primary rounded-lg font-bold hover:bg-kech-primary hover:text-white transition flex items-center justify-center gap-2">Voir Détails <ChevronRight size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CarnetView = () => {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('zelig_notes') || '[]'));
  const [input, setInput] = useState('');
  useEffect(() => localStorage.setItem('zelig_notes', JSON.stringify(notes)), [notes]);
  const add = (e) => { e.preventDefault(); if(!input)return; setNotes([{id:Date.now(), text:input, date:new Date().toLocaleDateString()}, ...notes]); setInput(''); };
  return (
    <div className="h-full p-8 overflow-y-auto flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h2 className="text-3xl font-serif text-center text-kech-primary font-bold mb-8">Carnet de Voyage</h2>
        <form onSubmit={add} className="flex gap-2 mb-8 relative">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ajouter une note..." className="w-full p-4 rounded-full shadow-lg outline-none focus:ring-2 focus:ring-kech-secondary/50" />
          <button className="absolute right-2 top-2 w-10 h-10 bg-kech-primary text-white rounded-full flex items-center justify-center hover:bg-blue-900"><Plus size={20}/></button>
        </form>
        <div className="space-y-4">
          {notes.length === 0 && <div className="text-center text-gray-400 py-10 italic bg-white/50 rounded-xl border border-dashed border-gray-300">Votre carnet est vide pour l'instant.</div>}
          {notes.map(n => (
            <div key={n.id} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition flex justify-between border border-white/50">
              <div><p className="text-lg text-slate-800">{n.text}</p><span className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Calendar size={12}/> {n.date}</span></div>
              <button onClick={() => setNotes(notes.filter(x => x.id !== n.id))} className="text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Utils
const NavItem = ({ icon, label, isActive, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 lg:py-4 rounded-xl transition-all duration-200 group mb-1 text-left ${isActive ? 'bg-white/10 text-white border-r-4 border-kech-accent font-semibold shadow-inner' : 'text-blue-100 hover:bg-white/5 hover:text-white'}`}>
    <span className={isActive ? 'text-kech-accent' : ''}>{icon}</span><span className="text-sm lg:text-base tracking-wide">{label}</span>
  </button>
);
const EmergencyCard = ({ icon, title, number, color }) => {
  const c = { red: "bg-red-50 text-red-700 border-red-100", orange: "bg-orange-50 text-orange-700 border-orange-100", blue: "bg-blue-50 text-blue-700 border-blue-100" };
  return <div className={`${c[color]} p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition border`}><div className="mb-2 opacity-80">{icon}</div><h3 className="font-bold text-sm uppercase mb-1">{title}</h3><p className="text-4xl font-black">{number}</p></div>;
};

export default App;