'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, MapPin, Clock, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logout } from '@/lib/slices/authSlice';
import { toast } from 'react-toastify';

const TABS = [
  { href: '/student', label: '홈', icon: Home },
  { href: '/student/check', label: '위치 체크', icon: MapPin },
  { href: '/student/history', label: '내 기록', icon: Clock },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/'); return; }
    if (user?.role !== 'student') { router.replace('/admin'); }
  }, [isAuthenticated, user, router]);

  function handleLogout() {
    dispatch(logout());
    toast.success('로그아웃 되었습니다.');
    router.replace('/');
  }

  if (!isAuthenticated || user?.role !== 'student') return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--surface-2)', maxWidth: 480, margin: '0 auto' }}>
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-30 px-5 py-4 flex items-center justify-between" style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand)' }}>
            <MapPin className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold" style={{ color: 'var(--brand)' }}>야자 체크</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg" style={{ color: 'var(--text-2)', background: 'var(--surface-2)' }}>
          <LogOut className="w-3.5 h-3.5" />
          로그아웃
        </button>
      </header>

      {/* 본문 */}
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: 80 }}>
        {children}
      </main>

      {/* 하단 탭바 */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full flex" style={{ maxWidth: 480, background: 'var(--surface-1)', borderTop: '1px solid var(--border)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-colors"
              style={{ color: active ? 'var(--brand)' : 'var(--text-3)' }}>
              <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
