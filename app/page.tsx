'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Eye, EyeOff, BookOpen, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { loginThunk } from '@/lib/slices/authSlice';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated, user } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') router.replace('/admin');
      else router.replace('/student');
    }
  }, [isAuthenticated, user, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { toast.error('이메일과 비밀번호를 입력해주세요.'); return; }
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.rejected.match(result)) toast.error(result.payload as string || '로그인 실패');
  }

  function fillDemo(type: 'student' | 'admin') {
    setEmail(type === 'admin' ? 'admin@test.com' : 'student@test.com');
    setPassword('1234');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5" style={{ background: 'linear-gradient(160deg,#f5f4fc 0%,#eeedfe 100%)' }}>
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--brand)' }}>
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--brand)' }}>야자 현황 체크</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>야간자율학습 위치 등록 시스템</p>
        </div>
      </div>
      <div className="w-full max-w-sm rounded-3xl p-7 shadow-sm" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
        <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-1)' }}>로그인</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력하세요"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text-1)' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--brand-mid)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>비밀번호</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호"
                className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none"
                style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text-1)' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--brand-mid)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'var(--text-3)' }}>
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
            style={{ background: 'var(--brand)', opacity: loading ? 0.7 : 1 }}>
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs text-center mb-3" style={{ color: 'var(--text-3)' }}>데모 계정으로 빠르게 체험</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => fillDemo('student')} className="py-2.5 rounded-xl text-xs font-medium" style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}>학생으로 입장</button>
            <button onClick={() => fillDemo('admin')} className="py-2.5 rounded-xl text-xs font-medium" style={{ background: 'var(--warn-light)', color: 'var(--warn)' }}>관리자로 입장</button>
          </div>
          <div className="mt-3 p-3 rounded-xl text-xs space-y-1" style={{ background: 'var(--surface-2)', color: 'var(--text-3)' }}>
            <p>학생: student@test.com / 1234</p>
            <p>관리자: admin@test.com / 1234</p>
          </div>
        </div>
      </div>
    </div>
  );
}
