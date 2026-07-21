import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { Block, Example, Node } from '../content/types';
import { inline, marked, speakable } from '../lib/text';
import { speak } from '../lib/tts';
import { BranchIcon, ChevronIcon, PlayIcon } from './Icons';

/**
 * 콘텐츠 렌더링 엔진.
 * content/의 데이터를 화면으로 옮기는 유일한 지점 — 챕터가 늘어나도 여기는 그대로다.
 */

/** 강조 톤 → 실제 색. 뜻 줄의 굵은 글자를 일본어 강조와 같은 색으로 맞추는 데 쓴다. */
const TONE: Record<string, string> = {
  blue: 'var(--blue)',
  warn: 'var(--warn)',
  good: 'var(--good)',
};

/** 예문 한 줄. 재생 버튼을 누르면 일본어 TTS가 나간다. */
function ExampleRow({ jp, read, mean, speak: override, mark, markTone }: Example) {
  const [playing, setPlaying] = useState(false);
  // 재생 중 화면을 벗어나면 setState가 떠도는 걸 막는다
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  const play = () => {
    setPlaying(true);
    speak(speakable(jp, override), () => {
      if (alive.current) setPlaying(false);
    });
  };

  return (
    <div
      className="ex"
      style={{ ['--ex-tone']: TONE[markTone ?? 'warn'] } as CSSProperties}
    >
      <button
        type="button"
        className={playing ? 'ex__play is-playing' : 'ex__play'}
        onClick={play}
        aria-label={`${jp} 듣기`}
      >
        <PlayIcon />
      </button>
      <div className="ex__txt">
        <div className="ex__jp">{marked(jp, mark, markTone)}</div>
        <div className="ex__read">{inline(read)}</div>
        {mean && <div className="ex__mean">{inline(mean)}</div>}
      </div>
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'p': {
      const cls = ['p', block.center && 'is-center', block.small && 'is-small']
        .filter(Boolean)
        .join(' ');
      return <p className={cls}>{inline(block.text)}</p>;
    }

    case 'ex':
      return <ExampleRow {...block} />;

    case 'swap':
      return (
        <div className="swap">
          <span className="swap__box">
            {block.stem}
            <span className="swap__del">{block.from}</span>
          </span>
          <span className="swap__arrow">→</span>
          <span className="swap__box">
            {block.stem}
            <span className="swap__add">{block.to}</span>
            {block.tail}
          </span>
        </div>
      );

    case 'table':
      return (
        <div className="tablewrap">
          <table className="table">
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r) => (
                <tr key={r.end} className={r.trap ? 'is-trap' : undefined}>
                  <td>{r.end}</td>
                  <td>{inline(r.form)}</td>
                  <td>{inline(r.ex)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'grid':
      return (
        <div className="tablewrap">
          <table className="table table--grid">
            <thead>
              <tr>
                {block.head.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i} className={r.trap ? 'is-trap' : undefined}>
                  {r.cells.map((c, j) => (
                    <td key={j}>{inline(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'rhythm':
      return <div className="rhythm">🎵 {inline(block.text)}</div>;
  }
}

function NodeView({ node }: { node: Node }) {
  switch (node.kind) {
    case 'section':
      return (
        <section className="sec">
          <h3 className="sec__title">
            {node.n !== undefined && <span className="n">{node.n}</span>}
            {node.title}
          </h3>
          {node.body.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </section>
      );

    case 'callout':
      return (
        <aside className={`call call--${node.tone}`}>
          <div className="call__title">{node.title}</div>
          {node.body.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </aside>
      );

    case 'tree':
      return (
        <div className="tree">
          <pre>
            {node.lines.map((line, i) => {
              const at = line.hl ? line.text.indexOf(line.hl) : -1;
              return (
                <span key={i}>
                  {at === -1 ? (
                    line.text
                  ) : (
                    <>
                      {line.text.slice(0, at)}
                      <span className="hl">{line.hl}</span>
                      {line.text.slice(at + line.hl!.length)}
                    </>
                  )}
                  {line.note && <span className="note">{'   ' + line.note}</span>}
                  {'\n'}
                </span>
              );
            })}
          </pre>
        </div>
      );

    case 'keys':
      return (
        <div className="keys">
          {node.items.map((item, i) => (
            <div className="key" key={i}>
              <span className="key__n">{i + 1}</span>
              <span className="key__t">{inline(item)}</span>
            </div>
          ))}
        </div>
      );

    case 'next': {
      const body = (
        <>
          <span className="next__ic">
            <BranchIcon />
          </span>
          <span className="next__mid">
            <span className="next__label">{node.label}</span>
            <span className="next__title">{node.title}</span>
            <span className="next__sub">{node.sub}</span>
          </span>
          <ChevronIcon />
        </>
      );

      return node.to ? (
        <Link className="next" to={`/grammar/${node.to}`}>
          {body}
        </Link>
      ) : (
        <div className="next">{body}</div>
      );
    }
  }
}

/** 탭 하나(한국어 / 일본식 / 정리)의 본문 전체 */
export function Pane({ nodes }: { nodes: Node[] }) {
  return (
    <div className="pane">
      {nodes.map((n, i) => (
        <NodeView key={i} node={n} />
      ))}
    </div>
  );
}
