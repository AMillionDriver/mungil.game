<div align="center">

# Mini Game Hub

**100+ browser games — instant play, no install, no login.**

[![Live Demo](https://img.shields.io/website?url=https%3A%2F%2Fgame.mungil.my.id&style=for-the-badge&logo=googlechrome&logoColor=white&label=LIVE%20DEMO&color=667eea&labelColor=1a1a2e)](https://game.mungil.my.id)
[![Deploy](https://img.shields.io/github/deployments/AMillionDriver/mungil.game/github-pages?style=for-the-badge&logo=github&label=DEPLOY&color=4ade80&labelColor=1a1a2e)](https://github.com/AMillionDriver/mungil.game/deployments)
[![License](https://img.shields.io/github/license/AMillionDriver/mungil.game?style=for-the-badge&logo=opensourceinitiative&logoColor=white&label=LICENSE&color=fbbf24&labelColor=1a1a2e)](LICENSE)

[![Stars](https://img.shields.io/github/stars/AMillionDriver/mungil.game?style=for-the-badge&logo=github&label=STARS&color=FFD700&labelColor=1a1a2e)](https://github.com/AMillionDriver/mungil.game/stargazers)
[![Forks](https://img.shields.io/github/forks/AMillionDriver/mungil.game?style=for-the-badge&logo=git&label=FORKS&color=a78bfa&labelColor=1a1a2e)](https://github.com/AMillionDriver/mungil.game/network/members)
[![Last Commit](https://img.shields.io/github/last-commit/AMillionDriver/mungil.game?style=for-the-badge&logo=git&label=LAST%20COMMIT&color=22d3ee&labelColor=1a1a2e)](https://github.com/AMillionDriver/mungil.game/commits/main)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)

</div>

---

## About

**Mini Game Hub** is a curated collection of browser-based games you can play **instantly** — no install, no login, no intrusive ads.

Built with **vanilla JavaScript** (no heavy framework), optimized for performance and mobile-first experience.

## Features

- **100+ Games** — Action, Defense, Puzzle, Arcade, Retro
- **Instant Play** — No install, no signup
- **Dark Mode** — Toggle theme, saved to localStorage
- **Smart Search** — Fuse.js fuzzy search (typo-tolerant)
- **Filter & Sort** — Filter by category, sort by Newest/Popular/A-Z
- **Mobile-First** — Virtual joystick for action games
- **PWA Ready** — Installable on mobile devices
- **Offline Cache** — Service Worker for offline access
- **Auto Thumbnails** — 300+ screenshots generated via Puppeteer

## Featured Games

| Game | Genre | Description |
|------|-------|-------------|
| **Neon Cyber Survivor** | Action, Roguelike | Survive endless waves of cyber drones |
| **Neon Mainframe Defense** | Tower Defense, Strategy | Defend the mainframe from virus attacks |
| **Neon Protocol: Cyber Rebellion** | Action, Story | Visual novel + hack & slash + hacking puzzle |

## Tech Stack

### Frontend
- **HTML5 Canvas** — 2D game rendering
- **CSS3** — Styling with Tailwind CSS (CDN)
- **Vanilla JavaScript** — Game logic, no framework
- **Fuse.js** — Fuzzy search for game library

### Backend & Infrastructure
- **GitHub Pages** — Static hosting
- **Cloudflare DNS** — Custom domain & SSL
- **Cloudflare Worker** — Email relay (OTP catcher)
- **Cloudflare KV** — Temporary OTP storage
- **Puppeteer** — Auto-generate game thumbnails

### Development Tools
- **Wrangler** — Cloudflare Workers CLI
- **Git** — Version control

## Project Structure
mungil.game/
├── .github/workflows/ # CI/CD (auto-deploy)
├── assets/
│ ├── icons/ # PWA icons
│ └── thumbs/ # Game thumbnails (300+)
├── game/
│ ├── neon_cyber_survivor.html
│ ├── neon_mainframe_defense.html
│ ├── neon_protocol_cyber_rebellion.html
│ └── Jsk_Games/ # JSk13 collection
├── page/ # Static pages (privacy, etc)
├── scripts/
│ ├── games.js # Game data & card rendering
│ └── script.js # Search, filter, dark mode
├── styles/style.css
├── CNAME # Custom domain config
├── LICENSE # MIT
├── index.html
├── manifest.json # PWA manifest
└── sw.js # Service Worker

## Getting Started

### Prerequisites
- Modern browser (Chrome, Firefox, Safari, Edge)
- Optional: Python or Node.js for local server

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/AMillionDriver/mungil.game.git
   cd mungil.game
2. Start a local server

bash
# Python 3
python -m http.server 5500

# Node.js
npx http-server -p 5500
Open in browser

3. http://localhost:5500
Note: Service Worker and PWA only work on localhost or HTTPS, not file://.

Deployment
Auto-deployed to GitHub Pages on every push to main.

Domain: game.mungil.my.id

DNS: Cloudflare (CNAME to amilliondriver.github.io)

SSL: Automatic via GitHub Pages

Credits
Featured Games (Neon Series) — Built by Nanang Nurmansyah

JSK13Games Collection — Cloned from JSk13Games (with attribution)

Thumbnails — Auto-generated via Puppeteer

Fonts — Orbitron & Rajdhani

Contributing
Contributions welcome:

Fork this repository

Create feature branch (git checkout -b feature/NewGame)

Commit changes (git commit -m 'Add new game: Space Invaders')

Push to branch (git push origin feature/NewGame)

Open a Pull Request

Guidelines:

Ensure the game runs on Chrome & Firefox

Include thumbnail (800×450 px)

Update games.js when adding new games

Follow existing folder structure

License
MIT License — see LICENSE for details.

<div align="center">
Nanang Nurmansyah
Software Engineer · Automation · Cloud

https://img.shields.io/badge/GitHub-AMillionDriver-181717?style=for-the-badge&logo=github
https://img.shields.io/badge/LinkedIn-nanangnumansah-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white
https://img.shields.io/badge/Email-dev@mungil.my.id-EA4335?style=for-the-badge&logo=gmail&logoColor=white

</div> ```