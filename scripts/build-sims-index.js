// Scans public/sims/*.html and builds public/sims/index.json.
// Each simulation declares its own details in a block like:
//   <script type="application/json" id="sim-meta">
//   {"id":"wave-lab","title":"Waves lab","topic":"3",
//    "tabs":[{"id":"ts","title":"Standing waves","keywords":["node","antinode"]}]}
//   </script>
// Single-view sims can skip "tabs" and give "keywords" at the top level.
// Runs automatically before `npm start` and `npm run build`.
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'sims');
const entries = [];
const problems = [];

if (fs.existsSync(dir)) {
  fs.readdirSync(dir)
    .filter((f) => f.endsWith('.html'))
    .sort()
    .forEach((file) => {
      const html = fs.readFileSync(path.join(dir, file), 'utf8');
      const m = html.match(/<script[^>]*id="sim-meta"[^>]*>([\s\S]*?)<\/script>/);
      if (!m) {
        problems.push(`${file}: no sim-meta block, skipped`);
        return;
      }
      let meta;
      try {
        meta = JSON.parse(m[1]);
      } catch (e) {
        problems.push(`${file}: sim-meta is not valid JSON (${e.message}), skipped`);
        return;
      }
      const sim = meta.title || file;
      const views = Array.isArray(meta.tabs) && meta.tabs.length
        ? meta.tabs.map((t) => ({ tab: t.id, title: t.title || sim, keywords: t.keywords }))
        : [{ tab: '', title: sim, keywords: meta.keywords }];
      views.forEach((v) => {
        if (!Array.isArray(v.keywords) || !v.keywords.length) {
          problems.push(`${file}${v.tab ? '#' + v.tab : ''}: no keywords, skipped`);
          return;
        }
        entries.push({
          file,
          sim,
          topic: meta.topic || '',
          tab: v.tab,
          title: v.title,
          keywords: v.keywords.map((k) => String(k)),
        });
      });
    });
}

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify({ entries }, null, 1));
console.log(`Simulation index: ${entries.length} views from ${new Set(entries.map((e) => e.file)).size} file(s)`);
problems.forEach((p) => console.warn('  warning: ' + p));
