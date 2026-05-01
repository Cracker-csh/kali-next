const { Jimp } = require('jimp');
const pngToIco = require('png-to-ico');
const fs = require('fs');

async function processLogo() {
  try {
    const imgPath = 'C:\\Users\\mitro\\.gemini\\antigravity\\brain\\65d42360-551e-40ac-b805-ef2e8012c253\\.tempmediaStorage\\media_65d42360-551e-40ac-b805-ef2e8012c253_1777659656110.png';
    const image = await Jimp.read(imgPath);
    
    // The image size is 1920x970.
    // Let's crop the big 128x128 logo preview on the left side.
    image.crop({ x: 130, y: 100, w: 750, h: 750 });

    // Background Removal: The mockup has a light gray/white background.
    // We will make light/white pixels transparent.
    image.scan((x, y, idx) => {
      const r = image.bitmap.data[idx];
      const g = image.bitmap.data[idx + 1];
      const b = image.bitmap.data[idx + 2];
      
      // If it's the light mockup background (gray/white)
      if (r > 230 && g > 230 && b > 230) {
        image.bitmap.data[idx + 3] = 0; // transparent
      } else if (r > 200 && g > 200 && b > 200 && Math.abs(r-g) < 10 && Math.abs(g-b) < 10) {
        // catch slightly darker gray background
        image.bitmap.data[idx + 3] = 0; 
      }
    });

    const sizes = [128, 64, 48, 32, 16];
    const pngFiles = [];

    if (!fs.existsSync('public')) {
      fs.mkdirSync('public');
    }

    for (const size of sizes) {
      const cloned = image.clone();
      cloned.resize({ w: size, h: size });
      const outPath = `public/favicon-${size}x${size}.png`;
      await cloned.write(outPath);
      pngFiles.push(outPath);
      console.log(`Generated ${outPath}`);
    }

    // Now generate .ico
    const buf = await pngToIco(pngFiles);
    fs.writeFileSync('public/favicon.ico', buf);
    console.log('Generated public/favicon.ico');

  } catch (error) {
    console.error('Error processing:', error);
  }
}

processLogo();
