import React, { useState } from 'react';
import { generateSecurityScript } from '../services/geminiService';
import { TerminalOutput } from './TerminalOutput';
import { HardDrive, FolderLock, FileKey, Shield } from 'lucide-react';
import { Drive } from '../types';

const MOCK_DRIVES: Drive[] = [
  { device: '/dev/nvme0n1p1', mount: '/', size: '480GB', encrypted: true, uuid: 'a1b2-c3d4' },
  { device: '/dev/sda1', mount: '/data', size: '2TB', encrypted: false, uuid: 'e5f6-g7h8' },
];

export const DiskEncryption: React.FC = () => {
  const [selectedDrive, setSelectedDrive] = useState<string | null>(null);
  const [targetPath, setTargetPath] = useState('');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  const encryptDrive = async () => {
    if (!selectedDrive) return;
    setLoading(true);
    const prompt = `Generate a script to encrypt partition ${selectedDrive} using LUKS (Linux Unified Key Setup). Ensure it formats with ext4 after encryption, updates /etc/crypttab, and mounts automatically on boot via a keyfile stored in /root/keys/.`;
    const res = await generateSecurityScript(prompt);
    setScript(res);
    setLoading(false);
  };

  const encryptFolder = async () => {
    if (!targetPath) return;
    setLoading(true);
    const prompt = `Generate a script to encrypt the directory '${targetPath}' using 'fscrypt' or 'ecryptfs' on Ubuntu 24.04. Create a specific user key for this directory so only the owner can read contents.`;
    const res = await generateSecurityScript(prompt);
    setScript(res);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <HardDrive className="text-cyan-500" />
          Storage Encryption
        </h2>
        <p className="text-slate-400 mt-1">Manage Full Disk Encryption (LUKS) and Directory-level sealing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Drive Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Shield size={18} className="text-cyan-500"/> Physical Disks
          </h3>
          <div className="space-y-3 mb-6">
            {MOCK_DRIVES.map(drive => (
              <div 
                key={drive.device}
                onClick={() => !drive.encrypted && setSelectedDrive(drive.device)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center ${
                  selectedDrive === drive.device 
                    ? 'bg-cyan-900/30 border-cyan-500' 
                    : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                } ${drive.encrypted ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <div>
                  <div className="text-sm font-mono text-slate-300">{drive.device}</div>
                  <div className="text-xs text-slate-500">{drive.size} • Mount: {drive.mount}</div>
                </div>
                <div>
                  {drive.encrypted ? (
                    <span className="text-xs bg-emerald-900 text-emerald-400 px-2 py-1 rounded flex items-center gap-1">
                      <Lock size={10} /> LUKS
                    </span>
                  ) : (
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">RAW</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={encryptDrive}
            disabled={!selectedDrive || loading}
            className="w-full bg-cyan-700 disabled:bg-slate-800 disabled:text-slate-600 hover:bg-cyan-600 text-white py-2 rounded-lg font-medium transition-colors"
          >
            Encrypt Selected Drive
          </button>
        </div>

        {/* Directory Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <FolderLock size={18} className="text-pink-500"/> Directory Seal
          </h3>
          <div className="space-y-4">
             <div>
               <label className="text-sm text-slate-400 mb-1 block">Target Path</label>
               <div className="relative">
                 <input 
                  type="text" 
                  value={targetPath}
                  onChange={(e) => setTargetPath(e.target.value)}
                  placeholder="/home/secure_project"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:border-pink-500 outline-none"
                 />
                 <FileKey size={16} className="absolute left-3 top-3 text-slate-600"/>
               </div>
             </div>
             <p className="text-xs text-slate-500">
               Uses fscrypt to encrypt this specific folder. Even root cannot read files without the user's login key.
             </p>
             <button 
               onClick={encryptFolder}
               disabled={!targetPath || loading}
               className="w-full bg-pink-700 disabled:bg-slate-800 disabled:text-slate-600 hover:bg-pink-600 text-white py-2 rounded-lg font-medium transition-colors"
             >
               Encrypt Directory
             </button>
          </div>
        </div>
      </div>

      <TerminalOutput 
        title="Encryption Command Sequence" 
        content={script} 
        isLoading={loading} 
      />
    </div>
  );
};