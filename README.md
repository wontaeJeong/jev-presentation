# Jev 발표 자료

15분 발표, 표지 포함 10장. 같은 내용을 reveal.js와 Slidev로 제작했습니다.
Agent Router CLI 데모는 기존 repo에서 그대로 실행합니다.

## 바로 보기

설치 없이 보려면 `presentation/reveal-standalone.html`을 Chrome/Edge에서 엽니다.
이동은 방향키, 전체 화면은 F, 발표 대본·출처는 N입니다. N을 다시 누르거나 노트 화면을 클릭하면 닫힙니다.

두 버전을 함께 열려면 압축을 푼 폴더에서:

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory presentation/dist/local
```

Windows에서 `python3` 명령이 없으면 `python`으로 바꿉니다.

- 선택 화면: http://localhost:8000/
- reveal.js: http://localhost:8000/reveal/
- Slidev: http://localhost:8000/slidev/

빌드된 파일·한국어 폰트·JS·CSS가 모두 포함되어 있습니다. 발표 열람에는 Node.js 설치나 인터넷 연결이 필요하지 않습니다.
Slidev는 HTML 파일을 직접 여는 대신 위 로컬 서버로 여세요. 해시 라우팅이므로 새로고침도 동작합니다.

## 기존 Agent Router repo에 넣기

1. 이 패키지의 `presentation/`을 기존 repo 루트에 복사합니다.
2. `.github/workflows/jev-presentation-pages.yml`도 같은 상대 경로로 복사합니다.
3. 기존 CLI·Python 코드와 기존 설정은 그대로 둡니다.
4. `presentation/README.md`의 데모 준비 항목에 따라 실행 명령과 결과를 넣습니다.
5. `presentation/dist/`도 commit하여 사내 clone 후 재빌드 없이 열 수 있게 합니다.

이미 GitHub Pages가 있는 repo라면 새 workflow로 덮어쓰지 말고 기존 Pages 빌드에 두 발표 경로를 합치세요.

## 수정·GitHub Pages

자세한 내용은 [presentation/README.md](presentation/README.md)에 있습니다.

이 패키지는 실제 Agent Router repo가 없는 작업공간에서 작성했습니다.
라우터 설명은 대화에서 합의한 설계이며, 실제 CLI 명령·모델명·측정값은 확인 후 반영해야 합니다.
결과 표에 임의의 속도·토큰·정확도를 넣지 않았습니다.
