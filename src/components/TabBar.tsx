import { NavLink } from 'react-router-dom';
import { HomeIcon, MeIcon, ReviewIcon, StudyIcon } from './Icons';

const TABS = [
  { to: '/', label: '홈', Icon: HomeIcon },
  { to: '/grammar', label: '학습', Icon: StudyIcon },
  { to: '/review', label: '복습', Icon: ReviewIcon },
  { to: '/me', label: '내정보', Icon: MeIcon },
];

export function TabBar() {
  return (
    <nav className="tabbar">
      {TABS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => (isActive ? 'tab is-on' : 'tab')}
        >
          <Icon />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
