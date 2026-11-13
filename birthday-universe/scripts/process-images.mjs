import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function processHippoImage() {
  const inputPath = 'public/images/hippo/hippo-main.jpg';
  const outputPath = 'public/images/hippo/hippo-transparent.png';

  console.log('Loading hippo image...');
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  // Get raw RGBA buffer
  const rawBuffer = await image.ensureAlpha().raw().toBuffer();

  // Flood fill / background detection from corners
  // Corner pixels are white/light-grey background: (240-255, 235-255, 235-255)
  // Hippo body is distinct pink/magenta/purple (#D86090, #F080A8, etc.) or dark mouth/eyes/bow
  // Let's create an alpha mask buffer
  const totalPixels = width * height;
  const isBg = new Uint8Array(totalPixels);
  const queue = [];

  function getPixel(x, y) {
    const idx = (y * width + x) * 4;
    return [rawBuffer[idx], rawBuffer[idx + 1], rawBuffer[idx + 2], rawBuffer[idx + 3]];
  }

  function isBackgroundPixel(r, g, b) {
    // Background is near white/light grey studio background
    // Pure or near white: r > 220, g > 215, b > 215 and difference between r,g,b is small (grayish/neutral)
    const maxDiff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
    const brightness = (r + g + b) / 3;

    // Very bright neutral color
    if (brightness > 230 && maxDiff < 30) return true;
    if (brightness > 215 && maxDiff < 18) return true;
    if (brightness > 190 && maxDiff < 12 && r < 210 && g < 210 && b < 210) {
      // Light shadow on the floor (neutral gray)
      return true;
    }
    return false;
  }

  // Seed boundary flood fill from top, left, right, and top corners
  for (let x = 0; x < width; x++) {
    queue.push(x, 0);
    queue.push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    queue.push(0, y);
    queue.push(width - 1, y);
  }

  // BFS flood fill
  const visited = new Uint8Array(totalPixels);
  let head = 0;

  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];
    const idx = y * width + x;

    if (visited[idx]) continue;
    visited[idx] = 1;

    const [r, g, b] = getPixel(x, y);

    if (isBackgroundPixel(r, g, b)) {
      isBg[idx] = 1;

      // Check 4 neighbors
      if (x > 0 && !visited[idx - 1]) queue.push(x - 1, y);
      if (x < width - 1 && !visited[idx + 1]) queue.push(x + 1, y);
      if (y > 0 && !visited[idx - width]) queue.push(x, y - 1);
      if (y < height - 1 && !visited[idx + width]) queue.push(x, y + 1);
    }
  }

  // Now create output buffer with feathered / anti-aliased transparency
  const outBuffer = Buffer.from(rawBuffer);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const bufIdx = idx * 4;

      if (isBg[idx]) {
        outBuffer[bufIdx + 3] = 0; // Completely transparent
      } else {
        // Check if adjacent to background for edge feathering/smoothing
        let bgNeighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (isBg[ny * width + nx]) bgNeighbors++;
            }
          }
        }

        if (bgNeighbors > 0) {
          // Feather alpha
          const alphaFactor = 1 - (bgNeighbors / 9) * 0.7;
          outBuffer[bufIdx + 3] = Math.round(255 * alphaFactor);
        } else {
          outBuffer[bufIdx + 3] = 255;
        }
      }
    }
  }

  // Save the refined transparent hippo
  await sharp(outBuffer, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outputPath);

  console.log(`Saved refined transparent hippo to ${outputPath}`);

  // Create cards for Hippo Matching Game:
  // Card A: Pink Hippo with Party Hat
  // Card B: Lavender Hippo with Heart
  // Card C: Baby Blue Hippo with Balloon
  console.log('Generating game cards...');

  // Base hippo resized for cards (400x400)
  const hippoResized = await sharp(outputPath)
    .resize(320, 320, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // SVG overlays:
  // 1. Party Hat overlay (colorful striped hat on head)
  const partyHatSvg = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFD700" />
          <stop offset="50%" stop-color="#FF69B4" />
          <stop offset="100%" stop-color="#9370DB" />
        </linearGradient>
      </defs>
      <!-- Party Hat positioned on top right head near bow -->
      <polygon points="210,12 180,95 245,85" fill="url(#hatGrad)" stroke="#FFF" stroke-width="2"/>
      <circle cx="210" cy="12" r="10" fill="#FFF" />
      <circle cx="210" cy="12" r="6" fill="#FFD700" />
      <path d="M185,75 Q210,65 240,68" stroke="#FFF" stroke-width="4" fill="none"/>
      <path d="M190,52 Q210,45 230,48" stroke="#FFE4E1" stroke-width="4" fill="none"/>
      <path d="M197,32 Q210,28 223,30" stroke="#FFF" stroke-width="4" fill="none"/>
    </svg>
  `;

  // 2. Big Glowing Heart in hands
  const heartSvg = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="heartGrad" cx="30%" cy="30%">
          <stop offset="0%" stop-color="#FF6B9E" />
          <stop offset="100%" stop-color="#D9206A" />
        </radialGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <!-- Heart on belly/hands area -->
      <path d="M200,240 C175,190 120,205 120,250 C120,290 200,340 200,340 C200,340 280,290 280,250 C280,205 225,190 200,240 Z"
            fill="url(#heartGrad)" filter="url(#glow)" stroke="#FFF" stroke-width="3" />
      <ellipse cx="160" cy="235" rx="15" ry="8" fill="#FFF" opacity="0.6" transform="rotate(-30 160 235)" />
    </svg>
  `;

  // 3. Birthday Balloon tied to hand
  const balloonSvg = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="balloonGrad" cx="35%" cy="30%">
          <stop offset="0%" stop-color="#A0E9FF" />
          <stop offset="70%" stop-color="#00A8FF" />
          <stop offset="100%" stop-color="#0066CC" />
        </radialGradient>
      </defs>
      <!-- Balloon floating above right hand -->
      <path d="M310,215 Q295,140 315,80" stroke="#FFF" stroke-width="2.5" fill="none" stroke-dasharray="4,2"/>
      <ellipse cx="315" cy="65" rx="36" ry="44" fill="url(#balloonGrad)" />
      <polygon points="315,108 308,118 322,118" fill="#0066CC" />
      <ellipse cx="304" cy="52" rx="10" ry="16" fill="#FFF" opacity="0.6" transform="rotate(-20 304 52)" />
    </svg>
  `;

  // Combine background card + hippo + overlays for 3 cards
  // Hippo A: Party Hat
  await sharp({
    create: {
      width: 400,
      height: 400,
      channels: 4,
      background: { r: 255, g: 240, b: 247, alpha: 1 }
    }
  })
  .composite([
    { input: hippoResized, top: 40, left: 40 },
    { input: Buffer.from(partyHatSvg), top: 0, left: 0 }
  ])
  .png()
  .toFile('public/images/hippo/hippo-card-a.png');

  // Hippo B: Lavender tint + Heart
  // Tint hippo towards lavender
  const lavenderHippo = await sharp(hippoResized)
    .tint({ r: 216, g: 180, b: 240 })
    .toBuffer();

  await sharp({
    create: {
      width: 400,
      height: 400,
      channels: 4,
      background: { r: 243, g: 236, b: 255, alpha: 1 }
    }
  })
  .composite([
    { input: lavenderHippo, top: 40, left: 40 },
    { input: Buffer.from(heartSvg), top: 0, left: 0 }
  ])
  .png()
  .toFile('public/images/hippo/hippo-card-b.png');

  // Hippo C: Baby blue tint + Balloon
  const blueHippo = await sharp(hippoResized)
    .tint({ r: 170, g: 215, b: 255 })
    .toBuffer();

  await sharp({
    create: {
      width: 400,
      height: 400,
      channels: 4,
      background: { r: 235, g: 247, b: 255, alpha: 1 }
    }
  })
  .composite([
    { input: blueHippo, top: 40, left: 40 },
    { input: Buffer.from(balloonSvg), top: 0, left: 0 }
  ])
  .png()
  .toFile('public/images/hippo/hippo-card-c.png');

  console.log('All hippo images and matching game cards generated successfully!');
}

processHippoImage().catch(console.error);

