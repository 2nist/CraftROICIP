const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const pngToIco = require('png-to-ico');

async function main() {
  const assetsDir = path.join(__dirname, '..', 'assets');
  const srcPng = path.join(assetsDir, 'icon.png');
  const squarePng = path.join(assetsDir, 'icon.square.png');
  const resizedPng = path.join(assetsDir, 'icon.512.png');
  const outIco = path.join(assetsDir, 'icon.ico');

  if (!fs.existsSync(srcPng)) {
    console.error('Source PNG not found:', srcPng);
    process.exit(1);
  }

  const img = await Jimp.read(srcPng);
  const size = Math.max(img.bitmap.width, img.bitmap.height);
  const canvas = new Jimp(size, size, 0x00000000);
  const x = Math.floor((size - img.bitmap.width) / 2);
  const y = Math.floor((size - img.bitmap.height) / 2);
  canvas.composite(img, x, y);
  await canvas.writeAsync(squarePng);

  const squareImg = await Jimp.read(squarePng);
  squareImg.resize(512, 512, Jimp.RESIZE_BILINEAR);
  await squareImg.writeAsync(resizedPng);

  const icoBuffer = await pngToIco([resizedPng]);
  fs.writeFileSync(outIco, icoBuffer);
  console.log('Generated:', outIco);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
