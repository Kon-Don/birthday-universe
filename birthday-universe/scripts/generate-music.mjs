import fs from 'fs';

function generateWav(filename, melody) {
  const sampleRate = 44100;
  const bpm = 120;
  const beatDuration = 60 / bpm;
  
  // Calculate total samples
  let totalDuration = 0;
  melody.forEach(note => {
    totalDuration += note.duration * beatDuration;
  });
  
  const totalSamples = Math.floor(sampleRate * totalDuration);
  const buffer = Buffer.alloc(44 + totalSamples * 2);
  
  // WAV Header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + totalSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // PCM format
  buffer.writeUInt16LE(1, 22);  // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
  buffer.writeUInt16LE(2, 32);  // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample
  buffer.write('data', 36);
  buffer.writeUInt32LE(totalSamples * 2, 40);
  
  let sampleIndex = 0;
  melody.forEach(note => {
    const noteSamples = Math.floor(sampleRate * (note.duration * beatDuration));
    const freq = note.freq;
    for (let i = 0; i < noteSamples; i++) {
      if (sampleIndex >= totalSamples) break;
      let val = 0;
      if (freq > 0) {
        const t = i / sampleRate;
        // Bell/chime envelope with gentle harmonic
        const env = Math.exp(-3 * (i / noteSamples));
        val = (Math.sin(2 * Math.PI * freq * t) * 0.7 + Math.sin(4 * Math.PI * freq * t) * 0.3) * env;
      }
      const sample = Math.max(-1, Math.min(1, val)) * 32767 * 0.4;
      buffer.writeInt16LE(Math.floor(sample), 44 + sampleIndex * 2);
      sampleIndex++;
    }
  });
  
  fs.writeFileSync(filename, buffer);
  console.log(`Saved ${filename}`);
}

// Frequencies (C4 to C6)
const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25;

// Track 1: Happy Birthday theme chimes
const happyBirthday = [
  { freq: C4, duration: 0.75 }, { freq: C4, duration: 0.25 }, { freq: D4, duration: 1 },
  { freq: C4, duration: 1 }, { freq: F4, duration: 1 }, { freq: E4, duration: 2 },
  { freq: C4, duration: 0.75 }, { freq: C4, duration: 0.25 }, { freq: D4, duration: 1 },
  { freq: C4, duration: 1 }, { freq: G4, duration: 1 }, { freq: F4, duration: 2 },
  { freq: C4, duration: 0.75 }, { freq: C4, duration: 0.25 }, { freq: C5, duration: 1 },
  { freq: A4, duration: 1 }, { freq: F4, duration: 1 }, { freq: E4, duration: 1 }, { freq: D4, duration: 2 }
];

// Track 2: Sweet dreamy lullaby
const dreamyChimes = [
  { freq: E4, duration: 1 }, { freq: G4, duration: 1 }, { freq: C5, duration: 2 },
  { freq: B4, duration: 1 }, { freq: A4, duration: 1 }, { freq: G4, duration: 2 },
  { freq: A4, duration: 1 }, { freq: C5, duration: 1 }, { freq: E4, duration: 2 },
  { freq: D4, duration: 2 }, { freq: C4, duration: 2 }
];

// Track 3: Joyful celebratory melody
const joyfulMoments = [
  { freq: C4, duration: 0.5 }, { freq: E4, duration: 0.5 }, { freq: G4, duration: 1 },
  { freq: C5, duration: 1 }, { freq: B4, duration: 0.5 }, { freq: A4, duration: 0.5 },
  { freq: G4, duration: 2 }, { freq: F4, duration: 1 }, { freq: E4, duration: 1 },
  { freq: D4, duration: 1 }, { freq: C4, duration: 2 }
];

generateWav('public/music/track1.mp3', happyBirthday);
generateWav('public/music/track2.mp3', dreamyChimes);
generateWav('public/music/track3.mp3', joyfulMoments);

