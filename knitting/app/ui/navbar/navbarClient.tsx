"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserIcon } from '@heroicons/react/24/outline';

interface NavbarClientProps {
  user: any;
}

const NavbarClient: React.FC<NavbarClientProps> = ({ user }) => {
  console.log("User in NavbarClient:", user); // Debug log

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const items = [
    { name: "Learn", href: "/learn/introduction" },
    { name: "Create", href: "/create" },
    { name: "Dictionary", href: "/dictionary" },
    { name: "Calculator", href: "/calculator" },
  ];

  const pathname = usePathname();
  const userRouter = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
  console.log("handleLogout called"); // Debug
  try {
    const response = await fetch('/api/logout', {
      method: 'GET',
    });

    console.log("Logout response:", response.status); // Debug

    if (response.ok) {
      console.log("Logout successful, redirecting..."); // Debug
      setIsDropdownOpen(false);
      userRouter.push("/");
      userRouter.refresh();
    } else {
      console.error("Logout failed with status:", response.status);
    }
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

  return (
    <header className="w-full flex items-center justify-between py-4 px-8 bg-bgNavbar">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/knitting.png" alt="Knitting Icon" className="w-10 h-12" />
        <Link href="/" className="text-2xl text-txtLogo">
          KnittingBuddy
        </Link>
      </div>

      {/* Navigation */}
      <nav className="justify-center">
        <ul className="flex text-base items-center">
          {items.map((item, idx) => {
            const isActive = pathname.startsWith(item.href); 

            return (
              <React.Fragment key={item.name}>
                <li>
                  <Link
                    href={item.href}
                    className={`p-4 text-txtTransBtn transition inline-block min-w-[110px] text-center ${
                      isActive ? "font-bold underline" : "hover:underline hover:font-bold"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>

                {/* Divider */}
                {idx !== items.length - 1 && (
                  <li>
                    <div className="w-[2px] h-6 bg-deviderNavbar" />
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ul>
      </nav>

      {/* Sign in button OR User profile */}
      <div className="relative" ref={dropdownRef}>
        {!user ? (
          <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
            <button className="border text-base border-borderBtn text-txtTransBtn px-4 py-2 rounded-lg bg-transparent hover:bg-colorBtn hover:text-txtColorBtn transition">
              Sign in
            </button>
          </Link>
        ) : (
          <>
            {/* Profile Icon */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center transition cursor-pointer"
              aria-label="User menu"
            >
              <UserIcon className="h-6 w-6 text-gray-700" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-bgDefault border border-borderCard rounded-lg shadow-sm z-50">
                <Link
                  href="/account"
                  className="block w-full text-left text-txtTransBtn px-4 py-2 rounded-lg hover:bg-bgHover"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Account
                </Link>
                <button
                  className="w-full text-left text-txtSoft px-4 py-2 rounded-lg hover:bg-bgHover"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default NavbarClient;