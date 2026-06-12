import { useCallback, useState } from 'react'
import { Mic, MicOff, Trash2 } from 'lucide-react'
import { useSpeech } from '../hooks/useSpeech'

export default function VoiceRecorder({ transcript, onTranscriptChange, onClear }) {
  const [volume, setVolume] = useState(0)

  const handleTranscript = useCallback((text) => {
    onTranscriptChange(text)
  }, [onTranscriptChange])

  const { listening, supported, start, stop } = useSpeech({
    onTranscript: handleTranscript,
    onVolume: setVolume,
  })

  const toggle = () => listening ? stop() : start(transcript)

  const ringScale = listening ? 1 + volume * 0.7 : 1
  const ringOpacity = listening ? 0.2 + volume * 0.6 : 0

  const s = {
    card: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '1.25rem',
      width: '100%',
      maxWidth: 720,
      marginBottom: '1rem',
    },
    topRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.75rem',
    },
    label: {
      fontSize: '0.68rem',
      fontFamily: 'Courier New, monospace',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--text-hint)',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
    dot: {
      width: 6, height: 6, borderRadius: '50%',
      background: listening ? '#E24B4A' : 'var(--accent)',
      display: 'inline-block',
      transition: 'background 0.2s',
    },
    controls: { display: 'flex', gap: 8, alignItems: 'center' },
    micWrap: {
      position: 'relative',
      width: 44,
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    ring: {
      position: 'absolute',
      inset: -6,
      borderRadius: '50%',
      border: '2px solid #E24B4A',
      transform: `scale(${ringScale})`,
      opacity: ringOpacity,
      transition: 'transform 0.08s ease-out, opacity 0.08s ease-out',
      pointerEvents: 'none',
    },
    ring2: {
      position: 'absolute',
      inset: -12,
      borderRadius: '50%',
      border: '1.5px solid #E24B4A',
      transform: `scale(${1 + volume * 0.5})`,
      opacity: listening ? volume * 0.3 : 0,
      transition: 'transform 0.12s ease-out, opacity 0.12s ease-out',
      pointerEvents: 'none',
    },
    micBtn: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      border: `2px solid ${listening ? '#E24B4A' : 'var(--accent)'}`,
      background: listening ? '#FCEBEB' : 'var(--accent-light)',
      color: listening ? '#E24B4A' : 'var(--accent)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      position: 'relative',
      zIndex: 1,
    },
    clearBtn: {
      background: 'none',
      border: '1px solid var(--border-md)',
      borderRadius: 'var(--radius-sm)',
      padding: '6px 10px',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontSize: '0.78rem',
      fontFamily: 'Courier New, monospace',
    },
    statusBadge: {
      fontSize: '0.7rem',
      fontFamily: 'Courier New, monospace',
      padding: '3px 10px',
      borderRadius: 99,
      background: listening ? '#FCEBEB' : 'var(--surface2)',
      color: listening ? '#A32D2D' : 'var(--text-hint)',
      border: `1px solid ${listening ? '#F09595' : 'var(--border)'}`,
      letterSpacing: '0.08em',
    },
    textarea: {
      width: '100%',
      background: 'var(--surface2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: '0.9rem 1rem',
      fontFamily: 'Georgia, serif',
      fontSize: '0.95rem',
      color: transcript ? 'var(--text)' : 'var(--text-hint)',
      resize: 'vertical',
      minHeight: 160,
      lineHeight: 1.65,
      outline: 'none',
    },
  }

  return (
    <div style={s.card}>
      <div style={s.topRow}>
        <div style={s.label}><span style={s.dot} />Dictation</div>
        <div style={s.controls}>
          <span style={s.statusBadge}>{listening ? '● recording' : 'idle'}</span>
          {supported && (
            <div style={s.micWrap}>
              <div style={s.ring} />
              <div style={s.ring2} />
              <button style={s.micBtn} onClick={toggle} title={listening ? 'Stop' : 'Start recording'}>
                {listening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            </div>
          )}
          {transcript && (
            <button style={s.clearBtn} onClick={onClear}>
              <Trash2 size={13} /> Clear
            </button>
          )}
        </div>
      </div>
      {!supported && (
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem 0' }}>
          Voice input not supported in this browser. Try Chrome or Edge.
        </div>
      )}
      <textarea
        style={s.textarea}
        value={transcript}
        onChange={e => onTranscriptChange(e.target.value)}
        placeholder={supported ? 'Press the mic and start speaking — or type your notes here…' : 'Type your notes here…'}
        spellCheck={false}
      />
    </div>
  )
}
