import sharp from 'sharp';
import fs from 'fs';

async function generateMemoryPlaceholders() {
  const memories = [
    { title: 'The Unforgettable Day', subtitle: 'Summer 2024', color1: '#FF9A8B', color2: '#FF6A88' },
    { title: 'Our Random Adventures', subtitle: 'Roadtrip Fun', color1: '#A18CD1', color2: '#FBC2EB' },
    { title: 'Too Much Laughter', subtitle: 'Café Hangouts', color1: '#84FAB0', color2: '#8FD3F4' },
    { title: 'Favourite Memory', subtitle: 'Stargazing Night', color1: '#F6D365', color2: '#FDA085' },
    { title: 'Wish to Relive', subtitle: 'Beach Sunset', color1: '#FBC2EB', color2: '#A6C1EE' },
    { title: 'Making Memories', subtitle: 'Best Friends Forever', color1: '#FCCB90', color2: '#D57EEB' }
  ];

  for (let i = 0; i < memories.length; i++) {
    const m = memories[i];
    const svg = `
      <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g${i}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${m.color1}" />
            <stop offset="100%" stop-color="${m.color2}" />
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#g${i})" rx="24" />
        <circle cx="300" cy="240" r="110" fill="white" opacity="0.25" />
        <!-- Camera Icon / Sparkles -->
        <path d="M260,200 L275,180 L325,180 L340,200 L370,200 C378,200 385,207 385,215 L385,280 C385,288 378,295 370,295 L230,295 C222,295 215,288 215,280 L215,215 C215,207 222,200 230,200 Z" fill="white" opacity="0.85" />
        <circle cx="300" cy="248" r="30" fill="none" stroke="white" stroke-width="8" opacity="0.85" />
        <text x="300" y="420" font-family="'Playfair Display', Georgia, serif" font-size="34" font-weight="bold" fill="white" text-anchor="middle" letter-spacing="1">${m.title}</text>
        <text x="300" y="465" font-family="'Montserrat', sans-serif" font-size="20" fill="white" opacity="0.9" text-anchor="middle" letter-spacing="3">${m.subtitle}</text>
        <text x="300" y="520" font-family="sans-serif" font-size="28" fill="white" opacity="0.8" text-anchor="middle">✨ ♡ ✨</text>
      </svg>
    `;

    await sharp(Buffer.from(svg))
      .png()
      .toFile(`public/images/memories/memory-${i + 1}.jpg`);
  }

  console.log('Generated 6 memory photos!');
}

generateMemoryPlaceholders().catch(console.error);

