// 회사 작업 폴더(예: "D:\01 WORK")를 훑어 projects.json에 없는 폴더를 찾아주는 감사 스크립트.
// 사용법: node scripts/scan-folders.js ["D:\01 WORK"]
const fs = require('fs');
const path = require('path');

const root = process.argv[2] || 'D:/01 WORK';
const projects = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'projects.json'), 'utf8'));

const SKIP_NAMES = new Set(['node_modules', '.git', '.claude']);

// 큐레이션 대상이 아니라고 확정된 폴더 (context-notes.md "영구 제외 확정" 참고)
const EXCLUDED = new Set(['260628 insight']);

// "260622 dashboard" → "2026-06-22" (폴더명 앞 6자리 YYMMDD 관례)
function parseFolderDate(name) {
  const m = name.match(/^(\d{2})(\d{2})(\d{2})/);
  if (!m) return null;
  const [, yy, mm, dd] = m;
  return `20${yy}-${mm}-${dd}`;
}

function isEmptyDir(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath).filter(e => !SKIP_NAMES.has(e));
    return entries.length === 0;
  } catch {
    return false;
  }
}

if (!fs.existsSync(root)) {
  console.error(`경로를 찾을 수 없음: ${root}`);
  process.exit(1);
}

const datesInProjects = new Set(projects.map(p => p.date));
const folders = fs.readdirSync(root, { withFileTypes: true })
  .filter(e => e.isDirectory() && !SKIP_NAMES.has(e.name));

const matched = [];
const unmatched = [];
const empty = [];
const excluded = [];

folders.forEach(e => {
  if (EXCLUDED.has(e.name)) { excluded.push(e.name); return; }
  const full = path.join(root, e.name);
  if (isEmptyDir(full)) { empty.push(e.name); return; }
  const date = parseFolderDate(e.name);
  if (date && datesInProjects.has(date)) matched.push({ name: e.name, date });
  else unmatched.push({ name: e.name, date });
});

console.log(`\n검사 대상: ${root} (${folders.length}개 폴더)\n`);

console.log(`✔ 이미 등록됨 (${matched.length})`);
matched.forEach(m => console.log(`  ${m.date}  ${m.name}`));

console.log(`\n○ 빈 폴더 — 큐레이션 기준상 제외 대상 (${empty.length})`);
empty.forEach(n => console.log(`  ${n}`));

if (excluded.length) {
  console.log(`\n― 영구 제외 확정 — 재검토 불필요 (${excluded.length})`);
  excluded.forEach(n => console.log(`  ${n}`));
}

console.log(`\n⚠ 미등록 후보 — 내용 확인 후 projects.json 추가 검토 (${unmatched.length})`);
unmatched.forEach(u => console.log(`  ${u.date || '(날짜 파싱 실패)'}  ${u.name}`));

console.log(`\n요약: 등록 ${matched.length} · 빈 폴더 ${empty.length} · 제외 확정 ${excluded.length} · 검토 필요 ${unmatched.length}\n`);
