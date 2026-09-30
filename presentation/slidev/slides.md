---
theme: none
title: Jev와 의사결정 모델
info: 15분 발표와 Agent Router CLI 비교 데모
author: Jev · Agent Router
canvasWidth: 1280
aspectRatio: 16/9
routerMode: hash
fonts:
  provider: none
  sans: Noto Sans KR
  mono: JetBrains Mono
colorSchema: dark
transition: fade
drawings:
  enabled: false
record: false
print: true
wakeLock: false
download: false
exportFilename: jev-slidev
htmlAttrs:
  lang: ko
defaults:
  layout: none
---

<div class="deck-canvas cover"><div class="cover-name">Jev<span class="period">.</span></div>&#10;      <h1 class="cover-title">소프트웨어의<br>작은 판단들</h1>&#10;      <p class="cover-sub">의사결정 모델과 Agent Router 비교 데모</p>&#10;      <div class="cover-meta"><span>Jev · Agent Router</span><span>2026.09.30</span></div><div class="page-number">01 / 10</div></div>

<!--
오늘은 Jev가 어떤 종류의 AI인지, 기존 분류기나 LLM의 JSON 출력과 어디에서 차이가 나는지 살펴보겠습니다. 마지막에는 긴 업무 요청을 입력하고 일반 LLM과 로컬 Jev-like 라우터가 어떤 결정을 내리는지 CLI에서 비교합니다. 오늘의 초점은 에이전트 전체를 교체하는 것이 아니라 반복되는 작은 판단을 어디에 맡길지입니다.

출처:

-->

---
layout: none
---

<div class="deck-canvas "><h2>Jev 한눈에 이해하기</h2>&#10;      <p class="statement">상황을 읽고,<br><em>보기 중에서 고르는 AI</em></p>&#10;      <div class="comparison-sentence"><div><span class="mono-label">GENERATIVE LLM</span><p>문장·코드·설명 생성</p></div><div v-click><span class="mono-label accent">JEV / SYSTEM ONE</span><p>정해진 답과 판단의 확률</p></div></div>&#10;      <p class="bottom-line">TypeSafe의 의사결정 모델. 코드가 사용할 답의 공간을 개발자가 먼저 정의합니다.</p><div class="page-number">02 / 10</div></div>

<!--
쉽게 말하면 보기 중에서 골라주는 AI입니다. 예를 들어 이 문의를 어느 팀으로 보낼지, 이 요청에 검색이 필요한지 판단합니다. TypeSafe는 Jev를 소프트웨어 안에서 빠르고 좁은 판단을 하는 System One 모델이라고 설명합니다. 일반 LLM도 이런 판단을 할 수 있습니다. 차이는 능력의 유무보다 모델의 목적과 인터페이스에 있습니다. Jev는 자유로운 설명을 작성하는 용도보다 코드가 바로 읽을 수 있는 답과 확률을 반환하는 용도에 초점을 둡니다. 현재 공식 Jev는 텍스트 입력을 받습니다.

출처:
TypeSafe · Introduction
https://docs.typesafe.ai/introduction

TypeSafe · System One
https://docs.typesafe.ai/concepts/system-one
-->

---
layout: none
---

<div class="deck-canvas "><h2>에이전트에서 반복되는 판단</h2>&#10;      <div class="request-strip"><span class="mono-label">USER REQUEST</span><p>“장애 원인을 분석하고, 최신 정보를 확인한 뒤,<br>필요하면 운영 설정을 변경해줘.”</p></div>&#10;      <div class="decision-rows"><div><span class="number">01</span><strong>어느 모델로 보낼까?</strong><code>FAST / STANDARD / REASONING</code></div><div v-click><span class="number">02</span><strong>검색이 필요한가?</strong><code>needs_web</code></div><div v-click><span class="number">03</span><strong>승인이 필요한가?</strong><code>needs_approval</code></div></div>&#10;      <p class="bottom-line">Agent Router는 답변 생성에 앞서 요청의 처리 경로를 결정합니다.</p><div class="page-number">03 / 10</div></div>

<!--
긴 업무 요청 하나에도 여러 판단이 숨어 있습니다. 모델의 수준을 고르는 판단, 외부 정보가 필요한지 판단하는 일, 사용자 승인을 받아야 하는지 판단하는 일이 있습니다. 실제 답변이나 코드 생성은 이후 모델이 수행합니다. 이번 데모에서는 먼저 이 세 판단만 비교합니다. FAST, STANDARD, REASONING은 데모의 처리 경로 이름이며 실제 정확도 순위를 뜻하지 않습니다. 승인 필요 여부의 예측과 실제 실행 권한 확인도 구분해야 합니다. 권한 확인은 애플리케이션 코드가 책임집니다.

출처:
TypeSafe · Intent routing
https://docs.typesafe.ai/patterns/intent-routing
-->

---
layout: none
---

<div class="deck-canvas "><h2>Jev의 입출력과 동작 방식</h2>&#10;      <div class="io-layout"><div class="io-input"><span class="mono-label">INPUT</span><h3>상황 + 타입이 있는 질문</h3><pre><code>state: 긴 업무 요청&#10;&#10;questions:&#10;  route          Choice&#10;  needs_web      Noul&#10;  needs_approval Noul</code></pre></div><div class="io-output" v-click><span class="mono-label accent">OUTPUT</span><h3>코드가 읽을 판단 결과</h3><div class="primitive"><strong>Choice</strong><span>선택값 + 옵션별 확률 + confidence</span></div><div class="primitive"><strong>Noul</strong><span>“예”일 확률, 0~1</span></div><div class="primitive"><strong>Score</strong><span>순서가 있는 등급의 확률 가중 점수</span></div></div></div>&#10;      <p class="bottom-line">Choice·Score의 confidence는 확률 분포에서 계산합니다. 개별 답의 정답 보장은 아닙니다.</p><div class="page-number">04 / 10</div></div>

<!--
입력은 판단 대상인 state와 질문들의 묶음입니다. 여기 보이는 입력은 API 문법 전체가 아니라 데모에 맞춘 개념 예시입니다. Choice는 미리 정의한 옵션 중 하나를 고르고, 옵션별 확률과 confidence를 제공합니다. Noul은 예 또는 참이라는 답의 확률을 제공합니다. 실제 boolean으로 쓸 임계값은 코드에서 정합니다. Score는 순서가 있는 설명형 등급을 정의하고 그 등급 확률로 계산한 가중 점수를 받습니다. Choice와 Score의 confidence는 확률 분포의 집중도를 요약한 값입니다. 0.9가 개별 답이 90퍼센트 확률로 정확하다는 뜻이라고 단정하면 안 됩니다. 이 API는 네트워크에서 JSON으로 전달되고 입력·출력 토큰 사용량도 존재합니다. 생성문을 다시 해석하는 문제를 줄인다는 인터페이스 차이로 설명해야 합니다.

출처:
TypeSafe · Choice
https://docs.typesafe.ai/primitives/choice

TypeSafe · Noul
https://docs.typesafe.ai/primitives/noul

TypeSafe · Score
https://docs.typesafe.ai/primitives/score

TypeSafe · Confidence
https://docs.typesafe.ai/confidence
-->

---
layout: none
---

<div class="deck-canvas "><h2>기존 기술과의 차이</h2>&#10;      <p class="lead">기능은 겹칩니다. <em>무엇을 학습하고 어떤 값으로 반환하는지</em>를 비교합니다.</p>&#10;      <table class="editorial-table"><thead><tr><th>기술</th><th>주로 다루는 문제</th><th>Jev와 비교할 지점</th></tr></thead><tbody>&#10;      <tr><td>Classifier</td><td>분류·라벨 선택</td><td>질문 정의 방식과 확률 보정</td></tr>&#10;      <tr><td>Guardrail</td><td>정책·위험 검사</td><td>Jev가 수행할 수 있는 판단의 활용 목적</td></tr>&#10;      <tr><td>LLM-as-a-Judge</td><td>응답 평가·복합 기준 판단</td><td>설명·추론 필요 여부와 좁은 질문의 적합성</td></tr>&#10;      <tr><td>Structured Output</td><td>출력의 스키마 준수</td><td>형식 준수와 판단 정확도·불확실성은 별개</td></tr>&#10;      </tbody></table><p class="bottom-line" v-click>일반 LLM도 같은 답을 낼 수 있습니다. 속도·품질·출력 처리 비용은 실제로 비교합니다.</p><div class="page-number">05 / 10</div></div>

<!--
Jev로만 할 수 있는 분류가 있는 것처럼 설명할 필요는 없습니다. 분류기는 원래 라벨과 확률을 반환할 수 있습니다. Jev와 비교할 지점은 개발자가 자연어로 좁은 질문과 선택지를 정의하는 인터페이스, 확률 보정, 여러 판단을 묶는 방식입니다. Guardrail은 모델의 종류라기보다 위험이나 정책을 검사하는 목적입니다. LLM-as-a-Judge는 복합 기준과 설명이 필요한 평가에도 유용합니다. Jev에서는 복잡한 판단을 좁은 질문들로 분해하는 접근이 권장됩니다. Structured Outputs는 스키마에 맞는 결과를 받게 해줍니다. 하지만 문법이 맞는다고 판단도 정확해지는 것은 아닙니다. 비교표는 용도와 인터페이스를 설명하는 개념 비교이고 모든 구현에 대한 성능 순위는 아닙니다.

출처:
TypeSafe · System One
https://docs.typesafe.ai/concepts/system-one

OpenAI · Structured outputs
https://developers.openai.com/api/docs/guides/structured-outputs
-->

---
layout: none
---

<div class="deck-canvas "><h2>OpenAI Decisions API와 관련 모델</h2>&#10;      <div class="two-products"><div><span class="mono-label">TYPESAFE</span><h3>Jev / System One</h3><p>텍스트 상태와 타입이 있는 질문</p><p>Choice·Noul·Score</p><p>확률 보정에 초점을 둔 의사결정 모델</p></div><div><span class="mono-label accent">OPENAI · 2026.09.29 발표</span><h3>Decisions API</h3><p>텍스트·이미지 맥락과 질문 집합</p><p>미리 정한 유한한 선택지</p><p>Luna 기반의 실시간 의사결정 API</p></div></div>&#10;      <div class="open-model-line" v-click><strong>로컬 대안</strong><span>Laya 등 공개 모델도 탐색 가능. Ollama 데모의 API·확률·성능은 각각 확인해야 합니다.</span></div>&#10;      <p class="bottom-line">Decisions API는 발표 당시 제한된 프리뷰. 이 발표의 실험 대상은 로컬 Jev-like 라우터입니다.</p><div class="page-number">06 / 10</div></div>

<!--
Jev와 OpenAI Decisions API는 좁은 판단을 소프트웨어에 제공한다는 공통점이 있습니다. 서로 같은 제품이나 호환 API라고 보면 안 됩니다. TypeSafe 공식 문서는 현재 Jev의 입력을 텍스트로 설명합니다. OpenAI가 2026년 9월 29일 발표한 Decisions API는 Luna의 지능을 개발자가 정한 질문 집합에 집중하고 각 답을 유한한 선택지로 제한합니다. 텍스트와 이미지 맥락을 지원한다고 소개했습니다. 발표 당시에는 제한된 프리뷰였습니다. 상세 API와 직접 성능 비교는 이 발표에서 확인하지 않았습니다. 공개 모델 카드의 Laya는 관련 로컬 모델 후보입니다. 그러나 특정 공개 모델이 Ollama로 바로 실행된다거나 공식 Jev의 확률 보정과 속도를 그대로 재현한다고 가정하지 않습니다. 이번 데모는 사용자가 Ollama에 서빙할 Jev-like 엔드포인트와 일반 LLM 라우터를 비교합니다.

출처:
TypeSafe · System One
https://docs.typesafe.ai/concepts/system-one

OpenAI · DevDay 2026 recap (2026-09-29)
https://openai.com/ko-KR/index/devday-2026-recap/

Laya · Official model card
https://huggingface.co/convaiinnovations/laya
-->

---
layout: none
---

<div class="deck-canvas "><h2>적용 사례와 활용 지점</h2>&#10;      <div class="case-list"><div><span class="case-label">실제 유사 사례</span><h3>Claude Code auto mode</h3><p>도구 실행 전 classifier가 행동을 평가.<br>빠른 필터 뒤에 필요한 경우 추가 추론.</p><span class="caption">Anthropic의 구현이며 Jev 사용 사례는 아닙니다.</span></div><div v-click><span class="case-label">공식 활용 패턴</span><h3>Intent routing</h3><p>요청을 분류해 일반 코드·전문 LLM·<br>사람에게 처리 경로를 배정.</p></div><div v-click><span class="case-label">우리의 적용 후보</span><h3>Agent Router / ACE-RTL</h3><p>라우팅 또는 재시도·검증·종료 판단.<br>RTL 생성은 기존 생성형 LLM에 유지.</p></div></div>&#10;      <p class="bottom-line">오늘 시연은 Agent Router. ACE-RTL 통합은 적용 아이디어로 구분합니다.</p><div class="page-number">07 / 10</div></div>

<!--
작은 판단 모델을 에이전트 사이에 넣는 패턴은 이미 보입니다. Anthropic의 공식 auto mode 설명에서는 행동을 실행하기 전 classifier가 검사하고 빠른 필터가 표시한 경우 추가 추론을 수행합니다. 이는 Jev를 사용했다는 사례가 아니라 판단을 생성과 분리하는 유사 사례입니다. classifier 과금 정책은 이 발표의 비교 범위에서 제외합니다. TypeSafe의 공식 intent routing 패턴도 요청에 맞는 handler를 고르는 구조입니다. 우리 프로젝트에서는 Agent Router가 가장 직접적인 데모입니다. ACE-RTL은 RTL 코드 생성은 LLM에 맡기고 재시도, 검증 결과 해석, 종료 여부 같은 판단을 좁혀 적용할 수 있는 후보입니다. ACE-RTL의 Jev 통합이 완료됐다는 의미는 아닙니다.

출처:
Anthropic · Claude Code auto mode
https://www.anthropic.com/engineering/claude-code-auto-mode

TypeSafe · Intent routing
https://docs.typesafe.ai/patterns/intent-routing
-->

---
layout: none
---

<div class="deck-canvas "><h2>Agent Router 데모 구성</h2>&#10;      <p class="lead">같은 긴 요청, 같은 판단 항목. <em>라우터 구현을 비교합니다.</em></p>&#10;      <div class="router-input"><span class="mono-label">SAME REQUEST + SAME DECISION CONTRACT</span><p>route · needs_web · needs_approval</p></div>&#10;      <div class="router-lanes"><div><span class="mono-label">BASELINE</span><h3>일반 LLM</h3><p>로컬 LiteLLM</p><p class="lane-detail">JSON 생성과 결과 검증·정규화</p></div><div><span class="mono-label accent">JEV-LIKE</span><h3>의사결정 라우터</h3><p>로컬 Ollama</p><p class="lane-detail">실제 엔드포인트의 반환 방식에 맞춘 어댑터</p></div></div>&#10;      <div class="router-output"><strong>CLI에서 나란히 비교</strong><span>판단 결과 · 시간 · 토큰 · 원본 출력 · 파싱/오류</span></div>&#10;      <p class="bottom-line">라우팅 판단까지 비교합니다. 선택된 모델·검색·승인 절차는 실제 실행하지 않습니다.</p><div class="page-number">08 / 10</div></div>

<!--
이 구성은 지금까지 합의한 최종 데모 설계입니다. 현재 이 발표 제작 작업공간에는 실제 Agent Router repo가 없으므로 실제 코드와의 일치는 데모 repo에 넣을 때 확인해야 합니다. 두 라우터는 같은 긴 요청과 같은 판단 요구사항을 받습니다. baseline은 로컬 LiteLLM을 통해 일반 LLM이 판단 JSON을 생성합니다. Jev-like 쪽은 Ollama에 서빙한 모델을 실제 반환 형식에 맞춘 어댑터로 연결합니다. Ollama가 JSON을 생성하는 구성이라면 그것도 생성형 경로임을 그대로 표시합니다. 확률을 제공하지 않는 엔드포인트의 confidence를 임의로 만들지 않습니다. 이 데모는 downstream 실행이 아니라 라우팅 판단만 비교합니다. 관측 시간과 토큰, 오류, 결과 일치를 확인합니다.

출처:

-->

---
layout: none
---

<div class="deck-canvas demo"><h2>Agent Router 라이브 데모</h2>&#10;      <span class="mono-label accent">SCENARIO · OPERATIONS</span>&#10;      <blockquote class="long-request">“운영 중인 PostgreSQL에서 오늘 오전부터 응답 지연이 늘었습니다. 첨부한 로그와 설정을 함께 검토해 원인 후보와 확인 순서를 정리해주세요. 사용 중인 버전의 최신 알려진 문제도 찾아보고, 설정 변경이 필요하다면 서비스 영향과 되돌리는 방법을 설명한 뒤 제 승인을 받고 진행해주세요.”</blockquote>&#10;      <div class="demo-bottom"><div><span class="mono-label">판단할 항목</span><p>모델 경로 / 검색 필요 / 승인 필요</p></div><div><span class="mono-label">시연 순서</span><p>대표 요청 → 쉬운 요청 → 직접 입력</p></div></div>&#10;      <p class="bottom-line">여기서 터미널로 전환합니다. 위 문장은 발표용 입력 예시이며 실행 결과를 미리 정하지 않습니다.</p><div class="page-number">09 / 10</div></div>

<!--
4분간 터미널에서 시연합니다. 1분: CLI를 열고 양쪽 연결과 모델명을 확인한 후 이 긴 운영 요청을 넣습니다. 1분: route, 검색, 승인 판단을 먼저 읽고 각 요청의 시간과 토큰을 비교합니다. 1분: 외부 정보도 실행 승인도 필요하지 않은 요약 요청으로 바꿔서 판단이 어떻게 변하는지 확인합니다. 마지막 1분: 청중의 짧은 요청이나 직접 입력으로 한 번 더 비교합니다. 원본 출력과 파싱 오류를 보여주고 누적 지표를 확인합니다. 현재 확인된 CLI 진입점이 없으므로 실행 명령은 만들어 넣지 않았습니다. 데모 repo의 실제 --help와 README에서 확인한 명령을 presentation/demo-config.json의 cliCommand에 넣습니다. API 키나 내부 주소는 발표 화면에서 노출하지 않습니다. 결과가 예상과 다르면 이유를 단정하지 말고 관찰한 차이를 설명합니다.

출처:

-->

---
layout: none
---

<div class="deck-canvas results"><h2>측정 결과와 해석</h2>&#10;      <p class="lead">판단의 품질과 처리 비용을 <em>함께 확인합니다.</em></p>&#10;      <table class="editorial-table results-table"><thead><tr><th>관찰 항목</th><th>일반 LLM</th><th>로컬 Jev-like</th></tr></thead><tbody>&#10;      <tr><td>판단 결과 / 기대값 일치</td><td data-metric="llm.decision">실행 후 확인</td><td data-metric="jev.decision">실행 후 확인</td></tr>&#10;      <tr><td>요청 시간 · 중앙값</td><td data-metric="llm.latency">측정 전</td><td data-metric="jev.latency">측정 전</td></tr>&#10;      <tr><td>입력 / 출력 토큰 · 평균</td><td data-metric="llm.tokens">측정 전</td><td data-metric="jev.tokens">측정 전</td></tr>&#10;      <tr><td>오류 / 파싱 실패</td><td data-metric="llm.errors">측정 전</td><td data-metric="jev.errors">측정 전</td></tr>&#10;      </tbody></table>&#10;      <p class="result-status" data-results-status>현재 실측 데이터 없음. 숫자는 CLI 실행 결과를 받은 뒤 반영합니다.</p>&#10;      <div class="closing-thought"><span class="mono-label">핵심 질문</span><p>이 판단에 어떤 모델이 적합한가?</p></div>&#10;      <p class="bottom-line">로컬 모델·양자화·서빙 설정을 포함한 실험입니다. Jev 공식 서비스의 성능 비교가 아닙니다.</p><div class="page-number">10 / 10</div></div>

<!--
1분 30초 동안 실측 결과를 읽습니다. 단일 요청만으로 일반적인 성능 우위를 결론 내리지 않습니다. 먼저 결과가 맞는지, 기대값은 무엇인지 확인합니다. 그 다음 동일 입력으로 반복한 요청의 중앙값과 오류 수, 입력·출력 토큰을 읽습니다. 모델별 tokenizer가 다르므로 토큰 수만으로 계산 비용이 같다고 단정하지 않습니다. 입력이 길면 양쪽 입력 토큰이 주된 비용일 수 있습니다. 모델 크기와 양자화, 서버 상태, warm-up, 캐시 등의 조건도 구분합니다. 확률이 없으면 없는 상태로 표시합니다. 지금은 실제 서버와 실행 로그가 없어 값이 비어 있습니다. presentation/results.json에 실제 집계값을 넣고 빌드하면 두 버전에 반영됩니다. 생성은 LLM에 유지하고, 소프트웨어에서 반복되는 좁은 판단을 분리할 가치가 있는지 실제 데이터로 결정하자는 질문으로 끝냅니다.

출처:

-->
