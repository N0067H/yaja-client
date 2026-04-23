'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
    if (!email || !password) { toast.error('아이디와 비밀번호를 입력해주세요.'); return; }
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.rejected.match(result)) toast.error(result.payload as string || '로그인 실패');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: '#F9FAFB' }}>
      <div
        className="bg-white p-8 w-[500px]"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.10)', borderRadius: '2rem' }}
      >
        {/* 로고 */}
        <img src="/logo2.png" alt="야자 로고" className="mx-auto mt-5 mb-4 h-16 w-auto" />

        {/* 타이틀 */}
        <h1 className="text-[40px] font-bold text-center mb-2">로그인</h1>
        <p className="text-center text-[18px] font-medium mb-6" style={{ color: 'rgba(0,0,0,0.6)' }}>
          경소마고 야자 현황 체크
        </p>

        <form onSubmit={handleLogin} className="flex flex-col items-center">
          {/* 아이디 */}
          <div className="mb-[30px]">
            <label className="block mb-1 text-sm font-medium" style={{ color: 'rgba(0,0,0,0.6)' }}>아이디</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[400px] h-[47px] outline-none transition-all"
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1.5px solid #D7D7D7',
                borderRadius: 0,
              }}
              onFocus={(e) => { e.target.style.borderBottomColor = 'var(--brand)'; }}
              onBlur={(e) => { e.target.style.borderBottomColor = '#D7D7D7'; }}
            />
          </div>

          {/* 비밀번호 */}
          <div className="mb-[30px]">
            <label className="block mb-1 text-sm font-medium" style={{ color: 'rgba(0,0,0,0.6)' }}>비밀번호</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 w-[400px] h-[47px] outline-none transition-all"
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1.5px solid #D7D7D7',
                  borderRadius: 0,
                }}
                onFocus={(e) => { e.target.style.borderBottomColor = 'var(--brand)'; }}
                onBlur={(e) => { e.target.style.borderBottomColor = '#D7D7D7'; }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#9ca3af' }}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="mt-[7px] w-[400px] h-[47px] font-bold text-white flex items-center justify-center gap-2 transition"
            style={{
              background: 'var(--brand)',
              borderRadius: '10px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
