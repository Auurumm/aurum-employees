// src/app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import './portal.css';

export default function PortalPage() {
  const router = useRouter();

  const handlePortalClick = () => {
    const portalContainer = document.querySelector('.portal-container');
    portalContainer?.classList.add('animate-collapse');
    
    setTimeout(() => {
      router.push('/login');
    }, 800);
  };

  return (
    <div className="entry-screen">
      <div className="background-image"></div>
      {/* 어두운 오버레이 */}
      <div className="overlay"></div>

      {/* 포털 비디오 */}
      <div className="portal-container" onClick={handlePortalClick}>
        <video autoPlay muted loop playsInline>
          <source
            src="https://cdn.pixabay.com/video/2020/01/22/31495-387312407_tiny.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      <div className="info-box">
        <h1>AURUM.INC_PORTAL</h1>
        <p>포털을 클릭하여 시스템에 접속하세요</p>
      </div>
    </div>
  );
}