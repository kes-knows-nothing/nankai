import type { ReactNode } from 'react';

/**
 * 앱 셸. 폰에서는 화면 전체를 쓰고, 데스크탑(760px+)에서는 폰 목업 안에 가둔다.
 * 개발할 때 데스크탑에서도 실제 비율로 보이게 하려는 목적.
 */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <div className="shell__device">
        <div className="shell__screen">{children}</div>
      </div>
    </div>
  );
}
