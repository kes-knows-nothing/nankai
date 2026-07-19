import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { TabBar } from '../components/TabBar';
import { ChevronIcon, SearchIcon } from '../components/Icons';
import { LEVELS, SPINES, getLevel } from '../content/n5';
import type { Chapter, Part, SpineId } from '../content/types';
import { inline } from '../lib/text';

/** 'CH 13-A' → '13-A' — 상태 뱃지에 넣을 짧은 번호 */
function shortNo(no: string): string {
  return no.replace(/^CH\s*/i, '');
}

function ChapterTags({ ch }: { ch: Chapter }) {
  const spine = SPINES.find((s) => s.id === ch.spine);
  return (
    <span className="ch__tags">
      <span className={`tag tag--${ch.kind === '개념' ? 'concept' : 'conj'}`}>{ch.kind}</span>
      {spine && (
        <span className={`tag tag--${spine.id}${ch.hub ? ' is-hub' : ''}`}>{spine.label}</span>
      )}
    </span>
  );
}

function ChapterRow({ ch, filter }: { ch: Chapter; filter: SpineId | null }) {
  const spine = SPINES.find((s) => s.id === ch.spine);
  const hit = filter !== null && ch.spine === filter;
  const dim = filter !== null && !hit;

  const cls = ['ch', dim && 'is-dim', hit && 'is-hit'].filter(Boolean).join(' ');

  return (
    <Link
      to={`/grammar/${ch.id}`}
      className={cls}
      style={hit && spine ? ({ '--accent': spine.color } as React.CSSProperties) : undefined}
    >
      <span className={`ch__st ${ch.status}`}>
        {ch.status === 'done' ? '✓' : ch.status === 'now' ? '▶' : shortNo(ch.no)}
      </span>
      <span className="ch__mid">
        <span className="ch__no">{ch.no}</span>
        <span className="ch__name">{ch.title}</span>
        <ChapterTags ch={ch} />
      </span>
      <span className="ch__rt">
        {ch.progress !== undefined ? (
          <span className={ch.status === 'now' ? 'ch__pct now' : 'ch__pct'}>{ch.progress}%</span>
        ) : (
          <ChevronIcon />
        )}
      </span>
    </Link>
  );
}

function PartCard({ part }: { part: Part }) {
  const all = part.blocks.flatMap((b) => b.chapters);
  const done = all.filter((c) => c.status === 'done').length;
  const pct = Math.round((done / all.length) * 100);

  return (
    <div className="part rise">
      <div className="part__label">{part.label}</div>
      <h2 className="part__title">{part.title}</h2>
      <div className="part__desc">{part.desc}</div>
      <div className="part__row">
        <div className="part__bar">
          <i style={{ width: `${pct}%` }} />
        </div>
        <div className="part__num">
          {done} / {all.length}과
        </div>
      </div>
    </div>
  );
}

export function GrammarPage() {
  const [level, setLevel] = useState('N5');
  const [filter, setFilter] = useState<SpineId | null>(null);

  const data = getLevel(level);
  const spine = SPINES.find((s) => s.id === filter);

  return (
    <Shell>
      <header className="appbar">
        <h1 className="appbar__title">문법</h1>
        <button type="button" className="iconbtn" aria-label="검색">
          <SearchIcon />
        </button>
      </header>

      <div className="levels">
        {LEVELS.map((lv) => (
          <button
            key={lv}
            type="button"
            className={lv === level ? 'lv is-on' : 'lv'}
            onClick={() => setLevel(lv)}
          >
            {lv}
          </button>
        ))}
      </div>

      <div className="scroll">
        {!data ? (
          <div className="empty">
            <div className="empty__mark">🌱</div>
            <div className="empty__title">{level}은 아직 비어 있어요</div>
            <div className="empty__sub">
              지금은 N5 문법부터 채우는 중이에요.
              <br />
              N5를 눌러 돌아가세요.
            </div>
          </div>
        ) : (
          <div className="grammar">
            {data.parts.map((part) => (
              <PartCard key={part.label} part={part} />
            ))}

            <div className="rise" style={{ animationDelay: '.06s' }}>
              <div className="spines__title">척추로 보기</div>
              <div className="spines__chips">
                <button
                  type="button"
                  className={filter === null ? 'chip is-on' : 'chip'}
                  onClick={() => setFilter(null)}
                >
                  전체
                </button>
                {SPINES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={filter === s.id ? 'chip is-on' : 'chip'}
                    style={{ '--chip': s.color } as React.CSSProperties}
                    onClick={() => setFilter(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {spine && (
              <>
                <div className="snote" style={{ '--accent': spine.color } as React.CSSProperties}>
                  {inline(spine.note)}
                </div>

                <div className="journey">
                  <div className="journey__head">🧭 이 척추의 다음 여정</div>
                  <div className="journey__list">
                    {spine.next.map((n) => (
                      <div className="journey__row" key={n.no}>
                        <span className="journey__lv">{n.level}</span>
                        <span className="journey__name">{n.name}</span>
                        <span className="journey__no">{n.no}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {data.parts.flatMap((part) =>
              part.blocks.map((block, i) => {
                const done = block.chapters.filter((c) => c.status === 'done').length;
                const all = block.chapters.length;
                return (
                  <div
                    className="block rise"
                    key={block.id}
                    style={{ animationDelay: `${0.1 + i * 0.04}s` }}
                  >
                    <div className="block__head">
                      <div className="block__title">
                        <em>{block.label}</em>
                        {block.title}
                      </div>
                      <div className={done === all ? 'block__count is-done' : 'block__count'}>
                        {done} / {all}
                      </div>
                    </div>
                    <div className="list">
                      {block.chapters.map((ch) => (
                        <ChapterRow key={ch.id} ch={ch} filter={filter} />
                      ))}
                    </div>
                    {block.note && <div className="block__note">{block.note}</div>}
                  </div>
                );
              }),
            )}
          </div>
        )}
      </div>

      <TabBar />
    </Shell>
  );
}
