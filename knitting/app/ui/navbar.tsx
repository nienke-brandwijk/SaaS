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
    <div className="w-full bg-white">
      <header className="w-full flex items-center py-6 px-8 bg-gray-100">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/">
            <h1 className="text-orange-700 text-2xl font-bold cursor-pointer">
              Mijn Header
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 justify-center uppercase">
          {items.map((item, idx) => (
            <div key={item.name} className="flex items-center">
              {/* Divider tussen menu items */}
              {idx !== 0 && (
                <div className="w-[2px] h-6 bg-orange-700 flex-shrink-0" />
              )}

              <Link
                href={item.href}
                className="px-4 py-2 text-orange-700 hover:underline hover:font-bold"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>

        {/* Sign in */}
        <div className="flex-shrink-0">
          {/* DaisyUI button met exact dezelfde stijl als voorheen */}
          <button className="btn btn-outline btn-warning text-orange-700 px-4 py-2 rounded-lg uppercase hover:bg-orange-700 hover:text-white">
            Sign in
          </button>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
