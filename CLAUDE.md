# 니혼고 (nankai)

일본어 문법 학습 웹앱(PWA). 문법 원리 이해 중심 — 단어 암기 앱이 아니다.

## 명령

```bash
npm run dev        # 개발 서버 (5173)
npm run typecheck  # 타입 검사
npm run build      # 빌드
```

## 구조

- **챕터 본문은 JSX가 아니라 타입 있는 데이터다.** `src/content/types.ts`의 `Node[]`/`Block[]`.
- 렌더러는 `src/components/Content.tsx` 하나. 새 챕터 = `src/content/chapters/`에 데이터 파일 하나 추가 후 `src/content/n5.ts`에 배선.
- 챕터 상세는 **🇰🇷 한국어 / 🇯🇵 일본식 / 📌 정리** 3탭. 이 셋은 절대 통합하지 않는다.
- `spine`(척추)이 데이터 1급 시민 — 챕터를 가로지르는 축이고 문법 탭의 필터가 된다.

## 콘텐츠를 쓰거나 고칠 때

**`docs/CONTENT_STYLE.md`를 먼저 읽는다.** 챕터 본문 작성 규칙이 거기 있다.
가장 자주 어기는 것: 화면의 모든 일본어에는 한글 독음이 붙어야 한다 (프로즈 안에 언급하는 단어까지 포함).
