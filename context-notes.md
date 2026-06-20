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
