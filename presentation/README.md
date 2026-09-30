# 발표 자료 실행과 수정

## 발표

repo 루트에서 실행:

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory presentation/dist/local
```

http://localhost:8000/에서 reveal.js 또는 Slidev를 선택합니다.

| 기능 | reveal.js | Slidev |
|---|---|---|
| 다음 / 이전 | 방향키 | 방향키 |
| 전체 화면 | F | 하단 메뉴 |
| 발표자 노트 | S (새 창) | 하단 메뉴 또는 `/#/presenter/1` |
| 슬라이드 개요 | Esc | 하단 메뉴 |

단일 HTML 버전 `reveal-standalone.html`은 파일을 바로 열 수 있습니다. 노트는 N입니다.

## 내용·디자인 수정

Node.js 24와 npm을 사용합니다. 의존성 설치와 소스 재빌드는 인터넷이 가능한 환경에서 진행하세요.

```bash
cd presentation
npm ci
```

- 두 버전의 공통 내용·대본: `slides.mjs`
- 두 버전의 공통 디자인: `assets/deck.css`
- 읽기 쉬운 대본·출처: `content.md` (생성된 파일)
- reveal.js 직접 편집: `reveal/index.html`
- Slidev 직접 편집: `slidev/slides.md`, `slidev/style.css`

공통 원본을 수정한 뒤:

```bash
npm run generate
npm run build:local
```

`generate`는 두 도구의 편집 파일과 `content.md`를 다시 생성합니다.
각 도구의 파일을 직접 수정했다면 `generate`가 해당 수정을 덮어쓰므로, 그 경우에는 `build:local`만 실행하세요.
디자인 공통 CSS를 수정한 경우에는 `generate`로 두 도구의 assets를 갱신합니다.

Slidev만 개발 모드로 열기:

```bash
cd slidev
npx slidev slides.md
```

## 실제 데모 준비

`demo-config.json`의 `cliCommand`에 실제 repo에서 확인한 실행 명령을 넣습니다.
명령을 넣고 `npm run generate`를 실행하면 9번 슬라이드 발표자 노트에 반영됩니다.

라이브 시연은 다음 순서로 진행합니다.

1. 일반 LLM/LiteLLM 및 Jev-like/Ollama 연결과 모델명 확인.
2. 9번 슬라이드의 긴 운영 요청 실행.
3. 모델 경로·검색·승인 판단 결과 읽기.
4. 시간·토큰·원본 출력·파싱/오류 비교.
5. 단순 요약 요청 및 직접 입력으로 추가 비교.
6. 누적 지표를 확인하고 10번 결과 슬라이드로 복귀.

슬라이드에서 검색·설정 변경·모델 호출을 실행하지 않습니다. 기존 CLI에서 라우팅 판단만 비교합니다.

## 실측 결과 입력

`results.json`은 미측정 상태로 제공했습니다. 실제 CLI 로그에서 집계한 값을 넣고 다음을 실행합니다.

```bash
npm run generate
npm run build:local
```

- `decision`: 실제 관찰한 판단 또는 기대값 일치 요약 문자열
- `median_latency_ms`: 동일 입력·조건으로 반복한 요청 시간의 중앙값 (ms)
- `mean_input_tokens`, `mean_output_tokens`: 평균 토큰 수. 제공되지 않으면 null 유지
- `errors`: 요청 오류 건수
- `parsing_failures`: 파싱 실패 건수 (오류 건수와 중복 여부를 conditions에 설명)
- `requests`: 반복 요청 수
- `conditions`: 모델명·양자화·서빙 설정·입력 세트·warm-up·캐시·실행 일시
- `status`: 양쪽 실제 latency와 requests가 준비되면 `measured`

0과 미제공(null)을 구분합니다. 확률·confidence는 엔드포인트가 실제 제공할 때만 표시합니다.
서로 다른 tokenizer의 토큰 수를 동일 계산 비용이나 가격으로 환산하지 않습니다.

## PDF

`jev-reveal.pdf`와 `jev-slidev.pdf`는 배포·예비 발표용입니다.
발표 내용 변경 후에는 브라우저 인쇄 또는 각 도구의 내보내기로 PDF도 갱신하세요.
두 PDF는 모든 단계별 내용을 포함하고 발표자 노트는 포함하지 않습니다.

## GitHub Pages

1. repo에 `presentation/`과 workflow를 commit/push합니다.
2. GitHub의 Settings > Pages > Build and deployment > Source에서 GitHub Actions를 선택합니다.
3. Actions > Jev presentation on Pages > Run workflow를 누릅니다.
4. 배포된 첫 화면에서 reveal.js / Slidev를 선택합니다.

workflow는 수동 실행만 설정되어 있으며 이 패키지 제작 과정에서는 공개 배포하지 않았습니다.
repository 이름은 `GITHUB_REPOSITORY`에서 가져와 Slidev의 base 경로에 자동 반영합니다.

로컬에서 Pages용 빌드를 만들려면:

```bash
# 실제 repo 이름으로 변경
PAGES_REPO=jev-demo npm run build:pages
```

PowerShell에서는 `$env:PAGES_REPO='jev-demo'`를 설정한 뒤 `npm run build:pages`를 실행합니다.
GitHub user site(`<user>.github.io`) 루트 배포는 현재 프로젝트 Pages 경로 설정과 다르므로 build.mjs의 base를 `/slidev/`로 조정해야 합니다.

## 출처·범위

`content.md`와 `source-register.json`에 2026-09-30 확인한 공식 자료가 있습니다.
OpenAI Decisions API의 프리뷰 상태는 2026-09-29 공식 발표 기준입니다.
Claude Code auto mode는 유사 구조의 사례이며 Jev 사용 사례로 제시하지 않습니다.
ACE-RTL은 적용 후보로만 설명합니다.
Agent Router 설명은 사용자가 합의한 설계이며 실제 구현 완료 여부는 이 작업에서 확인하지 않았습니다.
