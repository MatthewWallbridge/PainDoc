import { useState, useRef, useCallback } from 'react';

interface UseSpeechOptions {
  onTranscript: (text: string) => void;
  onVolume: (vol: number) => void;
}

export function useSpeech({ onTranscript, onVolume }: UseSpeechOptions) {
  const [listening, setListening] = useState(false);
  const [supported] = useState(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);
  const fullTranscriptRef = useRef('');
  const onTranscriptRef = useRef(onTranscript);
  const onVolumeRef = useRef(onVolume);
  const shouldListenRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  onTranscriptRef.current = onTranscript;
  onVolumeRef.current = onVolume;

  const startAudioAnalyser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.6;
      analyserRef.current = analyser;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        if (!shouldListenRef.current) return;
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        const vol = Math.min(avg / 40, 1);
        onVolumeRef.current?.(vol);
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (_) {}
  }, []);

  const stopAudioAnalyser = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    streamRef.current = null;
    onVolumeRef.current?.(0);
  }, []);

  const createRecognition = useCallback((existingText?: string) => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-NZ';
    recognition.maxAlternatives = 1;

    if (existingText !== undefined) {
      fullTranscriptRef.current = existingText;
    }

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          final += t;
        } else {
          interim += t;
        }
      }
      if (final) fullTranscriptRef.current += final + ' ';
      onTranscriptRef.current(fullTranscriptRef.current + interim);
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === 'not-allowed') {
        shouldListenRef.current = false;
        setListening(false);
        stopAudioAnalyser();
      }
    };

    recognition.onend = () => {
      if (shouldListenRef.current) {
        try {
          const next = createRecognition();
          recognitionRef.current = next;
          next.start();
        } catch (_) {
          shouldListenRef.current = false;
          setListening(false);
          stopAudioAnalyser();
        }
      } else {
        setListening(false);
      }
    };

    return recognition;
  }, [stopAudioAnalyser]);

  const start = useCallback((existingText = '') => {
    if (!supported) return;
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
    }
    shouldListenRef.current = true;
    const recognition = createRecognition(existingText);
    recognitionRef.current = recognition;
    recognition.start();
    startAudioAnalyser();
    setListening(true);
  }, [supported, createRecognition, startAudioAnalyser]);

  const stop = useCallback(() => {
    shouldListenRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    stopAudioAnalyser();
    setListening(false);
  }, [stopAudioAnalyser]);

  return { listening, supported, start, stop };
}
