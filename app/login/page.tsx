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
        <div className="auth-page">
            {/* Background with overlay */}
            <div
                className="auth-page-background"
                style={{
                    backgroundImage: 'url(/inspinia/images/auth.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -1
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.9) 0%, rgba(13, 71, 161, 0.85) 100%)',
                    }}
                />
            </div>

            <div className="container-fluid">
                <div className="row min-vh-100 align-items-center justify-content-center">
                    <div className="col-12 col-lg-10 col-xl-9">
                        <div className="card border-0 shadow-lg overflow-hidden">
                            <div className="row g-0">
                                {/* Left Panel - Branding */}
                                <div className="col-md-5 d-none d-md-flex align-items-center justify-content-center bg-primary text-white p-5">
                                    <div className="text-center">
                                        <div className="mb-4">
                                            <i className="ti ti-building-estate display-1 opacity-75"></i>
                                        </div>
                                        <h2 className="fw-bold mb-3">부동산 관리 시스템</h2>
                                        <p className="lead mb-4 opacity-90">
                                            전문적인 매물 관리 솔루션
                                        </p>
                                        <div className="d-flex justify-content-center gap-3 mb-3">
                                            <div className="text-center">
                                                <i className="ti ti-chart-line fs-1 mb-2"></i>
                                                <p className="fs-sm mb-0">통계 분석</p>
                                            </div>
                                            <div className="text-center">
                                                <i className="ti ti-file-spreadsheet fs-1 mb-2"></i>
                                                <p className="fs-sm mb-0">엑셀 관리</p>
                                            </div>
                                            <div className="text-center">
                                                <i className="ti ti-shield-lock fs-1 mb-2"></i>
                                                <p className="fs-sm mb-0">안전한 보안</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Panel - Login Form */}
                                <div className="col-md-7 bg-white">
                                    <div className="p-4 p-lg-5">
                                        {/* Mobile Logo */}
                                        <div className="d-md-none text-center mb-4">
                                            <i className="ti ti-building-estate fs-1 text-primary mb-2"></i>
                                            <h4 className="fw-bold text-primary mb-0">부동산 관리 시스템</h4>
                                        </div>

                                        {/* Welcome Text */}
                                        <div className="mb-4">
                                            <h3 className="fw-bold mb-2">관리자 로그인</h3>
                                            <p className="text-muted">시스템에 접속하려면 계정 정보를 입력하세요</p>
                                        </div>

                                        {/* Login Form */}
                                        <form action={authenticate}>
                                            <div className="mb-3">
                                                <label htmlFor="username" className="form-label fw-500">
                                                    아이디
                                                </label>
                                                <div className="input-group input-group-lg">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <i className="ti ti-user text-muted"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        id="username"
                                                        name="username"
                                                        className="form-control border-start-0 ps-0"
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
                                                <div className="input-group input-group-lg">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <i className="ti ti-lock text-muted"></i>
                                                    </span>
                                                    <input
                                                        type="password"
                                                        id="password"
                                                        name="password"
                                                        className="form-control border-start-0 ps-0"
                                                        placeholder="비밀번호를 입력하세요"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-lg w-100 mb-3"
                                            >
                                                <i className="ti ti-login me-2"></i>
                                                로그인
                                            </button>
                                        </form>

                                        {/* Divider */}
                                        <div className="position-relative my-4">
                                            <hr className="text-muted" />
                                            <span
                                                className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted fs-sm"
                                            >
                                                테스트 계정
                                            </span>
                                        </div>

                                        {/* Test Accounts Info */}
                                        <div className="alert alert-info mb-0">
                                            <div className="d-flex align-items-start">
                                                <i className="ti ti-info-circle me-2 mt-1"></i>
                                                <div className="flex-grow-1">
                                                    <p className="fw-600 mb-2 fs-sm">다음 계정으로 테스트하실 수 있습니다:</p>
                                                    <ul className="fs-xs mb-0 ps-3">
                                                        <li className="mb-1">
                                                            <strong>총괄매니저:</strong> admin / admin1234
                                                        </li>
                                                        <li className="mb-1">
                                                            <strong>수석매니저:</strong> senior / admin1234
                                                        </li>
                                                        <li className="mb-0">
                                                            <strong>매니저:</strong> manager / admin1234
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-4">
                            <p className="text-white-50 fs-sm mb-0">
                                © 2025 부동산 관리 시스템. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
