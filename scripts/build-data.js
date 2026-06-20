// projects.json(단일 원본)을 읽어 index.html 인라인 배열과 network-flow/src/projects.js를 재생성하는 빌드 스크립트
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const projects = JSON.parse(fs.readFileSync(path.join(root, 'projects.json'), 'utf8'));

// 객체 1개당 1줄로 직렬화 (diff 가독성 유지)
const body = projects.map(p => '  ' + JSON.stringify(p)).join(',\n');

// 1) index.html 인라인 배열 교체 (file:// 더블클릭 실행 유지를 위해 인라인 데이터 사용)
const htmlPath = path.join(root, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const re = /const projects = \[[\s\S]*?\n\];/;
if (!re.test(html)) throw new Error('index.html에서 projects 배열을 찾지 못함');
html = html.replace(re, `const projects = [\n${body}\n];`);
fs.writeFileSync(htmlPath, html);

// 2) network-flow/src/projects.js 재생성 (번들러용 ES 모듈)
const jsPath = path.join(root, 'network-flow', 'src', 'projects.js');
const header = '// projects.json에서 자동 생성됨 — 직접 수정 금지 (원본: ../../projects.json, 빌드: scripts/build-data.js)';
fs.writeFileSync(jsPath, `${header}\nexport const projects = [\n${body}\n];\n`);

console.log('재생성 완료:', projects.length, '개 → index.html, network-flow/src/projects.js');
