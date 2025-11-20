"use client";

export default function WipLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bgDefault">
        {children}
    </div>
  );
}