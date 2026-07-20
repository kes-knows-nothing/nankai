import type { Chapter, Level, Spine } from './types';
import { n5ch1 } from './chapters/n5-ch1';
import { n5ch2 } from './chapters/n5-ch2';
import { n5ch3 } from './chapters/n5-ch3';
import { n5ch4 } from './chapters/n5-ch4';
import { n5ch5 } from './chapters/n5-ch5';
import { n5ch6 } from './chapters/n5-ch6';
import { n5ch7 } from './chapters/n5-ch7';

/**
 * 척추 정의 — 문법 탭의 필터 칩.
 * "챕터를 순서대로 나열한 목차"가 아니라 "같은 축에 꿰인 것들"을 보여주는 게 이 앱의 핵심.
 */
export const SPINES: Spine[] = [
  {
    id: 'wa',
    label: 'は/が',
    color: 'var(--blue)',
    note: '**は/が 척추** — Ch1에서 잡은 "を가 아니라 が인 이유"가 N4·N3까지 그대로 이어져요. N5 안에선 Ch1 하나뿐이지만, 뒤에서 세 번 더 돌아와요.',
    next: [
      { level: 'N4', no: 'Ch15', name: '〜たい / 〜がほしい' },
      { level: 'N4', no: 'Ch16', name: '가능형' },
      { level: 'N3', no: 'Ch23', name: '종속절 안의 が' },
    ],
  },
  {
    id: 'te',
    label: 'て형',
    color: 'var(--good)',
    note: '**て형 척추** — Ch4의 "글자가 통째로 교체되는" 감각 하나로 6개 챕터가 꿰여요. N5에서 이미 3개.',
    next: [
      { level: 'N4', no: 'Ch14', name: '〜てください / 〜てもいい' },
      { level: 'N4', no: 'Ch17', name: '〜たり / 〜ながら' },
      { level: 'N3', no: 'Ch33', name: '〜てしまう / 〜ておく' },
    ],
  },
  {
    id: 'mi',
    label: '未然形',
    color: 'var(--purple)',
    note: '**未然形 척추** — Ch7의 あ단(未然形)을 잡으면 부정·의지·수동·사역이 전부 같은 자리에서 나와요.',
    next: [
      { level: 'N4', no: 'Ch22-A', name: '수동·사역 입문' },
      { level: 'N3', no: 'Ch25', name: '수동태 (受け身)' },
      { level: 'N3', no: 'Ch26', name: '사역 (使役)' },
      { level: 'N3', no: 'Ch27', name: '사역수동' },
    ],
  },
];

/** 본문이 아직 없는 챕터를 짧게 선언하기 위한 헬퍼. 잠금이 아니라 그냥 빈 챕터다. */
const stub = (
  no: string,
  title: string,
  kind: Chapter['kind'],
  extra: Partial<Chapter> = {},
): Chapter => ({
  id: `n5-${no.toLowerCase().replace(/\s+/g, '')}`,
  level: 'N5',
  no,
  title,
  kind,
  status: 'open',
  ...extra,
});

export const N5: Level = {
  id: 'N5',
  parts: [
    {
      label: 'N5 PART 1',
      title: '조사와 동사 활용',
      desc: '문장의 뼈대를 세우고 동사를 굴린다',
      blocks: [
        {
          id: 'a',
          label: '블록 A',
          title: '조사 3부작',
          chapters: [n5ch1, n5ch2, n5ch3],
        },
        {
          id: 'b',
          label: '블록 B',
          title: '동사 활용',
          note: 'Ch4는 그룹 판정이 뒤 4개 챕터의 관문이라 드릴이 가장 많아요.',
          chapters: [n5ch4, n5ch5, n5ch6, n5ch7, stub('CH 8', '의지형·명령형', '활용', { spine: 'mi' })],
        },
        {
          id: 'c',
          label: '블록 C',
          title: '명사문·형용사',
          chapters: [
            stub('CH 9', '명사문 だ/です', '개념'),
            stub('CH 10', 'い형용사', '활용'),
            stub('CH 11', 'な형용사 (형용동사)', '활용'),
          ],
        },
        {
          id: 'd',
          label: '블록 D',
          title: '존재·정중체·보강',
          note: 'Ch13-A의 의문사는 Ch1 예외①(의문사는 무조건 が)과 직결돼요.',
          chapters: [
            stub('CH 12', 'あります / います', '개념'),
            stub('CH 13', 'ます형 심화', '활용'),
            stub('CH 13-A', 'こそあど + 의문사', '개념', { spine: 'wa' }),
            stub('CH 13-B', '기초 부사·접속사', '개념'),
          ],
        },
      ],
    },
  ],
};

export const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

/** 레벨 하나를 통째로 꺼낸다. 아직 N5만 콘텐츠가 있다. */
export function getLevel(id: string): Level | undefined {
  return id === 'N5' ? N5 : undefined;
}

/** id로 챕터 찾기. 라우트에서 쓴다. */
export function getChapter(id: string): Chapter | undefined {
  for (const part of N5.parts)
    for (const block of part.blocks) {
      const hit = block.chapters.find((c) => c.id === id);
      if (hit) return hit;
    }
  return undefined;
}

export function getSpine(id: string | undefined): Spine | undefined {
  return SPINES.find((s) => s.id === id);
}
