import React, { useState } from 'react';
import { generateSecurityScript } from '../services/geminiService';
import { TerminalOutput } from './TerminalOutput';
import { Database, Download, Upload, Shield, Key } from 'lucide-react';

export const DatabaseOps: React.FC = () => {
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: 'backup' | 'import' | 'encrypt') => {
    setLoading(true);
    let prompt = "";
    if (action === 'backup') {
      prompt = "Generate a secure mysqldump script. It should: 1) Dump all databases. 2) Compress with gzip. 3) Encrypt the backup file using OpenSSL AES-256 with a timestamped filename. 4) Save to /var/secure_backups/.";
    } else if (action === 'import') {
      prompt = "Generate a script to: 1) Decrypt a specific AES-256 encrypted SQL backup. 2) Drop existing tables (safe mode). 3) Import the SQL dump into MySQL. 4) Flush privileges.";
    } else if (action === 'encrypt') {
      prompt = "Generate instructions to enable 'Data at Rest Encryption' (TDE) for MySQL/MariaDB on Ubuntu 24.04. Include steps to generate keyring files, modify my.cnf, and restart the service securely.";
    }
    
    const res = await generateSecurityScript(prompt);
    setScript(res);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
       <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Database className="text-purple-500" />
          Database Fortress
        </h2>
        <p className="text-slate-400 mt-1">Secure MySQL operations: Backup, Restore, and Transparent Data Encryption.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button 
          onClick={() => handleAction('backup')}
          className="group relative p-6 bg-slate-900 border border-slate-700 hover:border-purple-500 rounded-xl transition-all hover:shadow-lg hover:shadow-purple-900/20 text-left"
        >
          <div className="absolute top-4 right-4 bg-slate-800 p-2 rounded-lg group-hover:bg-purple-900/30 transition-colors">
            <Download className="text-purple-400" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-200 mt-4">Secure Backup</h3>
          <p className="text-sm text-slate-500 mt-2">Dump, Zip, and Encrypt via AES-256.</p>
        </button>

        <button 
          onClick={() => handleAction('import')}
          className="group relative p-6 bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-900/20 text-left"
        >
           <div className="absolute top-4 right-4 bg-slate-800 p-2 rounded-lg group-hover:bg-blue-900/30 transition-colors">
            <Upload className="text-blue-400" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-200 mt-4">Safe Restore</h3>
          <p className="text-sm text-slate-500 mt-2">Decrypt and import to production.</p>
        </button>

         <button 
          onClick={() => handleAction('encrypt')}
          className="group relative p-6 bg-slate-900 border border-slate-700 hover:border-emerald-500 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-900/20 text-left"
        >
           <div className="absolute top-4 right-4 bg-slate-800 p-2 rounded-lg group-hover:bg-emerald-900/30 transition-colors">
            <Shield className="text-emerald-400" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-200 mt-4">TDE Encryption</h3>
          <p className="text-sm text-slate-500 mt-2">Encrypt tablespace at rest (Keyring).</p>
        </button>
      </div>

      <div className="bg-purple-950/20 border border-purple-500/30 p-4 rounded-lg flex items-start gap-3 mb-6">
        <Key className="text-purple-400 shrink-0 mt-1" size={18} />
        <div>
           <h4 className="text-purple-200 font-medium text-sm">Access Control Policy</h4>
           <p className="text-purple-300/60 text-xs mt-1">
             These operations ensure that without the "System Key", the raw database files on the disk are unreadable (via TDE) and backups are useless (via AES encryption).
           </p>
        </div>
      </div>

      <TerminalOutput 
        title="MySQL Security Procedure" 
        content={script} 
        isLoading={loading} 
      />
    </div>
  );
};