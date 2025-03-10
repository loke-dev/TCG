const { execSync } = require('child_process');

// Force using the WebAssembly version of Rollup
process.env.ROLLUP_WASM = 'true';

try {
  // Install the WebAssembly version of Rollup
  console.log('Installing @rollup/wasm-node...');
  execSync('npm install @rollup/wasm-node', { stdio: 'inherit' });

  // Run the build
  console.log('Running build with ROLLUP_WASM=true...');
  execSync('ROLLUP_WASM=true npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}