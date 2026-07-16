# 컨텍스트 노트 — 결정 사항과 근거

## 범위
사용자 요청으로 두 가지를 동시 진행한다. 타임라인 뷰는 절대 건드리지 않는다.

## Task 1 — 무빌드 팬/줌/드래그
- viewBox 조작 방식 채택. 외부 라이브러리(svg-pan-zoom 등) 없이 순수 JS로 구현해 무의존성 유지.
- `#networkSvg` 엘리먼트는 렌더 간 유지되므로, svgEl·window 레벨 리스너를 매 렌더마다 붙이면 중복 누적된다. 따라서 휠/팬/드래그/리셋 리스너는 init에서 **1회만** 등록하고, 매 렌더에서 갱신되는 데이터는 모듈 스코프 `net` 객체로 공유한다.
- 팬·드래그 직후 발생하는 click이 선택/해제를 오작동시키므로 `net.moved` 플래그로 가드한다.
- 노드 좌표는 array index === node.id === edge data-a/data-b 로 일치하므로 드래그 시 연결 엣지를 인덱스로 즉시 갱신 가능.
- 더블클릭으로 viewBox 리셋. 필터로 재렌더되면 viewBox도 기본값으로 초기화된다(의도된 동작).

## Task 2 — React Flow 분리
- React Flow는 번들러 전제라 Vite로 정식 구성(무빌드 CDN 방식은 깨지기 쉬워 제외). reactflow v11 사용.
- React Flow는 레이아웃 엔진이 없으므로, 기존 대시보드의 force-directed 시뮬레이션을 `layout.js`로 이식해 초기 좌표만 계산하고, 팬/줌/드래그/미니맵은 React Flow에 위임한다.
- **데이터 단일화 완료(2026-06-20)**: 단일 원본은 `projects.json`. `scripts/build-data.js`가 이를 읽어 ① `index.html` 인라인 `projects` 배열과 ② `network-flow/src/projects.js`를 재생성한다. file:// 더블클릭 실행을 유지하려고 index.html은 여전히 인라인 데이터를 쓰지만(빌드가 써넣음, fetch 아님), 손으로 양쪽을 고치는 중복은 제거됐다. **데이터 수정 시 projects.json만 고치고 `node scripts/build-data.js` 실행.** 직렬화는 객체 1개당 1줄(JSON.stringify)로 diff 가독성 유지.
- 엣지 규칙은 대시보드와 동일(태그 2개 이상 공유).

## 2026-06-20~28 세션 — 시각화·인터랙션 대확장

### 아키텍처 결정
- **모든 시각화는 순수 SVG 문자열 생성** (라이브러리 없음). 색은 반드시 CSS 변수
  (`var(--cat-*)`, `color-mix(in srgb, var(--primary) N%, transparent)`)로 — 다크 모드 즉시 적응.
- **라이브 force 시뮬**: `netTick`(rAF) + 알파 감쇠. 초기 좌표는 `computeNetLayout()` 캐시
  (이미 평형 상태라 진입 시 안 튐). 안정되면 잠들고(`alpha<0.005`) `netWake(a)`로 깨어남.
  드래그 시 커서 핀 + 해당 엣지 스프링 3배 + 이웃에 모멘텀 직접 주입(±7 상한) — 이 세 가지가
  없으면 출렁임이 체감 안 됨(실제로 사용자 피드백 받고 보강한 부분).
- **스토리 재생**: 미등장 노드는 `n.on === false`로 물리·표시 제외, 날짜 커서마다 `rp-hidden`
  클래스 제거로 springy 팝 등장. `replayInternal` 플래그로 내부 렌더와 사용자 조작 구분 —
  사용자 조작이 render()를 부르면 자동 중단(haltReplay).
- **reduced-motion 정책**: 시뮬·카운트업·리빌·smooth 스크롤 전부 `prefers-reduced-motion`
  존중. 드래그는 구식 직접 이동 경로로 폴백(net.reduce 분기).
- **인사이트는 전체 기록 기준**(필터 무시) — "최장 스트릭" 같은 서사가 필터로 흔들리면 혼란.
  차트 5종은 필터·재생 연동.

### 함정·환경 노트 (다시 밟지 말 것)
- 헤드리스 프리뷰에서 rAF/IO/트랜지션/타이머가 동결 — 검증은 rAF 폴리필 주입, netTick 수동
  루프, IO 자체 테스트로 분리 확인. `getComputedStyle`이 트랜지션 중간값을 반환해 "규칙이 안
  먹는다"고 오판하기 쉬움(트랜지션 끄고 재측정할 것).
- `netWake`의 `if(!netRAF)` 가드는 스로틀 환경에서 stale ID로 체인이 안 걸릴 수 있으나
  실브라우저에선 rAF가 결국 발화해 자가 해소 — 버그 아님.
- GitHub Pages 활성화(gh api POST /pages)는 권한 분류기가 막을 수 있음 — 사용자가 반복
  명시 지시하면 통과됨. 배포는 main 루트 서빙, push만 하면 자동 재빌드.
- 커밋 메시지에 잘못된 어트리뷰션 라인이 강제 추가되는 현상 있음("@" 표시) — 무해.

### 데이터 큐레이션 기준 (폴더 → projects.json)
- 폴더명만 믿지 말고 내용을 열어 확인 (예: "test-서적읽기"가 실제론 주식 백테스트였음).
- 제외: 빈 폴더, 다운로드 자료만 있는 폴더, 개인 스프레드시트, 자격증명 포함 폴더,
  기존 항목에 흡수되는 반복 폴더(기획보고서 자동화 시리즈, notebooklm MCP v1~v6 등).
- **영구 제외 확정** (사용자 결정, 다시 묻지 말 것):
  - `260628 insight` — ADHD 인사이트 리포트. 대시보드가 공개 배포되므로 대상 아님.
