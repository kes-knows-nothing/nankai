import { Fragment, type ReactNode } from 'react';

/**
 * 콘텐츠 문자열의 **굵게**만 처리하는 최소 인라인 렌더러.
 * 마크다운 전체를 끌어오지 않는 건, 콘텐츠에서 필요한 게 이거 하나뿐이기 때문.
 */
export function inline(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/gs);
  return parts.map((chunk, i) =>
    // split의 홀수 인덱스가 캡처된 굵은 부분
    i % 2 === 1 ? <b key={i}>{chunk}</b> : <Fragment key={i}>{chunk}</Fragment>,
  );
}

/**
 * 예문에서 강조할 부분만 <mark>로 감싼다.
 * "A → B" 꼴이 많고 강조는 항상 뒤쪽(B)에 있으므로 마지막 출현을 고른다.
 */
export function marked(jp: string, mark?: string, tone: 'blue' | 'warn' | 'good' = 'blue'): ReactNode {
  if (!mark) return jp;
  const at = jp.lastIndexOf(mark);
  if (at === -1) return jp;
  return (
    <>
      {jp.slice(0, at)}
      <mark className={tone}>{mark}</mark>
      {jp.slice(at + mark.length)}
    </>
  );
}

/**
 * TTS로 읽을 텍스트. speak가 있으면 그것, 없으면 "A → B"의 뒷부분.
 * 화살표가 없으면 전체를 읽는다.
 */
export function speakable(jp: string, speak?: string): string {
  if (speak) return speak;
  const at = jp.lastIndexOf('→');
  return at === -1 ? jp : jp.slice(at + 1).trim();
}
