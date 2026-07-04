import { useState } from 'react';
import { KeyRound, Eye, EyeOff } from 'lucide-react';

export default function ApiKeyInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="w-full max-w-2xl mb-4 bg-white rounded-2xl border border-[#CCFBF1] p-5 shadow-[0_2px_10px_rgba(8,145,178,0.06)]">
      <div className="flex items-center gap-2 mb-3">
        <KeyRound size={13} className="text-[#94A3B8]" />
        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Anthropic API Key</span>
      </div>
      <div className="flex gap-2 items-center">
        <input
          type={show ? 'text' : 'password'}
          placeholder="sk-ant-…"
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          className="flex-1 px-3 py-2.5 rounded-xl border border-[#CCFBF1] bg-[#F0FDFA] text-[#134E4A] text-sm font-mono focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/10 transition"
        />
        <button
          onClick={() => setShow(v => !v)}
          className="p-2.5 rounded-xl border border-[#CCFBF1] text-[#94A3B8] hover:text-[#134E4A] hover:bg-[#F0FDFA] transition"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <p className="text-[11px] text-[#94A3B8] mt-2">Stored in this browser only — never sent to our servers.</p>
    </div>
  );
}
