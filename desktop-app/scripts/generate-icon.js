const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const pngToIco = require('png-to-ico');

async function main() {
  const assetsDir = path.join(__dirname, '..', 'assets');
  const srcPng = path.join(assetsDir, 'icon.png');
  const squarePng = path.join(assetsDir, 'icon.square.png');
  const outIco = path.join(assetsDir, 'icon.ico');

  if (!fs.existsSync(srcPng)) {
    console.error('Source PNG not found:', srcPng);
    process.exit(1);
  }

  // 1) Square-pad the source image so it isn't distorted when resizing to various icon sizes
  const img = await Jimp.read(srcPng);
  const size = Math.max(img.bitmap.width, img.bitmap.height);
  const canvas = new Jimp(size, size, 0x00000000);
  const x = Math.floor((size - img.bitmap.width) / 2);
  const y = Math.floor((size - img.bitmap.height) / 2);
  canvas.composite(img, x, y);
  await canvas.writeAsync(squarePng);

  // 2) Generate multiple sizes required by Windows ICO (avoid 512, keep up to 256 for NSIS compatibility)
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const pngFiles = [];
  for (const s of sizes) {
    const outPng = path.join(assetsDir, `icon.${s}.png`);
    const base = await Jimp.read(squarePng);
    base.resize(s, s, Jimp.RESIZE_BILINEAR);
    await base.writeAsync(outPng);
    pngFiles.push(outPng);
  }

  // 3) Build ICO from the set of PNGs
  const icoBuffer = await pngToIco(pngFiles);
  fs.writeFileSync(outIco, icoBuffer);
  console.log('Generated:', outIco);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
