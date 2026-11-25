// Static halftone band: white above, #1b1b1b below, a ragged dotted front between.
// Tiles seamlessly on x (every wave divides the column count).
const cell = 10, cols = 60, rows = 16, W = cols * cell, H = rows * cell, edge = 2.5;
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const hash = (r, c) => { const s = Math.sin(r * 127.1 + c * 311.7) * 43758.5453; return s - Math.floor(s); };
let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice"><g fill="#1b1b1b">`;
for (let r = 0; r < rows; r++) {
  const t = (r + 0.5) / rows;
  const cov = [];
  for (let c = 0; c < cols; c++) {
    let f = t - 0.5
      + 0.07 * (0.55 * Math.sin((2 * Math.PI * c) / 20 + r * 0.5) + 0.3 * Math.sin((2 * Math.PI * c) / 12 + 1.7) + 0.15 * Math.sin((2 * Math.PI * c) / 6 + r))
      + 0.16 * (hash(r, c) - 0.5);
    let v = smooth(-0.38, 0.38, f);
    if (r < edge) v = 0;
    if (r >= rows - edge) v = 1;
    cov.push(v);
  }
  if (cov.every((v) => v >= 0.93)) { out += `<rect x="0" y="${r * cell}" width="${W}" height="${cell}"/>`; continue; }
  cov.forEach((v, c) => {
    if (v < 0.02) return;
    if (v >= 0.85) { out += `<rect x="${c * cell}" y="${r * cell}" width="${cell}" height="${cell}"/>`; return; } const rad = +(Math.sqrt(v) * cell * 0.62).toFixed(2);
    out += `<circle cx="${c * cell + cell / 2}" cy="${r * cell + cell / 2}" r="${rad}"/>`;
  });
}
out += `</g></svg>\n`;
process.stdout.write(out);
