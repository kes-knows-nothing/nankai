/**
 * 일본어 음성 합성.
 *
 * 프로토타입 단계에선 브라우저 내장 SpeechSynthesis를 쓴다 (무료·오프라인).
 * 나중에 녹음 음원으로 갈아끼울 때 이 파일만 바꾸면 되도록 호출부는 speak() 하나로 묶어둔다.
 */

let voices: SpeechSynthesisVoice[] = [];

function loadVoices() {
  voices = window.speechSynthesis?.getVoices() ?? [];
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  // 크롬은 음성 목록을 비동기로 채운다
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
}

export function ttsAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.speechSynthesis;
}

/**
 * 일본어로 읽는다. 이미 재생 중이면 끊고 새로 읽는다.
 * @param onEnd 재생이 끝나거나 실패했을 때 (버튼 상태 되돌리기용)
 */
export function speak(text: string, onEnd?: () => void): void {
  if (!ttsAvailable()) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP';
  u.rate = 0.85;

  if (!voices.length) loadVoices();
  const jp = voices.find((v) => v.lang === 'ja-JP' || v.lang === 'ja_JP');
  if (jp) u.voice = jp;

  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();

  window.speechSynthesis.speak(u);
}
