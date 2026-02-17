import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Simple TypeScript to JavaScript transpiler (removes types)
function transpileTS(code) {
    // Remove import type statements
    code = code.replace(/import\s+type\s+\{[^}]+\}\s+from\s+['"][^'"]+['"];?\s*/g, '');
    
    // Remove type annotations from function parameters
    code = code.replace(/(\w+)\s*:\s*[A-Za-z<>[\]|]+(\s*[,)])/g, '$1$2');
    
    // Remove return type annotations
    code = code.replace(/\)\s*:\s*[A-Za-z<>[\]|]+\s*\{/g, ') {');
    
    // Remove property type annotations
    code = code.replace(/((?:public|private|protected)\s+(?:readonly\s+)?\w+)\s*:\s*[A-Za-z<>[\]|]+;/g, '$1;');
    
    // Remove type assertions
    code = code.replace(/as\s+[A-Za-z<>[\]|]+/g, '');
    
    // Remove interface declarations (but keep export for enums/types that might be needed)
    code = code.replace(/export\s+interface\s+\w+\s*\{[^}]+\}/g, '');
    
    // Remove type aliases
    code = code.replace(/export\s+type\s+\w+\s*=\s*[^;]+;/g, '');
    
    return code;
}

// Create dist directory if it doesn't exist
const distDir = join(__dirname, 'dist');
if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true });
}

// Files to transpile
const files = [
    'types.ts',
    'Board.ts',
    'WinChecker.ts',
    'Player.ts',
    'AIPlayer.ts',
    'UIController.ts',
    'Game.ts',
    'main.ts'
];

console.log('Transpiling TypeScript files...');

for (const file of files) {
    const srcPath = join(__dirname, 'src', file);
    const distPath = join(distDir, file.replace('.ts', '.js'));
    
    try {
        let code = readFileSync(srcPath, 'utf8');
        code = transpileTS(code);
        writeFileSync(distPath, code);
        console.log(`✓ ${file} -> ${file.replace('.ts', '.js')}`);
    } catch (error) {
        console.error(`✗ Error transpiling ${file}:`, error.message);
    }
}

console.log('\nBuild complete!');
