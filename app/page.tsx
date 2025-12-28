'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IndexPage() {
  const router = useRouter();

  // 页面加载后立即重定向到 /home
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home');
    }, 1000); // 显示1秒loading后重定向

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <style jsx global>{`
        /* 赛博朋克背景 */
        .bg-dark-bg {
          background: 
            radial-gradient(circle at 20% 50%, rgba(157, 78, 221, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(67, 97, 238, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(247, 37, 133, 0.15) 0%, transparent 50%),
            linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%),
            repeating-linear-gradient(0deg, rgba(157, 78, 221, 0.05) 0px, rgba(157, 78, 221, 0.05) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(90deg, rgba(157, 78, 221, 0.05) 0px, rgba(157, 78, 221, 0.05) 1px, transparent 1px, transparent 20px);
          background-attachment: fixed;
          background-size: cover, cover, cover, cover, 20px 20px, 20px 20px;
        }

        /* 赛博朋克加载动画 */
        .cyber-loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
        }

        .cyber-loader {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .cyber-loader::before,
        .cyber-loader::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          animation: cyber-spin 2s linear infinite;
        }

        .cyber-loader::before {
          border: 3px solid transparent;
          border-top-color: #9d4edd;
          animation-duration: 1s;
        }

        .cyber-loader::after {
          border: 3px solid transparent;
          border-bottom-color: #4361ee;
          animation-duration: 2s;
        }

        .cyber-loader-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          border: 3px solid transparent;
          border-left-color: #f72585;
          border-radius: 50%;
          animation: cyber-spin-reverse 1.5s linear infinite;
        }

        .cyber-loading-text {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.5rem;
          font-weight: 900;
          color: #ffffff;
          text-shadow: 
            0 0 5px #9d4edd,
            0 0 10px #9d4edd,
            0 0 20px #9d4edd,
            0 0 40px #9d4edd;
          animation: cyber-flicker 2s infinite alternate;
        }

        @keyframes cyber-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes cyber-spin-reverse {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(-360deg); }
        }

        @keyframes cyber-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            text-shadow: 
              0 0 5px #9d4edd,
              0 0 10px #9d4edd,
              0 0 20px #9d4edd,
              0 0 40px #9d4edd;
          }
          20%, 24%, 55% {
            text-shadow: none;
          }
        }
      `}</style>

      <div className="cyber-loading-container">
        <div className="cyber-loader">
          <div className="cyber-loader-inner"></div>
        </div>
        <div className="cyber-loading-text">LOADING...</div>
      </div>
    </div>
  );
}
