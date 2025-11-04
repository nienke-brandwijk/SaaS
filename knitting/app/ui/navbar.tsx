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
    <div className="navbar bg-stone-100 shadow-md">
      {/* Logo */}
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-2xl text-primary font-bold">
          Mijn Header
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 uppercase">
          {items.map((item, idx) => (
            <li key={item.name} className="flex items-center">
              {idx !== 0 && <div className="h-5 w-[2px] bg-primary mx-1" />}
              <Link
                href={item.href}
                className="text-primary hover:underline hover:font-bold"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Sign in button */}
      <div className="flex-none ml-4">
        <button className="btn btn-outline btn-primary uppercase">
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Navbar;
