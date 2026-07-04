# 프로젝트 네트워크 (React Flow) — 아카이브된 실험

> **이 실험은 종료되었다.** 대시보드 본체(`../index.html`)의 인라인 SVG 네트워크 뷰가 팬/줌/드래그,
> 라이브 force 시뮬레이션, 스토리 재생까지 갖추며 이 실험의 목적을 이미 넘어섰기 때문이다.
> `scripts/build-data.js`는 더 이상 아래 `src/projects.js`를 갱신하지 않으므로, 이 폴더의 데이터는
> `../projects.json` 대비 오래된 상태일 수 있다. 신규 기능은 `../index.html`에서만 개발한다.

대시보드(`../index.html`)의 네트워크 뷰를 React + [React Flow](https://reactflow.dev)로 분리해 보았던 standalone 페이지다. 타임라인 등 나머지 대시보드는 무빌드 단일 HTML 그대로 유지된다.

## 실행

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # dist/ 정적 빌드
npm run preview  # 빌드 결과 미리보기
```

## 기능
- 프로젝트 = 노드(카테고리별 색), 태그 2개 이상 공유 = 엣지
- React Flow 기본 제공: 팬 / 줌 / 노드 드래그 / 미니맵 / 컨트롤
- 카테고리 필터, 노드 클릭 시 상세 정보 패널

## 데이터
`src/projects.js`는 `../index.html`의 `projects` 배열 **복사본**이다. file:// 더블클릭 실행을 유지하려고 원본 대시보드는 인라인 데이터를 그대로 둔다. 원본을 바꾸면 이 파일도 함께 갱신해야 한다.
