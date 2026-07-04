# 체크리스트 — Claude Code Project Timeline 대시보드

## Task 1 — 기존 SVG 네트워크 뷰에 팬/줌/드래그 (무빌드, index.html)
- [x] 모듈 스코프 `net` 상태 추가
- [x] renderNetwork에서 `net` 채우기 + 클릭 핸들러에 드래그 가드 추가
- [x] init 1회: 휠 줌 / 배경 팬 / 노드 드래그 / 더블클릭 리셋
- [x] window mousemove·mouseup 리스너 중복 등록 방지 (1회만)
- [x] 인라인 스크립트 `node --check` 문법 통과

## Task 2 — 네트워크 뷰만 React + React Flow 페이지로 분리 (network-flow/)
- [x] Vite + React + reactflow 스캐폴딩 (package.json, vite.config.js, index.html, main.jsx)
- [x] projects.js — index.html 데이터 추출 (62개 확인)
- [x] layout.js — 기존 force-directed 레이아웃 이식 (초기 좌표)
- [x] App.jsx — 노드(카테고리 색)·엣지(태그≥2)·MiniMap·Controls·카테고리 필터·정보 패널
- [x] .gitignore (node_modules, dist) + README
- [x] `npm install` → `npm run build` 성공 (199 modules, dist 생성)
- [x] dev 서버 런타임 확인 — 노드 62·핸들 124·엣지 51(상태) 렌더, JS 에러 없음

## Task 3 — 프로젝트 데이터 JSON 단일화 (2026-06-20)
- [x] index.html 인라인 배열을 추출해 `projects.json` 단일 원본 생성 (62개)
- [x] `scripts/build-data.js` — projects.json → index.html 인라인 + network-flow/src/projects.js 재생성
- [x] 빌드 실행 → 양쪽 재생성, `node --check` 통과, 인라인 배열 62개 검증
- [x] `npm run build` 성공(199 모듈) + dev 프리뷰 노드 62·핸들 124·콘솔 에러 0 확인
- 데이터 수정 시: **projects.json만 고치고 `node scripts/build-data.js` 실행**

## Task 4 — 옵시디언 스타일 + 테마 + 배포 (2026-06-20~)
- [x] 네트워크 뷰 옵시디언 그래프뷰 스타일 (원형 노드·연결수 비례 크기·연한 엣지)
- [x] 다크 모드 토글 (Carbon Gray 100 토큰, OS 설정 따름, localStorage 저장)
- [x] 맨 위로 버튼, README, GitHub Pages 배포 → https://takeused.github.io/dashboard1/

## Task 5 — 성능·접근성·인터랙션 (2026-06-20)
- [x] 네트워크 레이아웃 캐시(computeNetLayout) — 필터 시 재시뮬 없음, 좌표 안정
- [x] 검색 150ms 디바운스, 노드 키보드 접근(tabindex·Enter), prefers-reduced-motion
- [x] 태그 클릭 → 검색 (카드·정보 패널 공통 위임)

## Task 6 — 차트·라이브 시뮬·스토리 재생 (2026-06-20)
- [x] SVG 차트 5종: 월별 스택막대·누적 성장곡선·카테고리 분포(클릭→필터)·태그 Top12(클릭→검색)·카테고리 물결(스트림그래프)
- [x] 히트맵 다크모드(color-mix) + 셀 클릭 → 날짜 점프(jumpToDate)
- [x] 라이브 force 시뮬(rAF, 알파 감쇠) — 드래그 시 스프링 3배·모멘텀 주입으로 출렁임
- [x] 노드 호버 이웃 하이라이트, 통계 카운트업(setStat), 차트 진입 리빌(IO+안전망)
- [x] 스토리 재생(startReplay): 날짜 커서 흐르며 노드 팝 등장·히트맵 점등·차트 성장, 조작 시 자동 중단
- [x] 기록 인사이트 6종(renderInsights), 공유 카드 PNG(downloadShareCard, 1200×630)
- [x] OG 메타태그·파비콘, pill 버튼 다크 오버라이드

## Task 7 — 데이터 (2026-06-28)
- [x] D:\01 WORK 폴더 재조사 — 폴더 내용 직접 확인 후 6개 추가 (70→76개)
- [x] 누적 차트 최대값 라벨 잘림 수정 (상단 패딩 T 14→28)

## 다음 후보 (미착수)
- [ ] 네트워크 노드 딥링크 (URL로 특정 프로젝트 포커스 상태 공유)
- [ ] 타임라인 정렬 옵션 (오래된순 토글)
- [ ] network-flow(React Flow 실험) 유지/통합/제거 방향 결정

## 알려진 사항
- Task 2를 헤드리스 프리뷰로 열면 React Flow가 컨테이너 크기를 0으로 측정(에러 #004)해
  엣지 path와 fitView가 적용되지 않는다. ResizeObserver 미발화로 인한 프리뷰 환경 한계이며,
  일반 브라우저(`npm run dev`)에서는 정상 렌더된다.
- Claude Code 헤드리스 프리뷰에서는 rAF·IntersectionObserver·CSS 트랜지션·setTimeout이
  스로틀/동결된다. 시뮬·카운트업·IO 검증은 폴리필 주입 또는 수동 tick 구동으로 해야 하며,
  getComputedStyle의 트랜지션 중간값을 최종값으로 오판하지 말 것.
- 이 저장소는 여러 세션(기기)에서 동시 작업된다. push 전 `git fetch` + `git log HEAD..origin/main`
  확인 후 필요 시 `git pull --rebase`.
