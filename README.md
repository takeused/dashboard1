# Claude Code Project Timeline

Claude·CODEX로 진행한 작업들을 한눈에 정리한 단일 페이지 대시보드.
타임라인 뷰와 네트워크(그래프) 뷰를 제공한다.

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
| `index.html` | 대시보드 본체 (단일 파일, 무빌드). 타임라인 + 네트워크 뷰 |
| `projects.json` | **프로젝트 데이터 단일 원본** |
| `scripts/build-data.js` | `projects.json` → `index.html` 인라인 배열 + `network-flow/src/projects.js` 재생성 |
| `network-flow/` | 네트워크 뷰를 React Flow로 분리한 실험 페이지 (Vite) |

## 데이터 수정 워크플로

프로젝트를 추가·수정할 때는 **`projects.json`만 고치고** 빌드 스크립트를 돌린다.

```bash
node scripts/build-data.js
```

`index.html`은 `file://` 더블클릭 실행을 유지하려고 데이터를 인라인으로 품고 있어서,
손으로 두 곳을 고치는 대신 빌드가 양쪽(`index.html`, `network-flow`)을 자동 갱신한다.

## 기능

- 그룹(회사/집)·카테고리·상태 필터, 검색, URL 상태 동기화
- 타임라인 뷰 / 네트워크 뷰 전환 (옵시디언 그래프뷰 스타일)
- 네트워크 뷰: 팬·줌·노드 드래그, 연결 수에 비례한 노드 크기
- 라이트/다크 테마 토글 (OS 설정 따름, 선택값은 저장됨)
- 맨 위로 가기 버튼

## network-flow (실험)

```bash
cd network-flow
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
```
