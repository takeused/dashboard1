// projects.json(단일 원본)을 읽어 index.html 인라인 배열을 재생성하는 빌드 스크립트
// (network-flow/는 실험이 종료되어 더 이상 자동 갱신하지 않음 — README 참고)
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const projects = JSON.parse(fs.readFileSync(path.join(root, 'projects.json'), 'utf8'));

// 객체 1개당 1줄로 직렬화 (diff 가독성 유지)
const body = projects.map(p => '  ' + JSON.stringify(p)).join(',\n');

// index.html 인라인 배열 교체 (file:// 더블클릭 실행 유지를 위해 인라인 데이터 사용)
const htmlPath = path.join(root, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const re = /const projects = \[[\s\S]*?\n\];/;
if (!re.test(html)) throw new Error('index.html에서 projects 배열을 찾지 못함');
html = html.replace(re, `const projects = [\n${body}\n];`);
fs.writeFileSync(htmlPath, html);

console.log('재생성 완료:', projects.length, '개 → index.html');
