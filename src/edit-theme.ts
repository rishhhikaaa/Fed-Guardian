import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Removes recharts import
code = code.replace(/import\s*\{\s*LineChart.*?\}\s*from\s*'recharts';/s, '');

// Colors replacement mapping
// Emerald -> White/Zinc
code = code.replace(/emerald-500\/30/g, 'zinc-700');
code = code.replace(/emerald-500\/50/g, 'zinc-600');
code = code.replace(/emerald-500\/20/g, 'zinc-800');
code = code.replace(/emerald-500\/10/g, 'zinc-800');
code = code.replace(/emerald-500\/60/g, 'zinc-500');
code = code.replace(/emerald-500\/70/g, 'zinc-400');
code = code.replace(/emerald-950\/80/g, 'zinc-900');
code = code.replace(/emerald-950\/50/g, 'zinc-900');
code = code.replace(/emerald-950\/30/g, 'zinc-900');
code = code.replace(/emerald-950\/20/g, 'zinc-900');
code = code.replace(/emerald-950/g, 'zinc-900');
code = code.replace(/emerald-900/g, 'zinc-800');
code = code.replace(/emerald-500/g, 'white');
code = code.replace(/emerald-400/g, 'white');
code = code.replace(/emerald-50/g, 'white');
code = code.replace(/emerald-200\/80/g, 'zinc-300');

// Cyan
code = code.replace(/cyan-950\/30/g, 'zinc-900');
code = code.replace(/cyan-950\/20/g, 'zinc-900');
code = code.replace(/cyan-900/g, 'zinc-800');
code = code.replace(/cyan-500\/70/g, 'zinc-400');
code = code.replace(/cyan-500\/30/g, 'zinc-700');
code = code.replace(/cyan-500\/20/g, 'zinc-800');
code = code.replace(/cyan-500/g, 'white');
code = code.replace(/cyan-400/g, 'white');

// Rose
code = code.replace(/rose-500\/70/g, 'zinc-400');
code = code.replace(/rose-500\/30/g, 'zinc-700');
code = code.replace(/rose-950\/30/g, 'zinc-900');
code = code.replace(/rose-500/g, 'white');

// Amber
code = code.replace(/amber-950\/30/g, 'zinc-900');
code = code.replace(/amber-900/g, 'zinc-800');
code = code.replace(/amber-500\/30/g, 'zinc-700');
code = code.replace(/amber-400/g, 'white');

// Red/Green/Blue left over
code = code.replace(/green-500/g, 'white');
code = code.replace(/red-500/g, 'white');
code = code.replace(/blue-500/g, 'white');

// Shadows related to colors
code = code.replace(/shadow-\[.*?rgba.*?\]/g, 'shadow-sm');
code = code.replace(/shadow-\[.*?theme.*?\]/g, 'shadow-sm');

// Remove Resilience Monitoring block
const lines = code.split('\n');
let newLines = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{/* Performance Chart */}')) {
    skip = true;
    continue;
  }
  
  if (skip) {
    if (lines[i].includes('{/* Audit Logs */}')) {
      skip = false;
      newLines.push(lines[i]);
    }
  } else {
    newLines.push(lines[i]);
  }
}

code = newLines.join('\n');

// Remove data effect and state
code = code.replace(/const \[chartData, setChartData\] = useState<any\[\]>\(\[\]\);\n/, '');
code = code.replace(/\/\/ Simulation effect for data\n\s*useEffect\(\(\) => \{\n\s*const interval = setInterval\(\(\) => \{\n\s*setChartData\(prev => \{\n\s*const newData = \[\.\.\.prev, \{\n\s*time: new Date\(\)\.toLocaleTimeString\(\[\], \{ hour: '2-digit', minute: '2-digit', second: '2-digit' \}\),\n\s*fraud: Math\.random\(\) \* 5,\n\s*performance: 70 \+ Math\.random\(\) \* 25\n\s*\}\]\.slice\(-10\);\n\s*return newData;\n\s*\}\);\n\s*\}, 3000\);\n\s*return \(\) => clearInterval\(interval\);\n\s*\}, \[\]\);\n/g, '');


fs.writeFileSync('src/App.tsx', code);
console.log("Transformation complete.");
