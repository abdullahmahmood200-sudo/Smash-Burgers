import { readFileSync, writeFileSync } from 'node:fs';

const SRC = 'D:/Burger Website/smash-burgers-handoff/smash-burgers-design-customization/project/Smash Burgers - Animated.dc.html';
const OUT = 'D:/Burger Website/site/index.html';

const src = readFileSync(SRC, 'utf8');

// --- extract <x-dc> template ---
const xdcOpen = src.indexOf('<x-dc>');
const xdcClose = src.lastIndexOf('</x-dc>');
let template = src.slice(xdcOpen + '<x-dc>'.length, xdcClose);

// --- pull helmet content out into <head> ---
const helmetMatch = template.match(/<helmet>([\s\S]*?)<\/helmet>/i);
const helmet = helmetMatch ? helmetMatch[1].trim() : '';
template = template.replace(/<helmet>[\s\S]*?<\/helmet>/i, '').trim();

// --- wire the carousel buttons (renderVals -> prev/next) ---
template = template
  .replace(/onClick="\{\{\s*prev\s*\}\}"/g, 'onclick="window.__cmp&&window.__cmp.scrollCards(-1)"')
  .replace(/onClick="\{\{\s*next\s*\}\}"/g, 'onclick="window.__cmp&&window.__cmp.scrollCards(1)"');

// point the MENU link at the real menu page
template = template.replace(/href="Menu\.dc\.html"/g, 'href="menu.html"');

// --- extract the DC logic class, detach it from the runtime base ---
const scriptMatch = src.match(/<script type="text\/x-dc" data-dc-script>([\s\S]*?)<\/script>/);
let logic = scriptMatch[1];
logic = logic.replace(/class\s+Component\s+extends\s+DCLogic\s*\{/, 'class Component {');

const out = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SMASH Burgers</title>
${helmet}
</head>
<body>
${template}

<script>
${logic}

(function () {
  function boot() {
    // Reproduce the runtime's style-hover -> :hover rules.
    var sheet = document.createElement('style');
    document.head.appendChild(sheet);
    var n = 0;
    document.querySelectorAll('[style-hover]').forEach(function (el) {
      var css = el.getAttribute('style-hover');
      if (!css) return;
      var cls = 'scp' + (n++).toString(36);
      el.classList.add(cls);
      try { sheet.sheet.insertRule('.' + cls + ':hover{' + css + '}', sheet.sheet.cssRules.length); } catch (e) {}
    });

    var cmp = new Component();
    window.__cmp = cmp;
    cmp.componentDidMount();
  }
  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
</script>
</body>
</html>
`;

writeFileSync(OUT, out, 'utf8');
console.log('wrote', OUT, out.length, 'bytes');
