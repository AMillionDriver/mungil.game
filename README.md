<div align="center">

# Mini Game Hub

**300+ browser games — instant play, no install, no login.**

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

**Mini Game Hub** is a curated collection of browser-based games designed for instant play — no installation, no account required, and no intrusive ads.

The project uses lightweight web technologies with a **mobile-first** approach and focuses on fast loading, simple interaction, and easy access to a large game collection.

## Highlights

- **300+ Games** — Action, Defense, Puzzle, Arcade, Retro, and more
- **3 Original Games** — The Neon Series, developed specifically for this project
- **Instant Play** — No install and no signup required
- **Dark Mode** — Theme preference saved with `localStorage`
- **Smart Search** — Fuse.js fuzzy search for typo-tolerant discovery
- **Filter & Sort** — Browse by category, newest, popularity, or A–Z
- **Mobile-First** — Virtual joystick support for compatible action games
- **PWA Ready** — Installable on supported mobile devices
- **Offline Cache** — Service Worker support for cached access
- **Auto Thumbnails** — 300+ game screenshots generated with Puppeteer

## Original Games

These games were developed specifically for Mini Game Hub:

| Game | Genre | Description |
|------|-------|-------------|
| **Neon Cyber Survivor** | Action, Roguelike | Survive endless waves of cyber drones in a neon cyberpunk environment |
| **Neon Mainframe Defense** | Tower Defense, Strategy | Defend a futuristic mainframe against waves of digital threats |
| **Neon Protocol: Cyber Rebellion** | Action, Story | A cyberpunk experience combining visual novel elements, hack & slash combat, and hacking puzzles |

### Neon Protocol: Cyber Rebellion

The latest original title in the Neon Series, featuring:

- Hack & slash combat
- Combo system
- Parry and perfect parry
- Dynamic Difficulty Adjustment (DDA)
- Near Miss system
- Search optimization with Fuse.js
- Client-side caching for faster navigation

## Game Collection

The hub also includes a large third-party collection under `game/Jsk_Games/`.

The **JSk13Games Collection** contains 300+ browser games available through the hub. These games are separate from the three original Neon Series titles and are included with attribution to the original source.

## Tech Stack

### Frontend

- **HTML5 Canvas** — 2D game rendering
- **CSS3** — Styling and responsive layout
- **Tailwind CSS (CDN)** — Utility classes where needed
- **Vanilla JavaScript** — Game logic and UI without a heavy framework
- **Fuse.js** — Fuzzy search for the game library
- **Service Worker** — Offline caching and PWA functionality

### Backend & Infrastructure

- **GitHub Pages** — Static hosting and deployment
- **Cloudflare DNS** — Custom domain and SSL
- **Cloudflare Worker** — Email relay / OTP processing
- **Cloudflare KV** — Temporary email and OTP storage
- **Puppeteer** — Automated thumbnail generation

### Development Tools

- **Wrangler** — Cloudflare Workers CLI
- **Git** — Version control
- **Python / Node.js** — Local development and automation scripts

## Project Structure

```text
mungil.game/
├── .github/
│   └── workflows/                  # CI/CD (auto-deploy)
├── assets/
│   ├── icons/                     # PWA icons
│   └── thumbs/                    # Game thumbnails (300+)
├── game/
│   ├── neon_cyber_survivor.html
│   ├── neon_mainframe_defense.html
│   ├── neon_protocol_cyber_rebellion.html
│   └── Jsk_Games/                # Third-party game collection
├── page/                          # Static pages (privacy, etc.)
├── scripts/
│   ├── games.js                   # Game data & card rendering
│   └── script.js                  # Search, filter, dark mode
├── styles/
│   └── style.css
├── CNAME                          # Custom domain configuration
├── LICENSE                        # MIT License
├── index.html
├── manifest.json                  # PWA manifest
└── sw.js                          # Service Worker
```

## Getting Started

### Prerequisites

- Modern browser: Chrome, Firefox, Safari, or Edge
- Optional: Python 3 or Node.js for local development

### Run Locally

#### 1. Clone the repository

```bash
git clone https://github.com/AMillionDriver/mungil.game.git
cd mungil.game
```

#### 2. Start a local server

Using Python:

```bash
python -m http.server 5500
```

Or using Node.js:

```bash
npx http-server -p 5500
```

#### 3. Open in your browser

```text
http://localhost:5500
```

> **Note:** Service Worker and PWA features require `localhost` or HTTPS. They will not work correctly from `file://`.

## Deployment

The project is automatically deployed to GitHub Pages on every push to `main`.

- **Production:** https://game.mungil.my.id
- **Hosting:** GitHub Pages
- **DNS:** Cloudflare
- **SSL:** Automatic HTTPS via GitHub Pages

## Credits

### Original Games

**Neon Cyber Survivor**  
**Neon Mainframe Defense**  
**Neon Protocol: Cyber Rebellion**

Developed by **Nanang Nurmansyah**.

### Third-Party Collection

**JSk13Games Collection**  
Included with attribution to the original source.

### Other Assets

- **Thumbnails** — Auto-generated with Puppeteer
- **Fonts** — Orbitron & Rajdhani

## Contributing

Contributions are welcome.

### Add a Game

1. Fork this repository.
2. Create a feature branch:

```bash
git checkout -b feature/new-game
```

3. Add your game under the existing project structure.
4. Include a thumbnail at **800×450 px** when applicable.
5. Update `scripts/games.js`.
6. Test the game on Chrome and Firefox.
7. Commit your changes:

```bash
git add .
git commit -m "Add new game: Space Invaders"
```

8. Push your branch:

```bash
git push origin feature/new-game
```

9. Open a Pull Request.

### Guidelines

- Ensure the game works on modern browsers.
- Prefer lightweight assets and fast loading.
- Keep the existing folder structure consistent.
- Include or update metadata used by the game catalog.
- Make sure new games remain playable on mobile where practical.

## License

This project is licensed under the **MIT License**.

See [LICENSE](LICENSE) for the full license text.

<div align="center">

**Nanang Nurmansyah**

Software Engineer · Game Developer · Automation · Cloud

[![GitHub](https://img.shields.io/badge/GitHub-AMillionDriver-181717?style=for-the-badge&logo=github)](https://github.com/AMillionDriver)

[![Website](https://img.shields.io/badge/Website-game.mungil.my.id-667eea?style=for-the-badge&logo=googlechrome&logoColor=white)](https://game.mungil.my.id)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-nanangnumansah-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/nanangnumansah/)

[![Email](https://img.shields.io/badge/Email-dev@mungil.my.id-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:dev@mungil.my.id)

</div>
