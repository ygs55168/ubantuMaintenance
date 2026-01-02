import React, { useState } from 'react';
import { SystemUser } from '../types';
import { generateSecurityScript } from '../services/geminiService';
import { TerminalOutput } from './TerminalOutput';
import { Users, AlertTriangle, RefreshCw, UserX } from 'lucide-react';

const MOCK_USERS: SystemUser[] = [
  { id: 1, username: 'root', uid: 0, group: 'root', lastLogin: '2023-10-27 10:42', status: 'active' },
  { id: 2, username: 'admin', uid: 1000, group: 'sudo', lastLogin: '2023-10-26 14:20', status: 'active' },
  { id: 3, username: 'guest', uid: 1001, group: 'users', lastLogin: 'Never', status: 'risk' },
  { id: 4, username: 'deploy', uid: 1002, group: 'www-data', lastLogin: '2023-09-01', status: 'locked' },
];

export const UserSecurity: React.FC = () => {
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  const rotatePasswords = async () => {
    setLoading(true);
    const prompt = "Generate a script to force password rotation for ALL users with UID >= 1000. Also generate a random strong password for the root user and 'mysql' root user. Output the new credentials to a secured file /root/new_creds.txt only readable by root.";
    const res = await generateSecurityScript(prompt);
    setScript(res);
    setLoading(false);
  };

  const lockUnauthorized = async () => {
    setLoading(true);
    const prompt = "Generate a script to audit /etc/passwd. Lock ALL users that are not in the 'sudo' group or verified list. Kill all active SSH sessions for these users immediately.";
    const res = await generateSecurityScript(prompt);
    setScript(res);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
       <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="text-blue-500" />
            User Access Control
          </h2>
          <p className="text-slate-400 mt-1">Audit users, rotate credentials, and enforce lockout policies.</p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={rotatePasswords}
            className="flex items-center gap-2 bg-amber-700/80 hover:bg-amber-600 text-amber-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} /> Rotate All Passwords
          </button>
           <button 
            onClick={lockUnauthorized}
            className="flex items-center gap-2 bg-red-900/80 hover:bg-red-700 text-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <UserX size={16} /> Lock Unauthorized
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Username</th>
              <th className="p-4 font-medium">UID</th>
              <th className="p-4 font-medium">Group</th>
              <th className="p-4 font-medium">Last Login</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {MOCK_USERS.map(user => (
              <tr key={user.id} className="text-slate-300 hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-mono">{user.username}</td>
                <td className="p-4 text-slate-500">{user.uid}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">{user.group}</span>
                </td>
                <td className="p-4 text-sm">{user.lastLogin}</td>
                <td className="p-4">
                  {user.status === 'active' && <span className="text-emerald-500 text-xs font-bold px-2 py-1 bg-emerald-500/10 rounded-full">ACTIVE</span>}
                  {user.status === 'locked' && <span className="text-slate-500 text-xs font-bold px-2 py-1 bg-slate-500/10 rounded-full">LOCKED</span>}
                  {user.status === 'risk' && (
                    <span className="flex items-center gap-1 text-amber-500 text-xs font-bold px-2 py-1 bg-amber-500/10 rounded-full w-fit">
                      <AlertTriangle size={12} /> RISK
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TerminalOutput 
        title="Access Control Operation Script" 
        content={script} 
        isLoading={loading} 
      />
    </div>
  );
};