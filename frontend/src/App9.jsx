import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, MapPin, ShieldAlert, Menu, X, Sparkles, 
  Map, BookOpen, Phone, ChevronRight, ArrowLeft, 
  Plus, Trash2, Calendar, Clock, CheckCircle, 
  Languages, Copy, ArrowRight, Search, Globe, AlertTriangle
} from 'lucide-react';
import { chatWithGuide, translateText, checkCitySecurity } from './services/api';

// ==========================================
// DONNÉES STATIQUES (GRAND TOUR)
// ==========================================
const TOURS_DATA = [
  {
    id: 'imperiales',
    title: "Les Villes Impériales",
    duration: "7 Jours",
    level: "Facile",
    image: "bg-blue-900",
    description: "Le circuit historique par excellence. Découvrez les quatre capitales historiques du Maroc : Marrakech, Fès, Meknès et Rabat.",
    itinerary: [
      { day: "Jour 1", title: "Arrivée à Marrakech", desc: "Installation au Riad, première immersion sur la place Jemaa el-Fna au coucher du soleil." },
      { day: "Jour 2", title: "Marrakech Historique", desc: "Visite du Palais Bahia, de la Koutoubia et des Tombeaux Saadiens. Après-midi dans les souks." },
      { day: "Jour 3", title: "Vers Casablanca & Rabat", desc: "Trajet vers Casa (Mosquée Hassan II) puis route vers Rabat. Nuit dans la capitale." },
      { day: "Jour 4", title: "Rabat & Meknès", desc: "Visite de la Tour Hassan, puis route vers Meknès (Bab Mansour). Arrivée à Fès le soir." },
      { day: "Jour 5", title: "Fès Spirituelle", desc: "Journée complète dans la plus grande médina du monde : Tanneries, Madrasas, et artisanat." },
      { day: "Jour 6", title: "Retour via le Moyen Atlas", desc: "Traversée des forêts de cèdres d'Ifrane et Azrou. Retour vers Marrakech." },
      { day: "Jour 7", title: "Départ", desc: "Dernier thé à la menthe et transfert aéroport." }
    ]
  },
  {
    id: 'desert',
    title: "La Route des Mille Kasbahs",
    duration: "5 Jours",
    level: "Modéré",
    image: "bg-orange-800",
    description: "Une aventure cinématographique à travers l'Atlas jusqu'aux dunes dorées du Sahara.",
    itinerary: [
      { day: "Jour 1", title: "Marrakech - Ouarzazate", desc: "Traversée du col Tizi n'Tichka. Visite du Ksar Aït Ben Haddou (Game of Thrones)." },
      { day: "Jour 2", title: "Vallée des Roses & Dades", desc: "Route à travers la palmeraie de Skoura. Nuit dans les gorges du Dadès." },
      { day: "Jour 3", title: "Gorges du Todra - Merzouga", desc: "Marche dans les gorges. Arrivée aux dunes de l'Erg Chebbi à dos de dromadaire. Nuit en bivouac." },
      { day: "Jour 4", title: "Merzouga - Agdz", desc: "Réveil au lever du soleil sur les dunes. Retour par la vallée du Draa." },
      { day: "Jour 5", title: "Retour à Marrakech", desc: "Traversée de l'Anti-Atlas et fin du voyage." }
    ]
  },
  {
    id: 'nord',
    title: "Le Nord & La Perle Bleue",
    duration: "6 Jours",
    level: "Détente",
    image: "bg-blue-500",
    description: "Découvrez la côte méditerranéenne, l'influence andalouse et les montagnes du Rif.",
    itinerary: [
      { day: "Jour 1", title: "Arrivée à Tanger", desc: "Balade dans la Kasbah et thé au Café Hafa face à l'Espagne." },
      { day: "Jour 2", title: "Tanger - Cap Spartel", desc: "Visite des Grottes d'Hercule. Route vers Tétouan." },
      { day: "Jour 3", title: "Chefchaouen", desc: "Arrivée dans la ville bleue. Photographie et détente sur la place Uta el-Hammam." },
      { day: "Jour 4", title: "Cascades d'Akchour", desc: "Randonnée nature vers le Pont de Dieu." },
      { day: "Jour 5", title: "Asilah", desc: "Route vers la côte atlantique. Visite de la médina artistique d'Asilah." },
      { day: "Jour 6", title: "Retour Tanger", desc: "Shopping de dernière minute et départ." }
    ]
  }
];

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
const App = () => {
  const [activeView, setActiveView] = useState('guide');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateTo = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-[100dvh] w-full font-sans overflow-hidden text-slate-800 relative bg-kech-sand">
      {/* Overlay Mobile */}
      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm lg:hidden transition-opacity" />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-kech-primary text-white transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 flex-shrink-0`}>
        <div className="p-6 lg:p-8 border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl lg:text-3xl font-bold tracking-widest text-kech-accent">ZELIG</h1>
            <p className="text-[10px] lg:text-xs text-blue-200 tracking-wider mt-1 uppercase">Digital Morocco</p>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-white/80 hover:text-white"><X size={24} /></button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavItem icon={<Sparkles size={20}/>} label="Guide Royal IA" isActive={activeView === 'guide'} onClick={() => navigateTo('guide')} />
          <NavItem icon={<Languages size={20}/>} label="Terjman (Traduction)" isActive={activeView === 'translate'} onClick={() => navigateTo('translate')} />
          <NavItem icon={<Map size={20}/>} label="Grand Tour" isActive={activeView === 'tour'} onClick={() => navigateTo('tour')} />
          <NavItem icon={<ShieldAlert size={20}/>} label="Sécurité Voyage" isActive={activeView === 'safety'} onClick={() => navigateTo('safety')} />
          <NavItem icon={<BookOpen size={20}/>} label="Carnet de Route" isActive={activeView === 'carnet'} onClick={() => navigateTo('carnet')} />
        </nav>

        <div className="p-6 border-t border-white/10 bg-black/20 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-kech-accent flex items-center justify-center text-kech-primary font-bold font-serif shadow-lg">M</div>
            <div><p className="text-sm font-bold">Profil Voyageur</p><p className="text-xs text-blue-200">Connecté</p></div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-full relative min-w-0 bg-kech-sand bg-zellij-pattern">
        <header className="lg:hidden p-4 bg-kech-primary text-white flex justify-between items-center shadow-md flex-shrink-0 z-30">
          <h1 className="font-serif text-lg font-bold text-kech-accent">ZELIG</h1>
          <button onClick={() => setMobileMenuOpen(true)} className="p-1"><Menu size={24} /></button>
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

// ==========================================
// 1. CHAT VIEW
// ==========================================
const ChatView = () => {
  const [messages, setMessages] = useState([{ role: 'ai', content: 'Salam ! Je suis ton guide expert. Pose-moi une question sur le Maroc !' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

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
      setMessages(prev => [...prev, { role: 'ai', content: "Erreur de connexion avec le serveur." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-6 pb-4">
          {messages.length < 2 && (
             <div className="text-center py-12 animate-fade-in">
                <div className="inline-flex p-5 rounded-full bg-white shadow-lg mb-6"><MapPin className="text-kech-secondary w-10 h-10" /></div>
                <h2 className="text-4xl font-serif text-kech-primary font-bold mb-4">MARHBA !</h2>
                <p className="text-xl text-gray-600">Votre assistant personnel pour explorer le Royaume.</p>
             </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex w-full ${idx === 0 ? 'justify-center' : (msg.role === 'user' ? 'justify-end' : 'justify-start')}`}>
              <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3 items-end`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-md mb-1 ${msg.role === 'user' ? 'bg-kech-secondary text-white' : 'bg-white border border-kech-primary/20 text-kech-primary'}`}>
                  {msg.role === 'user' ? 'Moi' : <Sparkles size={16} />}
                </div>
                <div className={`p-4 lg:p-6 rounded-2xl shadow-sm text-base leading-relaxed backdrop-blur-sm ${msg.role === 'user' ? 'bg-kech-primary text-white rounded-br-none' : 'bg-white/95 border border-white/50 text-slate-800 rounded-bl-none'} ${idx === 0 ? 'text-center font-medium' : ''}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {loading && <div className="pl-14 text-sm text-gray-500 italic flex items-center gap-2"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div> Écriture en cours...</div>}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-20">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="flex items-center gap-2 bg-white p-2 pl-4 rounded-full shadow-lg border border-gray-200">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Posez votre question..." className="flex-1 bg-transparent outline-none text-gray-700 h-10" />
            <button type="submit" disabled={loading} className="w-10 h-10 bg-kech-secondary text-white rounded-full flex items-center justify-center shadow hover:bg-orange-700 transition"><Send size={18} /></button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. VUE TRADUCTION (NETTOYÉE)
// ==========================================
const TranslationView = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    const result = await translateText(inputText);
    setTranslatedText(result);
    setLoading(false);
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 animate-fade-in flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
           <h2 className="text-3xl font-serif text-kech-primary font-bold mb-2 tracking-wide">Terjman AI</h2>
           <p className="text-gray-500 font-light text-lg">Traduction instantanée Anglais ➔ Darija Marocaine</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* INPUT */}
           <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col h-72 transition-shadow hover:shadow-2xl">
              <label className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2"><Languages size={14}/> Anglais</label>
              <textarea 
                className="flex-1 w-full resize-none outline-none text-xl text-slate-800 placeholder:text-gray-300 bg-transparent"
                placeholder="Ex: Hello friend, how are you?"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
           </div>

           {/* OUTPUT */}
           <div className="bg-kech-primary/5 p-6 rounded-2xl border border-kech-primary/10 flex flex-col h-72 relative">
              <label className="text-xs font-bold text-kech-primary uppercase mb-3 flex items-center gap-2 justify-end">Darija <Sparkles size={14}/></label>
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-kech-primary/60 animate-pulse gap-3">
                   <div className="w-8 h-8 border-4 border-kech-primary border-t-transparent rounded-full animate-spin"></div>
                   <span>Traduction neuronale en cours...</span>
                </div>
              ) : (
                <div className="flex-1 text-2xl text-kech-primary font-medium font-serif leading-relaxed dir-rtl flex items-center justify-end text-right">
                   {translatedText || <span className="text-gray-300 italic text-lg">La traduction apparaîtra ici...</span>}
                </div>
              )}
              {translatedText && (
                <button onClick={() => navigator.clipboard.writeText(translatedText)} className="absolute bottom-4 left-4 text-kech-primary hover:bg-white bg-white/50 p-2 rounded-full transition shadow-sm" title="Copier">
                  <Copy size={20}/>
                </button>
              )}
           </div>
        </div>

        <div className="flex justify-center pt-4">
           <button 
             onClick={handleTranslate}
             disabled={loading || !inputText}
             className="px-10 py-4 bg-kech-secondary text-white rounded-full font-bold shadow-xl hover:bg-orange-700 transition flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
           >
             Traduire <ArrowRight size={20}/>
           </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. VUE SÉCURITÉ (LIVE PRESS SCANNER)
// ==========================================
const SafetyView = () => {
  const [city, setCity] = useState('');
  const [alert, setAlert] = useState(null);
  const [scanning, setScanning] = useState(false);

  const checkSafety = async (e) => {
    e.preventDefault();
    if (!city) return;
    setScanning(true);
    setAlert(null);
    const data = await checkCitySecurity(city);
    setAlert(data);
    setScanning(false);
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 animate-fade-in">
      <h2 className="text-3xl font-serif text-kech-primary font-bold mb-2">Sécurité Voyage Live</h2>
      <p className="text-gray-600 mb-8">Scan en temps réel de la presse marocaine locale (Arabe) pour détecter les incidents récents.</p>
      
      {/* Search Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8 max-w-2xl mx-auto">
        <label className="text-xs font-bold text-gray-400 uppercase flex gap-2"><Globe size={14}/> Scanner une destination</label>
        <form onSubmit={checkSafety} className="flex gap-2 mt-2">
          <input 
            type="text" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Entrez une ville (ex: Tanger, Agadir)..." 
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-kech-secondary transition"
          />
          <button type="submit" disabled={scanning} className="bg-kech-secondary hover:bg-orange-700 text-white px-8 py-2 rounded-lg font-bold flex items-center gap-2 transition disabled:opacity-70">
            {scanning ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"/> : <Search size={20} />}
            {scanning ? 'Scan...' : 'Analyser'}
          </button>
        </form>
      </div>

      {/* Result Card */}
      {alert && (
        <div className="max-w-4xl mx-auto animate-slide-up">
          <div className={`bg-white/95 backdrop-blur rounded-2xl p-6 shadow-glass border-l-8 mb-8 ${
            alert.risk_color === 'green' ? 'border-green-500' : alert.risk_color === 'orange' ? 'border-orange-500' : 'border-red-500'
          }`}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-3">
                   <h3 className="text-3xl font-bold text-slate-800">{alert.city}</h3>
                   <span className="text-lg text-gray-400 font-serif font-light">({alert.city_ar})</span>
                </div>
                <p className="text-lg text-slate-700 mt-4 leading-relaxed font-medium">{alert.recommendation}</p>
                <div className="mt-4 flex gap-4 text-sm text-gray-500">
                   <span>Presse analysée : {alert.sources_count} sources</span>
                   {alert.sources_count > 0 && <span className="text-green-600">Données en direct</span>}
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide text-white shadow-md ${
                  alert.risk_color === 'green' ? 'bg-green-600' : alert.risk_color === 'orange' ? 'bg-orange-500' : 'bg-red-600'
                }`}>
                  Risque : {alert.risk_level}
                </span>
                
                {/* Stats Grid */}
                {alert.hits && (
                  <div className="grid grid-cols-2 gap-2 mt-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                     <div className="text-xs text-gray-500">Mentions Crime</div>
                     <div className="text-xs font-bold text-right">{alert.hits.crime || 0}</div>
                     <div className="text-xs text-gray-500">Mentions Accident</div>
                     <div className="text-xs font-bold text-right">{alert.hits.accident || 0}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Static Emergency Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto">
        <EmergencyCard icon={<Phone/>} title="Police Touristique" number="19" color="red" />
        <EmergencyCard icon={<ShieldAlert/>} title="Ambulance / Pompiers" number="15" color="orange" />
        <EmergencyCard icon={<ShieldAlert/>} title="Gendarmerie Royale" number="177" color="blue" />
      </div>
    </div>
  );
};

// ==========================================
// 4. TOUR VIEW
// ==========================================
const TourView = () => {
  const [selectedTour, setSelectedTour] = useState(null);

  if (selectedTour) {
    return (
      <div className="h-full overflow-y-auto p-4 md:p-8 animate-fade-in bg-white/50">
        <button onClick={() => setSelectedTour(null)} className="flex items-center gap-2 text-kech-primary font-bold mb-6 hover:underline">
          <ArrowLeft size={20} /> Retour aux circuits
        </button>
        
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-white/50">
          <div className={`h-48 ${selectedTour.image} relative`}>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h2 className="text-4xl font-serif text-white font-bold text-center px-4">{selectedTour.title}</h2>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex gap-4 mb-8 text-sm font-bold text-gray-500 uppercase tracking-wide">
              <span className="flex items-center gap-1"><Clock size={16}/> {selectedTour.duration}</span>
              <span className="flex items-center gap-1"><Map size={16}/> {selectedTour.level}</span>
            </div>
            
            <p className="text-xl text-gray-700 mb-8 font-light italic border-l-4 border-kech-accent pl-4">
              {selectedTour.description}
            </p>

            <h3 className="text-2xl font-serif text-kech-primary mb-6">Itinéraire Détaillé</h3>
            <div className="space-y-6">
              {selectedTour.itinerary.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-kech-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {idx + 1}
                    </div>
                    {idx !== selectedTour.itinerary.length - 1 && <div className="w-0.5 h-full bg-gray-200 my-1"></div>}
                  </div>
                  <div className="pb-6">
                    <h4 className="font-bold text-lg text-slate-800">{step.title}</h4>
                    <p className="text-sm text-gray-500 mb-1">{step.day}</p>
                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-serif text-kech-primary font-bold mb-2">Le Grand Tour</h2>
      <p className="text-gray-600 mb-8">Sélectionnez un itinéraire pour voir le détail jour par jour.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOURS_DATA.map((tour) => (
          <div key={tour.id} className="bg-white rounded-xl shadow-glass border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
            <div className={`h-40 ${tour.image} relative group-hover:scale-105 transition-transform duration-500`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-kech-secondary bg-orange-50 px-2 py-1 rounded">{tour.duration}</span>
                <span className="text-xs text-gray-400">{tour.level}</span>
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-3">{tour.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-6">{tour.description}</p>
              
              <button 
                onClick={() => setSelectedTour(tour)}
                className="w-full py-3 border border-kech-primary text-kech-primary rounded-lg font-bold hover:bg-kech-primary hover:text-white transition flex items-center justify-center gap-2 group-hover:gap-3"
              >
                Voir le détail <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 5. CARNET VIEW
// ==========================================
const CarnetView = () => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('zelig_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    localStorage.setItem('zelig_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([{ id: Date.now(), text: newNote, date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) }, ...notes]);
    setNewNote('');
  };

  const deleteNote = (id) => setNotes(notes.filter(n => n.id !== id));

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 animate-fade-in flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block bg-white p-4 rounded-full shadow-lg mb-4 text-kech-accent"><BookOpen size={40} /></div>
          <h2 className="text-3xl font-serif text-kech-primary font-bold">Carnet de Voyage</h2>
          <p className="text-gray-600">Notez vos coups de cœur et souvenirs. Ils sont sauvegardés automatiquement.</p>
        </div>
        <form onSubmit={addNote} className="relative flex items-center gap-2 mb-8">
          <input type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Ajouter une note..." className="w-full p-4 pl-6 rounded-full shadow-lg border-none outline-none focus:ring-2 focus:ring-kech-secondary/50" />
          <button type="submit" className="absolute right-2 w-10 h-10 bg-kech-primary text-white rounded-full flex items-center justify-center hover:bg-blue-900 transition shadow-md"><Plus size={20} /></button>
        </form>
        <div className="space-y-4">
          {notes.length === 0 && <div className="text-center text-gray-400 py-10 italic bg-white/50 rounded-xl border border-dashed border-gray-300">Votre carnet est vide pour l'instant.</div>}
          {notes.map(note => (
            <div key={note.id} className="bg-white p-5 rounded-xl shadow-sm border border-white/50 flex justify-between items-start group hover:shadow-md transition">
              <div><p className="text-slate-800 text-lg leading-relaxed">{note.text}</p><span className="text-xs text-gray-400 mt-2 block flex items-center gap-1"><Calendar size={12}/> {note.date}</span></div>
              <button onClick={() => deleteNote(note.id)} className="text-gray-300 hover:text-red-500 transition p-2" title="Supprimer"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPOSANTS UTILITAIRES
// ==========================================
const NavItem = ({ icon, label, isActive, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 lg:py-4 rounded-xl transition-all duration-200 group mb-1 text-left ${isActive ? 'bg-white/10 text-white border-r-4 border-kech-accent font-semibold shadow-inner' : 'text-blue-100 hover:bg-white/5 hover:text-white'}`}>
    <span className={`${isActive ? 'text-kech-accent' : 'group-hover:text-white transition-colors'}`}>{icon}</span>
    <span className="text-sm lg:text-base tracking-wide">{label}</span>
  </button>
);

const EmergencyCard = ({ icon, title, number, color }) => {
  const colors = { red: "bg-red-50 text-red-700 border-red-100", orange: "bg-orange-50 text-orange-700 border-orange-100", blue: "bg-blue-50 text-blue-700 border-blue-100" };
  return (
    <div className={`${colors[color]} p-6 rounded-2xl border flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition`}>
      <div className="mb-2 opacity-80">{icon}</div>
      <h3 className="font-bold text-sm uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-4xl font-black">{number}</p>
    </div>
  );
};

export default App;