import { Shell } from '../components/Shell';
import { TabBar } from '../components/TabBar';

/**
 * 아직 안 만든 탭. 이번 슬라이스는 문법 축 하나만 관통하는 게 목적이라
 * 나머지 탭은 자리만 잡아둔다.
 */
export function PlaceholderPage({ title, note }: { title: string; note: string }) {
  return (
    <Shell>
      <header className="appbar">
        <h1 className="appbar__title">{title}</h1>
      </header>
      <div className="scroll">
        <div className="empty">
          <div className="empty__mark">🚧</div>
          <div className="empty__title">{title}은 다음 차례예요</div>
          <div className="empty__sub">{note}</div>
        </div>
      </div>
      <TabBar />
    </Shell>
  );
}
