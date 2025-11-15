"use client";

export default function Footer() {
    return(
        <footer className="flex flex-row items-center bg-bgFooter px-8 py-4">
            <aside className="flex-1 text-left">  {/* flex-1 to make aside and nav equal width*/}
                <div className="flex flex-row items-center gap-4">
                    <img src="/knitting.png" alt="Knitting Icon" className="w-10 h-12 m-2" />
                    <div className="text-txtDefault">
                        <p className="font-bold text-txtBold text-lg"> KnittingBuddy </p>
                        <a className="text-txtSoft font-semibold text-lg" href="mailto:contact@knittingbuddy.com">
                            contact@knittingbuddy.com
                        </a>
                        <br />
                        Sesamstraat 123, 9999 Fabelstad, Belgium
                        <p className="text-txtSoft text-sm">Copyright © {new Date().getFullYear()} KnittingBuddy. All rights reserved.</p>
                    </div>
                </div>
            </aside>
            <nav className="flex-1 text-left">
                <h6 className="footer-title">Our partners:</h6>
                <div className="flex flex-row items-center gap-4">
                    <a href="https://www.filomena.be/" target="_blank" rel="noopener noreferrer">
                        <img
                            src="/filomena_logo.png"
                            alt="Filomena"
                            className="w-24 h-auto"
                        />
                    </a>
                    <a href="https://www.veritas.be" target="_blank" rel="noopener noreferrer">
                        <img
                            src="/veritas_logo.png"
                            alt="Veritas"
                            className="w-24 h-auto"
                        />
                    </a>
                </div>
            </nav>
        </footer>
    );
}