// projects.json의 데이터 건강 상태(필수 필드·URL 누락·태그 별칭·설명 길이)를 점검하는 리포트 스크립트.
// 사용법: node scripts/check-data.js   (오류가 있으면 종료 코드 1, 경고만 있으면 0)
const fs = require('fs');
const path = require('path');

const projects = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'projects.json'), 'utf8'));

const CATS = new Set(['ai', 'data', 'doc', 'mcp', 'util', 'finance']);
const STATUSES = new Set(['done', 'wip']);
const GROUPS = new Set(['work', 'home']);
const DESC_MAX = 150;

// 같은 뜻인데 표기가 갈라진 태그 → 표준 태그. 새로 추가할 때 이 목록의 왼쪽 표기를 쓰면 경고한다.
const TAG_ALIASES = {
  '웹 스크래핑': 'Web Scraping',
  '멀티 에이전트': '멀티에이전트',
  'Fine-tuning': '파인튜닝',
  '시각화': '데이터 시각화',
  '한국 공공데이터': '공공데이터',
  'R&D 기획': 'R&D',
  'HWPX': 'HWP',
  '스킬 관리': 'Skills',
};

const errors = [];
const warns = [];
const label = p => `${p.date} ${p.name}`;

const seenNames = new Map();
projects.forEach(p => {
  if (!p.name || !p.desc || !p.date) errors.push(`필수 필드(name/desc/date) 누락: ${label(p)}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date || '')) errors.push(`날짜 형식 오류: ${label(p)}`);
  if (!CATS.has(p.cat)) errors.push(`알 수 없는 cat "${p.cat}": ${label(p)}`);
  if (!STATUSES.has(p.status)) errors.push(`알 수 없는 status "${p.status}": ${label(p)}`);
  if (!GROUPS.has(p.group)) errors.push(`알 수 없는 group "${p.group}": ${label(p)}`);
  if (!Array.isArray(p.tags) || p.tags.length === 0) errors.push(`태그 없음: ${label(p)}`);
  if (seenNames.has(p.name)) errors.push(`이름 중복: ${p.name}`);
  seenNames.set(p.name, true);

  const tags = p.tags || [];
  if (new Set(tags).size !== tags.length) errors.push(`한 항목 안에 중복 태그: ${label(p)}`);
  tags.forEach(t => {
    if (TAG_ALIASES[t]) warns.push(`태그 별칭 "${t}" → "${TAG_ALIASES[t]}": ${label(p)}`);
  });
  if (p.desc && p.desc.length > DESC_MAX) warns.push(`설명 ${p.desc.length}자 (>${DESC_MAX}): ${label(p)}`);
});

// wip인데 url이 없는 항목 — 배포처를 알면 채울 후보
const wipNoUrl = projects.filter(p => p.status === 'wip' && !p.url && p.group === 'work');

// 태그 빈도 — 1회 태그가 많으면 기술 지도·Top 차트에 반영되지 않는다
const freq = {};
projects.forEach(p => (p.tags || []).forEach(t => { freq[t] = (freq[t] || 0) + 1; }));
const tagNames = Object.keys(freq);
const singles = tagNames.filter(t => freq[t] === 1);

const section = (title, items) => {
  console.log(`\n${title} (${items.length})`);
  items.forEach(i => console.log('  ' + i));
};

console.log(`프로젝트 ${projects.length}건 · 태그 ${tagNames.length}개 · url 없음 ${projects.filter(p => !p.url).length}건`);
section('✖ 오류', errors);
section('⚠ 경고', warns);
section('○ url 없는 진행 중(wip) 업무 항목 — 배포처 확인 후보', wipNoUrl.map(label));
console.log(`\n○ 1회만 쓰인 태그 ${singles.length}개 (전체 ${tagNames.length}개의 ${Math.round(singles.length / tagNames.length * 100)}%)`);

process.exit(errors.length ? 1 : 0);
