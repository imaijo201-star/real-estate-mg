import { signIn } from '@/auth';
import { redirect } from 'next/navigation';

export default function LoginPage() {
    async function authenticate(formData: FormData) {
        'use server';

        const username = formData.get('username');
        const password = formData.get('password');

        try {
            await signIn('credentials', {
                username,
                password,
                redirect: false,
            });
        } catch (error) {
            throw error;
        }

        redirect('/admin');
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="card-body p-5">
                    {/* 로고/타이틀 */}
                    <div className="text-center mb-4">
                        <svg className="sa-icon sa-icon-5x text-primary mb-3">
                            <use href="/icons/sprite.svg#home" />
                        </svg>
                        <h2 className="h4 fw-700 mb-1">부동산 관리 시스템</h2>
                        <p className="text-muted fs-sm">관리자 로그인</p>
                    </div>

                    {/* 로그인 폼 */}
                    <form action={authenticate}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label fw-500">
                                아이디
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <svg className="sa-icon">
                                        <use href="/icons/sprite.svg#user" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="form-control"
                                    placeholder="아이디를 입력하세요"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="form-label fw-500">
                                비밀번호
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <svg className="sa-icon">
                                        <use href="/icons/sprite.svg#lock" />
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="비밀번호를 입력하세요"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                        >
                            <svg className="sa-icon">
                                <use href="/icons/sprite.svg#log-in" />
                            </svg>
                            <span>로그인</span>
                        </button>
                    </form>

                    {/* 테스트 계정 안내 */}
                    <div className="mt-4 p-3 bg-light rounded">
                        <p className="fs-xs text-muted mb-2">
                            <strong>테스트 계정:</strong>
                        </p>
                        <ul className="fs-xs text-muted mb-0 ps-3">
                            <li>총괄매니저: admin / admin1234</li>
                            <li>수석매니저: senior / admin1234</li>
                            <li>매니저: manager / admin1234</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
