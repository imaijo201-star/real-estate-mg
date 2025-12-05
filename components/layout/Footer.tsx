export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <div className="text-md-start footer-links d-none d-md-block">
                            <a href="#" className="text-muted">소개</a>
                            <span className="text-muted mx-2">·</span>
                            <a href="#" className="text-muted">지원</a>
                            <span className="text-muted mx-2">·</span>
                            <a href="#" className="text-muted">문의</a>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="text-md-end footer-text text-muted">
                            © {currentYear} Real Estate Manager. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
