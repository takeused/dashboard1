# Claude Code Project Timeline

Claude·CODEX로 진행한 작업들을 한눈에 정리한 단일 페이지 대시보드.
타임라인 뷰 · 네트워크(그래프) 뷰 · 기술 지도(태그 공출현) 뷰를 제공한다.

## 실행

빌드가 필요 없는 단일 HTML이다.

- **간단히**: `index.html`을 브라우저로 더블클릭해서 열면 된다 (`file://`).
- **정적 서버로**: 일부 기능을 정상 환경에서 보려면 정적 서버 권장.
  ```bash
  npx serve .        # 또는 python -m http.server
  ```

## 구조

| 경로 | 설명 |
|---|---|
| `index.html` | 대시보드 본체 (단일 파일, 무빌드). 타임라인 + 네트워크 + 기술 지도 뷰 |
| `projects.json` | **프로젝트 데이터 단일 원본** |
| `scripts/build-data.js` | `projects.json` → `index.html` 인라인 배열 재생성 |
| `scripts/scan-folders.js` | 작업 폴더(예: `D:\01 WORK`)를 훑어 `projects.json`에 없는 폴더를 찾아주는 감사 스크립트 |
| `network-flow/` | (아카이브) 네트워크 뷰를 React Flow로 분리했던 실험 페이지 — 더 이상 갱신하지 않음, 아래 참고 |

## 데이터 수정 워크플로

프로젝트를 추가·수정할 때는 **`projects.json`만 고치고** 빌드 스크립트를 돌린다.

```bash
node scripts/build-data.js
```

`index.html`은 `file://` 더블클릭 실행을 유지하려고 데이터를 인라인으로 품고 있어서,
손으로 직접 고치는 대신 빌드가 자동 갱신한다.

새 프로젝트 폴더를 놓치지 않았는지 확인하려면:

```bash
node scripts/scan-folders.js "D:\01 WORK"
```

## 기능

- 그룹(회사/집)·카테고리·상태·시리즈·월 필터, 검색, URL 상태 동기화
- 타임라인 뷰 (월별 스티키 헤더, 정렬 순서 토글, 시리즈·NEW 뱃지, 딥링크 공유) / 네트워크 뷰 / 기술 지도 뷰(태그 공출현) 전환
- 네트워크 뷰: 팬·줌·노드 드래그, 연결 수에 비례한 노드 크기
- 라이트/다크 테마 토글 (OS 설정 따름, 선택값은 저장됨)
- 맨 위로 가기 버튼, Markdown 작업 보고서 내보내기, 공유 카드 PNG 저장

## network-flow (아카이브된 실험)

네트워크 뷰를 React Flow로 분리해 보던 실험 페이지. 인라인 SVG 네트워크 뷰가 라이브 force
시뮬레이션·스토리 재생 등으로 이미 그 이상을 구현했기 때문에 실험을 마감했다.
`projects.js`는 더 이상 `build-data.js`가 갱신하지 않으므로 최신 프로젝트 데이터와 어긋날 수 있다.
그대로 두되 신규 기능 개발은 `index.html` 쪽에서만 진행한다.

```bash
cd network-flow
npm install
npm run dev      # 개발 서버 (데이터는 마지막 갱신 시점 기준, 최신이 아닐 수 있음)
npm run build    # 프로덕션 빌드
```
