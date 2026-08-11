import fs from 'fs';
import path from 'path';

// Path to the public folder
const publicPath = path.join(process.cwd(), 'public');

// Ensure public folder exists
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}

// Content of roboto.txt
const content = `
Roboto Font License
...
`;

// Write the file
fs.writeFileSync(path.join(publicPath, 'roboto.txt'), content.trim());

console.log('✅ roboto.txt generated in public folder');
