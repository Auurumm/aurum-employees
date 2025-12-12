// app/layout.tsx
import "./globals.css";
import "./portal.css";
import type { Metadata } from "next";
// TODO: Fix the import path below according to your project structure.
import { AuthProvider } from "../contexts/AuthContext"; 
import { MenuProvider } from "@/contexts/MenuContext"; 


export const metadata: Metadata = {
  title: "AURUM.INC_PORTAL",
  description: "오럼 직원 인적사항 관리 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard 폰트 */}
        <link 
          rel="stylesheet" 
          as="style" 
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}