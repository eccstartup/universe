// Build or run the wallet-only TU Lite variant.
// Usage: node scripts/tauri-lite.js [dev|build] [...tauri args]
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

process.env.TARI_NETWORK = 'mainnet';
process.env.TARI_TARGET_NETWORK = 'mainnet';
process.env.VITE_TU_LITE = 'true';

const args = process.argv.slice(2);
const command = args[0] ?? 'build';
const passthrough = args.slice(1);

const tauriArgs = [
    command,
    '--config',
    path.join('src-tauri', 'tauri.lite.conf.json'),
    '--features',
    'tu-lite',
    ...passthrough,
];

const child = spawn(process.execPath, [path.join(__dirname, 'tauri-wrapper.js'), ...tauriArgs], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
});

child.on('exit', (code, signal) => {
    if (signal) {
        process.kill(process.pid, signal);
        return;
    }
    process.exit(code ?? 0);
});
