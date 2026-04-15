/**
 * Generate a terrain heightmap for the experience page planet.
 * Multi-octave ridged noise + domain warping for geological realism.
 * Output: 2048x1024 grayscale PPM → converted to PNG via sips.
 */
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

const W = 2048;
const H = 1024;

/* ── Permutation table ─────────────────────────────────── */
const perm = new Uint8Array(512);
{
  const base = new Uint8Array(256);
  for (let i = 0; i < 256; i++) base[i] = i;
  let seed = 42;
  for (let i = 255; i > 0; i--) {
    seed = (seed * 16807) % 2147483647;
    const j = seed % (i + 1);
    [base[i], base[j]] = [base[j], base[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = base[i & 255];
}

const grad3 = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
];

function dot3(g, x, y, z) { return g[0]*x + g[1]*y + g[2]*z; }
function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lrp(a, b, t) { return a + t * (b - a); }

function perlin3(x, y, z) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
  const u = fade(x), v = fade(y), w = fade(z);
  const A = perm[X]+Y, AA = perm[A]+Z, AB = perm[A+1]+Z;
  const B = perm[X+1]+Y, BA = perm[B]+Z, BB = perm[B+1]+Z;
  return lrp(
    lrp(lrp(dot3(grad3[perm[AA]%12],x,y,z), dot3(grad3[perm[BA]%12],x-1,y,z), u),
        lrp(dot3(grad3[perm[AB]%12],x,y-1,z), dot3(grad3[perm[BB]%12],x-1,y-1,z), u), v),
    lrp(lrp(dot3(grad3[perm[AA+1]%12],x,y,z-1), dot3(grad3[perm[BA+1]%12],x-1,y,z-1), u),
        lrp(dot3(grad3[perm[AB+1]%12],x,y-1,z-1), dot3(grad3[perm[BB+1]%12],x-1,y-1,z-1), u), v), w);
}

function fbm(x, y, z, oct = 6, lac = 2.0, gain = 0.5) {
  let val = 0, amp = 1, freq = 1, mx = 0;
  for (let i = 0; i < oct; i++) {
    val += perlin3(x*freq, y*freq, z*freq) * amp;
    mx += amp; freq *= lac; amp *= gain;
  }
  return val / mx;
}

function ridged(x, y, z, oct = 5, lac = 2.2, gain = 0.5) {
  let val = 0, amp = 1, freq = 1, weight = 1, mx = 0;
  for (let i = 0; i < oct; i++) {
    let n = perlin3(x*freq, y*freq, z*freq);
    n = 1.0 - Math.abs(n);
    n = n * n * weight;
    weight = Math.min(Math.max(n, 0), 1);
    val += n * amp; mx += amp; freq *= lac; amp *= gain;
  }
  return val / mx;
}

/* ── Generate ──────────────────────────────────────────── */
console.log(`Generating ${W}x${H} terrain heightmap...`);
const t0 = performance.now();

const heights = new Float32Array(W * H);
let min = Infinity, max = -Infinity;

for (let py = 0; py < H; py++) {
  const lat = (py / H) * Math.PI;
  const sinLat = Math.sin(lat);
  const cosLat = Math.cos(lat);

  for (let px = 0; px < W; px++) {
    const lon = (px / W) * Math.PI * 2;
    const x = sinLat * Math.cos(lon);
    const y = cosLat;
    const z = sinLat * Math.sin(lon);

    const wx = fbm(x*1.5+7.3, y*1.5+2.1, z*1.5+5.8, 3) * 0.4;
    const wy = fbm(x*1.5+13.7, y*1.5+9.2, z*1.5+1.4, 3) * 0.4;
    const wz = fbm(x*1.5+3.1, y*1.5+6.5, z*1.5+11.9, 3) * 0.4;

    const broad = fbm(x*1.2+wx, y*1.2+wy, z*1.2+wz, 4, 2.0, 0.55);
    const ridges = ridged(x*2.5+wx, y*2.5+wy, z*2.5+wz, 5, 2.2, 0.5);
    const detail = fbm(x*8.0, y*8.0, z*8.0, 4, 2.5, 0.4);

    let h = broad * 0.45 + ridges * 0.42 + detail * 0.13;

    const crater = fbm(x*3.0+20.0, y*3.0, z*3.0, 3);
    if (crater > 0.3) h -= (crater - 0.3) * 0.22;

    heights[py * W + px] = h;
    if (h < min) min = h;
    if (h > max) max = h;
  }
}

const range = max - min || 1;
const pixels = Buffer.alloc(W * H * 3);
for (let i = 0; i < W * H; i++) {
  const v = Math.round(((heights[i] - min) / range) * 255);
  pixels[i*3] = v;
  pixels[i*3+1] = v;
  pixels[i*3+2] = v;
}

const header = Buffer.from(`P6\n${W} ${H}\n255\n`);
const ppmPath = 'assets/textures/heightmap.ppm';
const pngPath = 'assets/textures/heightmap.png';

writeFileSync(ppmPath, Buffer.concat([header, pixels]));

const elapsed = ((performance.now() - t0) / 1000).toFixed(1);
console.log(`Generated in ${elapsed}s. Converting to PNG...`);

execSync(`sips -s format png "${ppmPath}" --out "${pngPath}" 2>/dev/null`);
execSync(`rm "${ppmPath}"`);

const { statSync } = await import('fs');
const size = (statSync(pngPath).size / 1024).toFixed(0);
console.log(`Done: ${pngPath} (${size}KB)`);
