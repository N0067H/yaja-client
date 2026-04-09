'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, History, Download, Settings, LogOut, BookOpen } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logout } from '@/lib/slices/authSlice';
import { toast } from 'react-toastify';

const NAV_ITEMS = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard },
  { href: '/admin/unchecked', label: '미체크 관리', icon: Users },
  { href: '/admin/history', label: '히스토리', icon: History },
  { href: '/admin/export', label: '내보내기', icon: Download },
  { href: '/admin/settings', label: '설정', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/'); return; }
    if (user?.role !== 'admin') router.replace('/student');
  }, [isAuthenticated, user, router]);

  function handleLogout() {
    dispatch(logout());
    toast.success('로그아웃 되었습니다.');
    router.replace('/');
  }

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--surface-2)' }}>
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between" style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--brand)' }}>
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--brand)' }}>야자 현황 체크</p>
            <p className="text-xs" style={{ color: 'var(--text-3)' }}>관리자 패널</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{user?.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-3)' }}>관리자</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl"
            style={{ color: 'var(--text-2)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:block">로그아웃</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* 사이드바 (데스크탑) */}
        <aside className="hidden md:flex flex-col w-56 py-4 gap-1 sticky top-[61px] h-[calc(100vh-61px)]"
          style={{ background: 'var(--surface-1)', borderRight: '1px solid var(--border)' }}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className="mx-3 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={active
                  ? { background: 'var(--brand-light)', color: 'var(--brand)' }
                  : { color: 'var(--text-2)' }}>
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </aside>

        {/* 본문 */}
        <main className="flex-1 min-w-0 p-4 md:p-6" style={{ paddingBottom: 80 }}>
          {children}
        </main>
      </div>

      {/* 하단 탭바 (모바일) */}
      <nav className="fixed bottom-0 left-0 right-0 flex md:hidden z-30"
        style={{ background: 'var(--surface-1)', borderTop: '1px solid var(--border)', paddingBottom: 'env(safe-area-inset-bottom,0px)' }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-medium"
              style={{ color: active ? 'var(--brand)' : 'var(--text-3)' }}>
              <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.8} />
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
