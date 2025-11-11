"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar: React.FC = () => {
  const items = [
    { name: "Learn", href: "/learn/introduction" },
    { name: "Create", href: "/create" },
    { name: "Dictionary", href: "/dictionary" },
    { name: "Calculator", href: "/calculator" },
    { name: "Contact", href: "/contact" },
  ];

  const pathname = usePathname();

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
                    className={`p-4 text-txtTransBtn transition ${
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

      {/* Sign in button */}
      <div>
        <Link href="/login">
          <button className="border text-base border-borderBtn text-txtTransBtn px-4 py-2 rounded-lg bg-transparent hover:bg-colorBtn hover:text-txtColorBtn transition">
            Sign in
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
