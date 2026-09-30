const fs = require('fs');
const path = require('path');

// Baca games.js
const gamesJsPath = path.join(__dirname, '..', 'scripts', 'games.js');
const gamesJsContent = fs.readFileSync(gamesJsPath, 'utf8');

// Parse array dari games.js
const match = gamesJsContent.match(/const jskGames = \[([\s\S]*?)\]/);
if (!match) {
  console.error('❌ Tidak bisa parse games.js');
  process.exit(1);
}

const gameNames = match[1]
  .split(',')
  .map(line => line.trim())
  .filter(line => line.startsWith("'") && line.endsWith("'"))
  .map(line => line.slice(1, -1));

console.log(`📋 Found ${gameNames.length} games`);

// Generate games object untuk screenshot.js
const games = [
  // Neon games
  { name: 'neon-cyber-survivor', url: './game/neon_cyber_survivor.html' },
  { name: 'neon-mainframe-defense', url: './game/neon_mainframe_defense.html' },
  { name: 'neon-protocol-cyber-rebellion', url: './game/neon_protocol_cyber_rebellion.html' },
  
  // JSk13Games - auto-generated
  ...gameNames.map(name => ({
    name,
    url: `./game/Jsk_Games/${name}/index.html`
  }))
];

// Generate screenshot.js
const screenshotJsContent = `const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Daftar game - auto-generated
const games = ${JSON.stringify(games, null, 2)};

const OUT_DIR = path.join(__dirname, '..', 'assets', 'thumbs');

(async () => {
  console.log('📁 Output directory:', OUT_DIR);
  
  if (!fs.existsSync(OUT_DIR)) {
    console.log('📂 Creating output directory...');
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 450 });

  console.log(\`🎯 Screenshot \${games.length} games...\`);
  
  for (const game of games) {
    console.log(\`\\n📸 Screenshot: \${game.name}\`);
    try {
      await page.goto(game.url, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({
        path: path.join(OUT_DIR, \`\${game.name}.png\`),
        type: 'png',
        fullPage: false
      });
      console.log(\`✅ Saved: \${game.name}.png\`);
    } catch (e) {
      console.error(\`❌ Failed \${game.name}: \${e.message}\`);
    }
  }

  await browser.close();
  console.log('\\n✅ Selesai! Check assets/thumbs/');
})();
`;

const outputPath = path.join(__dirname, 'screenshot.js');
fs.writeFileSync(outputPath, screenshotJsContent);

console.log(`✅ Generated screenshot.js with ${games.length} games`);
console.log('🚀 Run: npm run screenshot');
