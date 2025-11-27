"use client";

export default function VisionBoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bgDefault">
      {children}
    </div>
  );
}