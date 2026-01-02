import React, { useState } from 'react';
import { KeyConfig } from '../types';
import { generateKeyLogic } from '../services/geminiService';
import { TerminalOutput } from './TerminalOutput';
import { ShieldCheck, Calendar, Cpu, Lock } from 'lucide-react';

export const KeyManager: React.FC = () => {
  const [config, setConfig] = useState<KeyConfig>({
    algorithm: 'AES-256',
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    hardwareBinding: true,
    maxSessions: 1
  });
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateKeyLogic(config);
    setScript(result);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="text-emerald-500" />
          System Key Generation
        </h2>
        <p className="text-slate-400 mt-1">Configure the master key parameters for the Ubuntu 24.04 instance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Lock size={16} /> Encryption Standard
            </label>
            <select 
              value={config.algorithm}
              onChange={(e) => setConfig({...config, algorithm: e.target.value as any})}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="AES-256">AES-256 (FIPS 197)</option>
              <option value="ChaCha20-Poly1305">ChaCha20-Poly1305 (High Performance)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Calendar size={16} /> Key Expiration
            </label>
            <input 
              type="date"
              value={config.expiryDate}
              onChange={(e) => setConfig({...config, expiryDate: e.target.value})}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Cpu size={16} /> Hardware Binding
            </label>
            <div className="flex items-center p-3 bg-slate-950 border border-slate-700 rounded-lg justify-between">
              <span className="text-sm text-slate-400">Bind to BIOS/TPM UUID</span>
              <button 
                onClick={() => setConfig({...config, hardwareBinding: !config.hardwareBinding})}
                className={`w-12 h-6 rounded-full transition-colors relative ${config.hardwareBinding ? 'bg-emerald-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${config.hardwareBinding ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              If enabled, this key will become invalid if the hard drive is moved to another motherboard.
            </p>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98]"
          >
            {loading ? 'Generating...' : 'Create Master Key'}
          </button>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <div className="bg-blue-950/30 border border-blue-900/50 p-4 rounded-xl">
            <h3 className="text-blue-400 font-semibold mb-2">Security Architecture</h3>
            <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
              <li>Generates a cryptographically signed license file.</li>
              <li>Integrates with Linux PAM (Pluggable Authentication Modules).</li>
              <li>Prevents login if key validation fails.</li>
              <li>Compatible with Ubuntu 24.04 LTS kernel.</li>
            </ul>
          </div>
          
          <TerminalOutput 
            title="Generated Python Key Generator" 
            content={script} 
            isLoading={loading} 
          />
        </div>
      </div>
    </div>
  );
};