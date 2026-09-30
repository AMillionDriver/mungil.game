import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Project Integrity & Structure', () => {
  it('should have essential project files', () => {
    const requiredFiles = [
      'index.html',
      'manifest.json',
      'sw.js',
      'package.json',
      '.gitignore',
      '.prettierrc',
      '.eslintrc.cjs',
      'game/neon_cyber_survivor.html',
      'assets/audio/cyber_bgm.mp3',
    ];

    requiredFiles.forEach(file => {
      const filePath = path.resolve(process.cwd(), file);
      expect(fs.existsSync(filePath), `File ${file} should exist`).toBe(true);
    });
  });

  it('should parse games list from scripts/games.js correctly', () => {
    const gamesFilePath = path.resolve(process.cwd(), 'scripts/games.js');
    const content = fs.readFileSync(gamesFilePath, 'utf8');

    // Extract jskGames array using regex
    const match = content.match(/const\s+jskGames\s*=\s*\[([\s\S]*?)\];/);
    expect(match).not.toBeNull();

    const games = match[1]
      .split(',')
      .map(item => item.trim().replace(/['"]/g, ''))
      .filter(Boolean);

    expect(games.length).toBeGreaterThan(0);

    // Verify all game entries are non-empty valid strings
    games.forEach(game => {
      expect(typeof game).toBe('string');
      expect(game.length).toBeGreaterThan(0);
      expect(game).toMatch(/^[a-zA-Z0-9-_]+$/);
    });

    // Check for duplicates
    const uniqueGames = new Set(games);
    expect(uniqueGames.size).toBe(games.length);
  });
});
