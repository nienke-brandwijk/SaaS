"use client";

export default function CalculatorLayout({children}: {children: React.ReactNode}) {
    return (
        <div style={{minHeight: 'calc(100vh - 64px - 100px)'}}>
            {children}
        </div>
    );
}