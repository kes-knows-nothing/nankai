import { Navigate, Route, Routes } from 'react-router-dom';
import { GrammarPage } from './routes/GrammarPage';
import { ChapterPage } from './routes/ChapterPage';
import { PlaceholderPage } from './routes/PlaceholderPage';

export default function App() {
  return (
    <Routes>
      {/* 이번 슬라이스는 문법이 주인공이라 홈 대신 문법으로 보낸다 */}
      <Route path="/" element={<Navigate to="/grammar" replace />} />
      <Route path="/grammar" element={<GrammarPage />} />
      <Route path="/grammar/:id" element={<ChapterPage />} />
      <Route
        path="/review"
        element={<PlaceholderPage title="복습" note="틀린 문제와 약한 챕터가 여기로 모일 자리예요." />}
      />
      <Route
        path="/me"
        element={<PlaceholderPage title="내정보" note="학습 통계와 설정이 들어갈 자리예요." />}
      />
      <Route path="*" element={<Navigate to="/grammar" replace />} />
    </Routes>
  );
}
