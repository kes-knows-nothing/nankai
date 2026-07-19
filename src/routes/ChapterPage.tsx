import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { Pane } from '../components/Content';
import { BackIcon } from '../components/Icons';
import { SPINES, getChapter } from '../content/n5';
import { inline } from '../lib/text';

const TABS = [
  { key: 'ko', label: '🇰🇷 한국어' },
  { key: 'jp', label: '🇯🇵 일본식' },
  { key: 'sum', label: '📌 정리' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export function ChapterPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('ko');
  const scrollRef = useRef<HTMLDivElement>(null);

  const chapter = getChapter(id);
  const detail = chapter?.detail;
  const spine = SPINES.find((s) => s.id === chapter?.spine);

  const back = () => navigate('/grammar');

  const pick = (key: TabKey) => {
    setTab(key);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  if (!chapter) {
    return (
      <Shell>
        <nav className="dnav">
          <button type="button" className="dnav__back" onClick={back} aria-label="뒤로">
            <BackIcon />
          </button>
          <div className="dnav__title">문법</div>
        </nav>
        <div className="scroll">
          <div className="empty">
            <div className="empty__mark">🔍</div>
            <div className="empty__title">없는 챕터예요</div>
            <div className="empty__sub">주소를 다시 확인해 주세요.</div>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <nav className="dnav">
        <button type="button" className="dnav__back" onClick={back} aria-label="뒤로">
          <BackIcon />
        </button>
        <div className="dnav__title">
          <em>{chapter.level}</em>
          {detail?.unit ?? '문법'}
        </div>
      </nav>

      <header className="chead">
        <h1 className="chead__title">{chapter.title}</h1>
        <div className="chead__tags">
          <span className={`tag tag--${chapter.kind === '개념' ? 'concept' : 'conj'}`}>
            {chapter.kind}
          </span>
          {spine && (
            <span className={`tag tag--${spine.id}${chapter.hub ? ' is-hub' : ''}`}>
              {spine.label} 척추
            </span>
          )}
        </div>
        {detail && <div className="chead__summary">{inline(detail.summary)}</div>}
      </header>

      {detail && (
        <div className="seg">
          <div className="seg__wrap">
            <div
              className="seg__ind"
              style={{ transform: `translateX(${TABS.findIndex((t) => t.key === tab) * 100}%)` }}
            />
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={t.key === tab ? 'seg__btn is-on' : 'seg__btn'}
                onClick={() => pick(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="scroll" ref={scrollRef}>
        {detail ? (
          <Pane key={tab} nodes={detail.panes[tab]} />
        ) : (
          <div className="empty">
            <div className="empty__mark">✍️</div>
            <div className="empty__title">아직 안 쓴 챕터예요</div>
            <div className="empty__sub">
              {chapter.no} {chapter.title}
              <br />
              콘텐츠를 채우면 여기에 바로 나와요.
            </div>
          </div>
        )}
      </div>

      {detail?.quizCount && (
        <div className="cta">
          <button type="button" className="cta__btn">
            문제 풀기 <span className="cta__count">함정 {detail.quizCount}문항</span>
          </button>
        </div>
      )}
    </Shell>
  );
}
