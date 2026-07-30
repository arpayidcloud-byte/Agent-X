// Security: SAST/DAST integration script
import { spawn } from 'child_process';

async function runSecurityScan() {
  console.log('🧪 Running security scans for Agent-X...');
  
  // SAST (Static)
  const sast = spawn('pnpm', ['run', 'lint', '--', '--fix']);
  sast.stdout.on('data', data => process.stdout.write(data));
  sast.stderr.on('data', data => process.stderr.write(data));
  
  await new Promise(res => sast.on('close', res));
  
  // DAST (dependency audit)
  const audit = spawn('pnpm', ['audit']);
  audit.stdout.on('data', data => process.stdout.write(data));
  audit.stderr.on('data', data => process.stderr.write(data));
  
  await new Promise(res => audit.on('close', res));
  
  console.log('✅ Security scans complete');
}