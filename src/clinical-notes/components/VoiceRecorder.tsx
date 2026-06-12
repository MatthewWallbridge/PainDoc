import { useCallback, useState } from 'react';
import { Mic, MicOff, Trash2 } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

export default function VoiceRecorder({ transcript, onTranscriptChange, onClear }: {
  transcript: string;
  onTranscriptChange: (text: string) => void;
  onClear: () => void;
}) {
  const [volume, setVolume] = useState(0);
  const handleTranscript = useCallback((text: string) => onTranscriptChange(text), [onTranscriptChange]);
  const { listening, supported, start, stop } = useSpeech({ onTranscript: handleTranscript, onVolume: setVolume });
  const toggle = () => listening ? stop() : start(transcript);

  const ringScale   = listening ? 1 + volume * 0.7 : 1;
  const ringOpacity = listening ? 0.2 + volume * 0.6 : 0;

  return (
    <div className="w-full max-w-2xl mb-4 bg-white rounded-2xl border border-[#E2E8E6] p-5 shadow-sm">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 transition-colors ${listening ? 'bg-red-400' : 'bg-[#0B5E47]'}`} />
          <span className="text-[10px] font-bold text-[#9BADA9] uppercase tracking-widest">Dictation</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-mono px-3 py-1 rounded-full border transition-all
            ${listening
              ? 'bg-red-50 text-red-500 border-red-200'
              : 'bg-[#F4F3EF] text-[#9BADA9] border-[#E2E8E6]'}`}>
            {listening ? '● recording' : 'idle'}
          </span>
          {supported && (
            <div className="relative w-10 h-10 flex items-center justify-center">
              {/* Animated ring */}
              <div
                className="absolute inset-0 rounded-full border-2 border-red-400 pointer-events-none"
                style={{ transform: `scale(${ringScale})`, opacity: ringOpacity, transition: 'transform 0.08s ease-out, opacity 0.08s ease-out' }}
              />
              <button
                onClick={toggle}
                title={listening ? 'Stop recording' : 'Start recording'}
                className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all
                  ${listening
                    ? 'border-red-400 bg-red-50 text-red-500 hover:bg-red-100'
                    : 'border-[#0B5E47] bg-[#E6F3EE] text-[#0B5E47] hover:bg-[#D4EDE5]'}`}
              >
                {listening ? <MicOff size={17} /> : <Mic size={17} />}
              </button>
            </div>
          )}
          {transcript && (
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8E6] text-[#9BADA9] hover:text-[#6B7E7A] hover:bg-[#F4F3EF] text-xs transition"
            >
              <Trash2 size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      {!supported && (
        <p className="text-sm text-[#9BADA9] italic mb-3">Voice input not supported in this browser. Try Chrome or Edge.</p>
      )}

      <textarea
        value={transcript}
        onChange={e => onTranscriptChange(e.target.value)}
        placeholder={supported ? 'Press the microphone and start speaking, or type your notes here…' : 'Type your notes here…'}
        spellCheck={false}
        rows={7}
        className="w-full px-4 py-3 rounded-xl border border-[#E2E8E6] bg-[#F9F8F5] text-[#1A2623] text-sm leading-relaxed resize-y focus:outline-none focus:border-[#0B5E47] focus:ring-2 focus:ring-[#0B5E47]/10 transition placeholder:text-[#C5D4D0]"
        style={{ fontFamily: 'Georgia, serif' }}
      />
    </div>
  );
}
