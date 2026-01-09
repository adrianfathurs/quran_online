const fs = require('fs');
const path = require('path');

// Simple SVG icon for PWA
function createIconSVG(size) {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#0F3D2E"/>
  <text x="50%" y="50%" font-size="${size * 0.5}" text-anchor="middle" dominant-baseline="middle" fill="#D4AF37" font-family="Arial">🕌</text>
</svg>`;
}

// Create icons directory
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate SVG icons (can be converted to PNG)
const sizes = [192, 512];
sizes.forEach(size => {
  const svg = createIconSVG(size);
  fs.writeFileSync(path.join(publicDir, `icon-${size}x${size}.svg`), svg);
  console.log(`Created icon-${size}x${size}.svg`);
});

console.log('\n⚠️  Note: SVG icons created. For full PWA support, convert these to PNG:');
console.log('   - Use online tool: https://svgtopng.com/');
console.log('   - Or use ImageMagick: convert icon-192x192.svg icon-192x192.png');
console.log('   - Place PNG files in public/ folder');
