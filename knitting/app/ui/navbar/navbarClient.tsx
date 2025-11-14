"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
    { name: "Contact", href: "/contact" },
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
          <Link href="/login">
            <button className="border text-base border-borderBtn text-txtTransBtn px-4 py-2 rounded-lg bg-transparent hover:bg-colorBtn hover:text-txtColorBtn transition">
              Sign in
            </button>
          </Link>
        ) : (
          <>
            {/* Profile Circle */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 transition cursor-pointer"
              aria-label="User menu"
            />

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                <Link
                  href="/account"
                  className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Account
                </Link>
                <button
                  className="w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 transition"
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