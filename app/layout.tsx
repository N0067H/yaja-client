'use client';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from '@/lib/store';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#3C3489" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <title>야자 현황 체크</title>
      </head>
      <body>
        <Provider store={store}>
          {children}
          <ToastContainer
            position="top-center"
            autoClose={2500}
            hideProgressBar
            newestOnTop
            closeOnClick
            pauseOnFocusLoss={false}
            draggable
            toastStyle={{
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: '14px',
              borderRadius: '12px',
              boxShadow: '0 4px 24px rgba(60,52,137,0.15)',
            }}
          />
        </Provider>
      </body>
    </html>
  );
}
