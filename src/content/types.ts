/**
 * 콘텐츠 스키마.
 *
 * 원칙: 챕터 본문은 JSX가 아니라 데이터다. 렌더러(엔진)는 한 번만 만들고,
 * 챕터는 이 타입을 만족하는 파일을 하나씩 부어넣어 늘린다.
 * 나중에 Supabase로 옮길 때도 이 모양 그대로 테이블/JSON이 된다.
 */

/** 문법 척추 — 여러 챕터를 하나로 꿰는 축. 챕터·필터 양쪽에서 쓴다. */
export type SpineId = 'wa' | 'te' | 'mi';

export interface Spine {
  id: SpineId;
  /** 칩에 보이는 짧은 이름 */
  label: string;
  /** 강조색 (CSS 변수명) */
  color: string;
  /** 필터를 켰을 때 뜨는 설명. **굵게** 지원 */
  note: string;
  /** 이 척추가 앞으로 이어지는 챕터들 */
  next: { level: string; no: string; name: string }[];
}

/** 챕터 성격 태그 */
export type ChapterKind = '개념' | '활용';

/** 학습 상태. 잠금 개념은 없다 — 전부 열려 있고 진행도만 다르다. */
export type ChapterStatus = 'done' | 'now' | 'open';

/** ── 챕터 본문을 이루는 블록들 ─────────────────────────────── */

/**
 * 예문 한 줄. 재생 버튼 + 일본어 + 읽기.
 * `mark`는 강조할 부분 문자열. "A → B" 꼴에서 강조는 항상 뒤쪽(B)에 있으므로
 * 마지막 출현을 강조한다.
 */
export interface Example {
  jp: string;
  /** 읽기 · 뜻 (예: "타베나이 · 안 먹는다") */
  read: string;
  /** TTS로 읽을 텍스트. 없으면 jp에서 화살표 뒷부분을 읽는다. */
  speak?: string;
  mark?: string;
  markTone?: 'blue' | 'warn' | 'good';
}

export type Block =
  /** 문단. **굵게** 지원 */
  | { kind: 'p'; text: string; center?: boolean; small?: boolean }
  | ({ kind: 'ex' } & Example)
  /** 글자 교체 시각화: 飲[む] → 飲[ま]ない. tail 생략 가능 (書く→書いた) */
  | { kind: 'swap'; stem: string; from: string; to: string; tail?: string }
  /** 활용 대조표 — 첫 칸이 "끝글자"로 크게 강조되는 특수형 */
  | {
      kind: 'table';
      head: [string, string, string];
      rows: { end: string; form: string; ex: string; trap?: boolean }[];
    }
  /** 범용 표 — 열 수 자유, 첫 칸 특별대우 없음. 셀은 **굵게** 지원 */
  | {
      kind: 'grid';
      head: string[];
      rows: { cells: string[]; trap?: boolean }[];
    }
  /** 외우는 리듬 카드 (다크 배경). **굵게**가 주황으로 강조된다. 표만 던지지 않기 위한 장치 */
  | { kind: 'rhythm'; text: string };

export type Node =
  | { kind: 'section'; n?: number; title: string; body: Block[] }
  /** bridge = 🌉 두 관점(🇰🇷/🇯🇵)을 잇는 초록 콜아웃 */
  | { kind: 'callout'; tone: 'warn' | 'tip' | 'bridge'; title: string; body: Block[] }
  /** 정리 탭의 다크 트리 다이어그램 */
  | { kind: 'tree'; lines: { text: string; hl?: string; note?: string }[] }
  /** 번호 뱃지가 붙은 핵심 요약 */
  | { kind: 'keys'; items: string[] }
  /** 다음 챕터로 넘어가는 카드 */
  | { kind: 'next'; label: string; title: string; sub: string; to?: string };

/** ── 챕터 ─────────────────────────────────────────────────── */

export interface Chapter {
  /** 라우트에 쓰이는 id. 예: 'n5-ch7' */
  id: string;
  level: string;
  /** 리스트에 보이는 번호. 'CH 13-A'처럼 문자가 섞일 수 있어 string */
  no: string;
  title: string;
  kind: ChapterKind;
  /** 이 챕터가 속한 척추 (없을 수 있음) */
  spine?: SpineId;
  /** 척추의 시작점(허브)이면 true — 리스트에서 ⭐ */
  hub?: boolean;
  status: ChapterStatus;
  /** 0~100. 값이 있을 때만 리스트에 표시한다. */
  progress?: number;

  /** ── 아래는 본문이 있는 챕터만 채운다 ── */
  detail?: {
    /** 상위 네비에 보이는 단원명 */
    unit: string;
    /** 파란 박스 한 줄 요약. **굵게** 지원 */
    summary: string;
    panes: {
      /** 🇰🇷 한국어 직관 */
      ko: Node[];
      /** 🇯🇵 일본 학교문법 */
      jp: Node[];
      /** 📌 정리 */
      sum: Node[];
    };
    /** 하단 CTA 문항 수 */
    quizCount?: number;
  };
}

/** 챕터 묶음 (블록 A, 블록 B …) */
export interface Block_ {
  id: string;
  label: string;
  title: string;
  chapters: Chapter[];
  /** 리스트 아래 회색 참고 문구 */
  note?: string;
}

/** 레벨 안의 큰 파트 */
export interface Part {
  label: string;
  title: string;
  desc: string;
  blocks: Block_[];
}

export interface Level {
  id: string;
  parts: Part[];
}
