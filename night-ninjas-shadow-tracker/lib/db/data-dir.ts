import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

/**
 * Resolves the per-user data directory for Shadow Tracker.
 *
 * Defaults follow OS conventions:
 *   Windows : %APPDATA%\NightNinjas
 *   macOS   : ~/Library/Application Support/NightNinjas
 *   Linux   : ~/.config/night-ninjas
 *
 * Override with NN_DATA_DIR env var if you want to keep the DB
 * somewhere specific (e.g. a OneDrive-synced folder).
 *
 * The directory is created on first call if it doesn't exist.
 */
export function resolveDataDir(): string {
  const override = process.env.NN_DATA_DIR;
  if (override) {
    fs.mkdirSync(override, { recursive: true });
    return override;
  }

  const home = os.homedir();
  let dir: string;

  switch (process.platform) {
    case 'win32':
      dir = path.join(
        process.env.APPDATA ?? path.join(home, 'AppData', 'Roaming'),
        'NightNinjas'
      );
      break;
    case 'darwin':
      dir = path.join(home, 'Library', 'Application Support', 'NightNinjas');
      break;
    default:
      dir = path.join(
        process.env.XDG_CONFIG_HOME ?? path.join(home, '.config'),
        'night-ninjas'
      );
  }

  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function dbFilePath(): string {
  return path.join(resolveDataDir(), 'shadow-tracker.db');
}
