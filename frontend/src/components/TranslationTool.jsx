import React, { useState } from 'react';
import { translateText } from '../services/api';
import { Languages, ArrowRightLeft } from 'lucide-react';

const TranslationTool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('darija'); // 'darija' means Eng -> Darija

  const handleTranslate = async () => {
    if(!input) return;
    setOutput("Translating...");
    const res = await translateText(input, mode);
    setOutput(res);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-kech-gold/30 p-8">
        <div className="flex items-center gap-3 mb-6 text-kech-blue">
          <Languages size={32} />
          <h2 className="text-2xl font-serif font-bold">Terjman (Translator)</h2>
        </div>

        {/* Input */}
        <textarea
          className="w-full p-4 bg-kech-sand/30 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kech-teal outline-none resize-none"
          rows="3"
          placeholder={mode === 'darija' ? "Type in English..." : "Type in Darija..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Controls */}
        <div className="flex justify-between items-center my-4">
          <button 
            onClick={() => setMode(mode === 'darija' ? 'english' : 'darija')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-kech-red font-bold"
          >
            <ArrowRightLeft size={16} />
            {mode === 'darija' ? "English ⮕ Darija" : "Darija ⮕ English"}
          </button>
          
          <button 
            onClick={handleTranslate}
            className="bg-kech-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition"
          >
            Translate
          </button>
        </div>

        {/* Output */}
        <div className="bg-kech-teal/10 p-6 rounded-xl border border-kech-teal/20 min-h-[100px]">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Translation</p>
          <p className="text-lg font-medium text-kech-teal">{output}</p>
        </div>
      </div>
    </div>
  );
};

export default TranslationTool;
