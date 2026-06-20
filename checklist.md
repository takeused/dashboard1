# 체크리스트 — 네트워크 뷰 인터랙션 강화 + React Flow 분리

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

## 알려진 사항
- Task 2를 헤드리스 프리뷰로 열면 React Flow가 컨테이너 크기를 0으로 측정(에러 #004)해
  엣지 path와 fitView가 적용되지 않는다. ResizeObserver 미발화로 인한 프리뷰 환경 한계이며,
  일반 브라우저(`npm run dev`)에서는 정상 렌더된다.
