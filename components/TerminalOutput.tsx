import React from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

interface TerminalOutputProps {
  title: string;
  content: string;
  isLoading: boolean;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ title, content, isLoading }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-slate-400">
          <Terminal size={16} />
          <span className="text-xs font-mono font-bold uppercase tracking-wider">{title}</span>
        </div>
        {!isLoading && content && (
          <button 
            onClick={handleCopy}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'COPIED' : 'COPY SCRIPT'}</span>
          </button>
        )}
      </div>
      <div className="p-4 overflow-x-auto min-h-[150px] max-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-3 text-emerald-500/50">
            <div className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
            <span className="text-xs font-mono animate-pulse">GENERATING SECURITY PROTOCOLS...</span>
          </div>
        ) : (
          <pre className="text-xs sm:text-sm font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap">
            {content || "# Waiting for command generation..."}
          </pre>
        )}
      </div>
    </div>
  );
};