const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

// Daftar game - auto-generated
const games = [
  {
    "name": "neon-cyber-survivor",
    "url": "./game/neon_cyber_survivor.html"
  },
  {
    "name": "neon-mainframe-defense",
    "url": "./game/neon_mainframe_defense.html"
  },
  {
    "name": "neon-protocol-cyber-rebellion",
    "url": "./game/neon_protocol_cyber_rebellion.html"
  },
  {
    "name": "08800-space-organizer",
    "url": "./game/Jsk_Games/08800-space-organizer/index.html"
  },
  {
    "name": "0xdead",
    "url": "./game/Jsk_Games/0xdead/index.html"
  },
  {
    "name": "1-13-am",
    "url": "./game/Jsk_Games/1-13-am/index.html"
  },
  {
    "name": "10-years-of-game-golfing",
    "url": "./game/Jsk_Games/10-years-of-game-golfing/index.html"
  },
  {
    "name": "1024-moves",
    "url": "./game/Jsk_Games/1024-moves/index.html"
  },
  {
    "name": "10plus3",
    "url": "./game/Jsk_Games/10plus3/index.html"
  },
  {
    "name": "1257-samalas",
    "url": "./game/Jsk_Games/1257-samalas/index.html"
  },
  {
    "name": "13",
    "url": "./game/Jsk_Games/13/index.html"
  },
  {
    "name": "13-ad",
    "url": "./game/Jsk_Games/13-ad/index.html"
  },
  {
    "name": "13-blades",
    "url": "./game/Jsk_Games/13-blades/index.html"
  },
  {
    "name": "13-bricks",
    "url": "./game/Jsk_Games/13-bricks/index.html"
  },
  {
    "name": "13-bubbles",
    "url": "./game/Jsk_Games/13-bubbles/index.html"
  },
  {
    "name": "13-cards-dungeon",
    "url": "./game/Jsk_Games/13-cards-dungeon/index.html"
  },
  {
    "name": "13-curses",
    "url": "./game/Jsk_Games/13-curses/index.html"
  },
  {
    "name": "13-drums",
    "url": "./game/Jsk_Games/13-drums/index.html"
  },
  {
    "name": "13-geese-defending-rome",
    "url": "./game/Jsk_Games/13-geese-defending-rome/index.html"
  },
  {
    "name": "13-hours",
    "url": "./game/Jsk_Games/13-hours/index.html"
  },
  {
    "name": "13-low",
    "url": "./game/Jsk_Games/13-low/index.html"
  },
  {
    "name": "13-maze",
    "url": "./game/Jsk_Games/13-maze/index.html"
  },
  {
    "name": "13-order",
    "url": "./game/Jsk_Games/13-order/index.html"
  },
  {
    "name": "13-samurai",
    "url": "./game/Jsk_Games/13-samurai/index.html"
  },
  {
    "name": "13-seconds-to-kill",
    "url": "./game/Jsk_Games/13-seconds-to-kill/index.html"
  },
  {
    "name": "13-seconds-to-midnight",
    "url": "./game/Jsk_Games/13-seconds-to-midnight/index.html"
  },
  {
    "name": "13-squared",
    "url": "./game/Jsk_Games/13-squared/index.html"
  },
  {
    "name": "13-steps-to-escape",
    "url": "./game/Jsk_Games/13-steps-to-escape/index.html"
  },
  {
    "name": "13-tanks",
    "url": "./game/Jsk_Games/13-tanks/index.html"
  },
  {
    "name": "13-the-damned",
    "url": "./game/Jsk_Games/13-the-damned/index.html"
  },
  {
    "name": "13all-room",
    "url": "./game/Jsk_Games/13all-room/index.html"
  },
  {
    "name": "13attle-tanks",
    "url": "./game/Jsk_Games/13attle-tanks/index.html"
  },
  {
    "name": "13c-defense",
    "url": "./game/Jsk_Games/13c-defense/index.html"
  },
  {
    "name": "13c-gauntlet",
    "url": "./game/Jsk_Games/13c-gauntlet/index.html"
  },
  {
    "name": "13k-bytes-under-the-seas",
    "url": "./game/Jsk_Games/13k-bytes-under-the-seas/index.html"
  },
  {
    "name": "13k-solitaire",
    "url": "./game/Jsk_Games/13k-solitaire/index.html"
  },
  {
    "name": "13kars",
    "url": "./game/Jsk_Games/13kars/index.html"
  },
  {
    "name": "13kb-404",
    "url": "./game/Jsk_Games/13kb-404/index.html"
  },
  {
    "name": "13legions",
    "url": "./game/Jsk_Games/13legions/index.html"
  },
  {
    "name": "13s",
    "url": "./game/Jsk_Games/13s/index.html"
  },
  {
    "name": "13s-tactics",
    "url": "./game/Jsk_Games/13s-tactics/index.html"
  },
  {
    "name": "13th-barbers-guild",
    "url": "./game/Jsk_Games/13th-barbers-guild/index.html"
  },
  {
    "name": "13th-century-2048",
    "url": "./game/Jsk_Games/13th-century-2048/index.html"
  },
  {
    "name": "13th-century-city-builder",
    "url": "./game/Jsk_Games/13th-century-city-builder/index.html"
  },
  {
    "name": "13th-century-siege",
    "url": "./game/Jsk_Games/13th-century-siege/index.html"
  },
  {
    "name": "13th-floor",
    "url": "./game/Jsk_Games/13th-floor/index.html"
  },
  {
    "name": "13th-gate",
    "url": "./game/Jsk_Games/13th-gate/index.html"
  },
  {
    "name": "13th-guy",
    "url": "./game/Jsk_Games/13th-guy/index.html"
  },
  {
    "name": "13th-of-fame",
    "url": "./game/Jsk_Games/13th-of-fame/index.html"
  },
  {
    "name": "13th-restaurant-rush",
    "url": "./game/Jsk_Games/13th-restaurant-rush/index.html"
  },
  {
    "name": "2021-a-space-opera",
    "url": "./game/Jsk_Games/2021-a-space-opera/index.html"
  },
  {
    "name": "20461-dioretsa",
    "url": "./game/Jsk_Games/20461-dioretsa/index.html"
  },
  {
    "name": "2048-13",
    "url": "./game/Jsk_Games/2048-13/index.html"
  },
  {
    "name": "26-games-in-1",
    "url": "./game/Jsk_Games/26-games-in-1/index.html"
  },
  {
    "name": "2ap-backyard-assault",
    "url": "./game/Jsk_Games/2ap-backyard-assault/index.html"
  },
  {
    "name": "2d4x13k",
    "url": "./game/Jsk_Games/2d4x13k/index.html"
  },
  {
    "name": "30s-shooter",
    "url": "./game/Jsk_Games/30s-shooter/index.html"
  },
  {
    "name": "3dc5s",
    "url": "./game/Jsk_Games/3dc5s/index.html"
  },
  {
    "name": "4-elements-tower-defense",
    "url": "./game/Jsk_Games/4-elements-tower-defense/index.html"
  },
  {
    "name": "404",
    "url": "./game/Jsk_Games/404/index.html"
  },
  {
    "name": "404-bc-pinball",
    "url": "./game/Jsk_Games/404-bc-pinball/index.html"
  },
  {
    "name": "404-box",
    "url": "./game/Jsk_Games/404-box/index.html"
  },
  {
    "name": "404-exit-not-found",
    "url": "./game/Jsk_Games/404-exit-not-found/index.html"
  },
  {
    "name": "404-f1-race-monochrome",
    "url": "./game/Jsk_Games/404-f1-race-monochrome/index.html"
  },
  {
    "name": "404-file-not-found",
    "url": "./game/Jsk_Games/404-file-not-found/index.html"
  },
  {
    "name": "404-flappingbird",
    "url": "./game/Jsk_Games/404-flappingbird/index.html"
  },
  {
    "name": "404-laundry-not-found",
    "url": "./game/Jsk_Games/404-laundry-not-found/index.html"
  },
  {
    "name": "404-lost-treasure",
    "url": "./game/Jsk_Games/404-lost-treasure/index.html"
  },
  {
    "name": "404-missingpage",
    "url": "./game/Jsk_Games/404-missingpage/index.html"
  },
  {
    "name": "404-mission",
    "url": "./game/Jsk_Games/404-mission/index.html"
  },
  {
    "name": "404-orbiting-asteroids",
    "url": "./game/Jsk_Games/404-orbiting-asteroids/index.html"
  },
  {
    "name": "404-princess",
    "url": "./game/Jsk_Games/404-princess/index.html"
  },
  {
    "name": "404-race",
    "url": "./game/Jsk_Games/404-race/index.html"
  },
  {
    "name": "404-remain-not-found",
    "url": "./game/Jsk_Games/404-remain-not-found/index.html"
  },
  {
    "name": "404-repetitions",
    "url": "./game/Jsk_Games/404-repetitions/index.html"
  },
  {
    "name": "404-rhythm-not-found",
    "url": "./game/Jsk_Games/404-rhythm-not-found/index.html"
  },
  {
    "name": "404-road-not-found",
    "url": "./game/Jsk_Games/404-road-not-found/index.html"
  },
  {
    "name": "404-search-for-the-missing-pages",
    "url": "./game/Jsk_Games/404-search-for-the-missing-pages/index.html"
  },
  {
    "name": "404-seconds",
    "url": "./game/Jsk_Games/404-seconds/index.html"
  },
  {
    "name": "404-snake-monochrome",
    "url": "./game/Jsk_Games/404-snake-monochrome/index.html"
  },
  {
    "name": "404-soccer",
    "url": "./game/Jsk_Games/404-soccer/index.html"
  },
  {
    "name": "404block",
    "url": "./game/Jsk_Games/404block/index.html"
  },
  {
    "name": "404kph",
    "url": "./game/Jsk_Games/404kph/index.html"
  },
  {
    "name": "404ms",
    "url": "./game/Jsk_Games/404ms/index.html"
  },
  {
    "name": "404th-floor",
    "url": "./game/Jsk_Games/404th-floor/index.html"
  },
  {
    "name": "40fighter",
    "url": "./game/Jsk_Games/40fighter/index.html"
  },
  {
    "name": "44-save-all",
    "url": "./game/Jsk_Games/44-save-all/index.html"
  },
  {
    "name": "4o-offline",
    "url": "./game/Jsk_Games/4o-offline/index.html"
  },
  {
    "name": "4o4",
    "url": "./game/Jsk_Games/4o4/index.html"
  },
  {
    "name": "6174",
    "url": "./game/Jsk_Games/6174/index.html"
  },
  {
    "name": "7-huenicorns",
    "url": "./game/Jsk_Games/7-huenicorns/index.html"
  },
  {
    "name": "70-seconds-of-terror",
    "url": "./game/Jsk_Games/70-seconds-of-terror/index.html"
  },
  {
    "name": "9-colored-game",
    "url": "./game/Jsk_Games/9-colored-game/index.html"
  },
  {
    "name": "9-lives",
    "url": "./game/Jsk_Games/9-lives/index.html"
  },
  {
    "name": "9-lives-an-escape-room",
    "url": "./game/Jsk_Games/9-lives-an-escape-room/index.html"
  },
  {
    "name": "a-bad-day-for-frank",
    "url": "./game/Jsk_Games/a-bad-day-for-frank/index.html"
  },
  {
    "name": "a-box-invaders",
    "url": "./game/Jsk_Games/a-box-invaders/index.html"
  },
  {
    "name": "a-day-in-the-life",
    "url": "./game/Jsk_Games/a-day-in-the-life/index.html"
  },
  {
    "name": "a-deadly-bet",
    "url": "./game/Jsk_Games/a-deadly-bet/index.html"
  },
  {
    "name": "a-dogs-adventure",
    "url": "./game/Jsk_Games/a-dogs-adventure/index.html"
  },
  {
    "name": "a-driving-game-where-actually-your-car-is-the-worst",
    "url": "./game/Jsk_Games/a-driving-game-where-actually-your-car-is-the-worst/index.html"
  },
  {
    "name": "a-hike-in-the-woods",
    "url": "./game/Jsk_Games/a-hike-in-the-woods/index.html"
  },
  {
    "name": "a-hungry-black",
    "url": "./game/Jsk_Games/a-hungry-black/index.html"
  },
  {
    "name": "a-khans-soul",
    "url": "./game/Jsk_Games/a-khans-soul/index.html"
  },
  {
    "name": "a-kings-journey-chapter-3-trapped-poisoned",
    "url": "./game/Jsk_Games/a-kings-journey-chapter-3-trapped-poisoned/index.html"
  },
  {
    "name": "a-moment-lost-in-time",
    "url": "./game/Jsk_Games/a-moment-lost-in-time/index.html"
  },
  {
    "name": "a-qr-maze",
    "url": "./game/Jsk_Games/a-qr-maze/index.html"
  },
  {
    "name": "a-ship-in-time",
    "url": "./game/Jsk_Games/a-ship-in-time/index.html"
  },
  {
    "name": "a-snake",
    "url": "./game/Jsk_Games/a-snake/index.html"
  },
  {
    "name": "a-space-in-the-sun",
    "url": "./game/Jsk_Games/a-space-in-the-sun/index.html"
  },
  {
    "name": "a-tale-of-two-unicorns",
    "url": "./game/Jsk_Games/a-tale-of-two-unicorns/index.html"
  },
  {
    "name": "a-tourist-in-paris",
    "url": "./game/Jsk_Games/a-tourist-in-paris/index.html"
  },
  {
    "name": "a-verse-on-leverage",
    "url": "./game/Jsk_Games/a-verse-on-leverage/index.html"
  },
  {
    "name": "a-voiding-your-problems",
    "url": "./game/Jsk_Games/a-voiding-your-problems/index.html"
  },
  {
    "name": "a0a",
    "url": "./game/Jsk_Games/a0a/index.html"
  },
  {
    "name": "aaarrrrggg",
    "url": "./game/Jsk_Games/aaarrrrggg/index.html"
  },
  {
    "name": "aargh-triskaideka-attacks",
    "url": "./game/Jsk_Games/aargh-triskaideka-attacks/index.html"
  },
  {
    "name": "absorbed",
    "url": "./game/Jsk_Games/absorbed/index.html"
  },
  {
    "name": "access-points",
    "url": "./game/Jsk_Games/access-points/index.html"
  },
  {
    "name": "ace-cadet",
    "url": "./game/Jsk_Games/ace-cadet/index.html"
  },
  {
    "name": "achluophobia",
    "url": "./game/Jsk_Games/achluophobia/index.html"
  },
  {
    "name": "action-hero-academy-shooting-range",
    "url": "./game/Jsk_Games/action-hero-academy-shooting-range/index.html"
  },
  {
    "name": "admiral-schiffchen",
    "url": "./game/Jsk_Games/admiral-schiffchen/index.html"
  },
  {
    "name": "adopt-a-fire",
    "url": "./game/Jsk_Games/adopt-a-fire/index.html"
  },
  {
    "name": "adrift",
    "url": "./game/Jsk_Games/adrift/index.html"
  },
  {
    "name": "adrift-to-the-abyss",
    "url": "./game/Jsk_Games/adrift-to-the-abyss/index.html"
  },
  {
    "name": "adventure-in-ascii-space",
    "url": "./game/Jsk_Games/adventure-in-ascii-space/index.html"
  },
  {
    "name": "adventure-time",
    "url": "./game/Jsk_Games/adventure-time/index.html"
  },
  {
    "name": "aelbahkat-the-lost-islands",
    "url": "./game/Jsk_Games/aelbahkat-the-lost-islands/index.html"
  },
  {
    "name": "afterglow",
    "url": "./game/Jsk_Games/afterglow/index.html"
  },
  {
    "name": "afterlife",
    "url": "./game/Jsk_Games/afterlife/index.html"
  },
  {
    "name": "age-of-the-demigods",
    "url": "./game/Jsk_Games/age-of-the-demigods/index.html"
  },
  {
    "name": "agent-xiii",
    "url": "./game/Jsk_Games/agent-xiii/index.html"
  },
  {
    "name": "ah-kin-glitch",
    "url": "./game/Jsk_Games/ah-kin-glitch/index.html"
  },
  {
    "name": "ai-begone",
    "url": "./game/Jsk_Games/ai-begone/index.html"
  },
  {
    "name": "aim-lab-from-hell",
    "url": "./game/Jsk_Games/aim-lab-from-hell/index.html"
  },
  {
    "name": "air-fury",
    "url": "./game/Jsk_Games/air-fury/index.html"
  },
  {
    "name": "airspace-alpha-zulu",
    "url": "./game/Jsk_Games/airspace-alpha-zulu/index.html"
  },
  {
    "name": "al13ycat",
    "url": "./game/Jsk_Games/al13ycat/index.html"
  },
  {
    "name": "alchemist-defence",
    "url": "./game/Jsk_Games/alchemist-defence/index.html"
  },
  {
    "name": "alchemists-nightmare",
    "url": "./game/Jsk_Games/alchemists-nightmare/index.html"
  },
  {
    "name": "alchemixer",
    "url": "./game/Jsk_Games/alchemixer/index.html"
  },
  {
    "name": "alien-disposal-crew",
    "url": "./game/Jsk_Games/alien-disposal-crew/index.html"
  },
  {
    "name": "alien-millionaire",
    "url": "./game/Jsk_Games/alien-millionaire/index.html"
  },
  {
    "name": "alien-scroll",
    "url": "./game/Jsk_Games/alien-scroll/index.html"
  },
  {
    "name": "alien-spaceship",
    "url": "./game/Jsk_Games/alien-spaceship/index.html"
  },
  {
    "name": "alien-war-begins",
    "url": "./game/Jsk_Games/alien-war-begins/index.html"
  },
  {
    "name": "alivenloaded",
    "url": "./game/Jsk_Games/alivenloaded/index.html"
  },
  {
    "name": "all-is-not-lost",
    "url": "./game/Jsk_Games/all-is-not-lost/index.html"
  },
  {
    "name": "all-systems-offline",
    "url": "./game/Jsk_Games/all-systems-offline/index.html"
  },
  {
    "name": "all-you-have-to-do-is-dream",
    "url": "./game/Jsk_Games/all-you-have-to-do-is-dream/index.html"
  },
  {
    "name": "alley-cat-noir",
    "url": "./game/Jsk_Games/alley-cat-noir/index.html"
  },
  {
    "name": "alley-kitty",
    "url": "./game/Jsk_Games/alley-kitty/index.html"
  },
  {
    "name": "alone-in-darkness",
    "url": "./game/Jsk_Games/alone-in-darkness/index.html"
  },
  {
    "name": "alquerque",
    "url": "./game/Jsk_Games/alquerque/index.html"
  },
  {
    "name": "alter",
    "url": "./game/Jsk_Games/alter/index.html"
  },
  {
    "name": "amaz3d",
    "url": "./game/Jsk_Games/amaz3d/index.html"
  },
  {
    "name": "ameb",
    "url": "./game/Jsk_Games/ameb/index.html"
  },
  {
    "name": "america-offline",
    "url": "./game/Jsk_Games/america-offline/index.html"
  },
  {
    "name": "an-http-story",
    "url": "./game/Jsk_Games/an-http-story/index.html"
  },
  {
    "name": "an-offline-life",
    "url": "./game/Jsk_Games/an-offline-life/index.html"
  },
  {
    "name": "anachronic",
    "url": "./game/Jsk_Games/anachronic/index.html"
  },
  {
    "name": "and-then-it-was-gone",
    "url": "./game/Jsk_Games/and-then-it-was-gone/index.html"
  },
  {
    "name": "angle",
    "url": "./game/Jsk_Games/angle/index.html"
  },
  {
    "name": "angry-boars",
    "url": "./game/Jsk_Games/angry-boars/index.html"
  },
  {
    "name": "angry-cleaning-robot",
    "url": "./game/Jsk_Games/angry-cleaning-robot/index.html"
  },
  {
    "name": "angry-temujin",
    "url": "./game/Jsk_Games/angry-temujin/index.html"
  },
  {
    "name": "another-day-at-the-website-factory",
    "url": "./game/Jsk_Games/another-day-at-the-website-factory/index.html"
  },
  {
    "name": "ant-realm",
    "url": "./game/Jsk_Games/ant-realm/index.html"
  },
  {
    "name": "ant-space",
    "url": "./game/Jsk_Games/ant-space/index.html"
  },
  {
    "name": "anthority",
    "url": "./game/Jsk_Games/anthority/index.html"
  },
  {
    "name": "anti-gravity-cave",
    "url": "./game/Jsk_Games/anti-gravity-cave/index.html"
  },
  {
    "name": "anti-gravity-kittens",
    "url": "./game/Jsk_Games/anti-gravity-kittens/index.html"
  },
  {
    "name": "anti-paradox-run",
    "url": "./game/Jsk_Games/anti-paradox-run/index.html"
  },
  {
    "name": "anti-virus",
    "url": "./game/Jsk_Games/anti-virus/index.html"
  },
  {
    "name": "antivirus",
    "url": "./game/Jsk_Games/antivirus/index.html"
  },
  {
    "name": "ap11",
    "url": "./game/Jsk_Games/ap11/index.html"
  },
  {
    "name": "ape-naps",
    "url": "./game/Jsk_Games/ape-naps/index.html"
  },
  {
    "name": "apex-predator",
    "url": "./game/Jsk_Games/apex-predator/index.html"
  },
  {
    "name": "apollo-13kb",
    "url": "./game/Jsk_Games/apollo-13kb/index.html"
  },
  {
    "name": "aquatic-beast-force",
    "url": "./game/Jsk_Games/aquatic-beast-force/index.html"
  },
  {
    "name": "archerfire-duet-of-aces",
    "url": "./game/Jsk_Games/archerfire-duet-of-aces/index.html"
  },
  {
    "name": "archery-master",
    "url": "./game/Jsk_Games/archery-master/index.html"
  },
  {
    "name": "arcobaleno-learn-italian",
    "url": "./game/Jsk_Games/arcobaleno-learn-italian/index.html"
  },
  {
    "name": "are-you-lost",
    "url": "./game/Jsk_Games/are-you-lost/index.html"
  },
  {
    "name": "area-404-signal-not-found",
    "url": "./game/Jsk_Games/area-404-signal-not-found/index.html"
  },
  {
    "name": "arena-of-glothad",
    "url": "./game/Jsk_Games/arena-of-glothad/index.html"
  },
  {
    "name": "arena013",
    "url": "./game/Jsk_Games/arena013/index.html"
  },
  {
    "name": "arithmetic-hunt",
    "url": "./game/Jsk_Games/arithmetic-hunt/index.html"
  },
  {
    "name": "arkanoid-404",
    "url": "./game/Jsk_Games/arkanoid-404/index.html"
  },
  {
    "name": "arres-climb",
    "url": "./game/Jsk_Games/arres-climb/index.html"
  },
  {
    "name": "asdf",
    "url": "./game/Jsk_Games/asdf/index.html"
  },
  {
    "name": "ashes-of-ulthar",
    "url": "./game/Jsk_Games/ashes-of-ulthar/index.html"
  },
  {
    "name": "assault-on-city-13",
    "url": "./game/Jsk_Games/assault-on-city-13/index.html"
  },
  {
    "name": "asteroid-404",
    "url": "./game/Jsk_Games/asteroid-404/index.html"
  },
  {
    "name": "asteroid-miner",
    "url": "./game/Jsk_Games/asteroid-miner/index.html"
  },
  {
    "name": "asteroidodge",
    "url": "./game/Jsk_Games/asteroidodge/index.html"
  },
  {
    "name": "Asteroids",
    "url": "./game/Jsk_Games/Asteroids/index.html"
  },
  {
    "name": "asteroids-extended",
    "url": "./game/Jsk_Games/asteroids-extended/index.html"
  },
  {
    "name": "asteroids404",
    "url": "./game/Jsk_Games/asteroids404/index.html"
  },
  {
    "name": "astro",
    "url": "./game/Jsk_Games/astro/index.html"
  },
  {
    "name": "astro-link",
    "url": "./game/Jsk_Games/astro-link/index.html"
  },
  {
    "name": "astro-miners",
    "url": "./game/Jsk_Games/astro-miners/index.html"
  },
  {
    "name": "astroach",
    "url": "./game/Jsk_Games/astroach/index.html"
  },
  {
    "name": "astronaut-in-trouble",
    "url": "./game/Jsk_Games/astronaut-in-trouble/index.html"
  },
  {
    "name": "at-both-ends",
    "url": "./game/Jsk_Games/at-both-ends/index.html"
  },
  {
    "name": "at-journeys-end",
    "url": "./game/Jsk_Games/at-journeys-end/index.html"
  },
  {
    "name": "at-sea",
    "url": "./game/Jsk_Games/at-sea/index.html"
  },
  {
    "name": "aud13nd",
    "url": "./game/Jsk_Games/aud13nd/index.html"
  },
  {
    "name": "audio-dash",
    "url": "./game/Jsk_Games/audio-dash/index.html"
  },
  {
    "name": "aurelius-7-trials",
    "url": "./game/Jsk_Games/aurelius-7-trials/index.html"
  },
  {
    "name": "aurora-snap",
    "url": "./game/Jsk_Games/aurora-snap/index.html"
  },
  {
    "name": "autopilot-offline",
    "url": "./game/Jsk_Games/autopilot-offline/index.html"
  },
  {
    "name": "avoid-being-hit",
    "url": "./game/Jsk_Games/avoid-being-hit/index.html"
  },
  {
    "name": "awesome",
    "url": "./game/Jsk_Games/awesome/index.html"
  },
  {
    "name": "awkward-turtle",
    "url": "./game/Jsk_Games/awkward-turtle/index.html"
  },
  {
    "name": "azetz",
    "url": "./game/Jsk_Games/azetz/index.html"
  },
  {
    "name": "b",
    "url": "./game/Jsk_Games/b/index.html"
  },
  {
    "name": "b1ack0ut",
    "url": "./game/Jsk_Games/b1ack0ut/index.html"
  },
  {
    "name": "baby-please-come-back-home",
    "url": "./game/Jsk_Games/baby-please-come-back-home/index.html"
  },
  {
    "name": "back",
    "url": "./game/Jsk_Games/back/index.html"
  },
  {
    "name": "back-2-back",
    "url": "./game/Jsk_Games/back-2-back/index.html"
  },
  {
    "name": "back-2-home",
    "url": "./game/Jsk_Games/back-2-home/index.html"
  },
  {
    "name": "back-attacker",
    "url": "./game/Jsk_Games/back-attacker/index.html"
  },
  {
    "name": "back-back-back-back-gone",
    "url": "./game/Jsk_Games/back-back-back-back-gone/index.html"
  },
  {
    "name": "back-down-the-tower",
    "url": "./game/Jsk_Games/back-down-the-tower/index.html"
  },
  {
    "name": "back-forth",
    "url": "./game/Jsk_Games/back-forth/index.html"
  },
  {
    "name": "back-from-kooky-island",
    "url": "./game/Jsk_Games/back-from-kooky-island/index.html"
  },
  {
    "name": "back-home",
    "url": "./game/Jsk_Games/back-home/index.html"
  },
  {
    "name": "back-in-black",
    "url": "./game/Jsk_Games/back-in-black/index.html"
  },
  {
    "name": "back-in-dino",
    "url": "./game/Jsk_Games/back-in-dino/index.html"
  },
  {
    "name": "back-on-track",
    "url": "./game/Jsk_Games/back-on-track/index.html"
  },
  {
    "name": "back-on-track-mania",
    "url": "./game/Jsk_Games/back-on-track-mania/index.html"
  },
  {
    "name": "back-online",
    "url": "./game/Jsk_Games/back-online/index.html"
  },
  {
    "name": "back-read",
    "url": "./game/Jsk_Games/back-read/index.html"
  },
  {
    "name": "back-relax",
    "url": "./game/Jsk_Games/back-relax/index.html"
  },
  {
    "name": "back-scratching-salon",
    "url": "./game/Jsk_Games/back-scratching-salon/index.html"
  },
  {
    "name": "back-to-bathroom",
    "url": "./game/Jsk_Games/back-to-bathroom/index.html"
  },
  {
    "name": "back-to-earth",
    "url": "./game/Jsk_Games/back-to-earth/index.html"
  },
  {
    "name": "back-to-exploration",
    "url": "./game/Jsk_Games/back-to-exploration/index.html"
  },
  {
    "name": "back-to-game",
    "url": "./game/Jsk_Games/back-to-game/index.html"
  },
  {
    "name": "back-to-life",
    "url": "./game/Jsk_Games/back-to-life/index.html"
  },
  {
    "name": "back-to-life-adventure",
    "url": "./game/Jsk_Games/back-to-life-adventure/index.html"
  },
  {
    "name": "back-to-oxygen",
    "url": "./game/Jsk_Games/back-to-oxygen/index.html"
  },
  {
    "name": "back-to-rescue",
    "url": "./game/Jsk_Games/back-to-rescue/index.html"
  },
  {
    "name": "back-to-school",
    "url": "./game/Jsk_Games/back-to-school/index.html"
  },
  {
    "name": "back-to-skull-island",
    "url": "./game/Jsk_Games/back-to-skull-island/index.html"
  },
  {
    "name": "back-to-source",
    "url": "./game/Jsk_Games/back-to-source/index.html"
  },
  {
    "name": "back-to-space",
    "url": "./game/Jsk_Games/back-to-space/index.html"
  },
  {
    "name": "back-to-that-platform-i-was-on-before-jumping",
    "url": "./game/Jsk_Games/back-to-that-platform-i-was-on-before-jumping/index.html"
  },
  {
    "name": "back-to-the-80s",
    "url": "./game/Jsk_Games/back-to-the-80s/index.html"
  },
  {
    "name": "back-to-the-battle-ship",
    "url": "./game/Jsk_Games/back-to-the-battle-ship/index.html"
  },
  {
    "name": "back-to-the-beginning",
    "url": "./game/Jsk_Games/back-to-the-beginning/index.html"
  },
  {
    "name": "back-to-the-earth",
    "url": "./game/Jsk_Games/back-to-the-earth/index.html"
  },
  {
    "name": "back-to-the-island",
    "url": "./game/Jsk_Games/back-to-the-island/index.html"
  },
  {
    "name": "back-to-the-nest",
    "url": "./game/Jsk_Games/back-to-the-nest/index.html"
  },
  {
    "name": "back-to-the-stars",
    "url": "./game/Jsk_Games/back-to-the-stars/index.html"
  },
  {
    "name": "back-up",
    "url": "./game/Jsk_Games/back-up/index.html"
  },
  {
    "name": "backbeat",
    "url": "./game/Jsk_Games/backbeat/index.html"
  },
  {
    "name": "backcountry",
    "url": "./game/Jsk_Games/backcountry/index.html"
  },
  {
    "name": "backflipped",
    "url": "./game/Jsk_Games/backflipped/index.html"
  },
  {
    "name": "backionary",
    "url": "./game/Jsk_Games/backionary/index.html"
  },
  {
    "name": "backlit-treasure-escape",
    "url": "./game/Jsk_Games/backlit-treasure-escape/index.html"
  },
  {
    "name": "backo",
    "url": "./game/Jsk_Games/backo/index.html"
  },
  {
    "name": "backorder-storehouse",
    "url": "./game/Jsk_Games/backorder-storehouse/index.html"
  },
  {
    "name": "backout",
    "url": "./game/Jsk_Games/backout/index.html"
  },
  {
    "name": "backpack-monsters",
    "url": "./game/Jsk_Games/backpack-monsters/index.html"
  },
  {
    "name": "backshooter",
    "url": "./game/Jsk_Games/backshooter/index.html"
  },
  {
    "name": "backshot-tactics",
    "url": "./game/Jsk_Games/backshot-tactics/index.html"
  },
  {
    "name": "backside",
    "url": "./game/Jsk_Games/backside/index.html"
  },
  {
    "name": "backside-ball",
    "url": "./game/Jsk_Games/backside-ball/index.html"
  },
  {
    "name": "backspace",
    "url": "./game/Jsk_Games/backspace/index.html"
  },
  {
    "name": "backspace-it",
    "url": "./game/Jsk_Games/backspace-it/index.html"
  },
  {
    "name": "backspace-magic",
    "url": "./game/Jsk_Games/backspace-magic/index.html"
  },
  {
    "name": "backspace-return-to-planet-figadore",
    "url": "./game/Jsk_Games/backspace-return-to-planet-figadore/index.html"
  },
  {
    "name": "backstabber-hero",
    "url": "./game/Jsk_Games/backstabber-hero/index.html"
  },
  {
    "name": "backstabbers",
    "url": "./game/Jsk_Games/backstabbers/index.html"
  },
  {
    "name": "backsteroid",
    "url": "./game/Jsk_Games/backsteroid/index.html"
  },
  {
    "name": "backstone",
    "url": "./game/Jsk_Games/backstone/index.html"
  },
  {
    "name": "backstreetsback",
    "url": "./game/Jsk_Games/backstreetsback/index.html"
  },
  {
    "name": "backto-where-we-left-off",
    "url": "./game/Jsk_Games/backto-where-we-left-off/index.html"
  },
  {
    "name": "backupbot",
    "url": "./game/Jsk_Games/backupbot/index.html"
  },
  {
    "name": "backwards-adventure",
    "url": "./game/Jsk_Games/backwards-adventure/index.html"
  },
  {
    "name": "bad-depot",
    "url": "./game/Jsk_Games/bad-depot/index.html"
  },
  {
    "name": "bad-luck-brian",
    "url": "./game/Jsk_Games/bad-luck-brian/index.html"
  },
  {
    "name": "badluck-butter-chicken-flies-the-unfriendly-skies",
    "url": "./game/Jsk_Games/badluck-butter-chicken-flies-the-unfriendly-skies/index.html"
  },
  {
    "name": "badluck-butter-chicken-goes-to-outer-space",
    "url": "./game/Jsk_Games/badluck-butter-chicken-goes-to-outer-space/index.html"
  },
  {
    "name": "bakpak",
    "url": "./game/Jsk_Games/bakpak/index.html"
  },
  {
    "name": "balance",
    "url": "./game/Jsk_Games/balance/index.html"
  },
  {
    "name": "ball-madness",
    "url": "./game/Jsk_Games/ball-madness/index.html"
  },
  {
    "name": "ballarena-2013k",
    "url": "./game/Jsk_Games/ballarena-2013k/index.html"
  },
  {
    "name": "balloon-problems",
    "url": "./game/Jsk_Games/balloon-problems/index.html"
  },
  {
    "name": "balls-juggle",
    "url": "./game/Jsk_Games/balls-juggle/index.html"
  },
  {
    "name": "baloon-operator",
    "url": "./game/Jsk_Games/baloon-operator/index.html"
  },
  {
    "name": "barbenheim-13",
    "url": "./game/Jsk_Games/barbenheim-13/index.html"
  },
  {
    "name": "bardo",
    "url": "./game/Jsk_Games/bardo/index.html"
  },
  {
    "name": "bards-fantasy",
    "url": "./game/Jsk_Games/bards-fantasy/index.html"
  },
  {
    "name": "barry-in-space",
    "url": "./game/Jsk_Games/barry-in-space/index.html"
  },
  {
    "name": "barry-the-bird",
    "url": "./game/Jsk_Games/barry-the-bird/index.html"
  },
  {
    "name": "basement-cat-ascends",
    "url": "./game/Jsk_Games/basement-cat-ascends/index.html"
  },
  {
    "name": "bastet-night",
    "url": "./game/Jsk_Games/bastet-night/index.html"
  },
  {
    "name": "battle-commander-middle-ages",
    "url": "./game/Jsk_Games/battle-commander-middle-ages/index.html"
  },
  {
    "name": "battle-of-mages-in-the-unireverse",
    "url": "./game/Jsk_Games/battle-of-mages-in-the-unireverse/index.html"
  },
  {
    "name": "battleship-earth-simulator",
    "url": "./game/Jsk_Games/battleship-earth-simulator/index.html"
  },
  {
    "name": "Pacman",
    "url": "./game/Jsk_Games/Pacman/index.html"
  },
  {
    "name": "Snake",
    "url": "./game/Jsk_Games/Snake/index.html"
  },
  {
    "name": "Tetris",
    "url": "./game/Jsk_Games/Tetris/index.html"
  }
];

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

  console.log(`🎯 Screenshot ${games.length} games...`);
  
  for (const game of games) {
    console.log(`\n📸 Screenshot: ${game.name}`);
    try {
      const filePath = path.resolve(__dirname, '..', game.url);
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      const fileUrl = pathToFileURL(filePath).href;
      await page.goto(fileUrl, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({
        path: path.join(OUT_DIR, `${game.name}.png`),
        type: 'png',
        fullPage: false
      });
      console.log(`✅ Saved: ${game.name}.png`);
    } catch (e) {
      console.error(`❌ Failed ${game.name}: ${e.message}`);
    }
  }

  await browser.close();
  console.log('\n✅ Selesai! Check assets/thumbs/');
})();