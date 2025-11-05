import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  const items = [
    { name: "Learn", href: "/learn" },
    { name: "Create", href: "/create" },
    { name: "Dictionary", href: "/dictionary" },
    { name: "Calculator", href: "/calculator" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full flex items-center justify-between py-4 px-8 bg-stone-100">
      {/* Logo */}
      <div className="flex items-center flex-shrink-0">
        <img src="/knitting.png" alt="Knitting Icon" className="w-10 h-12" />
        <Link href="/" className="text-2xl text-orange-950 text-primary font-bold">
          KnittingBuddy
        </Link>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex flex-1 justify-center">
        <ul className="flex items-center uppercase">
          {items.map((item, idx) => (
            <React.Fragment key={item.name}>
              <li>
                <Link
                  href={item.href}
                  className="px-4 py-2 text-orange-700 hover:underline hover:font-bold transition"
                >
                  {item.name}
                </Link>
              </li>
              {/* Divider */}
              {idx !== items.length - 1 && (
                <li>
                  <div className="w-[2px] h-6 bg-orange-900 mx-1" />
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </nav>

      {/* Sign in button */}
      <div className="flex-shrink-0">
        <button className="border border-orange-700 text-orange-700 px-4 py-2 rounded-lg bg-transparent hover:bg-orange-700 hover:text-white uppercase transition">
          Sign in
        </button>
      </div>
    </header>
  );
};

export default Navbar;
