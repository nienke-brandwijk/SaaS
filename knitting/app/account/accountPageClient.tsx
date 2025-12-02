'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Page({ user, wips }: { user: any, wips: any }) {
  const [profileImage, setProfileImage] = useState(user?.image_url || "empty_profile_pic.png");
  const router = useRouter();
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);
  let progress = (user?.learn_process - 1) || 0;
  if (progress < 0) progress = 0;
  const progressPercent = Math.round((progress / 8) * 100);
  let progressMessage = "";
  if (progressPercent === 0) {
    progressMessage = "Let's get started! Your journey awaits";
  } else if (progressPercent > 0 && progressPercent <= 20) {
    progressMessage = "Good start! Keep going!";
  } else if (progressPercent > 20 && progressPercent <= 50) {
    progressMessage = "You're making solid progress!";
  } else if (progressPercent > 50 && progressPercent < 100) {
    progressMessage = "Awesome! You're more than halfway there!";
  } else if (progressPercent === 100) {
    progressMessage = "Congratulations! You completed everything! 🎉";
  }
  useEffect(() => {
    if (user === null || user === undefined) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, router, pathname]);
  if (!user) return null;
    const handleImageClick = () => fileInputRef.current?.click();
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id.toString());
    const res = await fetch("/api/users/upima", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.url) setProfileImage(data.url); 
  };
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'GET' });
      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        console.error("Logout failed with status:", response.status);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className="bg-bgDefault flex flex-col items-center p-6 text-txtDefault">
      <div className="w-4/5 flex justify-end">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-colorBtn text-txtColorBtn border border-borderBtn rounded-lg hover:bg-transparent hover:text-txtTransBtn transition"
        >
          Logout
        </button>
      </div>
      
      {/* USER INFO */}
      <div className="card flex-row bg-white border border-borderCard h-1/3 w-4/5 gap-8 rounded-lg shadow-sm">
        <div
          className="relative h-48 px-8 py-4 cursor-pointer group"
          onClick={handleImageClick}
        >
          <img
            src={profileImage}
            alt="account image"
            className="h-full rounded-lg object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="text-white font-semibold">Change</span>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-6">
          <div className="text-2xl font-bold text-txtBold">
            {user?.first_name} {user?.last_name}
          </div>

          <div className="flex gap-32">
            <div>
              <p className="text-txtSoft text-lg">Email:</p>
              <div className="text-lg">{user?.email}</div>
            </div>
            <div>
              <p className="text-txtSoft text-lg">Username:</p>
              <div className="text-lg">{user?.username}</div>
            </div>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

       {/* LEARN PROGRESS */}
        <div className="card flex flex-col bg-white border border-borderCard h-2/3 w-4/5 rounded-lg shadow-sm px-8 py-4">
          <div className="text-2xl font-bold text-txtBold mb-6">Learning Progress</div>
          <div className="flex flex-row justify-between items-center w-full ">
              <div className="flex flex-col w-2/3 gap-4">
                <div className="relative bg-stone-300 rounded-full h-6 w-full">
                    <div
                    className="bg-colorBtn h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-black font-semibold text-sm">
                    {progressPercent}%
                    </span>
                </div>
                <div className="text-lg font-medium">
                    {progressMessage}
                </div>
              </div>
              <div className="">
                <button
                    onClick={() => window.location.href = '/learn/introduction'}
                    className="px-4 py-2 bg-colorBtn text-txtColorBtn border border-borderBtn rounded-lg hover:bg-white hover:text-txtTransBtn transition"
                >
                    Get back to learning
                </button>
              </div>
          </div>
        </div>

      {/* YOUR CREATIONS */}
      <div className="card flex flex-col bg-white border border-borderCard h-2/3 w-4/5 rounded-lg shadow-sm px-8 py-4">
        <div className="text-2xl font-bold text-txtBold mb-4">Your Creations</div>
        <div className="grid grid-cols-3 gap-6">
          {wips.length === 0 && <p className="col-span-3 text-center">No finished creations yet.</p>}
          {wips.map((wip: any) => (
            <div key={wip.id} className="flex flex-col items-center bg-stone-100 p-2 rounded">
              <div className="text-lg font-semibold mb-2 text-center">{wip.wipName}</div>
              <img src={wip.wipPictureURL} alt={wip.wipName} className="h-40 w-full object-cover rounded" />
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
