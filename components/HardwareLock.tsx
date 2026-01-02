import React, { useState } from 'react';
import { generateHardwareLockScript } from '../services/geminiService';
import { TerminalOutput } from './TerminalOutput';
import { Cpu, Lock, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const HardwareLock: React.FC = () => {
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSeal = async () => {
    setLoading(true);
    const res = await generateHardwareLockScript();
    setScript(res);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Cpu className="text-orange-500" />
          Hardware Root of Trust
        </h2>
        <p className="text-slate-400 mt-1">Bind the OS to this specific motherboard and TPM. Disk swaps will fail to boot.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-slate-200 font-semibold mb-4">Device Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-slate-400 text-sm">Secure Boot</span>
              <span className="text-emerald-500 flex items-center gap-1 text-sm font-bold"><CheckCircle2 size={14} /> ENABLED</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-slate-400 text-sm">TPM 2.0 Module</span>
              <span className="text-emerald-500 flex items-center gap-1 text-sm font-bold"><CheckCircle2 size={14} /> DETECTED</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-slate-400 text-sm">PCR 7 (Secure Boot)</span>
              <span className="text-emerald-500 flex items-center gap-1 text-sm font-bold"><CheckCircle2 size={14} /> MATCHED</span>
            </div>
             <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Disk Encryption (LUKS)</span>
              <span className="text-amber-500 flex items-center gap-1 text-sm font-bold"><ShieldAlert size={14} /> UNBOUND</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-950/30 to-slate-900 border border-orange-900/30 p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-orange-200 font-semibold mb-2">Seal System to Hardware</h3>
            <p className="text-orange-200/60 text-sm">
              This action uses <code>tpm2-seal</code> to generate a decryption key derived from the BIOS firmware signature and motherboard UUID. 
            </p>
            <p className="text-red-400 text-xs mt-4 border border-red-900/50 bg-red-950/20 p-2 rounded">
              WARNING: If the motherboard dies or BIOS is updated without suspending BitLocker/LUKS, data may be unrecoverable.
            </p>
          </div>
          <button 
            onClick={handleSeal}
            disabled={loading}
            className="mt-6 w-full bg-orange-700 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Lock size={18} /> {loading ? 'Computing PCRs...' : 'SEAL SYSTEM NOW'}
          </button>
        </div>
      </div>

      <TerminalOutput 
        title="TPM 2.0 Sealing Script" 
        content={script} 
        isLoading={loading} 
      />
    </div>
  );
};