// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import './portal.css';

export default function PortalPage() {
  const router = useRouter();

  const handlePortalClick = () => {
    // 포털 축소 애니메이션 후 로그인으로 이동
    const portalContainer = document.querySelector('.portal-container');
    portalContainer?.classList.add('animate-collapse');
    
    setTimeout(() => {
      router.push('/login');
    }, 800);
  };

  return (
    <div className="entry-screen">
      <div className="portal-container" onClick={handlePortalClick}>
        <video autoPlay muted loop playsInline>
          <source
            src="https://cdn.pixabay.com/video/2020/01/22/31495-387312407_tiny.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <div className="info-box">
        <h1>Aurum Inc. Portal</h1>
        <p>포털을 클릭하여 시스템에 접속하세요</p>
      </div>
    </div>
  );
}